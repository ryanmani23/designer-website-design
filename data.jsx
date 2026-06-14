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
  {
    title: "The Case for Copper Gutters on a Slate Roof — and Why Most Contractors Won't Touch Them",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=900&q=80",
    tag: "Craftsmanship",
    date: "February 2026",
  },
  {
    title: "How to Read a Roofing Estimate: What Every Line Item Actually Means",
    image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=900&q=80",
    tag: "Field Notes",
    date: "February 2026",
  },
  {
    title: "Why Historic Designation Changes Everything About Your Roofing Options",
    image: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=900&q=80",
    tag: "Restoration",
    date: "January 2026",
  },
  {
    title: "The Difference Between a Repair and a Replacement — A Field Guide for Estate Owners",
    image: "https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?w=900&q=80",
    tag: "Field Notes",
    date: "January 2026",
  },
  {
    title: "Ice and Water Shield: When Felt-15 Isn't Enough and What to Use Instead",
    image: "https://images.unsplash.com/photo-1565953554309-9e60d3edec64?w=900&q=80",
    tag: "Material Science",
    date: "December 2025",
  },
];

// ---------- Data: manufacturers, projects, discontinued products, partners ----------

// TODO(jack): Provide manufacturer logos at assets/logos/manufacturers/*.svg|.png.
// When `logo` is present, the cell renders the logo in place of the "01/04" stamp.
// TODO(jack): Featured project image swaps requested 2026-05-29:
//   Ludowici → Holy Trinity Catholic project photo
//   La Escandella → new clay-tile project photo (~2 weeks out from 2026-05-29)
//   Brava → Rachel Reed project photo
//   Slate Valley Supply → closer-up slate photo
const MANUFACTURERS = [
  {
    name: "Ludowici",
    role: "America's Oldest Clay Roof Tile Manufacturer · Est. 1888",
    body: "Ludowici is the oldest and most renowned clay roof tile manufacturer in America. They can remake any mold dating back to their conception as well as match discontinued tile molds such as Heinz tile or Mineral Wells tile to keep the exact historic charm the home previously had.",
    image: "assets/projects/estate-clay-tile/01.webp",
    stamp: "01 / 04",
    logo: "assets/logos/manufacturers/ludowici.png", // placeholder path
  },
  {
    name: "Slate Valley Supply / Be Natural",
    role: "Natural S1 Slate from Vermont & Spain",
    body: "Slate isn't manufactured, it's farmed. The selection process of that slate is almost as important as its rating. Our partners were born and live right where the quarries are and have a depth of knowledge that give us and our customers full confidence in the quality of the product installed and some of the shortest lead times in the industry.",
    image: "assets/materials/metal.jpg",
    stamp: "02 / 04",
    logo: "assets/logos/manufacturers/slate-valley.png",
  },
  {
    name: "Brava",
    role: "The Only Synthetic We Believe In",
    body: "We are roofing snobs. We only install what we believe in and what we love. Typically, that's natural slate or authentic clay tile. But Brava is the one synthetic company we believe in. They have never had a product discontinued, and their offering of lightweight, Class 4, hurricane rated Tile, Slate and Shake is incredible. Truly a product that has earned our trust and recommendation.",
    image: "assets/materials/brava.webp",
    stamp: "03 / 04",
    logo: "assets/logos/manufacturers/brava.png",
  },
  {
    name: "La Escandella",
    role: "Spain's Leading Clay Tile Manufacturer · European Certified",
    body: "La Escandella is the leading clay tile manufacturer in Spain and highly sought after throughout Europe. Their tiles have the highest ratings clay can earn and give the property a truly authentic European style.",
    image: "assets/materials/slate.jpg",
    stamp: "04 / 04",
    logo: "assets/logos/manufacturers/la-escandella.png",
  },
];

