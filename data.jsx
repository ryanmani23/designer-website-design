/* global window */

const JOURNAL = [
  {
    title: "Why Natural Slate Outlasts Every Modern Alternative — and What That Means for a Roof You'll Own for a Century",
    image: "https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=900&q=80",
    tag: "Material Science",
    date: "May 2026",
  },
  {
    title: "What Most Homeowners Don't Know About Discontinued Clay Tile (and Why a Match Still Exists)",
    image: "https://images.unsplash.com/photo-1567521464027-f127ff144326?w=900&q=80",
    tag: "Restoration",
    date: "April 2026",
  },
  {
    title: "Hand-Formed Copper Flashings: The Forgotten Detail That Determines Whether a Roof Leaks in 20 Years",
    image: "https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?w=900&q=80",
    tag: "Craftsmanship",
    date: "April 2026",
  },
  {
    title: "Reading a Historic Roof: How Preservationists Date a Building From the Profile of Its Tile",
    image: "https://images.unsplash.com/photo-1572120360610-d971b9d7767c?w=900&q=80",
    tag: "Field Notes",
    date: "March 2026",
  },
  {
    title: "Synthetic Composites Have a Reputation Problem — Here's the Only One We'd Install on Our Own Home",
    image: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=900&q=80",
    tag: "Material Science",
    date: "March 2026",
  },
];

// ---------- Data: manufacturers, projects, discontinued products, partners ----------

const MANUFACTURERS = [
  {
    name: "Ludowici",
    role: "America's Oldest Clay Roof Tile Manufacturer · Est. 1888",
    body: "Ludowici is the oldest and most renowned clay roof tile manufacturer in America. They can remake any mold dating back to their conception as well as match discontinued tile molds such as Heinz tile or Mineral Wells tile to keep the exact historic charm the home previously had.",
    image: "assets/materials/clay.jpg",
    stamp: "01 / 04",
  },
  {
    name: "La Escandella",
    role: "Spain's Leading Clay Tile Manufacturer · European Certified",
    body: "La Escandella is the leading clay tile manufacturer in Spain and highly sought after throughout Europe. Their tiles have the highest ratings clay can earn and give the property a truly authentic European style.",
    image: "assets/materials/slate.jpg",
    stamp: "02 / 04",
  },
  {
    name: "Brava",
    role: "The Only Synthetic We Believe In",
    body: "We are roofing snobs. We only install what we believe in and what we love. Typically, that's natural slate or authentic clay tile. But Brava is the one synthetic company we believe in. They have never had a product discontinued, and their offering of lightweight, Class 4, hurricane rated Tile, Slate and Shake is incredible. Truly a product that has earned our trust and recommendation.",
    image: "assets/materials/synthetic.jpg",
    stamp: "03 / 04",
  },
  {
    name: "Slate Valley Supply",
    role: "Natural Quarried Slate · Vermont and Beyond",
    body: "Slate isn't manufactured, it's farmed. We purchase from Slate Valley Supply because the owner and operator was born working the quarries in Vermont and has the best relationships and knowledge you can have. This gets us lead times of 2–8 weeks on any slate size and color. Something we've seen firsthand other companies cannot offer.",
    image: "assets/materials/metal.jpg",
    stamp: "04 / 04",
  },
];

const PROJECTS = [
  {
    name: "John Rothwell Estate",
    loc: "Highland Park, TX",
    tag: "Restoration · Slate",
    desc: "Full slate strip, re-deck and re-flash on a 1928 Tudor estate. Original Vermont slate matched and re-laid in coursing.",
    image: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=2200&auto=format&fit=crop&q=85",
  },
  {
    name: "The Beaumont House",
    loc: "Preston Hollow, TX",
    tag: "Clay Tile · Ludowici",
    desc: "Discontinued Heinz tile profile reproduced through Ludowici. Hand-blended into existing field for a seamless restoration.",
    image: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=2200&auto=format&fit=crop&q=85",
  },
  {
    name: "Wexler Manor",
    loc: "Park Cities, TX",
    tag: "Standing Seam · Copper",
    desc: "Hand-formed copper standing-seam over historic dormers and turrets. Hand-soldered ridge and flashing detailing.",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=2200&auto=format&fit=crop&q=85",
  },
  {
    name: "The Caldwell Residence",
    loc: "Southlake, TX",
    tag: "Clay Tile · Mineral Wells",
    desc: "Mineral Wells profile recreated and laid over self-adhered membrane. Original tiles salvaged where possible.",
    image: "https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?w=2200&auto=format&fit=crop&q=85",
  },
];

