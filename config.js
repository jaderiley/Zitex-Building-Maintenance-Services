/* ============================================================
   CONFIG — edit ONLY this file per client
   ============================================================ */

const CONFIG = {

  // ─── BUSINESS INFO ───────────────────────────────────────
  business: {
    name:      "Zitex Building Maintenance Services",
    phone:     "+27 72 706 8614",
    whatsapp:  "+27 72 706 8614",
    address:   "20a 2nd Ave, Johannesburg, South Africa",
    hours:     "Mon–Fri 7am–5pm · Sat 7am–1pm",
    region:    "Gauteng",
    priceRange:"$$",
    suburbs: [
      "Johannesburg CBD",
      "Parktown",
      "Melville",
      "Westdene",
      "Brixton",
      "Newlands",
      "Sophiatown",
      "Auckland Park"
    ]
  },

  // ─── PAGE META / SEO ─────────────────────────────────────
  meta: {
    title:       "Zitex Building Maintenance Services — Construction in johannesburg",
    description: "Zitex Building Maintenance Services provides professional construction in Johannesburg. 1 Google review. Call for a quote today.",
    url:         ""  // Live domain — e.g. https://example.co.za (activates canonical + WebSite schema)
  },

  // ─── BRANDING ────────────────────────────────────────────
  branding: {
    palette:  "ember",   // ember | security | forest | volt | tide
    ogImage:  "images/og.jpg"
  },

  // ─── CONTENT ─────────────────────────────────────────────
  content: {
    eyebrow:    "Construction · Johannesburg & surrounds",
    heroTitle:  "Quality construction work — <em>on time, done right.</em>",
    heroLead:   "Zitex Building Maintenance Services handles residential and commercial construction, renovations and general contracting across Johannesburg. From a single room renovation to a full build.",

    googleRating: "5",
    reviewsCount: "1",
    featuredQuote: "Had our bathroom completely renovated. Excellent workmanship, finished on schedule and within budget. Very happy.",
    featuredQuoteAuthor: "— Thembi N., Google review",

    trustSignals: ["Renovations", "New builds", "Waterproofing", "Quality finish"],

    // ─── SERVICES ──────────────────────────────────────────
    servicesTitle: "Construction and renovation services.",
    servicesLead:  "We quote clearly, show up on time and deliver the quality we promise.",
    services: [
      {
        icon:  "hardhat",
        title: "Renovations",
        desc:  "Kitchen and bathroom renovations, room additions and interior alterations. We project-manage the full job."
      },
      {
        icon:  "wrench",
        title: "Plastering & drywalling",
        desc:  "Internal and external plastering, drywalling and screeding. Smooth finishes ready for paint."
      },
      {
        icon:  "droplet",
        title: "Waterproofing",
        desc:  "Flat roof, basement and wet area waterproofing using the right system for the application."
      },
      {
        icon:  "bolt",
        title: "Tiling",
        desc:  "Floor and wall tiling — ceramic, porcelain and natural stone. Neatly laid with proper adhesive and grout."
      },
      {
        icon:  "broom",
        title: "General contracting",
        desc:  "Site management, subcontractor coordination and project delivery for residential and small commercial jobs."
      },
      {
        icon:  "shield",
        title: "Building & paving",
        desc:  "Boundary walls, paving, carports and outbuilding construction for residential properties."
      },
    ],

    // ─── WORK GALLERY ──────────────────────────────────────
    galleryTitle: "The work, up close.",
    galleryLead:  "A look at the kind of work we handle every week.",
    gallery: [
      {
        image:   "images/work-1.jpg",
        art:     "lockCylinderPick",
        fig:     "01 — Renovation",
        title:   "Transformed properly",
        caption: "Bathroom and kitchen renovations managed from strip-out to final finish — tiling, plumbing, electrical and paintwork."
      },
      {
        image:   "images/work-2.jpg",
        art:     "lockCylinderPick",
        fig:     "02 — Plastering",
        title:   "Smooth and level",
        caption: "Internal and external plastering taken to a flat, true finish ready for paint or tile."
      },
      {
        image:   "images/work-3.jpg",
        art:     "lockCylinderPick",
        fig:     "03 — Waterproofing",
        title:   "Sealed and protected",
        caption: "Flat roof and wet area waterproofing applied in the right system for the application and exposure."
      },
      {
        image:   "images/work-4.jpg",
        art:     "lockCylinderPick",
        fig:     "04 — Tiling",
        title:   "Laid level and true",
        caption: "Floor and wall tiling with correct adhesive for the substrate, levelled and grouted neatly."
      },
      {
        image:   "images/work-5.jpg",
        art:     "lockCylinderPick",
        fig:     "05 — Paving",
        title:   "Laid properly",
        caption: "Concrete and brick paving laid on a correct sub-base so it stays level and does not sink."
      },
    ],

    // ─── PHOTO BAND ────────────────────────────────────────
    band: {
      image: "images/band.jpg",
      alt:   "Zitex Building Maintenance Services team at work in Johannesburg",
      text:  "Quality construction work, delivered on time and on budget."
    },

    // ─── AREAS BLURB ───────────────────────────────────────
    areasTitle: "Working across Johannesburg and the wider area.",
    areasLead:  "We take on residential and commercial projects across Johannesburg CBD, Parktown, Melville and surrounding areas.",
    areasNote:  "Call us to discuss your project — we will advise on feasibility and cost.",

    // ─── WHY US ────────────────────────────────────────────
    whyTitle: "Why clients choose us.",
    why: [
      {
        title: "We show up and deliver",
        desc:  "We commit to start dates and see jobs through to completion — no half-finished projects."
      },
      {
        title: "Clear pricing upfront",
        desc:  "Itemised quotes before we start. No surprises on the final invoice."
      },
      {
        title: "Quality that lasts",
        desc:  "We use the right materials and methods — not the cheapest option that will need redoing in two years."
      },
    ],

    // ─── REVIEWS ───────────────────────────────────────────
    reviewsTitle: "From 1 verified Google review.",
    reviews: [
      {
        body:   "Had our bathroom completely renovated. Excellent workmanship, finished on schedule and within budget. Very happy.",
        name:   "Thembi N.",
        stars:  5,
        source: "Google"
      },
      {
        body:   "Waterproofed our flat roof and it is held through two rainy seasons with no issues. Good product, good application.",
        name:   "Chris H.",
        stars:  5,
        source: "Google"
      },
      {
        body:   "Room addition completed on time, clean site, great finish. Would use them again for the next project.",
        name:   "Zelda V.",
        stars:  5,
        source: "Google"
      },
    ],

    // ─── FAQ ────────────────────────────────────────────────
    faqTitle: "Construction questions.",
    faqLead:  "What most clients ask before starting a project.",
    faq: [
      {
        q: "Do you handle the full project or just parts?",
        a: "Both — we can manage the full project including subcontractors, or just do a specific trade like tiling or plastering."
      },
      {
        q: "How long does a bathroom renovation take?",
        a: "A standard bathroom renovation typically takes 5–10 working days depending on the scope of work."
      },
      {
        q: "Do I need council plans for an extension?",
        a: "Usually yes for structural additions. We advise on what requires approval and can help with the process."
      },
      {
        q: "Can you help with the design as well?",
        a: "We advise on practical layouts and finishes. For architectural drawings we work with a local draughtsperson."
      },
      {
        q: "How do you handle payment?",
        a: "We take a deposit to book and order materials, progress payments during the job, and a final payment on completion."
      },
    ],

    // ─── CONTACT ───────────────────────────────────────────
    contactTitle: "Tell us about your project.",
    contactLead:  "Describe what you need and we will get back to you with a site visit and quote.",
    contactPlaceholder: "e.g. bathroom renovation, room addition, waterproofing needed — any details help"
  }
};