// 2026-06-06: PROJECTS rebuilt with real project photography (supabase-files).
// Per Jack: no client names anywhere — public `name` field is now a generic
// descriptor (city / system). Institutional names (St. Joseph's parish) are
// retained because they are public landmarks, not client identifiers.
// Each project has a `gallery[]` of 3–8 photos under assets/projects/<slug>/.
const PROJECTS = [
  {
    name: "Dallas Tudor · Natural Slate Restoration",
    slug: "dallas-tudor-slate",
    loc: "Dallas, TX",
    tag: "Natural Slate · Tudor",
    type: "Slate",
    desc: "Period-correct slate restoration on a Dallas Tudor — full strip, hand-set field, copper flashings detailed at every transition.",
    longDesc: "A Dallas Tudor finished in a hand-set natural slate field with copper flashings at every transition. We stripped to the deck, re-underlaid in self-adhered membrane, and coursed the slate so the wear pattern reads as an original installation. Copper detailing at the valleys and chimney is sized to outlast the field above.",
    image: "assets/projects/dallas-tudor-slate/01.webp",
    gallery: [
      "assets/projects/dallas-tudor-slate/01.webp",
      "assets/projects/dallas-tudor-slate/02.webp",
      "assets/projects/dallas-tudor-slate/03.webp",
      "assets/projects/dallas-tudor-slate/04.webp",
    ],
  },
  {
    name: "Highland Park Residence · Slate & Copper",
    slug: "highland-park-copper-slate",
    loc: "Highland Park, TX",
    tag: "Natural Slate · Copper",
    type: "Slate",
    desc: "Symmetrical Georgian elevation finished in natural slate with copper accents — period detailing preserved through landmark-review.",
    longDesc: "A symmetrical Highland Park elevation where the original architectural rhythm called for natural slate above and copper at every penetration. We coordinated through landmark-review, salvaged what the existing field could give us, and detailed the copper to age with the brick rather than against it.",
    image: "assets/projects/highland-park-copper-slate/01.webp",
    gallery: [
      "assets/projects/highland-park-copper-slate/01.webp",
      "assets/projects/highland-park-copper-slate/02.webp",
      "assets/projects/highland-park-copper-slate/03.webp",
    ],
  },
  {
    name: "Tudor Restoration · Pennsylvania Slate",
    slug: "tudor-slate-restoration",
    loc: "University Park, TX",
    tag: "Pennsylvania Slate · Tudor",
    type: "Slate",
    desc: "Pennsylvania blue-grey slate on a half-timber Tudor — full restoration with copper valleys throughout.",
    longDesc: "A half-timber Tudor finished in Pennsylvania blue-grey slate. The original underlayment had reached end-of-life while the slate above remained largely sound, so we stripped, re-decked where the substrate required it, re-laid with self-adhered membrane, and re-coursed the salvaged field. Every flashing detail was rebuilt in copper.",
    image: "assets/projects/tudor-slate-restoration/01.webp",
    gallery: [
      "assets/projects/tudor-slate-restoration/01.webp",
      "assets/projects/tudor-slate-restoration/02.webp",
      "assets/projects/tudor-slate-restoration/03.webp",
      "assets/projects/tudor-slate-restoration/04.webp",
      "assets/projects/tudor-slate-restoration/05.webp",
    ],
  },
  {
    name: "Brick Estate · Welsh Slate",
    slug: "brick-estate-welsh-slate",
    loc: "Preston Hollow, TX",
    tag: "Welsh Slate · Estate",
    type: "Slate",
    desc: "Quarried Welsh slate over a formal brick estate — heavy field weight specified for thermal stability and a hundred-year roof.",
    longDesc: "A formal brick estate finished in quarried Welsh slate. The owner specified a heavy-field weight for thermal stability; we specified the substructure and fastener pattern to carry it. Copper flashings throughout. The roof reads as period-correct and is rated for the next century.",
    image: "assets/projects/brick-estate-welsh-slate/01.webp",
    gallery: [
      "assets/projects/brick-estate-welsh-slate/01.webp",
      "assets/projects/brick-estate-welsh-slate/02.webp",
      "assets/projects/brick-estate-welsh-slate/03.webp",
      "assets/projects/brick-estate-welsh-slate/04.webp",
      "assets/projects/brick-estate-welsh-slate/05.webp",
    ],
  },
  {
    name: "Park Cities Tudor · Hand-Set Slate",
    slug: "park-cities-tudor-slate",
    loc: "Park Cities, TX",
    tag: "Natural Slate · Tudor",
    type: "Slate",
    desc: "Hand-set slate over a Park Cities Tudor with intricate half-timber detail — fastener spec upgraded for Texas wind loading.",
    longDesc: "A Park Cities Tudor with intricate half-timber detail finished in hand-set natural slate. We specified the fastener pattern for Texas wind loading and detailed every wall and chimney flashing in copper. The roof maintains the architectural rhythm the original builder intended.",
    image: "assets/projects/park-cities-tudor-slate/01.webp",
    gallery: [
      "assets/projects/park-cities-tudor-slate/01.webp",
      "assets/projects/park-cities-tudor-slate/02.webp",
      "assets/projects/park-cities-tudor-slate/03.webp",
    ],
  },
  {
    name: "Colonial Revival · Slate Restoration",
    slug: "colonial-slate-restoration",
    loc: "University Park, TX",
    tag: "Natural Slate · Colonial",
    type: "Slate",
    desc: "Symmetrical Colonial revival roof restored with hand-set slate, period-correct dormer flashings, and copper detailing throughout.",
    longDesc: "A Colonial revival roof where the architectural symmetry demanded an absolutely consistent slate field. We hand-graded the slate before installation, coursed in the same direction as the original, and rebuilt the dormer flashings in copper. Period-correct from any approach.",
    image: "assets/projects/colonial-slate-restoration/01.webp",
    gallery: [
      "assets/projects/colonial-slate-restoration/01.webp",
      "assets/projects/colonial-slate-restoration/02.webp",
      "assets/projects/colonial-slate-restoration/03.webp",
      "assets/projects/colonial-slate-restoration/04.webp",
      "assets/projects/colonial-slate-restoration/05.webp",
      "assets/projects/colonial-slate-restoration/06.webp",
      "assets/projects/colonial-slate-restoration/07.webp",
    ],
  },
  {
    name: "Forested Estate · Vermont Slate",
    slug: "westover-hills-slate",
    loc: "Westover Hills, TX",
    tag: "Vermont Slate · Estate",
    type: "Slate",
    desc: "Sheltered estate roof rebuilt in Vermont slate — aerial coursework and concealed flashings preserved the original tree-canopy approach.",
    longDesc: "A heavily wooded estate where access required coordination but the roof itself called for a textbook Vermont slate installation. We staged from above, salvaged the recoverable field, re-underlaid with self-adhered membrane, and re-coursed the slate without disturbing the tree-canopy approach to the property.",
    image: "assets/projects/westover-hills-slate/01.webp",
    gallery: [
      "assets/projects/westover-hills-slate/01.webp",
      "assets/projects/westover-hills-slate/02.webp",
      "assets/projects/westover-hills-slate/03.webp",
      "assets/projects/westover-hills-slate/04.webp",
    ],
  },
  {
    name: "Fort Worth Historic · Slate & Copper",
    slug: "fort-worth-slate-copper",
    loc: "Fort Worth, TX",
    tag: "Natural Slate · Copper",
    type: "Slate",
    desc: "Historic Fort Worth roof restored with hand-set slate and bright copper valleys — heritage profile preserved end to end.",
    longDesc: "A historic Fort Worth estate restored with hand-set natural slate and bright copper valleys. The roof's complex hip-and-valley geometry required custom radius work at every transition. The result reads as a single coherent field with copper highlights — exactly the original detailing the architecture asked for.",
    image: "assets/projects/fort-worth-slate-copper/01.webp",
    gallery: [
      "assets/projects/fort-worth-slate-copper/01.webp",
      "assets/projects/fort-worth-slate-copper/02.webp",
      "assets/projects/fort-worth-slate-copper/03.webp",
      "assets/projects/fort-worth-slate-copper/04.webp",
    ],
  },
  {
    name: "Central Texas Estate · Natural Slate",
    slug: "waco-natural-slate",
    loc: "Waco, TX",
    tag: "Natural Slate",
    type: "Slate",
    desc: "Quarried natural slate over a Central Texas estate — every fastener and flashing engineered for a roof you'll own for a century.",
    longDesc: "A Central Texas estate finished in quarried natural slate with copper flashings throughout. Every course was laid by the same crew that assessed the roof. Every fastener was specified to outlast the material above it. This is what we mean when we say we install for the next hundred years, not the next warranty cycle.",
    image: "assets/projects/waco-natural-slate/01.webp",
    gallery: [
      "assets/projects/waco-natural-slate/01.webp",
      "assets/projects/waco-natural-slate/02.webp",
      "assets/projects/waco-natural-slate/03.webp",
    ],
  },
  {
    name: "St. Louis Estate · Slate Restoration",
    slug: "st-louis-estate-slate",
    loc: "St. Louis, MO",
    tag: "Natural Slate · Estate",
    type: "Slate",
    desc: "Out-of-region landmark restoration — slate match coordinated through quarried supply and detailed for Midwest freeze-thaw.",
    longDesc: "A St. Louis estate where the slate field had to match a regional historic profile that no national distributor stocked. We coordinated quarry supply, blended the new field with the salvaged original, and detailed every flashing for the Midwest freeze-thaw cycle. Out-of-region work delivered to the same standard as our DFW projects.",
    image: "assets/projects/st-louis-estate-slate/01.webp",
    gallery: [
      "assets/projects/st-louis-estate-slate/01.webp",
      "assets/projects/st-louis-estate-slate/02.webp",
      "assets/projects/st-louis-estate-slate/03.webp",
      "assets/projects/st-louis-estate-slate/04.webp",
    ],
  },
  {
    name: "Coastal California Estate · Pacific Slate",
    slug: "carmel-coastal-slate",
    loc: "Carmel, CA",
    tag: "Natural Slate · Coastal",
    type: "Slate",
    desc: "Pacific-coast slate restoration — salt-air corrosion dictated every fastener and flashing decision on the project.",
    longDesc: "A Carmel estate above the Pacific where salt-air exposure governed every fastener and flashing decision. Natural slate over self-adhered membrane, stainless-only fasteners, and copper flashings detailed to handle coastal weather. The original architectural character was preserved end to end and the install will outlast the climate it was specified for.",
    image: "assets/projects/carmel-coastal-slate/01.webp",
    gallery: [
      "assets/projects/carmel-coastal-slate/01.webp",
      "assets/projects/carmel-coastal-slate/02.webp",
      "assets/projects/carmel-coastal-slate/03.webp",
      "assets/projects/carmel-coastal-slate/04.webp",
      "assets/projects/carmel-coastal-slate/05.webp",
    ],
  },
  {
    name: "Plano Estate · Slate Field",
    slug: "plano-estate-slate",
    loc: "Plano, TX",
    tag: "Natural Slate",
    type: "Slate",
    desc: "Large-format slate field on a Plano estate — coursing planned for visual depth at every approach angle.",
    longDesc: "A Plano estate where the roof reads from every approach angle on the property. We planned the slate coursing for visual depth, hand-graded the field before installation, and detailed the valleys in copper. The roof is a continuous surface from every line of sight.",
    image: "assets/projects/plano-estate-slate/01.webp",
    gallery: [
      "assets/projects/plano-estate-slate/01.webp",
      "assets/projects/plano-estate-slate/02.webp",
      "assets/projects/plano-estate-slate/03.webp",
      "assets/projects/plano-estate-slate/04.webp",
      "assets/projects/plano-estate-slate/05.webp",
    ],
  },
  {
    name: "Hand-Formed Copper · Slate Turret",
    slug: "copper-standing-seam-turret",
    loc: "Park Cities, TX",
    tag: "Copper Standing-Seam · Slate Turret",
    type: "Metal",
    desc: "Hand-formed copper standing-seam with a fish-scale slate turret — every seam soldered, every dormer flashed in copper.",
    longDesc: "A Park Cities estate with a copper standing-seam field and a fish-scale slate turret as the architectural centerpiece. Every seam hand-soldered, every dormer flashing fabricated on site. The copper patina is just beginning to mature; the substructure is rated for the next half-century.",
    image: "assets/projects/copper-standing-seam-turret/01.webp",
    gallery: [
      "assets/projects/copper-standing-seam-turret/01.webp",
      "assets/projects/copper-standing-seam-turret/02.webp",
      "assets/projects/copper-standing-seam-turret/03.webp",
      "assets/projects/copper-standing-seam-turret/04.webp",
      "assets/projects/copper-standing-seam-turret/05.webp",
    ],
  },
  {
    name: "Westlake Estate · Designer Shingle + Copper",
    slug: "westlake-designer-shingle",
    loc: "Westlake, TX",
    tag: "Designer Shingle · Copper Turret",
    type: "Designer Shingles",
    desc: "Designer shingle field punctuated with hand-formed copper turrets — Class 4 impact rating with the depth of a custom estate.",
    longDesc: "A Westlake estate where the architect specified the warmth of a designer shingle field with hand-formed copper turrets as the architectural punctuation. The result combines hail-rated impact resistance with the kind of detail work that distinguishes a custom estate from a tract build.",
    image: "assets/projects/westlake-designer-shingle/01.webp",
    gallery: [
      "assets/projects/westlake-designer-shingle/01.webp",
      "assets/projects/westlake-designer-shingle/02.webp",
      "assets/projects/westlake-designer-shingle/03.webp",
      "assets/projects/westlake-designer-shingle/04.webp",
      "assets/projects/westlake-designer-shingle/05.webp",
      "assets/projects/westlake-designer-shingle/06.webp",
      "assets/projects/westlake-designer-shingle/07.webp",
      "assets/projects/westlake-designer-shingle/08.webp",
    ],
  },
  {
    name: "Estate Property · Designer Shingle",
    slug: "estate-designer-shingle",
    loc: "Dallas, TX",
    tag: "Designer Shingles",
    type: "Designer Shingles",
    desc: "Large-format designer shingle field over a transitional estate — dimensional profile chosen for shadow depth at distance.",
    longDesc: "A transitional estate where the architecture called for the dimensional shadow line of a designer shingle without the weight of slate or tile. Architectural-grade shingles installed with copper flashings, premium underlayment, and an upgraded fastener spec for Texas wind loading.",
    image: "assets/projects/estate-designer-shingle/01.webp",
    gallery: [
      "assets/projects/estate-designer-shingle/01.webp",
      "assets/projects/estate-designer-shingle/02.webp",
      "assets/projects/estate-designer-shingle/03.webp",
      "assets/projects/estate-designer-shingle/04.webp",
      "assets/projects/estate-designer-shingle/05.webp",
    ],
  },
  {
    name: "Historic Brick Residence · Spanish Clay Tile",
    slug: "st-louis-historic-clay",
    loc: "St. Louis, MO",
    tag: "Clay Tile · Spanish Mission",
    type: "Clay Tile",
    desc: "Spanish mission clay tile over a historic brick residence — original color preserved through hand-blended replacement field.",
    longDesc: "A historic St. Louis brick residence finished in Spanish mission clay tile. The original tile carried a color the replacement field had to match, so we coordinated quarried-clay supply, blended the new tile into the salvaged original, and detailed the chimney flashings in copper. The roof reads as the original installation, weather pattern and all.",
    image: "assets/projects/st-louis-historic-clay/01.webp",
    gallery: [
      "assets/projects/st-louis-historic-clay/01.webp",
      "assets/projects/st-louis-historic-clay/02.webp",
      "assets/projects/st-louis-historic-clay/03.webp",
    ],
  },
  {
    name: "Institutional Clay Tile · Hand-Reset Restoration",
    slug: "dallas-parish-clay",
    loc: "Dallas, TX",
    tag: "Commercial · Clay Tile",
    type: "Commercial",
    desc: "Institutional clay tile carefully unstacked, salvaged, and re-laid over a new underlayment — public access maintained throughout.",
    longDesc: "An institutional clay-tile roof carefully unstacked, salvaged, and re-laid over a new underlayment system without disrupting public access to the building. We worked in coordinated bays, documented every tile lot, and rebuilt every flashing in copper. Landmark-review documentation maintained throughout.",
    image: "assets/projects/dallas-parish-clay/01.webp",
    gallery: [
      "assets/projects/dallas-parish-clay/01.webp",
      "assets/projects/dallas-parish-clay/02.webp",
      "assets/projects/dallas-parish-clay/03.webp",
      "assets/projects/dallas-parish-clay/04.webp",
    ],
  },
  // ── Upcoming project (no on-site photos yet) ──
  {
    name: "St. Joseph's Catholic Church · Parish Restoration",
    slug: "st-josephs-cheyenne",
    loc: "Cheyenne, WY",
    tag: "Commercial · Slate",
    type: "Commercial",
    desc: "Upcoming parish slate restoration in Cheyenne, Wyoming — landmark-review documentation and phased install coordinated with the diocese.",
    longDesc: "An upcoming parish restoration in Cheyenne, Wyoming. We are coordinating landmark-review documentation with the diocese, sourcing slate to match the original architectural profile, and scheduling the install in phases to keep the building in continuous service through construction.",
    image: "https://images.unsplash.com/photo-1438032005730-c779502df39b?w=2200&auto=format&fit=crop&q=85",
    coming: true,
  },
];