const DISCONTINUED = {
  Slate: {
    label: "Natural & Synthetic Slate",
    items: [
      {
        title: "GAF TruSlate",
        sub: "Natural Slate · Proprietary Install System",
        desc: "GAF's TruSlate system used a proprietary clip and batten installation method with a documented failure mode when thermal movement stresses the clips over time. GAF has discontinued the product. Roofs installed with TruSlate require full system removal — the clips cannot be selectively replaced.",
      },
      {
        title: "Imported Natural Slate",
        sub: "Quality Inconsistent · Country of Origin Risk",
        desc: "Some imported natural slates from the early 2000s carried inconsistent mineral composition and freeze-thaw resistance. We inspect for delamination, edge crumbling, and tell-tale rust staining at fastener points before recommending repair vs. replacement.",
      },
      {
        title: "Fiber Cement Asbestos Slate",
        sub: "Asbestos-Containing Material · Regulated",
        desc: "Manufactured through the mid-20th century, asbestos-containing fiber cement slate tiles are now a regulated material. Replacement requires abatement protocols in many states. The material itself becomes brittle and loses fastener hold over time.",
      },
    ],
  },
  "Clay Tile": {
    label: "Clay & Terra Cotta Tile",
    items: [
      {
        title: "Heinz Architectural Tile",
        sub: "Discontinued Mid-Century · Mold Reproducible",
        desc: "The Heinz tile family is no longer in production, but the original molds remain documented. Ludowici can reproduce these profiles to match an existing roof. We handle the mold-matching, sample firing, and blended installation so repairs are invisible from the street.",
      },
      {
        title: "Mineral Wells Tile",
        sub: "Texas-Specific Profile · Heritage Reproduction",
        desc: "A regional Texas profile we encounter regularly on Highland Park and Preston Hollow estates. Originals are no longer made, but we coordinate reproduction through Ludowici to maintain landmark-review compatibility.",
      },
    ],
  },
  Synthetic: {
    label: "Composite & Synthetic Systems",
    items: [
      {
        title: "DaVinci Single-Width",
        sub: "Discontinued SKU · Color-Matched Replacement",
        desc: "Earlier single-width DaVinci composite shake has been retired in favor of multi-width profiles. We stock retired colorways for blending and replacement on roofs that should not be fully redone.",
      },
      {
        title: "EcoStar Majestic Slate (Early Run)",
        sub: "Pre-2010 Run · UV Degradation Documented",
        desc: "Pre-2010 EcoStar runs have a documented UV degradation pattern that becomes visible at year 12–15. We assess the affected areas and coordinate manufacturer warranty review where applicable.",
      },
    ],
  },
  "Concrete Tile": {
    label: "Concrete Tile",
    items: [
      {
        title: "Monier Lifetile (Discontinued Profiles)",
        sub: "Pre-Boral Acquisition Stock",
        desc: "Several Monier Lifetile profiles were discontinued post-acquisition. Replacement requires mold matching or compatible-profile substitution. We document the original profile for insurance and HOA submissions.",
      },
    ],
  },
  Asphalt: {
    label: "Asphalt Shingle",
    items: [
      {
        title: "Organic-Mat Asphalt Shingles",
        sub: "Pre-2007 · Class Action Settled",
        desc: "Organic-mat asphalt shingles (manufactured pre-2007) suffer well-documented premature failure. A class action settlement provided some recovery, but most homeowners with these shingles need full replacement and may qualify for partial insurance coverage.",
      },
      {
        title: "GAF Timberline (Specific Lot Numbers)",
        sub: "Manufacturing Defect · Recall Eligible",
        desc: "Specific lots of GAF Timberline shingles from 1999–2007 carry a documented manufacturing defect. We pull lot numbers and coordinate the recall claim on your behalf.",
      },
    ],
  },
  Underlayment: {
    label: "Underlayment & Decking",
    items: [
      {
        title: "Felt-15 Beneath Tile",
        sub: "Insufficient for 50-Year Material",
        desc: "Many tile and slate roofs were installed over felt-15 underlayment that has now reached end-of-life while the tile above remains serviceable. We strip, re-underlay with self-adhered membrane, and reinstall — saving 70%+ of the original tile.",
      },
      {
        title: "Original 1×6 Skip Sheathing",
        sub: "Common in Pre-1960 Estates",
        desc: "Skip sheathing is fine for slate and tile but won't accept modern underlayments without remediation. We over-deck with structural plywood or solid 1× nailing surface, preserving the original framing.",
      },
    ],
  },
};

