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
    image: "assets/materials/slate.jpg",
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
    image: "assets/materials/clay.jpg",
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
    // 2026-06-17 (Jack): "Mark Taylor's" job — variegated natural slate + copper.
    // Public name kept generic per no-client-names rule; confirm exact city with Jack.
    name: "Dallas Estate · Variegated Slate & Copper",
    slug: "dallas-variegated-slate-copper",
    loc: "Dallas, TX",
    tag: "Natural Slate · Purple/Grey/Green",
    type: "Slate",
    desc: "A Tudor estate finished in hand-blended purple, grey, and green natural slate, detailed throughout in copper at the ridges, valleys, and penetrations.",
    longDesc: "A Dallas-area Tudor finished in a variegated natural slate field — purple, grey, and green blended across the roof so the color reads evenly from every approach. We re-underlaid in a high-temperature ice-and-water membrane and hand-formed copper at every ridge, valley, and penetration, sized to outlast the slate above.",
    image: "assets/projects/dallas-variegated-slate-copper/01.webp",
    gallery: [
      "assets/projects/dallas-variegated-slate-copper/01.webp",
      "assets/projects/dallas-variegated-slate-copper/02.webp",
      "assets/projects/dallas-variegated-slate-copper/03.webp",
      "assets/projects/dallas-variegated-slate-copper/04.webp",
    ],
  },
  {
    name: "St. Louis Residence · Purple, Grey & Green Slate",
    slug: "st-louis-tri-color-slate",
    loc: "St. Louis, MO",
    tag: "Natural Slate · Purple/Grey/Green",
    type: "Slate",
    desc: "Purple, grey, and green natural Vermont slate over a St. Louis residence — a hand-blended field with copper flashings detailed at every transition.",
    longDesc: "A St. Louis residence finished in a natural Vermont slate field blending purple, grey, and green. We re-underlaid in a high-temperature ice-and-water membrane, hand-blended the slate across the field so the color reads evenly from every approach, and detailed the valleys and chimney in copper sized to outlast the slate above.",
    image: "assets/projects/st-louis-tri-color-slate/01.webp",
    gallery: [
      "assets/projects/st-louis-tri-color-slate/01.webp",
      "assets/projects/st-louis-tri-color-slate/02.webp",
      "assets/projects/st-louis-tri-color-slate/03.webp",
      "assets/projects/st-louis-tri-color-slate/04.webp",
    ],
  },
  {
    name: "Highland Park Residence · Vermont Black Slate",
    slug: "highland-park-vermont-black-slate",
    loc: "Highland Park, TX",
    tag: "Natural Slate · Vermont Black",
    type: "Slate",
    desc: "Vermont Black natural slate on a Highland Park residence — full field with copper flashings detailed at every transition.",
    longDesc: "A Highland Park residence finished in Vermont Black natural slate. We re-underlaid in a high-temperature ice-and-water membrane, coursed the slate for an even, deep-black field, and detailed every wall, valley, and chimney flashing in copper sized to outlast the slate above.",
    image: "assets/projects/highland-park-vermont-black-slate/01.webp",
    gallery: [
      "assets/projects/highland-park-vermont-black-slate/01.webp",
      "assets/projects/highland-park-vermont-black-slate/02.webp",
      "assets/projects/highland-park-vermont-black-slate/03.webp",
    ],
  },
  {
    name: "Highland Park Residence · Natural Slate",
    slug: "highland-park-slate",
    loc: "Highland Park, TX",
    tag: "Natural Slate",
    type: "Slate",
    desc: "Natural slate over a Highland Park residence — full field with copper valleys and flashings throughout.",
    longDesc: "A Highland Park residence finished in a natural slate field. We re-underlaid in a high-temperature ice-and-water membrane, coursed the slate so the field reads as a single continuous surface, and rebuilt every valley and flashing detail in copper.",
    image: "assets/projects/highland-park-slate/01.webp",
    gallery: [
      "assets/projects/highland-park-slate/01.webp",
      "assets/projects/highland-park-slate/02.webp",
      "assets/projects/highland-park-slate/03.webp",
      "assets/projects/highland-park-slate/04.webp",
      "assets/projects/highland-park-slate/05.webp",
    ],
  },
  {
    name: "University Park Residence · Clipped Galcar Slate",
    slug: "university-park-galcar-slate",
    loc: "University Park, TX",
    tag: "Natural Slate · Clipped Galcar",
    type: "Slate",
    desc: "Clipped Galcar slate over a University Park residence — a clipped-corner field detailed with copper throughout.",
    longDesc: "A University Park residence finished in clipped Galcar slate. We re-underlaid in a high-temperature ice-and-water membrane, set the clipped-corner field for a crisp, repeating shadow line, and detailed every valley and flashing in copper sized to outlast the slate above.",
    image: "assets/projects/university-park-galcar-slate/01.webp",
    gallery: [
      "assets/projects/university-park-galcar-slate/01.webp",
      "assets/projects/university-park-galcar-slate/02.webp",
      "assets/projects/university-park-galcar-slate/03.webp",
      "assets/projects/university-park-galcar-slate/04.webp",
      "assets/projects/university-park-galcar-slate/05.webp",
    ],
  },
  {
    name: "Highland Park Residence · Full Range Purple Slate",
    slug: "highland-park-full-range-purple-slate",
    loc: "Highland Park, TX",
    tag: "Natural Slate · Full Range Purple",
    type: "Slate",
    desc: "Full Range Purple natural Vermont slate over a Highland Park residence — copper flashings detailed at every transition.",
    longDesc: "A Highland Park residence finished in Full Range Purple natural Vermont slate. We re-underlaid in a high-temperature ice-and-water membrane, coursed the slate so the purple range reads evenly across the field, and detailed every wall and chimney flashing in copper sized to outlast the slate above.",
    image: "assets/projects/highland-park-full-range-purple-slate/01.webp",
    gallery: [
      "assets/projects/highland-park-full-range-purple-slate/01.webp",
      "assets/projects/highland-park-full-range-purple-slate/02.webp",
      "assets/projects/highland-park-full-range-purple-slate/03.webp",
    ],
  },
  {
    name: "Highland Park Residence · Unfading Grey Slate",
    slug: "highland-park-unfading-grey-slate",
    loc: "Highland Park, TX",
    tag: "Natural Slate · Unfading Grey",
    type: "Slate",
    desc: "Unfading Grey natural Vermont slate over a Highland Park residence — a consistent field with copper detailing throughout.",
    longDesc: "A Highland Park residence finished in Unfading Grey natural Vermont slate. We hand-graded the slate before installation, re-underlaid in a high-temperature ice-and-water membrane, and coursed an absolutely consistent grey field. Every dormer and flashing detail was rebuilt in copper.",
    image: "assets/projects/highland-park-unfading-grey-slate/01.webp",
    gallery: [
      "assets/projects/highland-park-unfading-grey-slate/01.webp",
      "assets/projects/highland-park-unfading-grey-slate/02.webp",
      "assets/projects/highland-park-unfading-grey-slate/03.webp",
      "assets/projects/highland-park-unfading-grey-slate/04.webp",
      "assets/projects/highland-park-unfading-grey-slate/05.webp",
      "assets/projects/highland-park-unfading-grey-slate/06.webp",
      "assets/projects/highland-park-unfading-grey-slate/07.webp",
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
    name: "Fort Worth Residence · Unfading Grey Slate",
    slug: "fort-worth-unfading-grey-slate",
    loc: "Fort Worth, TX",
    tag: "Natural Slate · Unfading Grey",
    type: "Slate",
    desc: "Unfading Gray natural Vermont slate over an Overton Park residence in Fort Worth — copper valleys and flashings throughout.",
    longDesc: "An Overton Park residence in Fort Worth finished in Unfading Gray natural Vermont slate. We re-underlaid in a high-temperature ice-and-water membrane, coursed the grey field for a single coherent surface, and detailed the valleys and flashings in copper sized to outlast the slate above.",
    image: "assets/projects/fort-worth-unfading-grey-slate/01.webp",
    gallery: [
      "assets/projects/fort-worth-unfading-grey-slate/01.webp",
      "assets/projects/fort-worth-unfading-grey-slate/02.webp",
      "assets/projects/fort-worth-unfading-grey-slate/03.webp",
      "assets/projects/fort-worth-unfading-grey-slate/04.webp",
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
    name: "St. Louis Estate · Purple, Grey & Green Slate",
    slug: "st-louis-estate-slate",
    loc: "St. Louis, MO",
    tag: "Natural Slate · Purple/Grey/Green",
    type: "Slate",
    desc: "Purple, grey, and green natural Vermont slate over a St. Louis estate — a hand-blended field detailed for Midwest freeze-thaw.",
    longDesc: "A St. Louis estate finished in a natural Vermont slate field blending purple, grey, and green. We re-underlaid in a high-temperature ice-and-water membrane, hand-blended the slate so the color reads evenly across the field, and detailed every flashing in copper for the Midwest freeze-thaw cycle. Out-of-region work delivered to the same standard as our DFW projects.",
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
    name: "Plano Estate · DaVinci Slate",
    slug: "plano-davinci-slate",
    loc: "Plano, TX",
    tag: "DaVinci Composite Slate",
    type: "Slate",
    desc: "DaVinci composite slate over a Plano estate — a synthetic slate field with the depth of quarried stone and a Class 4 impact rating.",
    longDesc: "A Plano estate finished in DaVinci composite slate — an engineered synthetic that carries the shadow line and color depth of natural slate at a fraction of the weight. We installed over a high-temperature ice-and-water membrane, blended the tile colors across the field, and detailed the valleys in copper. The result is hail-rated and built to hold its color in the Texas sun.",
    image: "assets/projects/plano-davinci-slate/01.webp",
    gallery: [
      "assets/projects/plano-davinci-slate/01.webp",
      "assets/projects/plano-davinci-slate/02.webp",
      "assets/projects/plano-davinci-slate/03.webp",
      "assets/projects/plano-davinci-slate/04.webp",
      "assets/projects/plano-davinci-slate/05.webp",
    ],
  },
  {
    name: "Park Cities Residence · CertainTeed Grand Manor",
    slug: "park-cities-grand-manor",
    loc: "Park Cities, TX",
    tag: "CertainTeed Grand Manor · Designer Shingle",
    type: "Designer Shingles",
    desc: "A CertainTeed Grand Manor roof emulating the look of natural slate through high-quality asphalt construction — bold, dimensional, and built to last.",
    longDesc: "This project features a CertainTeed Grand Manor roof, designed to emulate the look of natural slate through high-quality asphalt construction. The roofing system provides a bold, dimensional appearance while delivering reliable performance and long-term durability. Installed over a high-temperature ice-and-water membrane with copper flashings detailed at every transition.",
    image: "assets/projects/park-cities-grand-manor/01.webp",
    gallery: [
      "assets/projects/park-cities-grand-manor/01.webp",
      "assets/projects/park-cities-grand-manor/02.webp",
      "assets/projects/park-cities-grand-manor/03.webp",
      "assets/projects/park-cities-grand-manor/04.webp",
      "assets/projects/park-cities-grand-manor/05.webp",
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
    name: "University Park Residence · Natural Slate",
    slug: "university-park-slate",
    loc: "University Park, TX",
    tag: "Natural Slate",
    type: "Slate",
    desc: "Natural slate over a University Park residence — a full field with copper flashings and an upgraded fastener spec for Texas wind loading.",
    longDesc: "A University Park residence finished in a natural slate field. We re-underlaid in a high-temperature ice-and-water membrane, coursed the slate for a continuous, even surface, and specified the fastener pattern for Texas wind loading. Every flashing detail was rebuilt in copper sized to outlast the slate above.",
    image: "assets/projects/university-park-slate/01.webp",
    gallery: [
      "assets/projects/university-park-slate/01.webp",
      "assets/projects/university-park-slate/02.webp",
      "assets/projects/university-park-slate/03.webp",
      "assets/projects/university-park-slate/04.webp",
      "assets/projects/university-park-slate/05.webp",
    ],
  },
  {
    name: "St. Louis Residence · Ludowici Clay Tile",
    slug: "st-louis-ludowici-tile",
    loc: "St. Louis, MO",
    tag: "Clay Tile · Ludowici S-Tile",
    type: "Clay Tile",
    desc: "Ludowici S-profile clay tile over a St. Louis residence — a hand-blended field detailed in copper at every transition.",
    longDesc: "A St. Louis residence finished in Ludowici S-tile, a clay-tile profile prized for its deep, repeating S-curve shadow line. We re-underlaid in a high-temperature ice-and-water membrane, blended the tile across the field, and detailed the chimney and valley flashings in copper. The roof is built to outlast the building beneath it.",
    image: "assets/projects/st-louis-ludowici-tile/01.webp",
    gallery: [
      "assets/projects/st-louis-ludowici-tile/01.webp",
      "assets/projects/st-louis-ludowici-tile/02.webp",
      "assets/projects/st-louis-ludowici-tile/03.webp",
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
];

// Pins for the homepage "Jobs of Distinction" map. x/y are in the 960x600 SVG space.
// Schema: { name, city, state, metro, x, y, system, scope, blurb, image, slug }
// `slug` matches a PROJECTS entry so the popup/list CTA deep-links into the portfolio modal.
// `metro` groups pins: any metro with >1 job renders as a single numbered CLUSTER bubble
//   (click → zoom flourish + a list panel of that metro's jobs); a metro with 1 job is a
//   normal pin, so the dense DFW jobs don't pile on top of each other.
// This is a CURATED SUBSET of the 17 portfolio jobs (the map note says "selected
//   projects shown"): 5 DFW jobs picked for material/location variety + 3 St. Louis +
//   Waco + Carmel = 10 pins. The 7 other DFW portfolio jobs are intentionally not pinned.
// 2026-06-16 (Phase 2 map work): x/y are NO LONGER
//   eyeballed — they were derived from each city's real latitude/longitude through a
//   2nd-order least-squares fit calibrated against this exact SVG's state geometry
//   (getBBox of 19 states, RMS ≈ 6px), then verified with isPointInFill (every pin lands
//   in the correct state). To add/replace a pin, recompute via /tmp/fit2.js (see session
//   notes) rather than guessing. DFW jobs share ~(449–463, 413–419); the 3 St. Louis jobs
//   share ~(579–581, 283–285); Waco (451,446) and Carmel (46,270) are standalone.
const MAP_PROJECTS = [
  { name: "St. Louis Residence · Purple, Grey & Green Slate", city: "St. Louis", state: "MO", metro: "St. Louis, MO",        x: 580, y: 284, slug: "st-louis-tri-color-slate",          system: "Natural Slate · Purple/Grey/Green", scope: "Full Slate Restoration",   blurb: "Purple, grey, and green natural Vermont slate over a St. Louis residence — a hand-blended field with copper flashings at every transition.", image: "assets/projects/st-louis-tri-color-slate/01.webp" },
  { name: "Highland Park Residence · Vermont Black Slate",    city: "Highland Park", state: "TX", metro: "Dallas–Fort Worth, TX", x: 460, y: 417, slug: "highland-park-vermont-black-slate",   system: "Natural Slate · Vermont Black",     scope: "Full Slate Restoration",   blurb: "Vermont Black natural slate on a Highland Park residence, with copper flashings detailed at every transition.", image: "assets/projects/highland-park-vermont-black-slate/01.webp" },
  { name: "Fort Worth Residence · Unfading Grey Slate",       city: "Fort Worth", state: "TX", metro: "Dallas–Fort Worth, TX", x: 450, y: 417, slug: "fort-worth-unfading-grey-slate",      system: "Natural Slate · Unfading Grey",     scope: "Full Slate Restoration",   blurb: "Unfading Gray Vermont slate over an Overton Park residence, with copper valleys throughout.", image: "assets/projects/fort-worth-unfading-grey-slate/01.webp" },
  { name: "Central Texas Estate · Natural Slate",             city: "Waco", state: "TX", metro: "Waco, TX",                   x: 451, y: 446, slug: "waco-natural-slate",                   system: "Natural Slate",                     scope: "Full Slate Restoration",   blurb: "Central Texas estate finished in quarried natural slate — engineered to last a century.", image: "assets/projects/waco-natural-slate/01.webp" },
  { name: "St. Louis Estate · Purple, Grey & Green Slate",    city: "St. Louis", state: "MO", metro: "St. Louis, MO",        x: 581, y: 285, slug: "st-louis-estate-slate",               system: "Natural Slate · Purple/Grey/Green", scope: "Full Slate Restoration",   blurb: "Purple, grey, and green natural Vermont slate over a St. Louis estate, detailed for Midwest freeze-thaw.", image: "assets/projects/st-louis-estate-slate/01.webp" },
  { name: "Coastal California Estate · Pacific Slate",        city: "Carmel", state: "CA", metro: "Carmel, CA",               x: 46,  y: 270, slug: "carmel-coastal-slate",                system: "Natural Slate · Coastal",           scope: "Coastal Slate Restoration",blurb: "Pacific-coast slate restoration — salt-air exposure governed every fastener and flashing decision.", image: "assets/projects/carmel-coastal-slate/01.webp" },
  { name: "Plano Estate · DaVinci Slate",                     city: "Plano", state: "TX", metro: "Dallas–Fort Worth, TX",   x: 463, y: 413, slug: "plano-davinci-slate",                 system: "DaVinci Composite Slate",           scope: "Estate Re-Roof",           blurb: "DaVinci composite slate with the depth of quarried stone and a Class 4 impact rating.", image: "assets/projects/plano-davinci-slate/01.webp" },
  { name: "Westlake Estate · Designer Shingle + Copper",      city: "Westlake", state: "TX", metro: "Dallas–Fort Worth, TX", x: 453, y: 413, slug: "westlake-designer-shingle",            system: "Designer Shingle · Copper",         scope: "Estate New Construction",  blurb: "Designer shingle field with hand-formed copper turrets — Class 4 impact rating and estate depth.", image: "assets/projects/westlake-designer-shingle/01.webp" },
  { name: "St. Louis Residence · Ludowici Clay Tile",         city: "St. Louis", state: "MO", metro: "St. Louis, MO",        x: 579, y: 283, slug: "st-louis-ludowici-tile",               system: "Clay Tile · Ludowici S-Tile",       scope: "Clay Tile Restoration",    blurb: "Ludowici S-profile clay tile, hand-blended and detailed in copper at every transition.", image: "assets/projects/st-louis-ludowici-tile/01.webp" },
  { name: "Institutional Clay Tile · Hand-Reset Restoration", city: "Dallas", state: "TX", metro: "Dallas–Fort Worth, TX",  x: 460, y: 419, slug: "dallas-parish-clay",                  system: "Commercial · Clay Tile",            scope: "Institutional Restoration",blurb: "Institutional clay tile carefully unstacked, salvaged, and re-laid over new underlayment.", image: "assets/projects/dallas-parish-clay/01.webp" },
  // 2026-06-17 (Jack): upcoming jobs added for geographic reach — no photos yet, so these
  // carry `coming: true` (the existing "Project Coming" pin/popup treatment) and no `slug`/`image`
  // (popup shows the badge instead of a thumbnail + deep-link). x/y from the same affine lat/lng
  // fit as the rest (see comment above; residuals <3px on all anchors). KC client name omitted per
  // no-client-names rule; the Cheyenne cathedral is an institutional landmark name and is retained.
  { name: "Wisconsin Estate · Natural Slate",                city: "Madison", state: "WI", metro: "Wisconsin",            x: 601, y: 174, coming: true, system: "Natural Slate",            scope: "Full Slate Restoration",   blurb: "An upcoming natural-slate estate restoration in Wisconsin — scheduled for August 2026." },
  { name: "Kansas City Residence · Natural Slate",           city: "Kansas City", state: "MO", metro: "Kansas City, MO",   x: 508, y: 263, coming: true, system: "Natural Slate",            scope: "Full Slate Restoration",   blurb: "An upcoming natural-slate residence in the Kansas City metro." },
  { name: "St. Joseph's Catholic Cathedral · Cheyenne, WY",  city: "Cheyenne", state: "WY", metro: "Cheyenne, WY",         x: 340, y: 190, coming: true, system: "Specialty · Cathedral Roofing", scope: "Cathedral Restoration",    blurb: "An upcoming cathedral restoration at St. Joseph's in Cheyenne, Wyoming." },
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
  { slug: "holy-trinity-clay",          name: "Holy Trinity Catholic · Clay Tile",         image: "assets/projects/holy-trinity-clay/01.webp" },
  { slug: "dallas-variegated-slate-copper", name: "Dallas Estate · Variegated Slate & Copper", image: "assets/projects/dallas-variegated-slate-copper/02.webp" },
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
    ],
    image: "assets/discontinued/tamko-tw-underlayment/02.webp",
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
    image: "assets/materials/copper-nails.webp",
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
    image: "assets/projects/highland-park-vermont-black-slate/02.webp",
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
        images: [
          "assets/discontinued/fiber-cement-asbestos/01.webp",
        ],
      },
    ],
  },
  "Clay Tile": {
    label: "Clay Tile",
    items: [
      {
        title: "Heinz Clay Roof Tile",
        sub: "c. 1900–1940s · Midwest / Colorado Region",
        desc: "Heinz designed distinct tile families engineered to emulate historical European architecture while providing modern regional weather resistance. Tiles were fired from dense, iron-rich Colorado clay beds, giving a natural terracotta-red baseline color. Heinz tiles are still found on historic homes and institutional buildings throughout the Mountain West and Midwest.",
      },
      {
        title: "Mineral Wells Tile Co.",
        sub: "c. Early–Mid 20th Century · Mineral Wells, Texas",
        desc: "A prominent historic manufacturer based in Mineral Wells, Texas. Mineral Wells tiles are characterized by richly colored, artisanal clay with a distinctly varied 'bee-hive' kiln firing that creates buff-to-flashed tones — a single original batch naturally contains a blend of buffs, deep rust-reds, oranges, and smoky browns. Because they were fired in historic regional kilns, each tile is today classified as a reclaimed antique building material.",
      },
      {
        title: "Mound City Roofing Tile Co.",
        sub: "c. 1900–1930s · St. Louis, Missouri",
        desc: "Organized to serve the booming Midwestern building market, Mound City manufactured a full line of terra-cotta roofing tile from high-grade Missouri shale. Their 'Catalog D' (c. 1911) survives in the National Building Arts Center archive and documents a comprehensive product line — interlocking Spanish, Mission, Greek, and shingle profiles, plus a full accessory suite. Available in natural burnt-red or full-glazed finishes in green, yellow, blue, brown, and black.",
      },
      {
        title: "Cincinnati Roofing Tile & Terra Cotta Co.",
        sub: "c. 1890s–Early 20th Century · Cincinnati, Ohio",
        desc: "Founded between 1895 and 1898 by Jacob Freund, the Cincinnati Roofing Tile & Terra Cotta Company operated a highly mechanized plunger-press plant in the Winton Place neighborhood of Cincinnati. Known for their vitrified 'True S'-style Spanish tiles, their products are documented on prominent historic buildings including the East Lake Golf Club clubhouse and the Atlanta Post Office. Their original catalogues are preserved in the HathiTrust Digital Library.",
      },
      {
        title: "B. Mifflin Hood Brick Co.",
        sub: "c. 1904–1940s · Atlanta, Georgia",
        desc: "Founded by ceramicist and theologian Benjamin Mifflin Hood in Atlanta in 1904, the company expanded to six plants across Georgia, North Carolina, Tennessee, and Alabama. Hood pioneered shale-based clay-tile production in the American South and was known for distinctively matte, hand-pressed aesthetics. Signature shades included deep natural reds and 'Fire Flashed Autumn,' a multi-toned mottled brown and orange. The company dissolved in 1946, and its Atlanta showroom was added to the National Register of Historic Places in 2018.",
      },
      {
        title: "Sharps Brand Clay Roof Tile",
        sub: "c. 1890s–1940s · Denver, Colorado Region",
        desc: "Sharps tiles were widely used across the Rocky Mountain West and Great Plains, prized for their highly vitrified, dense clay and exceptional resistance to freeze-thaw cycles. Their signature product was a French-style interlocking tile with a pronounced center rib — slightly smaller than Ludowici's French but similar in character. Sharps tiles remain on thousands of homes across Colorado, Kansas, Nebraska, and surrounding states.",
      },
    ],
  },
  Synthetic: {
    label: "Synthetics — Rubber and Plastic",
    items: [
      {
        title: "DaVinci Bellaforté Slate",
        sub: "Discontinued May 2023 · Replaced by Province Slate",
        desc: "DaVinci discontinued production of Bellaforté Slate as of May 1, 2023, replacing it with the single-width Province Slate line. We stock retired Bellaforté colorways for blending and spot replacement, so a roof that's still serviceable doesn't have to be fully redone.",
        images: [
          "assets/discontinued/davinci-bellaforte/01.webp",
          "assets/discontinued/davinci-bellaforte/02.webp",
          "assets/discontinued/davinci-bellaforte/03.webp",
          "assets/discontinued/davinci-bellaforte/04.webp",
        ],
      },
      {
        title: "DaVinci Bellaforté Shake",
        sub: "Discontinued November 2023 · Replaced by Province Shake",
        desc: "DaVinci stopped offering Bellaforté Shake as of November 1, 2023, transitioning to the Province Shake line. We identify the discontinued profile, source remaining colorways where they exist, and match repairs into the existing field rather than tearing off a roof that still has life in it.",
      },
      {
        title: "EcoStar Majestic / Colonial Slate",
        sub: "Carlisle Discontinued ~2005 · Now EcoStar LLC",
        desc: "EcoStar Colonial Slate (10\" × 16\", 3/16\" thick) was manufactured and sold by Carlisle SynTec. Carlisle discontinued production around 2005; marketing rights passed to Staroba Plastics in 2010 and EcoStar LLC was formed. The current EcoStar tile is a different size and thickness (10\" × 18\", 1/4\"), so original Colonial / Majestic Slate roofs can't be matched with a current part — they require documented blending or section replacement.",
      },
      {
        title: "TAMKO Lamarite (Slate & Shake)",
        sub: "Not Manufactured Since 2012",
        desc: "TAMKO has not manufactured Lamarite composite slate and shake shingles since 2012. We document where Lamarite was installed, assess the field for the cracking and color loss it develops with age, and plan replacement where an exact match is no longer possible.",
      },
      {
        title: "Royal DuraSlate",
        sub: "Discontinued 2004 · Royal Building Products",
        desc: "Royal Building Products discontinued DuraSlate roofing in 2004. Replacement tiles are no longer produced, so DuraSlate roofs are handled through salvage-matched repair where feasible, or a full re-roof in a current system when they're past saving.",
      },
      {
        title: "CertainTeed Symphony Slate",
        sub: "Discontinued June 2018 · CertainTeed",
        desc: "CertainTeed discontinued its Symphony Slate composite in June 2018; the company's suggested replacements are the Grand Manor or Belmont shingles. Because neither is an exact match, we document the original profile and either blend or re-roof depending on what the home requires.",
      },
    ],
  },
  "Concrete Tile": {
    label: "Concrete Tile",
    items: [
      {
        title: "Monier / LifeTile / Boral",
        sub: "No Longer Produced in North America",
        desc: "Monier (later LifeTile and Boral, now Westlake Royal Building Products) concrete tiles are no longer produced in North America — only salvage or replication options exist. Discontinued profiles include Saxony, Capri, Villa, Spanish 'S' Nuevo, and the flat and S-profile Lifetile lines (often stamped 'Boral Lifetile BUSA'). We document the original profile for insurance and HOA submissions.",
      },
      {
        title: "Newpoint Concrete Roof Tiles",
        sub: "Westlake Royal · Katy, TX Profiles",
        desc: "Newpoint concrete roof tiles produced at the Katy, Texas plant — including the Tejas España, Barcelona Impact, and Saxony profiles — are out of production. Matching requires salvage stock or a compatible-profile substitution, which we document for HOA and insurance review.",
      },
      {
        title: "Eagle Roofing — Double Eagle",
        sub: "Discontinued Concrete Profile",
        desc: "The Double Eagle profile from Eagle Roofing Products has been discontinued. As with most discontinued concrete tile, mixing current profiles into the field creates interlock and wind-uplift incompatibilities — so we document the original and plan a matched repair or full section replacement rather than a mismatched patch.",
      },
    ],
  },
  "Designer Shingles": {
    label: "Designer Asphalt Shingles",
    items: [
      {
        title: "GAF Designer Shingles",
        sub: "Discontinued Luxury & Designer Lines",
        desc: "GAF's discontinued designer (luxury) shingles include Country Mansion (and Ultra Premium / Country Mansion 2), Camelot and Camelot Ultra, Grand Slate and Grand Slate 2, Capstone, Timberline Grande, Monaco, and Sienna — plus discontinued colorways of still-current lines such as Grand Canyon, Slateline (e.g. Sedona Sunset), and Woodland / Glenwood. These profiles and colors are no longer produced, so a matched repair depends on salvage stock; otherwise the affected slopes need a documented blend or replacement.",
      },
      {
        title: "CertainTeed Designer Shingles",
        sub: "Discontinued Luxury Profiles",
        desc: "CertainTeed's discontinued luxury / designer asphalt shingles include Centennial Slate (2010), Landmark TL Impact-Resistant (2012), Hatteras (2016), Highland Slate IR (2019), and Arcadia (2020); the Symphony Slate composite (2018) is covered under Synthetics. CertainTeed's suggested replacements are the Grand Manor, Belmont, or Presidential lines — none an exact match — so we document the original and plan the blend or re-roof accordingly.",
      },
      {
        title: "Atlas StormMaster Slate",
        sub: "Discontinued Designer Shingle",
        desc: "Atlas's StormMaster Slate, a slate-look designer shingle, has been discontinued. As with the GAF and CertainTeed luxury lines, current profiles won't match the original course exactly — so we document what's on the roof and plan a salvage-matched repair or a full section replacement.",
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

// 2026-06-14: real affiliation logos supplied by Ryan, converted to webp under
// assets/logos/trust/. The marquee renders the image; the initials badge stays
// as the onError fallback. (Manufacturer-card logos are still pending.)
const TRUST = [
  { initials: "TRI", name: "Tile Roofing Institute",        role: "Certified Tile Installer",      logo: "assets/logos/trust/tri.webp" },
  { initials: "SRC", name: "Slate Roofing Contractors",     role: "Certified Slate Specialist",    logo: "assets/logos/trust/srca.webp" },
  { initials: "NSA", name: "National Slate Association",    role: "NSA Certified Member",          logo: "assets/logos/trust/nsa.webp" },
  { initials: "MRC", name: "Metal Roofing Consortium",      role: "Certified Metal Specialist",    logo: "assets/logos/trust/mrc.webp" },
  { initials: "AIG", name: "AIG & Chubb Preferred",         role: "Preferred Contractor / Vendor", logo: "assets/logos/trust/aig-chubb.webp" },
  { initials: "FTF", name: "FORTIFIED",                     role: "Storm-Resilient Installation",  logo: "assets/logos/trust/fortified.webp" },
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