// Pins for the homepage "Jobs of Distinction" map. x/y are in the 960x600 SVG space.
// Schema: { name, city, state, x, y, system, scope, blurb, image, slug, coming? }
// `slug` matches a PROJECTS entry so the popup CTA deep-links into the portfolio modal.
// `coming: true` renders an outline-only pin with a "PROJECT COMING" chip on the card.
// 2026-06-06: client names dropped from pin labels; pin images now point to real
// project photos. Institutional names (St. Joseph's parish) preserved as landmarks.
const MAP_PROJECTS = [
  { name: "Dallas Tudor · Natural Slate",              city: "Dallas",      state: "TX", x: 478, y: 448, slug: "dallas-tudor-slate",          system: "Natural Slate · Tudor",     scope: "Full Slate Restoration",        blurb: "Period-correct slate restoration on a Dallas Tudor — hand-set field with copper flashings detailed at every transition.", image: "assets/projects/dallas-tudor-slate/01.webp" },
  { name: "Westlake Estate · Designer Shingle + Copper", city: "Westlake",  state: "TX", x: 464, y: 444, slug: "westlake-designer-shingle",   system: "Designer Shingle · Copper", scope: "Estate New Construction",       blurb: "Designer shingle field with hand-formed copper turrets — Class 4 impact rating and the depth of a custom estate.", image: "assets/projects/westlake-designer-shingle/01.webp" },
  { name: "Central Texas Estate · Natural Slate",      city: "Waco",        state: "TX", x: 470, y: 478, slug: "waco-natural-slate",          system: "Natural Slate",             scope: "Full Slate Restoration",        blurb: "Central Texas estate finished in quarried natural slate — every fastener and flashing engineered for a roof you'll own for a century.", image: "assets/projects/waco-natural-slate/01.webp" },
  { name: "Coastal California Estate · Pacific Slate", city: "Carmel",      state: "CA", x: 105, y: 298, slug: "carmel-coastal-slate",        system: "Natural Slate · Coastal",   scope: "Coastal Slate Restoration",     blurb: "Pacific-coast slate restoration — salt-air exposure governed every fastener and flashing decision on the project.", image: "assets/projects/carmel-coastal-slate/01.webp" },
  { name: "St. Louis Estate · Slate Restoration",      city: "St. Louis",   state: "MO", x: 575, y: 285, slug: "st-louis-estate-slate",       system: "Natural Slate · Estate",    scope: "Out-of-Region Restoration",     blurb: "Out-of-region slate restoration coordinated through quarried supply and detailed for Midwest freeze-thaw.", image: "assets/projects/st-louis-estate-slate/01.webp" },
  { name: "St. Joseph's Catholic Church",              city: "Cheyenne",    state: "WY", x: 345, y: 166, slug: "st-josephs-cheyenne",         system: "Natural Slate",             scope: "Parish Slate Restoration",      blurb: "Upcoming parish slate restoration coordinated with the diocese — landmark-review documentation and phased install scheduled to keep the building in service.", image: "https://images.unsplash.com/photo-1438032005730-c779502df39b?w=1600&auto=format&fit=crop&q=85", coming: true },
];