const ROOF_SYSTEMS = [
  {
    num: "01 / 03",
    title: "Decking & Underlayment",
    body: "What you don't see is what determines whether a roof leaks. We re-deck where original sheathing has lost integrity and over-lay with self-adhered membranes rated for the substrate above.",
    image: "https://images.unsplash.com/photo-1605000797499-95a51c5269ae?w=1200&auto=format&fit=crop&q=80",
  },
  {
    num: "02 / 03",
    title: "Flashings & Penetrations",
    body: "Flashings are the single largest source of failure. We hand-form copper, lead, and stainless step- and pan-flashings to match original details and outlast the roof material above.",
    image: "https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=1200&auto=format&fit=crop&q=80",
  },
  {
    num: "03 / 03",
    title: "Fasteners & Installation",
    body: "Stainless or copper-only fasteners, shimmed and torqued to manufacturer spec. Installation method matters more than material — we install the way each system was specified, not the way it's been done locally.",
    image: "https://images.unsplash.com/photo-1565953554309-9e60d3edec64?w=1200&auto=format&fit=crop&q=80",
  },
];

const CERTIFICATIONS = [
  { name: "Fortified Certified",         role: "Storm-Resilient Installation",   mark: "fortified" },
  { name: "Tile Roofing Institute",      role: "Certified Tile Installer",       mark: "tri" },
  { name: "Slate Roofing Contractors Asso.", role: "Certified Slate Specialist", mark: "srca" },
  { name: "National Slate Association",  role: "NSA Certified Member",           mark: "nsa" },
  { name: "Metal Roofing Consortium",    role: "Certified Metal Specialist",     mark: "usmrc" },
  { name: "AIG & Chubb Preferred",       role: "Preferred Contractor / Vendor",  mark: "chubb" },
];

const PRESERVATION = [
  { name: "Preservation Texas",          role: "Statewide Historic Preservation", mark: "ptx" },
  { name: "Preservation Dallas",         role: "Dallas Historic Preservation",    mark: "pdallas" },
  { name: "Preservation Park Cities",    role: "Highland Park & University Park", mark: "ppc" },
  { name: "Historic Fort Worth",         role: "Fort Worth Historic Preservation", mark: "hfw" },
];

const TRADE_CIVIC = [
  { name: "Roofing Contractors Association of Texas", role: "Statewide Trade Association", mark: "rcat" },
  { name: "North Texas Contractors Association",      role: "Regional Contractor Network",  mark: "ntrca" },
];

// legacy export name preserved for any other consumer
const PARTNERS = [...PRESERVATION, ...TRADE_CIVIC];

const TRUST = [
  { initials: "TRI", name: "Tile Roofing Institute",        role: "Certified Tile Installer" },
  { initials: "SRC", name: "Slate Roofing Contractors",     role: "Certified Slate Specialist" },
  { initials: "NSA", name: "National Slate Association",    role: "NSA Certified Member" },
  { initials: "MRC", name: "Metal Roofing Consortium",      role: "Certified Metal Specialist" },
  { initials: "AIG", name: "AIG & Chubb Preferred",         role: "Preferred Contractor / Vendor" },
  { initials: "FTF", name: "FORTIFIED",                     role: "Storm-Resilient Installation" },
];

const NAV_ITEMS = [
  { id: "manufacturers", label: "Credentials" },
  { id: "discontinued",  label: "Discontinued Systems" },
  { id: "partners",      label: "Affiliations" },
  { id: "projects",      label: "Portfolio" },
  { id: "about",         label: "About" },
];

Object.assign(window, {
  MANUFACTURERS, PROJECTS, DISCONTINUED, ROOF_SYSTEMS, PARTNERS, PRESERVATION, TRADE_CIVIC, CERTIFICATIONS, TRUST, NAV_ITEMS, JOURNAL,
});
