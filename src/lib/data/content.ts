export interface ContentSection {
  heading: string
  paragraphs?: string[]
  bullets?: string[]
  table?: { headers: string[]; rows: string[][] }
}

export interface Article {
  slug: string
  title: string
  excerpt: string
  category: "Subsidy" | "Net metering" | "Buying guide" | "Installation"
  readingTime: string
  publishedAt: string
  author: string
  heroImage: string
  sections: ContentSection[]
}

export interface InfoPage {
  slug: string
  title: string
  description: string
  updated: string
  sections: ContentSection[]
}

export const articles: Article[] = [
  {
    slug: "pm-surya-ghar-subsidy",
    title: "PM Surya Ghar subsidy: ₹78,000 for an Indian rooftop",
    excerpt:
      "Who is eligible, how much you get for 1, 2 and 3 kW, the documents you need, and what actually happens after you apply.",
    category: "Subsidy",
    readingTime: "7 min read",
    publishedAt: "2026-08-04",
    author: "SolarStore India Technical Team",
    heroImage: "/images/solar/rooftop.jpg",
    sections: [
      {
        heading: "What is PM Surya Ghar: Muft Bijli Yojana?",
        paragraphs: [
          "PM Surya Ghar is the Government of India's residential rooftop solar programme. It provides central financial assistance, or CFA, directly to households that install a grid-connected rooftop system through a registered vendor and complete net metering with their electricity distribution company (discom).",
          "The scheme is administered by the Ministry of New and Renewable Energy (MNRE) and delivered through state discoms and the national portal at pmsuryaghar.gov.in. The subsidy is transferred to the beneficiary's bank account after commissioning, not deducted automatically at the time of sale unless your vendor arranges financing around it.",
        ],
      },
      {
        heading: "How much subsidy do you get?",
        paragraphs: [
          "For residential rooftop systems, the central assistance follows a slab structure. The maximum for a single household is ₹78,000 for systems of 3 kW and above.",
        ],
        table: {
          headers: ["System size", "Central subsidy", "Typical use"],
          rows: [
            ["1 kW", "₹30,000", "Small home, 2–3 lights and fans"],
            ["2 kW", "₹60,000", "1–2 BHK, 200–300 units/month"],
            ["3 kW or more", "₹78,000", "2–3 BHK, 300–500 units/month"],
          ],
        },
        bullets: [
          "The subsidy is capped at ₹78,000 for residential systems, even if you install 5 kW or 10 kW.",
          "Group housing societies and resident welfare associations can claim ₹18,000 per kW for common-area systems, up to 500 kW, under the scheme's GHS component.",
          "Some states add their own top-up subsidy. Ask your discom or check the state section of the national portal for the current amount.",
        ],
      },
      {
        heading: "Who is eligible?",
        bullets: [
          "You must be an Indian citizen and the owner of the house or property where the system is installed.",
          "The home must have an active electricity connection with a valid consumer number.",
          "You should not already have an existing solar rooftop system at the same connection.",
          "The system must be grid-connected, installed by a registered vendor, and net-metered by the discom.",
          "The bank account used for the subsidy must be in the name of the applicant.",
        ],
      },
      {
        heading: "The application process, step by step",
        bullets: [
          "Register on pmsuryaghar.gov.in with your mobile number, state and electricity consumer number.",
          "Submit the application and wait for technical feasibility approval from your discom. This usually takes 15–30 days.",
          "Select a registered vendor from the portal, or ask your vendor to map your application. Compare at least three quotations.",
          "Pay the vendor and complete installation. The vendor uploads the commissioning report, photographs and net-meter application.",
          "The discom installs a bi-directional net meter and issues the commissioning certificate.",
          "Submit the bank details and cancelled cheque on the portal. The subsidy is credited by direct benefit transfer, typically within 30–60 days of approval.",
        ],
      },
      {
        heading: "Documents to keep ready",
        bullets: [
          "Aadhaar card of the property owner",
          "Latest electricity bill with consumer number",
          "Proof of ownership: sale deed, property tax receipt or possession letter",
          "Bank account passbook or cancelled cheque",
          "Roof photographs, including the proposed mounting area",
          "Signed vendor quotation and installation agreement",
        ],
      },
      {
        heading: "What can delay a subsidy claim?",
        paragraphs: [
          "Most delays come from incomplete documents, a mismatch between the applicant and the electricity connection, or a vendor that is not registered for your state. Net-meter installation queues can also add weeks during peak season.",
          "Keep copies of every submission, check that your name matches the electricity bill, and confirm the vendor's registration before paying an advance. If your discom or portal status has not moved for 30 days, escalate through the portal grievance option and your state's renewable energy nodal agency.",
        ],
      },
      {
        heading: "How SolarStore India helps",
        paragraphs: [
          "We supply ALMM-listed panels and BIS-certified inverters with a GST invoice, and our team can review your bill, roof photographs and discom details before you order. We do not claim the subsidy on your behalf; the application must be in your name through a registered vendor.",
          "Use our solar calculator to estimate system size and the ₹78,000 central subsidy, then speak to an engineer before you apply.",
        ],
      },
    ],
  },
  {
    slug: "net-metering-india",
    title: "Net metering in India: how you get paid for exported solar",
    excerpt:
      "A practical guide to bi-directional meters, export credits, state caps and the paperwork that turns a rooftop system into savings.",
    category: "Net metering",
    readingTime: "6 min read",
    publishedAt: "2026-07-22",
    author: "SolarStore India Technical Team",
    heroImage: "/images/solar/grid.jpg",
    sections: [
      {
        heading: "The simple version",
        paragraphs: [
          "A grid-connected solar system produces electricity during the day. Your home uses some of it, and the surplus flows into the discom's network through a bi-directional meter. That meter records both import and export separately.",
          "At the end of the billing cycle, the discom nets the units you exported against the units you imported. If you exported more than you used, the surplus is usually carried forward as a credit and adjusted in a later bill. Cash payouts are rare for residential customers; most states settle export at a credit rate rather than the full retail tariff.",
        ],
      },
      {
        heading: "What net metering is worth",
        paragraphs: [
          "If your home uses 600 units a month and a 5 kW system generates 650 units, the first 600 units offset your retail tariff and the extra 50 units become a credit. Your saving is roughly 600 × your tariff, not 650 × tariff.",
          "This is why sizing matters. A system that is much larger than your annual consumption has a long payback because exported units are credited at a lower rate or carried forward. We recommend sizing to 80–100% of annual usage for most homes.",
        ],
      },
      {
        heading: "State rules differ",
        bullets: [
          "Many states cap residential net metering at 10 kW or at your sanctioned load, whichever is lower. Larger systems may move to gross metering.",
          "Export credit rates vary from the full retail tariff to the average power purchase cost. Check your state's latest net-metering order.",
          "Some discoms charge fixed monthly meter fees, application fees or net-meter testing charges.",
          "Group net metering and virtual net metering are available in some states for societies and shared rooftops.",
        ],
      },
      {
        heading: "The net-metering process",
        bullets: [
          "Apply to your discom after your PM Surya Ghar application is approved, or as part of the same application.",
          "The discom checks feasibility at your transformer and sanctioned load.",
          "After installation, submit the test report, inverter certificate and wiring details.",
          "The discom installs or replaces the meter with a bi-directional meter and seals it.",
          "Sign the net-metering agreement and start exporting. Keep the first bill carefully; it shows how your credits are being applied.",
        ],
      },
      {
        heading: "Net metering vs gross metering",
        paragraphs: [
          "Under net metering, you are credited at the retail tariff for units consumed behind the meter. Under gross metering, every generated unit is exported and bought at a feed-in tariff, which is usually lower. Most Indian residential schemes use net metering, but the choice can depend on system size and state regulations.",
          "If you are planning a system above your state's net-metering cap, ask your discom about gross metering before ordering equipment. The economics can change materially.",
        ],
      },
      {
        heading: "Practical tips",
        bullets: [
          "Apply early. Net-meter approval often takes longer than equipment delivery.",
          "Keep your sanctioned load adequate; an undersized connection can limit approval.",
          "Use a BIS-certified inverter with anti-islanding protection, as required by the discom.",
          "Monitor import and export separately so you can spot metering errors.",
          "Do not expand the system without updating the discom agreement.",
        ],
      },
    ],
  },
  {
    slug: "solar-panel-price-india-2026",
    title: "Solar panel price in India: what a rooftop system really costs",
    excerpt:
      "Indicative 2026 prices for 3 kW, 5 kW and 10 kW systems, module rates, GST, installation costs and the hidden line items in a quotation.",
    category: "Buying guide",
    readingTime: "8 min read",
    publishedAt: "2026-09-12",
    author: "SolarStore India Technical Team",
    heroImage: "/images/solar/panels-close.jpg",
    sections: [
      {
        heading: "Typical installed costs",
        paragraphs: [
          "In 2026, a good-quality residential rooftop system in India typically costs ₹55,000–₹70,000 per kW, inclusive of GST, mounting structure, cabling, monitoring and standard installation. Premium brands, elevated structures, long cable runs and difficult roofs push the number higher.",
        ],
        table: {
          headers: ["System", "Indicative installed cost", "PM Surya Ghar subsidy", "Effective cost"],
          rows: [
            ["3 kW", "₹1,65,000 – ₹2,10,000", "₹78,000", "₹87,000 – ₹1,32,000"],
            ["5 kW", "₹2,45,000 – ₹3,25,000", "₹78,000", "₹1,67,000 – ₹2,47,000"],
            ["10 kW", "₹4,50,000 – ₹6,20,000", "₹78,000 (residential cap)", "₹3,72,000 – ₹5,42,000"],
          ],
        },
        bullets: [
          "These are indicative retail ranges for grid-connected systems. Commercial systems may have different GST treatment and no residential subsidy.",
          "A 3 kW system usually needs 300–350 sq ft of shadow-free roof; 5 kW needs about 500 sq ft.",
          "Prices include 5% GST on solar equipment. Labour and service components may attract a different rate; ask for a line-item quotation.",
        ],
      },
      {
        heading: "What drives the price",
        bullets: [
          "Module technology: mono PERC is the value option; n-type TOPCon costs more but offers higher efficiency and lower degradation.",
          "Brand and warranty: ALMM-listed Tier-1 modules cost more than unbranded imports and are eligible for government schemes.",
          "Structure: flat-roof elevated structures or cyclone-rated designs cost more than simple pitched-roof rails.",
          "Electrical balance: longer DC runs, surge protection, earthing and lightning arrestors add cost.",
          "Discom and net-metering charges: application fees, meter costs and testing vary by state.",
          "Installation access: scaffolding, crane charges or high-rise work add labour cost.",
        ],
      },
      {
        heading: "Why the cheapest quote is usually not the best",
        paragraphs: [
          "A very low quote often excludes the mounting structure, net-meter liaison, GST, or uses modules that are not ALMM-listed. If the panel is not on the ALMM list, your PM Surya Ghar subsidy can be rejected. If the inverter is not BIS-certified, the discom may refuse net metering.",
          "Ask for the module datasheet, inverter certificate, structure drawing, warranty documents and a clear scope of work. A slightly higher quote with genuine paperwork is almost always cheaper over 25 years.",
        ],
      },
      {
        heading: "Worked example: 5 kW home in Pune",
        bullets: [
          "10 × 545 W mono PERC panels: about ₹1,45,000",
          "5 kW on-grid inverter: about ₹30,000",
          "Galvanised elevated structure: about ₹32,000",
          "Cabling, MC4, earthing, lightning arrestor: about ₹15,000",
          "Monitoring and commissioning: about ₹4,000",
          "Installation labour and net-meter liaison: about ₹20,000",
          "Total before subsidy: about ₹2,46,000; after ₹78,000: about ₹1,68,000",
          "At ₹10.50/unit in Maharashtra and 7,250 units/year, payback is roughly 4–5 years for a typical home.",
        ],
      },
      {
        heading: "How to compare quotations",
        bullets: [
          "Compare price per kW, not just the total.",
          "Confirm whether GST, structure, cabling, installation and net-meter fees are included.",
          "Check the exact module model, wattage and ALMM listing.",
          "Check inverter brand, warranty and service network in your state.",
          "Ask who handles the discom application and how long commissioning usually takes.",
          "Get the payment schedule and completion timeline in writing.",
        ],
      },
    ],
  },
  {
    slug: "on-grid-vs-off-grid-vs-hybrid",
    title: "On-grid, off-grid or hybrid: which solar system fits your home?",
    excerpt:
      "A clear comparison of the three system types for Indian homes, including backup, net metering, cost and the right use case for each.",
    category: "Buying guide",
    readingTime: "5 min read",
    publishedAt: "2026-06-18",
    author: "SolarStore India Technical Team",
    heroImage: "/images/solar/panels-array.jpg",
    sections: [
      {
        heading: "The short answer",
        bullets: [
          "Choose on-grid if you have a reliable grid, want the lowest cost and can net-meter your exports. This is the right choice for most urban and semi-urban homes.",
          "Choose hybrid if you have frequent power cuts and want essential loads to keep running. Add a lithium or tubular battery bank.",
          "Choose off-grid only if there is no grid connection, or if the connection is extremely unreliable and you need complete independence.",
        ],
      },
      {
        heading: "Comparison",
        table: {
          headers: ["", "On-grid", "Hybrid", "Off-grid"],
          rows: [
            ["Battery", "None", "Optional or included", "Required"],
            ["Backup during outage", "No", "Yes, for selected loads", "Yes, within battery capacity"],
            ["Net metering", "Yes", "Yes", "Not applicable"],
            ["Typical cost", "Lowest", "20–50% higher", "Highest"],
            ["Best for", "Cities with stable grid", "Homes with outages", "Farms, remote sites"],
            ["Maintenance", "Low", "Moderate", "Moderate to high"],
          ],
        },
      },
      {
        heading: "How on-grid works",
        paragraphs: [
          "The inverter synchronises with the grid and shuts down automatically during an outage to protect linemen. All solar generation is either consumed at home or exported through the net meter. There is no battery, so there is no backup when the grid fails.",
          "On-grid is the cheapest and most common configuration under PM Surya Ghar. It is ideal when outages are short and your priority is reducing the bill.",
        ],
      },
      {
        heading: "How hybrid works",
        paragraphs: [
          "A hybrid inverter can charge a battery, run selected circuits during an outage, and still export surplus power when the grid is available. A transfer time of under 20 milliseconds keeps lights and fans running without a noticeable flicker.",
          "Battery sizing is a cost trade-off. A 5 kWh lithium battery typically supports lights, fans, Wi-Fi, a TV and a refrigerator for several hours, depending on usage. Resist the temptation to back up air conditioners unless you have a very large battery bank.",
        ],
      },
      {
        heading: "How off-grid works",
        paragraphs: [
          "An off-grid system uses a charge controller, battery bank and inverter to run loads independently of the grid. It is common for farms, telecom sites and remote homes. Because every unit must be stored or consumed, systems are sized conservatively and batteries add significant cost.",
          "If you have a grid connection, a hybrid system is usually more economical than a large off-grid system with the same backup capability.",
        ],
      },
      {
        heading: "What we recommend for Indian homes",
        paragraphs: [
          "Start with on-grid if your discom is reliable. If you experience daily outages, choose hybrid and size the battery around essential loads rather than the whole house. Always confirm the inverter is BIS-certified and compatible with the battery chemistry you plan to use.",
          "Use our project builder to compare a 3 kW on-grid, 3 kW hybrid and 5 kW on-grid system with current prices.",
        ],
      },
    ],
  },
  {
    slug: "solar-inverter-sizing",
    title: "How to size a solar inverter for an Indian rooftop",
    excerpt:
      "DC/AC ratio, MPPT inputs, single-phase vs three-phase, and why the cheapest inverter can cost you more over ten years.",
    category: "Installation",
    readingTime: "5 min read",
    publishedAt: "2026-05-30",
    author: "SolarStore India Technical Team",
    heroImage: "/images/solar/technician.jpg",
    sections: [
      {
        heading: "Match the inverter to the array, not just the kW label",
        paragraphs: [
          "A solar array rarely produces its nameplate rating. A 5 kW array might peak at 4.2 kW on a hot afternoon and produce 3.5 kW on a hazy day. Inverters are therefore often sized slightly below the array's DC rating, typically at a DC/AC ratio of 1.1 to 1.3.",
          "For a 5.45 kW array of ten 545 W panels, a 5 kW inverter is a good match. A 3 kW inverter would clip too much production; a 6 kW inverter would cost more without adding much annual generation.",
        ],
      },
      {
        heading: "Check the electrical window",
        bullets: [
          "Maximum DC input voltage: the array's open-circuit voltage at the coldest expected temperature must stay below the inverter limit.",
          "MPPT voltage range: make sure the string voltage sits inside the range for most of the day.",
          "Maximum input current: do not exceed the inverter's per-MPPT current rating.",
          "Number of MPPTs: more MPPTs help when panels face different directions or have partial shade.",
        ],
      },
      {
        heading: "Single phase or three phase?",
        paragraphs: [
          "Most homes have a single-phase connection and use single-phase inverters up to about 5–6 kW. Three-phase inverters are used for larger homes, shops and societies, and are generally required above 7–10 kW depending on the discom.",
          "Confirm your sanctioned load and phase before ordering. Upgrading a connection can add cost and time to the project.",
        ],
      },
      {
        heading: "Efficiency, protection and service",
        bullets: [
          "Look for BIS certification and IEC 62109 compliance; discoms require them for net metering.",
          "IP65 or IP66 protection matters in coastal and monsoon-heavy regions.",
          "Anti-islanding protection is mandatory for grid-tied systems.",
          "Check the local service network. A 10-year warranty is only useful if the brand can replace the unit in your state within days.",
          "Prefer inverters with open monitoring APIs or a reliable app for tracking generation and faults.",
        ],
      },
      {
        heading: "Hybrid inverter sizing",
        paragraphs: [
          "A hybrid inverter must be sized for both the solar array and the battery bank. Check the battery voltage (48 V is common for lithium rack batteries), maximum charge current and whether the inverter supports the battery's communication protocol.",
          "If you plan to add a battery later, buy a hybrid inverter now rather than replacing an on-grid unit. The incremental cost is usually lower than a second inverter.",
        ],
      },
    ],
  },
  {
    slug: "solar-for-apartments",
    title: "Solar for apartments and housing societies in India",
    excerpt:
      "Common-area solar, group net metering, RWA approvals and the ₹18,000/kW society subsidy explained.",
    category: "Installation",
    readingTime: "6 min read",
    publishedAt: "2026-04-11",
    author: "SolarStore India Technical Team",
    heroImage: "/images/solar/solar-farm.jpg",
    sections: [
      {
        heading: "Where can an apartment society install solar?",
        bullets: [
          "Common-area loads: lifts, corridor lighting, pumps, clubhouse and security. This is the simplest starting point.",
          "Individual flats with private rooftops or terraces, where ownership and access are clear.",
          "Shared rooftop systems using group net metering or virtual net metering, where the state regulator allows it.",
        ],
      },
      {
        heading: "The society subsidy",
        paragraphs: [
          "Under PM Surya Ghar, group housing societies and resident welfare associations can receive ₹18,000 per kW for common-area solar, up to 500 kW. The application is made in the society's name, with the electricity connection and bank account details of the RWA.",
          "This is separate from the ₹78,000 residential cap available to individual households. The discom and state nodal agency confirm eligibility and the exact process.",
        ],
      },
      {
        heading: "Approvals you will need",
        bullets: [
          "A resolution from the managing committee or general body authorising the project and expenditure.",
          "No-objection certificates for roof access, structural safety and common-area electrical work.",
          "A feasibility approval from the discom for the proposed capacity.",
          "A net-metering or group-net-metering agreement, depending on your state.",
          "A maintenance plan and insurance cover for the asset.",
        ],
      },
      {
        heading: "Technical considerations",
        paragraphs: [
          "Apartment roofs often have water tanks, lift rooms, staircases and shaded areas. A shadow analysis is essential; a single water tank can cut the output of an entire string. Use multiple MPPTs or micro-inverters where shading is unavoidable.",
          "Structural loading matters. A typical panel and elevated structure adds 15–25 kg per square metre. Get a structural engineer to confirm the slab can take the load, especially in older buildings.",
          "Cable runs from the roof to the meter room can be long. Use adequately sized DC cable and protect it in conduit or cable trays.",
        ],
      },
      {
        heading: "A practical roadmap",
        bullets: [
          "Start with an energy audit of common-area loads and a year of electricity bills.",
          "Estimate the rooftop area and shadow-free zones.",
          "Get three quotations with a clear scope for structure, cabling, net metering and maintenance.",
          "Pass the committee resolution and apply for feasibility.",
          "Install, commission, net-meter and set up a monthly generation review.",
        ],
      },
      {
        heading: "How we can help",
        paragraphs: [
          "SolarStore supplies panels, inverters, structures and monitoring for society projects, with GST invoices for the RWA. Our team can review roof photographs and bills remotely, and connect you with installation partners in your city. Call us on +91 522 471 2200 to start.",
        ],
      },
    ],
  },
]

