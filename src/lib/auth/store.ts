import { randomBytes, scryptSync, timingSafeEqual } from "node:crypto"
import { promises as fs } from "node:fs"
import path from "node:path"

import type { PublicUser, UserRole } from "./types"

export interface StoredUser {
  id: string
  email: string
  name: string
  companyName?: string
  role: UserRole
  passwordHash: string
  avatar?: string
  phone?: string
  emailVerified: boolean
  tokenVersion?: number
  createdAt: string
  updatedAt: string
}

const DATA_DIR = path.join(process.cwd(), ".data")
const USERS_FILE = path.join(DATA_DIR, "users.json")

// Serialize read-modify-write operations so concurrent requests can't clobber the file.
let writeQueue: Promise<unknown> = Promise.resolve()

function withLock<T>(task: () => Promise<T>): Promise<T> {
  const run = writeQueue.then(task, task)
  writeQueue = run.then(
    () => undefined,
    () => undefined
  )
  return run
}

export function hashPassword(password: string): string {
  const salt = randomBytes(16).toString("hex")
  const derived = scryptSync(password, salt, 64).toString("hex")
  return `scrypt:${salt}:${derived}`
}

export function verifyPassword(password: string, passwordHash: string): boolean {
  const [scheme, salt, expectedHex] = passwordHash.split(":")
  if (scheme !== "scrypt" || !salt || !expectedHex) return false

  const expected = Buffer.from(expectedHex, "hex")
  const candidate = scryptSync(password, salt, expected.length)
  return candidate.length === expected.length && timingSafeEqual(expected, candidate)
}

function seedUsers(): StoredUser[] {
  const isProd = process.env.NODE_ENV === "production"
  const defaultAdminPass =
    process.env.ADMIN_INITIAL_PASSWORD ||
    (isProd ? randomBytes(16).toString("hex") : "admin123")
  const defaultSupplierPass =
    process.env.SUPPLIER_INITIAL_PASSWORD ||
    (isProd ? randomBytes(16).toString("hex") : "supplier123")
  const defaultCustomerPass =
    process.env.CUSTOMER_INITIAL_PASSWORD ||
    (isProd ? randomBytes(16).toString("hex") : "customer123")

  if (isProd && !process.env.ADMIN_INITIAL_PASSWORD) {
    console.warn(
      `[SECURITY NOTICE] Initial admin password was randomly generated: ${defaultAdminPass}. Set ADMIN_INITIAL_PASSWORD in production to configure explicitly.`
    )
  }

  const now = new Date().toISOString()
  const seeds: Array<{
    id: string
    email: string
    name: string
    role: UserRole
    password: string
    phone: string
    companyName?: string
  }> = [
    { id: "usr_admin", email: "admin@solarstore.com", name: "Ananya Rao", role: "admin", password: defaultAdminPass, phone: "9845011201" },
    { id: "usr_supplier", email: "supplier@solarstore.com", name: "Meera Rao", role: "supplier", password: defaultSupplierPass, phone: "9845011200" },
    { id: "usr_customer", email: "customer@solarstore.com", name: "Rajesh Kumar", role: "customer", password: defaultCustomerPass, phone: "9876543210", companyName: "Lucknow Solar Works" },
  ]

  return seeds.map((seed) => ({
    id: seed.id,
    email: seed.email,
    name: seed.name,
    companyName: seed.companyName,
    role: seed.role,
    passwordHash: hashPassword(seed.password),
    phone: seed.phone,
    emailVerified: true,
    tokenVersion: 1,
    createdAt: now,
    updatedAt: now,
  }))
}

async function writeUsers(users: StoredUser[]): Promise<void> {
  await fs.mkdir(DATA_DIR, { recursive: true })
  await fs.writeFile(USERS_FILE, JSON.stringify(users, null, 2), "utf8")
}

async function readUsers(): Promise<StoredUser[]> {
  try {
    const raw = await fs.readFile(USERS_FILE, "utf8")
    const parsed: unknown = JSON.parse(raw)
    if (Array.isArray(parsed) && parsed.length > 0) return parsed as StoredUser[]
    throw new Error("Empty or invalid users file")
  } catch {
    const seeded = seedUsers()
    await writeUsers(seeded)
    return seeded
  }
}

export function toPublicUser(user: StoredUser): PublicUser {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    companyName: user.companyName,
    role: user.role,
    avatar: user.avatar,
    phone: user.phone,
    emailVerified: user.emailVerified,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  }
}

export async function findUserByEmail(email: string): Promise<StoredUser | null> {
  const users = await readUsers()
  const normalized = email.trim().toLowerCase()
  return users.find((user) => user.email.toLowerCase() === normalized) ?? null
}

export async function findUserById(id: string): Promise<StoredUser | null> {
  const users = await readUsers()
  return users.find((user) => user.id === id) ?? null
}

export interface CreateUserInput {
  name: string
  email: string
  password: string
  companyName?: string
  role?: UserRole
}

export async function createUser(input: CreateUserInput): Promise<StoredUser | null> {
  return withLock(async () => {
    const users = await readUsers()
    const email = input.email.trim().toLowerCase()

    if (users.some((user) => user.email.toLowerCase() === email)) return null

    const now = new Date().toISOString()
    const user: StoredUser = {
      id: `usr_${randomBytes(8).toString("hex")}`,
      email,
      name: input.name.trim(),
      companyName: input.companyName?.trim() || undefined,
      role: input.role ?? "customer",
      passwordHash: hashPassword(input.password),
      emailVerified: false,
      tokenVersion: 1,
      createdAt: now,
      updatedAt: now,
    }

    users.push(user)
    await writeUsers(users)
    return user
  })
}

export async function revokeUserSessions(userId: string): Promise<boolean> {
  return withLock(async () => {
    const users = await readUsers()
    const user = users.find((u) => u.id === userId)
    if (!user) return false
    user.tokenVersion = (user.tokenVersion ?? 1) + 1
    user.updatedAt = new Date().toISOString()
    await writeUsers(users)
    return true
  })
}