// Hero variants A/C — featured projects with real photos.
// Variant A (RoofReel) and Variant C (HeroSlides) both pull from this list;
// Variant B (HeroMosaic) reuses the full PROJECTS gallery for its tile fill.
// 2026-06-13 (Jack): lead the slides with the new Tobin slate + Andrew Arnold clay
// jobs; dropped the Colleyville copper turret ("looks weird from the angle").
// TODO(jack): add the Holy Trinity Catholic boom-lift/skyline shot when supplied
// (uncomment below + drop the photo at assets/projects/holy-trinity-clay/01.webp).
const HERO_TOP_FIVE = [
  { slug: "estate-slate-copper",        name: "Historic Estate · Natural Slate & Copper",  image: "assets/projects/estate-slate-copper/01.webp" },
  { slug: "estate-clay-tile",           name: "Historic Estate · Clay Tile",               image: "assets/projects/estate-clay-tile/01.webp" },
  // { slug: "holy-trinity-clay",       name: "Holy Trinity Catholic · Clay Tile",         image: "assets/projects/holy-trinity-clay/01.webp" },
  { slug: "waco-natural-slate",         name: "Central Texas Estate · Natural Slate",      image: "assets/projects/waco-natural-slate/01.webp" },
  { slug: "westlake-designer-shingle",  name: "Westlake Estate · Designer Shingle + Copper", image: "assets/projects/westlake-designer-shingle/01.webp" },
  { slug: "carmel-coastal-slate",       name: "Coastal California Estate · Pacific Slate", image: "assets/projects/carmel-coastal-slate/01.webp" },
];

