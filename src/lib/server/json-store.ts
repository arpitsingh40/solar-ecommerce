import { promises as fs } from "node:fs"
import path from "node:path"

const DATA_DIR = path.join(process.cwd(), ".data")

let writeQueue: Promise<unknown> = Promise.resolve()

function withLock<T>(task: () => Promise<T>): Promise<T> {
  const run = writeQueue.then(task, task)
  writeQueue = run.then(
    () => undefined,
    () => undefined
  )
  return run
}

async function readArray<T>(filePath: string): Promise<T[]> {
  try {
    const raw = await fs.readFile(filePath, "utf8")
    const parsed: unknown = JSON.parse(raw)
    return Array.isArray(parsed) ? (parsed as T[]) : []
  } catch {
    return []
  }
}

/**
 * Serialises read-modify-write access to one of the small JSON collections in
 * `.data`. This is intentionally simple; production traffic should use a
 * database, but it keeps the demo storefront durable and race-free.
 */
export async function updateJsonArray<T>(
  fileName: string,
  updater: (records: T[]) => T[] | Promise<T[]>
): Promise<T[]> {
  return withLock(async () => {
    await fs.mkdir(DATA_DIR, { recursive: true })
    const filePath = path.join(DATA_DIR, fileName)
    const current = await readArray<T>(filePath)
    const next = await updater(current)
    await fs.writeFile(filePath, JSON.stringify(next, null, 2), "utf8")
    return next
  })
}

export async function readJsonArray<T>(fileName: string): Promise<T[]> {
  const filePath = path.join(DATA_DIR, fileName)
  return readArray<T>(filePath)
}