export function getArticle(slug: string): Article | undefined {
  return articles.find((article) => article.slug === slug)
}

export const infoPages: InfoPage[] = [
  {
    slug: "about",
    title: "About SolarStore India",
    description:
      "We supply complete rooftop solar kits to dealers, EPCs and installers across India with transparent 65% kit pricing, GST invoices and UP subsidy documentation.",
    updated: "2026-10-22",
    sections: [
      {
        heading: "Our story",
        paragraphs: [
          "SolarStore India started in Lucknow in 2019 with a simple observation: solar dealers were spending too much time chasing panels, inverters, structures, cables and paperwork from different suppliers. Quotes were hard to compare and margin was unclear until the job was over.",
          "We built a dealer-only kit catalogue: one SKU with every component matched, one freight cost and one GST invoice. Today we supply complete 1–50 kW on-grid, hybrid and commercial kits to solar businesses across India.",
        ],
      },
      {
        heading: "What we do",
        bullets: [
          "Supply complete rooftop kits only — no loose panels, inverters, batteries or accessories.",
          "Fix the dealer kit price at 65% of the homeowner turnkey quote, leaving 35% for installation and dealer margin.",
          "Issue GST invoices with input-credit details and freight included.",
          "Provide the documentation dealers need for PM Surya Ghar, the UP top-up and net metering.",
          "Support dealer quotes with a kit calculator, project builder and technical desk.",
          "Coordinate warranty claims with module, inverter and battery manufacturers.",
        ],
      },
      {
        heading: "By the numbers",
        table: {
          headers: ["Metric", "Today"],
          rows: [
            ["Dealer businesses supplied", "1,200+"],
            ["Kit capacity supplied", "180 MW"],
            ["Serviceable pincodes", "19,000+"],
            ["Dealer rating", "4.8 / 5"],
            ["Team", "120+ people across India"],
          ],
        },
      },
      {
        heading: "Our registered office",
        paragraphs: [
          "SolarStore India Pvt. Ltd., SolarStore House, Vibhuti Khand, Gomti Nagar, Lucknow, Uttar Pradesh 226010. GSTIN 09AABCS1429B1ZX. CIN U40106UP2019PTC123456.",
          "For dealer onboarding, kit quotes or partnership enquiries, write to hello@solarstore.in or call +91 522 471 2200, Monday to Saturday, 9:00 AM to 8:00 PM IST.",
        ],
      },
    ],
  },
  {
    slug: "shipping",
    title: "Dealer kit freight and delivery",
    description:
      "Dispatch times, freight cover and how complete rooftop kits move from our Lucknow warehouse to your project site.",
    updated: "2026-10-22",
    sections: [
      {
        heading: "Freight and dispatch",
        bullets: [
          "Freight is included on every dealer kit, with no minimum order threshold.",
          "Prices include 5% GST and a tax invoice is issued for every dispatch.",
          "Standard kits are dispatched from Lucknow in 7–12 working days after payment confirmation.",
          "Commercial kits are dispatched in 12–21 working days after payment confirmation.",
          "Metro and major cities: 3–5 business days in transit. Rest of India: 4–7 business days. Remote states and islands: 6–9 business days.",
        ],
      },
      {
        heading: "Serviceable pincodes and site delivery",
        paragraphs: [
          "We deliver to more than 19,000 pincodes through surface logistics partners. Enter your pincode at checkout to confirm serviceability. For project sites outside a serviceable pincode, contact the dealer desk and we will quote the nearest delivery point.",
          "Complete kits travel as fragile, heavy goods on surface transport. Please confirm site access, unloading arrangements and a ground-floor delivery point before dispatch. If you are delivering directly to a homeowner, share the site contact and preferred window in the order notes.",
        ],
      },
      {
        heading: "Packaging and handling",
        paragraphs: [
          "Modules are shipped in reinforced edge-protected cartons on dedicated pallets. Inverters, batteries and balance-of-system components are packed with shock-absorbing material. Inspect the outer packaging before accepting delivery and note any visible damage on the delivery receipt.",
          "Large kits may need two people and lifting equipment to receive. Check that the site has access for the delivery vehicle and, for apartment or commercial buildings, that a lift or staircase is available.",
        ],
      },
      {
        heading: "Tracking and payment",
        paragraphs: [
          "You will receive an order confirmation immediately, a dispatch notification with LR and tracking details, and delivery updates by SMS and WhatsApp on the mobile number provided at checkout.",
          "We accept UPI, cards, net banking and NEFT/RTGS against a proforma invoice. For NEFT orders, the kit is reserved once the transfer is confirmed.",
        ],
      },
      {
        heading: "Damaged in transit",
        paragraphs: [
          "Report visible damage within 48 hours of delivery with photographs of the packaging, the kit components and the shipping label. Email support@solarstore.in or call +91 522 471 2200. We will arrange an inspection and a replacement or credit note after review.",
          "Do not install a component that arrived damaged. Installation voids the possibility of a transit-damage claim.",
        ],
      },
    ],
  },
  {
    slug: "returns",
    title: "Dealer returns and refunds",
    description:
      "Our 7-day return policy for unopened kits and components, what cannot be returned, and how dealer refunds are processed.",
    updated: "2026-10-22",
    sections: [
      {
        heading: "7-day return window",
        bullets: [
          "You can request a return within 7 days of delivery for unopened complete kits or components in original packaging.",
          "The kit must be unused, undamaged and complete with all manuals, warranty cards and the original GST invoice.",
          "Contact support@solarstore.in with your order number, GSTIN and reason for return. We will arrange a pickup where serviceable.",
          "Refunds are processed to the original payment account or issued as a credit note within 5–7 business days after inspection.",
        ],
      },
      {
        heading: "What cannot be returned",
        bullets: [
          "Modules that have been unpacked, mounted or connected.",
          "Custom-cut or custom-fabricated mounting structures.",
          "Batteries that have been connected to a system or charged.",
          "Clearance and final-sale kits, marked on the product page.",
          "Components damaged by incorrect installation, lightning, surge or physical impact.",
        ],
      },
      {
        heading: "Return freight and restocking",
        paragraphs: [
          "If the return is due to a defect, wrong component or our dispatch error, we cover return freight. For change-of-mind returns, a pickup and restocking charge may apply and will be deducted from the credit note. The exact amount depends on kit size and location and will be confirmed before pickup.",
        ],
      },
      {
        heading: "Warranty is separate",
        paragraphs: [
          "A return is for a kit or component you no longer want. If a component fails after installation, use the manufacturer warranty process instead. Modules carry up to 25-year performance warranties, inverters typically 5 years and batteries 36 months to 10 years. See our warranty page for the claim process.",
        ],
      },
      {
        heading: "Cancellations",
        paragraphs: [
          "You can cancel an order free of charge before dispatch. Once dispatched, a cancellation is treated as a return and may incur freight charges. Custom structures and special-order kits cannot be cancelled after fabrication begins.",
        ],
      },
    ],
  },
  {
    slug: "warranty",
    title: "Warranty claims",
    description:
      "What is covered, how long each product lasts, and the fastest way to raise a claim in India.",
    updated: "2026-09-05",
    sections: [
      {
        heading: "Standard warranty periods",
        table: {
          headers: ["Product", "Warranty"],
          rows: [
            ["Solar panels", "10–12 years product, 25-year performance"],
            ["On-grid inverters", "5 years, extendable with some brands"],
            ["Hybrid inverters", "5 years"],
            ["Tubular batteries", "36–48 months"],
            ["Lithium batteries", "10 years (manufacturer dependent)"],
            ["Mounting structures", "5–10 years"],
          ],
        },
        paragraphs: [
          "The exact warranty for your product is listed in the specifications tab and on the manufacturer's warranty card supplied with the shipment.",
        ],
      },
      {
        heading: "How to raise a claim",
        bullets: [
          "Call +91 522 471 2200 or email support@solarstore.in with your order number and product serial number.",
          "Describe the fault and attach photographs, a short video if relevant, and your GST invoice.",
          "Our team will do a first-level diagnosis and, if needed, raise an RMA with the manufacturer.",
          "A service engineer will inspect the product at your site or ask for it to be returned, depending on the fault.",
          "Approved claims are repaired or replaced as per the manufacturer's policy. Labour and transport for warranty work are covered as per the brand's terms.",
        ],
      },
      {
        heading: "What is not covered",
        bullets: [
          "Physical damage, cracked glass or broken frames caused by mishandling.",
          "Damage from lightning, voltage surge, flooding or fire.",
          "Incorrect installation, reverse polarity or use with incompatible equipment.",
          "Unauthorised repair or modification.",
          "Normal cosmetic wear, soiling or discolouration that does not affect performance.",
          "Products purchased from unauthorised resellers without a valid SolarStore invoice.",
        ],
      },
      {
        heading: "Performance warranty explained",
        paragraphs: [
          "A panel performance warranty guarantees a minimum power output over time, typically starting at 97–98% in year one and declining to about 80–87% by year 25 or 30. Claims require a measured test under standard conditions, usually arranged by the manufacturer.",
          "Keep your invoice and commissioning report. These are the first documents every warranty claim asks for.",
        ],
      },
    ],
  },
  {
    slug: "installation-guide",
    title: "Installation guide for Indian rooftops",
    description:
      "A practical checklist covering site survey, structure, wiring, earthing, net metering and commissioning.",
    updated: "2026-08-20",
    sections: [
      {
        heading: "Before installation",
        bullets: [
          "Complete a roof survey: measure shadow-free area, note water tanks, parapets and future construction.",
          "Confirm the roof can take the load; get a structural check for older buildings.",
          "Verify the discom connection, sanctioned load and net-metering eligibility.",
          "Agree the inverter location: shaded, ventilated and close to the meter room.",
          "Plan cable routes and conduit before drilling.",
        ],
      },
      {
        heading: "Mounting and structure",
        paragraphs: [
          "Use hot-dip galvanised or aluminium structures rated for local wind speeds. For coastal areas, specify corrosion-resistant fasteners. Maintain a minimum tilt of 10–15 degrees for self-cleaning, and leave walkways for maintenance.",
          "Ensure the structure is bonded to earth and that module clamps are tightened to the manufacturer's torque specification. Do not drill through the module frame.",
        ],
      },
      {
        heading: "Electrical work",
        bullets: [
          "Use UV-resistant DC solar cable with correct current-carrying capacity.",
          "Route DC cables in conduit or cable trays and avoid long loops.",
          "Install DC isolators, surge protection and a clearly labelled AC breaker.",
          "Provide a dedicated earth pit with low resistance, plus lightning arrestors where required.",
          "Use MC4 connectors from the same manufacturer and crimp them correctly.",
          "Commission only after insulation resistance and polarity checks pass.",
        ],
      },
      {
        heading: "Net metering and commissioning",
        paragraphs: [
          "Submit the installation test report, inverter certificate and photographs to the discom. After inspection, the discom installs a bi-directional meter. Record the initial meter reading and configure monitoring.",
          "Train the homeowner on shutdown procedure, basic fault indicators and cleaning. Provide the warranty documents and a single-point contact for service.",
        ],
      },
      {
        heading: "Maintenance calendar",
        bullets: [
          "Clean panels every 2–4 weeks in dusty regions; less often during monsoon.",
          "Inspect mounting bolts and cable ties every six months.",
          "Check inverter error logs and generation trends monthly.",
          "Test earthing and surge protection annually.",
          "Schedule a professional service every two years.",
        ],
      },
    ],
  },
  {
    slug: "faqs",
    title: "Dealer frequently asked questions",
    description:
      "Short answers on dealer pricing, GST, freight, installation, subsidy documentation, warranty and payment terms.",
    updated: "2026-10-22",
    sections: [
      {
        heading: "Pricing, GST and subsidy",
        bullets: [
          "How is the dealer price set? Every kit is priced at 65% of the homeowner turnkey quote. The remaining 35% is your margin for installation, labour and profit.",
          "Is GST included? Yes. All prices on the site include 5% GST, and you receive a GST tax invoice for input credit.",
          "Can my business claim input tax credit? Eligible GST-registered dealers can claim input tax credit on the GST charged, subject to their tax adviser's confirmation.",
          "Do you deduct the subsidy from my kit invoice? No. The homeowner claims PM Surya Ghar and the UP top-up. Your dealer invoice remains the full 65% kit price.",
          "Can I get a better price on volume? Contact the dealer desk for project pricing above 10 kW or repeat orders.",
        ],
      },
      {
        heading: "Freight and installation",
        bullets: [
          "How long does dispatch take? Standard kits leave Lucknow in 7–12 working days; commercial kits in 12–21 working days after payment confirmation.",
          "Is freight included? Yes, freight is included on every dealer kit. Transit is typically 3–9 business days depending on the state.",
          "Is installation included? No. Your team installs and commissions the kit. We provide the installation guide, wiring details and documentation support.",
          "Do you deliver to my project pincode? We serve 19,000+ pincodes. Check at checkout or contact support with your pincode.",
          "What payment terms do dealers get? Pay by UPI, cards, net banking or NEFT/RTGS against a proforma invoice. Production starts after payment confirmation.",
        ],
      },
      {
        heading: "Technical",
        bullets: [
          "How much roof does a kit need? About 100 sq ft per kW, including walkways and shading gaps.",
          "Will the system work during a power cut? Only a hybrid kit with a battery provides backup. On-grid kits shut down during outages for safety.",
          "How much will the homeowner save? A 1 kW system generates roughly 1,400–1,600 units a year in most of India. Use the kit calculator for a quote based on state tariff and subsidy.",
          "Do modules need cleaning? Yes. Dust reduces generation; recommend cleaning every 2–4 weeks in dry, dusty regions.",
          "What is net metering? A bi-directional meter records export and import, and the discom credits exported units against consumption. Rules vary by state.",
        ],
      },
      {
        heading: "Warranty and returns",
        bullets: [
          "What warranty comes with a kit? Modules carry 25-year performance and 10–12-year product warranties; inverters typically 5 years; batteries 36 months to 10 years depending on chemistry.",
          "Can I return a kit? Unopened kits and components can be returned within 7 days. Installed modules and custom structures cannot be returned, but warranty applies.",
          "What if a component arrives damaged? Report it within 48 hours with photographs and we will arrange an inspection and replacement or credit note.",
        ],
      },
    ],
  },
  {
    slug: "sustainability",
    title: "Sustainability at SolarStore India",
    description:
      "How we think about carbon, packaging, e-waste and responsible supply chains as solar scales in India.",
    updated: "2026-07-05",
    sections: [
      {
        heading: "The impact we enable",
        paragraphs: [
          "Every megawatt of rooftop solar we supply avoids roughly 710 tonnes of CO₂ per year compared with India's grid. Since 2019, systems supplied through SolarStore are estimated to avoid more than 120,000 tonnes of CO₂ annually.",
          "Solar is not automatically sustainable if it is manufactured irresponsibly or discarded badly. We try to address the full lifecycle, not just the generation number.",
        ],
      },
      {
        heading: "Responsible sourcing",
        bullets: [
          "Prefer ALMM-listed manufacturers with published environmental and labour policies.",
          "Ask suppliers about module recycling commitments and take-back programmes.",
          "Avoid unbranded or unrecyclable battery chemistries where a certified alternative exists.",
          "Audit packaging waste and consolidate shipments to reduce breakage and returns.",
        ],
      },
      {
        heading: "Packaging and logistics",
        paragraphs: [
          "Solar modules require robust packaging, but we are reducing single-use plastic and moving to recycled cardboard, reusable corner protectors and pallet pooling with logistics partners. We also consolidate orders where possible to reduce trips.",
        ],
      },
      {
        heading: "E-waste and end of life",
        paragraphs: [
          "India's e-waste rules now cover solar photovoltaic modules. We work with authorised recyclers for damaged modules, inverters and lithium batteries, and we provide customers with take-back guidance at end of life.",
          "Do not discard batteries or inverters with household waste. Call us for a recycling referral in your city.",
        ],
      },
      {
        heading: "Our 2030 commitments",
        bullets: [
          "Divert 90% of packaging waste from landfill.",
          "Offer a take-back route for every module and battery we sell.",
          "Publish an annual impact and supplier responsibility report.",
          "Support solar access for schools and primary health centres in underserved districts.",
        ],
      },
    ],
  },
  {
    slug: "careers",
    title: "Careers at SolarStore India",
    description:
      "Join a team that is making rooftop solar simpler, more transparent and more reliable for Indian homes.",
    updated: "2026-09-01",
    sections: [
      {
        heading: "Why work with us",
        paragraphs: [
          "We are a small, product-minded team in Lucknow working on one of India's most important transitions. You will work with engineers, installers and customers across the country, and your work will show up on real rooftops within weeks.",
          "We offer competitive salaries, health cover, 25 days of leave, a learning budget and employee discounts on solar systems.",
        ],
      },
      {
        heading: "Open roles",
        table: {
          headers: ["Role", "Location", "Type"],
          rows: [
            ["Solar design engineer", "Lucknow", "Full-time"],
            ["Inside sales specialist", "Lucknow / remote", "Full-time"],
            ["Supply chain associate", "Lucknow", "Full-time"],
            ["Customer support executive", "Lucknow", "Full-time"],
          ],
        },
      },
      {
        heading: "What we look for",
        bullets: [
          "Clear communication in English and at least one Indian language.",
          "Practical problem-solving, especially when a roof or a discom throws a surprise.",
          "Respect for safety and for the customer's money.",
          "Curiosity about solar, storage and the Indian electricity system.",
        ],
      },
      {
        heading: "How to apply",
        paragraphs: [
          "Email careers@solarstore.in with the role in the subject line, your CV and a short note on why the role interests you. We review every application and respond within two weeks.",
          "SolarStore India is an equal-opportunity employer. We do not discriminate on the basis of caste, religion, gender, disability, age or region.",
        ],
      },
    ],
  },
  {
    slug: "privacy",
    title: "Privacy policy",
    description:
      "How SolarStore India collects, uses, stores and protects personal data under India's Digital Personal Data Protection Act, 2023.",
    updated: "2026-09-01",
    sections: [
      {
        heading: "Data we collect",
        bullets: [
          "Account data: name, email address, phone number and hashed password.",
          "Order data: delivery address, pincode, GSTIN, items purchased and payment status.",
          "Support data: messages, call notes and warranty documents you share with us.",
          "Technical data: browser type, device, pages visited and approximate location derived from IP.",
          "Marketing preferences: whether you opted in to our newsletter.",
        ],
      },
      {
        heading: "How we use it",
        paragraphs: [
          "We use personal data to create and secure your account, process orders, deliver products, issue GST invoices, provide warranty support, prevent fraud and comply with Indian law. With your consent, we also send product updates and solar guides.",
          "We do not sell personal data. We share only what is necessary with logistics partners, payment processors, installation partners and manufacturers for warranty administration.",
        ],
      },
      {
        heading: "Your rights under the DPDP Act",
        bullets: [
          "Access a summary of the personal data we hold about you.",
          "Request correction of inaccurate or incomplete data.",
          "Request erasure of data that is no longer required for a legal or contractual purpose.",
          "Withdraw consent for marketing at any time.",
          "Nominate a person to exercise your rights in the event of death or incapacity.",
          "Raise a grievance with our Data Protection Officer.",
        ],
      },
      {
        heading: "Retention and security",
        paragraphs: [
          "Account data is retained while your account is active. Order and invoice records are retained for the period required under Indian tax and company law. Marketing data is deleted within 30 days of withdrawal of consent.",
          "We use encrypted connections, hashed passwords, access controls and audit logging. No system is completely secure; if a breach affects you, we will notify you and the Data Protection Board as required.",
        ],
      },
      {
        heading: "Grievance officer",
        paragraphs: [
          "Data Protection Officer, SolarStore India Pvt. Ltd., SolarStore House, Vibhuti Khand, Gomti Nagar, Lucknow 226010. Email: privacy@solarstore.in. Phone: +91 522 471 2200. We aim to respond within 30 days.",
          "This is a demonstration storefront built for a local project. Do not submit real payment credentials or sensitive personal data.",
        ],
      },
    ],
  },
  {
    slug: "terms",
    title: "Terms of sale",
    description:
      "The terms that apply when you browse SolarStore India, place an order or use our services.",
    updated: "2026-09-01",
    sections: [
      {
        heading: "Using this site",
        paragraphs: [
          "By accessing SolarStore India, you agree to these terms. If you do not agree, please do not use the site. Dealer accounts are for registered businesses, EPCs and installation companies. You must be at least 18 years old and legally capable of entering into a contract under Indian law to place an order.",
          "Kit images are representative. Component makes, specifications and packaging may change without notice. We try to keep listings accurate but do not warrant that every description is error-free.",
        ],
      },
      {
        heading: "Prices and GST",
        paragraphs: [
          "All prices are in Indian Rupees and include 5% GST on solar equipment. Freight is included on every dealer kit; installation is not included. We may correct pricing errors before dispatch and will contact you if the corrected price differs materially.",
          "The PM Surya Ghar and Uttar Pradesh subsidy figures shown on product pages are indicative benchmarks for the homeowner. Eligibility and disbursal are determined by the government and the discom, not by SolarStore India, and the subsidy is never deducted from the dealer kit invoice.",
        ],
      },
      {
        heading: "Dealer orders and payment",
        bullets: [
          "An order is an offer to purchase; acceptance occurs when we confirm dispatch.",
          "We may refuse or cancel an order for stock, pricing, fraud or serviceability reasons.",
          "Online payments are processed by authorised payment partners. We do not store card numbers.",
          "NEFT/RTGS orders are reserved once the transfer is confirmed against the proforma invoice.",
          "Dealer orders are prepaid by UPI, card, net banking or NEFT/RTGS.",
        ],
      },
      {
        heading: "Delivery, returns and warranty",
        paragraphs: [
          "Dispatch and transit timelines are estimates, not guarantees. Risk passes to you on delivery. Returns are governed by our dealer returns policy, and component warranties are provided by the manufacturer as described on the product page.",
          "Kits contain fragile and heavy components. Inspect packaging before accepting delivery and report transit damage within 48 hours.",
        ],
      },
      {
        heading: "Liability and governing law",
        paragraphs: [
          "To the maximum extent permitted by law, our aggregate liability for a claim is limited to the amount paid for the product giving rise to the claim. We are not liable for indirect or consequential losses, including lost generation or business interruption.",
          "These terms are governed by the laws of India. The courts at Lucknow, Uttar Pradesh have exclusive jurisdiction, subject to any mandatory consumer forum rights.",
        ],
      },
      {
        heading: "Contact",
        paragraphs: [
          "Questions about these terms: legal@solarstore.in or SolarStore India Pvt. Ltd., SolarStore House, Vibhuti Khand, Gomti Nagar, Lucknow 226010.",
          "This site is a demonstration project. Orders placed here do not create a real supply contract and no payment is collected.",
        ],
      },
    ],
  },
  {
    slug: "cookies",
    title: "Cookie policy",
    description:
      "The small files this site stores on your device, why we use them and how you can control them.",
    updated: "2026-08-01",
    sections: [
      {
        heading: "What cookies are",
        paragraphs: [
          "Cookies are small text files stored by your browser. They help a website remember your preferences and keep you signed in. Similar technologies include local storage, which this storefront uses to keep your kit order and saved kits on your device.",
        ],
      },
      {
        heading: "Cookies we use",
        table: {
          headers: ["Type", "Purpose", "Can you disable it?"],
          rows: [
            ["Essential", "Sign-in session, security, cart and checkout", "No, the site will not work"],
            ["Preferences", "Remember your light theme and region", "Yes"],
            ["Analytics", "Understand which pages and products are useful", "Yes"],
            ["Support", "Remember an open chat or support ticket", "Yes"],
          ],
        },
      },
      {
        heading: "Local storage",
        paragraphs: [
          "Your kit order, dealer credit code, saved kits and demo orders are stored in your browser's local storage, not on our servers, unless you place an order through an authenticated account. Clearing browser data removes them.",
        ],
      },
      {
        heading: "Managing cookies",
        paragraphs: [
          "You can block or delete cookies in your browser settings. Blocking essential cookies will prevent sign-in and checkout from working. There is no advertising cookie on this site, and we do not sell data to advertisers.",
          "For questions, email privacy@solarstore.in.",
        ],
      },
    ],
  },
  {
    slug: "accessibility",
    title: "Accessibility",
    description:
      "Our commitment to making SolarStore usable for people with disabilities, and how to tell us when we fall short.",
    updated: "2026-07-18",
    sections: [
      {
        heading: "Our commitment",
        paragraphs: [
          "We aim to meet WCAG 2.1 Level AA across the storefront, including keyboard navigation, visible focus states, sufficient colour contrast, meaningful alt text and form labels. A dealer quote is a long-term business commitment; the buying process should be usable by everyone.",
        ],
      },
      {
        heading: "What we have done",
        bullets: [
          "Semantic HTML landmarks and heading order across public pages.",
          "Keyboard-accessible navigation, dialogs, filters and quantity controls.",
          "Alt text on product and editorial images.",
          "Form labels, error messages and status announcements.",
          "Respect for reduced-motion preferences and a forced light theme for readability.",
        ],
      },
      {
        heading: "Known limitations",
        paragraphs: [
          "Some third-party logistics and payment pages are outside our control and may not fully meet the same standard. Interactive charts and PDF invoices may have limited screen-reader support. We are working on alternatives.",
        ],
      },
      {
        heading: "Tell us",
        paragraphs: [
          "If you encounter a barrier, email accessibility@solarstore.in or call +91 522 471 2200 with the page URL and a description. We aim to acknowledge accessibility reports within two business days and provide an alternative way to complete your purchase.",
        ],
      },
    ],
  },
]

export function getInfoPage(slug: string): InfoPage | undefined {
  return infoPages.find((page) => page.slug === slug)
}