// Three reasons we see roofs fail — replaces the era-based HistoricalContext per
// Jack's 2026-05-29 feedback. Mirrors the homepage SystemsNote framing.
// TODO(jack): provide company-cam failure photos for each reason.
const THREE_REASONS = [
  {
    num: "01",
    title: "Felt",
    subtitle: "What you don't see is what determines whether a roof leaks.",
    body: "We replace many roofs because they have an old #30 lb felt underneath or a failed ice and water shield. We cover all specialty roofs we install in a high-temperature ice and water shield. This is above industry standard — it is our own standard.",
    examples: [
      "Old #30 lb felt beneath natural slate or tile",
      "A failed or melted ice and water shield",
      "Underlayment that aged out while the field above held",
    ],
    image: "https://images.unsplash.com/photo-1605000797499-95a51c5269ae?w=2200&auto=format&fit=crop&q=85",
  },
  {
    num: "02",
    title: "Fasteners",
    subtitle: "The wrong fastener fails long before the roof does.",
    body: "Failures come from not using the proper material — copper or steel that will corrode long after the slate or tile ever would — or from over- and under-driven nails that let wind-driven rain in. The fastener holding the roof determines whether the system reaches its rated life.",
    examples: [
      "Galvanized fasteners under copper or stainless details",
      "Over-driven nails that crush the slate or tile",
      "Under-driven nails that let wind-driven rain in",
    ],
    image: "https://images.unsplash.com/photo-1565953554309-9e60d3edec64?w=2200&auto=format&fit=crop&q=85",
  },
  {
    num: "03",
    title: "Flashings",
    subtitle: "Flashings are the single largest source of failure.",
    body: "We hand-form copper, lead, and stainless step- and pan-flashings to match the original details and outlast the roof material above. The field can be flawless and still leak when the detail at the wall, chimney, or valley was built for the bid sheet instead of the building.",
    examples: [
      "Reused galvanized step flashing in copper-era systems",
      "Caulked chimney saddles with no cricket",
      "Plastic plumbing boots over hot decks",
    ],
    image: "https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=2200&auto=format&fit=crop&q=85",
  },
];

// Lifecycle ROI — expanded from slate-vs-asphalt to all 5 materials Jack confirmed
// on 2026-05-29 (asphalt 30, synthetic 50, metal 50, clay 75, slate 150).
const LIFECYCLE_MATERIALS = [
  { key: "asphalt",   name: "Asphalt Shingle",   years: 30,  tone: "hot",   note: "5 full replacements in 150 years", segments: 5 },
  { key: "synthetic", name: "Synthetic Slate",   years: 50,  tone: "cool",  note: "3 full replacements in 150 years", segments: 3 },
  { key: "metal",     name: "Metal · Standing Seam", years: 50, tone: "steel", note: "3 full replacements in 150 years", segments: 3 },
  { key: "clay",      name: "Clay Tile",         years: 75,  tone: "copper", note: "2 full replacements in 150 years", segments: 2 },
  { key: "slate",     name: "Natural Slate",     years: 150, tone: "slate", note: "One installation",                  segments: 1 },
];

// Materials page install process — replaces the previous Portfolio-style steps.
const INSTALL_STEPS = [
  { num: "01", title: "Material Arrives & QC", body: "Every bundle and crate is inspected on delivery against the original purchase order — profile, color, lot number, and quantity. Variants outside spec get refused before they ever reach the roof." },
  { num: "02", title: "Tear-Off & Decking",    body: "We strip in controlled sections so the structure is never exposed beyond what we can dry in the same day. Deck condition is documented; structural plywood or solid 1× nailing surface replaces anything that has lost integrity." },
  { num: "03", title: "Underlayment & Flashing", body: "Self-adhered membrane rated for the substrate above. Copper, lead, or stainless flashings hand-formed on site at every wall, chimney, valley, and penetration before the field material is touched." },
  { num: "04", title: "Field Installation",    body: "The same crew that assessed the roof installs it. Stainless or copper-only fasteners, torqued to manufacturer spec. Every course is checked before the next begins." },
  { num: "05", title: "Final Walkthrough",     body: "Owner walkthrough, written documentation of all work performed, and a punch-list of any future conditions to monitor. You receive the package before final payment — not after." },
];

const INSTALL_STEP_PHOTOS = [
  "https://images.unsplash.com/photo-1438032005730-c779502df39b?w=400&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1605000797499-95a51c5269ae?w=400&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=400&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1572120360610-d971b9d7767c?w=400&auto=format&fit=crop&q=80",
];

const DISCONTINUED = {
  Slate: {
    label: "Natural Slate",
    items: [
      {
        title: "GAF TruSlate",
        sub: "Natural Slate · Proprietary Install System",
        desc: "GAF's TruSlate system used a proprietary clip and batten installation method with a documented failure mode when thermal movement stresses the clips over time. Not only that, but their ice and water shield has melted frequently, multiplying the issues and causing failure. GAF has discontinued the product. Roofs installed with TruSlate require full system removal.",
        images: [
          "assets/discontinued/gaf-truslate/01.webp",
          "assets/discontinued/gaf-truslate/02.webp",
          "assets/discontinued/gaf-truslate/03.webp",
          "assets/discontinued/gaf-truslate/04.webp",
          "assets/discontinued/gaf-truslate/05.webp",
          "assets/discontinued/gaf-truslate/06.webp",
        ],
      },
      {
        title: "Chinese Slate",
        sub: "Discontinued · No Quality Standards",
        desc: "Chinese slate was commonly installed in the 90s – mid 2000s. We mentioned above that slate selection is extremely important, and this was the problem with Chinese slate. There were and are no standards or quality control which led to slates being very poor quality, delaminating frequently, extreme brittleness, and especially prone to efflorescence. We have found these in DFW, Colorado, St. Louis, and Wisconsin to name a few.",
        images: [
          "assets/discontinued/imported-slate/01.webp",
          "assets/discontinued/imported-slate/02.webp",
          "assets/discontinued/imported-slate/03.webp",
          "assets/discontinued/imported-slate/04.webp",
          "assets/discontinued/imported-slate/05.webp",
          "assets/discontinued/imported-slate/06.webp",
          "assets/discontinued/imported-slate/07.webp",
        ],
      },
      {
        title: "Fiber Cement / Asbestos",
        sub: "Asbestos-Containing Material · Regulated",
        desc: "Fiber Cement doesn't have to contain asbestos, but most did. These roof tiles have been discontinued due to the health hazards (mesothelioma & lung cancer) that come from the particles that can be breathed in. Removal of these roofs is required and delicate in relation to following the necessary safety protocols.",
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
    label: "Synthetics — Rubber and Plastic",
    items: [
      {
        title: "DaVinci BellaForte",
        sub: "Discontinued · Color-Matched Replacement",
        desc: "DaVinci's BellaForte composite slate has been retired from the line. We stock retired colorways for blending and replacement on roofs that should not be fully redone.",
        images: [
          "assets/discontinued/davinci-bellaforte/01.webp",
          "assets/discontinued/davinci-bellaforte/02.webp",
          "assets/discontinued/davinci-bellaforte/03.webp",
          "assets/discontinued/davinci-bellaforte/04.webp",
        ],
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
    label: "Underlayment",
    items: [
      {
        title: "TAMKO TW Underlayment",
        sub: "Discontinued Synthetic · Tile & Slate Substrate",
        desc: "TAMKO's TW synthetic underlayment was specified beneath tile and slate before it was pulled from the line. We document where it was used, check for the brittleness and seam separation it develops under heat load, and re-underlay with a self-adhered membrane rated for the material above — saving the tile or slate wherever it remains serviceable.",
        images: [
          "assets/discontinued/tamko-tw-underlayment/01.webp",
          "assets/discontinued/tamko-tw-underlayment/02.webp",
          "assets/discontinued/tamko-tw-underlayment/03.webp",
          "assets/discontinued/tamko-tw-underlayment/04.webp",
          "assets/discontinued/tamko-tw-underlayment/05.webp",
          "assets/discontinued/tamko-tw-underlayment/06.webp",
          "assets/discontinued/tamko-tw-underlayment/07.webp",
        ],
      },
    ],
  },
};

const ROOF_SYSTEMS = [
  {
    num: "01 / 03",
    title: "Felt",
    body: "What you don't see is what determines whether a roof leaks. We replace many roofs because they have an old #30 lb felt underneath or a failed ice and water shield. We cover all specialty roofs we install in a high-temperature ice and water shield — above industry standard, our own standard.",
    image: "https://images.unsplash.com/photo-1605000797499-95a51c5269ae?w=1200&auto=format&fit=crop&q=80",
  },
  {
    num: "02 / 03",
    title: "Fasteners",
    body: "Not using the proper material — copper or steel that corrodes long after the slate or tile ever would — or over- and under-driven nails that let wind-driven rain in. The fastener decides whether the system reaches its rated life.",
    image: "https://images.unsplash.com/photo-1565953554309-9e60d3edec64?w=1200&auto=format&fit=crop&q=80",
  },
  {
    num: "03 / 03",
    title: "Flashings",
    body: "Flashings are the single largest source of failure. We hand-form copper, lead, and stainless step- and pan-flashings to match original details and outlast the roof material above.",
    image: "https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=1200&auto=format&fit=crop&q=80",
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

// TODO(jack): Drop real affiliation logos at assets/logos/trust/*.svg|.png.
// When `logo` is present, the marquee renders the image instead of the text badge.
const TRUST = [
  { initials: "TRI", name: "Tile Roofing Institute",        role: "Certified Tile Installer",      logo: "assets/logos/trust/tri.png" },
  { initials: "SRC", name: "Slate Roofing Contractors",     role: "Certified Slate Specialist",    logo: "assets/logos/trust/srca.png" },
  { initials: "NSA", name: "National Slate Association",    role: "NSA Certified Member",          logo: "assets/logos/trust/nsa.png" },
  { initials: "MRC", name: "Metal Roofing Consortium",      role: "Certified Metal Specialist",    logo: "assets/logos/trust/mrc.png" },
  { initials: "AIG", name: "AIG & Chubb Preferred",         role: "Preferred Contractor / Vendor", logo: "assets/logos/trust/aig-chubb.png" },
  { initials: "FTF", name: "FORTIFIED",                     role: "Storm-Resilient Installation",  logo: "assets/logos/trust/fortified.png" },
];

const NAV_ITEMS = [
  { id: "about",        label: "About",                href: "about.html" },
  { id: "portfolio",    label: "Portfolio",            href: "portfolio.html" },
  { id: "materials",    label: "Materials",            href: "materials.html" },
  { id: "discontinued", label: "Discontinued Products", href: "discontinued.html" },
  { id: "blog",         label: "Blog",                 href: "blog.html" },
];

const TESTIMONIALS = [
  {
    quote: "We had a discontinued Heinz tile profile on a 1930 Highland Park estate. Priority Designer sourced a reproduction through Ludowici that was invisible from the street. We've since been asked three times by neighbors who did it. Nobody knows it's new.",
    name: "The Rothwell Family",
    property: "Highland Park Estate",
    material: "Ludowici Clay Tile",
  },
  {
    quote: "Jack spent two hours on our roof before he gave us a number. Every other contractor handed us a quote from the driveway. That told us everything we needed to know.",
    name: "M. & C. Caldwell",
    property: "Preston Hollow Residence",
    material: "Vermont Slate",
  },
  {
    quote: "After a hail event our insurance adjuster called it a total loss. Jack's inspection found 94% of the original Vermont slate was recoverable. We saved the roof and re-flashed everything. It's better than it's ever been.",
    name: "R. & A. Devereaux",
    property: "Westover Hills Estate",
    material: "Vermont Slate",
  },
];

const TEAM = [
  {
    name: "Jack [Last Name]",
    title: "Founder & Lead Estimator",
    bio: "A decade of historic exterior restoration across the DFW Metroplex. Jack founded Priority Designer in 2016 with a singular focus: do the work that mass-market contractors won't — source discontinued profiles, hand-form copper flashings, and stand behind every fastener. Bio and photo coming soon.",
    image: "",
  },
];

Object.assign(window, {
  MANUFACTURERS, PROJECTS, MAP_PROJECTS, DISCONTINUED, ROOF_SYSTEMS, PARTNERS, PRESERVATION, TRADE_CIVIC, CERTIFICATIONS, TRUST, NAV_ITEMS, JOURNAL, TEAM, TESTIMONIALS,
  HERO_TOP_FIVE, THREE_REASONS, LIFECYCLE_MATERIALS, INSTALL_STEPS, INSTALL_STEP_PHOTOS,
});
