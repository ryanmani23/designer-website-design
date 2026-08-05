/* global window */

// Blog articles are authored as markdown in content/blog/*.md and compiled by
// build-blog.mjs into (a) static <slug>.html pages and (b) dist/blog-articles.js,
// which sets window.BLOG_ARTICLES (title/tag/date/image/excerpt/url + plaintext
// searchText for in-content search). The blog index (ArticleGrid in sections.jsx)
// reads window.BLOG_ARTICLES, so there is no hand-maintained JOURNAL array here.

// ---------- Data: manufacturers, projects, discontinued products, partners ----------

// TODO(jack): Provide manufacturer logos at assets/logos/manufacturers/*.svg|.png.
// When `logo` is present, the cell renders the logo in place of the "01/04" stamp.
// TODO(jack): Featured project image swaps requested 2026-05-29:
//   Ludowici → Holy Trinity Catholic project photo
//   Brava → Rachel Reed project photo
//   Slate Valley Supply → closer-up slate photo
// Done: La Escandella → S-tile project photo (assets/materials/la-escandella.webp, 2026-08-05).
const MANUFACTURERS = [
  {
    name: "Ludowici",
    role: "America's Oldest Clay Roof Tile Manufacturer · Est. 1888",
    body: "Ludowici is the oldest and most renowned clay roof tile manufacturer in America. They can remake any mold dating back to their conception as well as match discontinued tile molds such as Heinz tile or Mineral Wells tile to keep the exact historic charm the home previously had.",
    image: "assets/projects/estate-clay-tile/01.webp",
    stamp: "01 / 04",
  },
  {
    name: "Slate Valley Supply / Be Natural",
    role: "Natural S1 Slate from Vermont & Spain",
    body: "Slate isn't manufactured, it's farmed. The selection process of that slate is almost as important as its rating. Our partners were born and live right where the quarries are and have a depth of knowledge that give us and our customers full confidence in the quality of the product installed and some of the shortest lead times in the industry.",
    image: "assets/materials/slate.webp",
    stamp: "02 / 04",
  },
  {
    name: "Brava",
    role: "The Only Synthetic We Believe In",
    body: "We are roofing snobs. We only install what we believe in and what we love. Typically, that's natural slate or authentic clay tile. But Brava is the one synthetic company we believe in. They have never had a product discontinued, and their offering of lightweight, Class 4, hurricane rated Tile, Slate and Shake is incredible. Truly a product that has earned our trust and recommendation.",
    image: "assets/materials/brava.webp",
    stamp: "03 / 04",
  },
  {
    name: "La Escandella",
    role: "Spain's Leading Clay Tile Manufacturer · European Certified",
    body: "La Escandella is the leading clay tile manufacturer in Spain and highly sought after throughout Europe. Their tiles have the highest ratings clay can earn and give the property a truly authentic European style.",
    image: "assets/materials/la-escandella.webp",
    stamp: "04 / 04",
  },
];

// 2026-06-06: PROJECTS rebuilt with real project photography (supabase-files).
// Per Jack: no client names anywhere, public `name` field is now a generic
// descriptor (city / system). Institutional names (St. Joseph's parish) are
// retained because they are public landmarks, not client identifiers.
// Each project has a `gallery[]` of 3–8 photos under assets/projects/<slug>/.
const PROJECTS = [
  {
    // 2026-06-17 (Jack): "Mark Taylor's" Highland Park job, variegated natural slate + copper.
    // Public name kept generic per no-client-names rule.
    name: "Highland Park Estate · Variegated Slate & Copper",
    slug: "highland-park-variegated-slate-copper",
    loc: "Highland Park, TX",
    tag: "Natural Slate · Purple/Grey/Green",
    type: "Slate",
    blend: "55% Vermont Purple · 35% Unfading Gray · 10% Unfading Green",
    desc: "A Tudor estate finished in hand-blended purple, grey, and green natural slate, detailed throughout in copper at the ridges, valleys, and penetrations.",
    longDesc: "A Highland Park Tudor finished in a variegated natural slate field, purple, grey, and green blended across the roof so the color reads evenly from every approach. We re-underlaid in a high-temperature ice-and-water membrane and hand-formed copper at every ridge, valley, and penetration, sized to outlast the slate above.",
    image: "assets/projects/highland-park-variegated-slate-copper/01.webp",
    gallery: [
      "assets/projects/highland-park-variegated-slate-copper/01.webp",
      "assets/projects/highland-park-variegated-slate-copper/02.webp",
      "assets/projects/highland-park-variegated-slate-copper/03.webp",
      "assets/projects/highland-park-variegated-slate-copper/04.webp",
    ],
  },
  {
    name: "St. Louis Residence · Purple, Grey & Green Slate",
    slug: "st-louis-tri-color-slate",
    loc: "St. Louis, MO",
    tag: "Natural Slate · Purple/Grey/Green",
    type: "Slate",
    blend: "55% Vermont Purple · 20% Unfading Green · 15% Mottled Green & Purple · 10% Fading Grey",
    desc: "Purple, grey, and green natural Vermont slate over a St. Louis residence, a hand-blended field with copper flashings detailed at every transition.",
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
    blend: "100% Vermont Black",
    desc: "Vermont Black natural slate on a Highland Park residence, full field with copper flashings detailed at every transition.",
    longDesc: "A Highland Park residence finished in Vermont Black natural slate. We re-underlaid in a high-temperature ice-and-water membrane, coursed the slate for an even, deep-black field, and detailed every wall, valley, and chimney flashing in copper sized to outlast the slate above.",
    image: "assets/projects/highland-park-vermont-black-slate/01.webp",
    gallery: [
      "assets/projects/highland-park-vermont-black-slate/01.webp",
      "assets/projects/highland-park-vermont-black-slate/02.webp",
      "assets/projects/highland-park-vermont-black-slate/03.webp",
    ],
  },
  {
    name: "University Park Residence · Clipped Galcar Slate",
    slug: "university-park-galcar-slate",
    loc: "University Park, TX",
    tag: "Natural Slate · Clipped Galcar",
    type: "Slate",
    blend: "Galcar Spanish Black, clipped edges",
    desc: "Clipped Galcar slate over a University Park residence, a clipped-corner field detailed with copper throughout.",
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
    blend: "Full Range Vermont Purple",
    desc: "Full Range Purple natural Vermont slate over a Highland Park residence, copper flashings detailed at every transition.",
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
    blend: "100% Vermont Unfading Gray",
    desc: "Unfading Grey natural Vermont slate over a Highland Park residence, a consistent field with copper detailing throughout.",
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
    name: "Highland Park Residence · Custom Vermont Slate",
    slug: "highland-park-lorraine-slate",
    loc: "Highland Park, TX",
    tag: "Natural Slate · Custom Blend",
    type: "Slate",
    blend: "30% Vermont Purple · 20% Fading Grey · 20% Fading Green · 10% Unfading Grey · 10% Unfading Green · 5% Spanish Black · 5% New York Red",
    desc: "A Highland Park residence in a custom multi-color Vermont slate blend, hand-coursed across the field and detailed in copper.",
    longDesc: "A Highland Park residence finished in a custom seven-color Vermont slate blend, hand-blended across the field so the color reads evenly from every approach. Set over a high-temperature ice-and-water membrane with copper detailed at every valley, dormer, and penetration. The full blend is listed in the spec above.",
    image: "assets/projects/highland-park-lorraine-slate/01.webp",
    gallery: [
      "assets/projects/highland-park-lorraine-slate/01.webp",
      "assets/projects/highland-park-lorraine-slate/02.webp",
      "assets/projects/highland-park-lorraine-slate/03.webp",
      "assets/projects/highland-park-lorraine-slate/04.webp",
    ],
  },
  {
    name: "Forested Estate · Vermont Slate",
    slug: "westover-hills-slate",
    loc: "Westover Hills, TX",
    tag: "Vermont Slate · Estate",
    type: "Slate",
    blend: "43% Unfading Vermont Grey · 42% Spanish Black · 10% Vermont Purple · 5% New York Red",
    desc: "Sheltered estate roof rebuilt in Vermont slate, aerial coursework and concealed flashings preserved the original tree-canopy approach.",
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
    blend: "100% Vermont Unfading Gray",
    desc: "Unfading Gray natural Vermont slate over an Overton Park residence in Fort Worth, copper valleys and flashings throughout.",
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
    blend: "100% Vermont Weathering Grey/Green",
    desc: "Quarried natural slate over a Central Texas estate, every fastener and flashing engineered for a roof you'll own for a century.",
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
    blend: "55% Vermont Purple · 20% Unfading Green · 15% Mottled Green & Purple · 10% Fading Grey",
    desc: "Purple, grey, and green natural Vermont slate over a St. Louis estate, a hand-blended field detailed for Midwest freeze-thaw.",
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
    name: "Coastal California Estate · Composite Slate",
    slug: "carmel-coastal-slate",
    loc: "Carmel, CA",
    tag: "Composite Slate · DaVinci Multi-Width",
    type: "Slate",
    blend: "DaVinci European Blend",
    desc: "DaVinci Multi-Width composite slate over a Carmel estate above the Pacific, detailed for salt-air exposure.",
    longDesc: "A Carmel estate above the Pacific finished in DaVinci Multi-Width composite slate, European Blend. We specified the composite for the coast: it carries the shadow line and color depth of natural slate while shrugging off the salt air that corrodes metal and weathers stone. Installed over a self-adhered membrane with stainless fasteners and copper flashings detailed to handle coastal weather, with the original architectural character preserved end to end.",
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
    blend: "DaVinci European Blend",
    desc: "DaVinci composite slate over a Plano estate, a synthetic slate field with the depth of quarried stone and a Class 4 impact rating.",
    longDesc: "A Plano estate finished in DaVinci composite slate, an engineered synthetic that carries the shadow line and color depth of natural slate at a fraction of the weight. We installed over a high-temperature ice-and-water membrane, blended the tile colors across the field, and detailed the valleys in copper. The result is hail-rated and built to hold its color in the Texas sun.",
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
    name: "Dallas Residence · Brava Composite Slate",
    slug: "dallas-brava-slate",
    loc: "Dallas, TX",
    tag: "Composite Slate · Brava Multi-Width",
    type: "Slate",
    blend: "Brava Light Arendale",
    desc: "Brava Multi-Width composite slate in Light Arendale over a Dallas residence, with copper detailing at the eaves and valleys.",
    longDesc: "A Dallas residence finished in Brava Multi-Width composite slate, Light Arendale. Brava is the one synthetic we install: a Class 4, color-stable slate look milled from molds of real stone. We coursed the multi-width tiles for a natural, hand-laid field over a high-temperature ice-and-water membrane and detailed the eaves and valleys in copper.",
    image: "assets/projects/dallas-brava-slate/01.webp",
    gallery: [
      "assets/projects/dallas-brava-slate/01.webp",
      "assets/projects/dallas-brava-slate/02.webp",
      "assets/projects/dallas-brava-slate/03.webp",
      "assets/projects/dallas-brava-slate/04.webp",
    ],
  },
  {
    name: "Colleyville Residence · CertainTeed Grand Manor",
    slug: "colleyville-grand-manor",
    loc: "Colleyville, TX",
    tag: "CertainTeed Grand Manor · Designer Shingle",
    type: "Designer Shingles",
    desc: "A CertainTeed Grand Manor roof that captures the depth and shadow line of natural slate in a dimensional, impact-rated asphalt shingle, detailed in copper at every transition.",
    longDesc: "A Colleyville residence roofed in CertainTeed Grand Manor, a luxury asphalt shingle built up in layers so it reads like natural slate from the street. We installed over a high-temperature ice-and-water membrane and hand-formed copper at the turret, valleys, and penetrations so the metalwork outlasts the field above.",
    image: "assets/projects/colleyville-grand-manor/06.webp",
    gallery: [
      "assets/projects/colleyville-grand-manor/06.webp",
      "assets/projects/colleyville-grand-manor/07.webp",
      "assets/projects/colleyville-grand-manor/08.webp",
      "assets/projects/colleyville-grand-manor/09.webp",
      "assets/projects/colleyville-grand-manor/01.webp",
      "assets/projects/colleyville-grand-manor/02.webp",
      "assets/projects/colleyville-grand-manor/03.webp",
      "assets/projects/colleyville-grand-manor/04.webp",
      "assets/projects/colleyville-grand-manor/05.webp",
    ],
  },
  {
    name: "Westlake Estate · Designer Shingle + Copper",
    slug: "westlake-designer-shingle",
    loc: "Westlake, TX",
    tag: "CertainTeed Belmont · Copper Turret",
    type: "Designer Shingles",
    desc: "A CertainTeed Belmont designer-shingle field punctuated with hand-formed copper turrets, with the depth of a custom estate.",
    longDesc: "A Westlake estate roofed in CertainTeed Belmont, a designer asphalt shingle chosen for the warmth of its field, with hand-formed copper turrets as the architectural punctuation. The result combines impact resistance with the kind of detail work that distinguishes a custom estate from a tract build.",
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
    desc: "Natural slate over a University Park residence, a full field with copper flashings and an upgraded fastener spec for Texas wind loading.",
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
    name: "Flower Mound Estate · Spanish S-Tile",
    slug: "flower-mound-s-tile",
    loc: "Flower Mound, TX",
    tag: "Clay Tile · Westlake 1-Piece S",
    type: "Clay Tile",
    blend: "Westlake Madera Rustic",
    desc: "A Flower Mound estate roofed in Westlake 1-Piece S clay tile, Madera Rustic blend, across a sprawling multi-gable footprint.",
    longDesc: "A Flower Mound estate finished in Westlake 1-Piece S clay tile in the Madera Rustic blend. The barrel-profile tile was coursed across a large, multi-gable roof and detailed in copper at the valleys and penetrations, set over a high-temperature underlayment rated for the tile above.",
    image: "assets/projects/flower-mound-s-tile/01.webp",
    gallery: [
      "assets/projects/flower-mound-s-tile/01.webp",
      "assets/projects/flower-mound-s-tile/02.webp",
      "assets/projects/flower-mound-s-tile/03.webp",
    ],
  },
  {
    name: "St. Louis Residence · La Escandella Clay Tile",
    slug: "st-louis-la-escandella-tile",
    loc: "St. Louis, MO",
    tag: "Clay Tile · La Escandella Spanish S",
    type: "Clay Tile",
    blend: "La Escandella H-Selection Provence",
    desc: "La Escandella Spanish S clay tile in H-Selection Provence over a St. Louis residence, with hand-formed copper details.",
    longDesc: "A St. Louis residence finished in La Escandella Spanish S clay tile, H-Selection Selectum Provence. La Escandella carries the highest ratings clay can earn; we coursed the barrel tile for an authentic European field over a high-temperature underlayment and hand-formed copper at the penetrations and valleys.",
    image: "assets/projects/st-louis-la-escandella-tile/01.webp",
    gallery: [
      "assets/projects/st-louis-la-escandella-tile/01.webp",
      "assets/projects/st-louis-la-escandella-tile/02.webp",
      "assets/projects/st-louis-la-escandella-tile/03.webp",
      "assets/projects/st-louis-la-escandella-tile/04.webp",
    ],
  },
  {
    name: "St. Louis Residence · Ludowici Clay Tile",
    slug: "st-louis-ludowici-tile",
    loc: "St. Louis, MO",
    tag: "Clay Tile · Ludowici S-Tile",
    type: "Clay Tile",
    blend: "Ludowici Summer Rose & Clay Red",
    desc: "Ludowici S-profile clay tile over a St. Louis residence, a hand-blended field detailed in copper at every transition.",
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
    desc: "Institutional clay tile carefully unstacked, salvaged, and re-laid over a new underlayment, public access maintained throughout.",
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
//   eyeballed, they were derived from each city's real latitude/longitude through a
//   2nd-order least-squares fit calibrated against this exact SVG's state geometry
//   (getBBox of 19 states, RMS ≈ 6px), then verified with isPointInFill (every pin lands
//   in the correct state). To add/replace a pin, recompute via /tmp/fit2.js (see session
//   notes) rather than guessing. DFW jobs share ~(449–463, 413–419); the 3 St. Louis jobs
//   share ~(579–581, 283–285); Waco (451,446) and Carmel (46,270) are standalone.
const MAP_PROJECTS = [
  { name: "St. Louis Residence · Purple, Grey & Green Slate", city: "St. Louis", state: "MO", metro: "St. Louis, MO",        x: 580, y: 284, slug: "st-louis-tri-color-slate",          system: "Natural Slate · Purple/Grey/Green", scope: "Full Slate Restoration",   blurb: "Purple, grey, and green natural Vermont slate over a St. Louis residence, a hand-blended field with copper flashings at every transition.", image: "assets/projects/st-louis-tri-color-slate/01.webp" },
  { name: "Highland Park Residence · Vermont Black Slate",    city: "Highland Park", state: "TX", metro: "Dallas–Fort Worth, TX", x: 460, y: 417, slug: "highland-park-vermont-black-slate",   system: "Natural Slate · Vermont Black",     scope: "Full Slate Restoration",   blurb: "Vermont Black natural slate on a Highland Park residence, with copper flashings detailed at every transition.", image: "assets/projects/highland-park-vermont-black-slate/01.webp" },
  { name: "Fort Worth Residence · Unfading Grey Slate",       city: "Fort Worth", state: "TX", metro: "Dallas–Fort Worth, TX", x: 450, y: 417, slug: "fort-worth-unfading-grey-slate",      system: "Natural Slate · Unfading Grey",     scope: "Full Slate Restoration",   blurb: "Unfading Gray Vermont slate over an Overton Park residence, with copper valleys throughout.", image: "assets/projects/fort-worth-unfading-grey-slate/01.webp" },
  { name: "Central Texas Estate · Natural Slate",             city: "Waco", state: "TX", metro: "Waco, TX",                   x: 451, y: 446, slug: "waco-natural-slate",                   system: "Natural Slate",                     scope: "Full Slate Restoration",   blurb: "Central Texas estate finished in quarried natural slate, engineered to last a century.", image: "assets/projects/waco-natural-slate/01.webp" },
  { name: "St. Louis Estate · Purple, Grey & Green Slate",    city: "St. Louis", state: "MO", metro: "St. Louis, MO",        x: 581, y: 285, slug: "st-louis-estate-slate",               system: "Natural Slate · Purple/Grey/Green", scope: "Full Slate Restoration",   blurb: "Purple, grey, and green natural Vermont slate over a St. Louis estate, detailed for Midwest freeze-thaw.", image: "assets/projects/st-louis-estate-slate/01.webp" },
  { name: "Coastal California Estate · Composite Slate",      city: "Carmel", state: "CA", metro: "Carmel, CA",               x: 46,  y: 270, slug: "carmel-coastal-slate",                system: "DaVinci Composite Slate · Coastal", scope: "Coastal Composite Slate",  blurb: "DaVinci Multi-Width composite slate on a Pacific-coast estate, specified for salt-air exposure.", image: "assets/projects/carmel-coastal-slate/01.webp" },
  { name: "Plano Estate · DaVinci Slate",                     city: "Plano", state: "TX", metro: "Dallas–Fort Worth, TX",   x: 463, y: 413, slug: "plano-davinci-slate",                 system: "DaVinci Composite Slate",           scope: "Estate Re-Roof",           blurb: "DaVinci composite slate with the depth of quarried stone and a Class 4 impact rating.", image: "assets/projects/plano-davinci-slate/01.webp" },
  { name: "Westlake Estate · Designer Shingle + Copper",      city: "Westlake", state: "TX", metro: "Dallas–Fort Worth, TX", x: 453, y: 413, slug: "westlake-designer-shingle",            system: "CertainTeed Belmont · Copper",      scope: "Estate New Construction",  blurb: "CertainTeed Belmont designer-shingle field with hand-formed copper turrets and estate depth.", image: "assets/projects/westlake-designer-shingle/01.webp" },
  { name: "St. Louis Residence · Ludowici Clay Tile",         city: "St. Louis", state: "MO", metro: "St. Louis, MO",        x: 579, y: 283, slug: "st-louis-ludowici-tile",               system: "Clay Tile · Ludowici S-Tile",       scope: "Clay Tile Restoration",    blurb: "Ludowici S-profile clay tile, hand-blended and detailed in copper at every transition.", image: "assets/projects/st-louis-ludowici-tile/01.webp" },
  { name: "Institutional Clay Tile · Hand-Reset Restoration", city: "Dallas", state: "TX", metro: "Dallas–Fort Worth, TX",  x: 460, y: 419, slug: "dallas-parish-clay",                  system: "Commercial · Clay Tile",            scope: "Institutional Restoration",blurb: "Institutional clay tile carefully unstacked, salvaged, and re-laid over new underlayment.", image: "assets/projects/dallas-parish-clay/01.webp" },
  // 2026-06-18: curated portfolio jobs added to the map (flagship + new work). DFW
  // entries fold into the existing Dallas–Fort Worth cluster; coords sit near the DFW
  // centroid since clustering hides exact position. Chris joins the St. Louis cluster.
  { name: "Highland Park Estate · Variegated Slate & Copper", city: "Highland Park", state: "TX", metro: "Dallas–Fort Worth, TX", x: 461, y: 416, slug: "highland-park-variegated-slate-copper", system: "Natural Slate · Purple/Grey/Green", scope: "Full Slate Restoration",   blurb: "Hand-blended purple, grey, and green natural slate over a Highland Park Tudor, detailed in copper at every ridge, valley, and penetration.", image: "assets/projects/highland-park-variegated-slate-copper/01.webp" },
  { name: "Highland Park Residence · Custom Vermont Slate",   city: "Highland Park", state: "TX", metro: "Dallas–Fort Worth, TX", x: 462, y: 418, slug: "highland-park-lorraine-slate",          system: "Natural Slate · Custom Blend",      scope: "Full Slate Restoration",   blurb: "A custom seven-color Vermont slate blend over a Highland Park residence, hand-blended and detailed in copper.", image: "assets/projects/highland-park-lorraine-slate/01.webp" },
  { name: "Dallas Residence · Brava Composite Slate",         city: "Dallas", state: "TX", metro: "Dallas–Fort Worth, TX",       x: 459, y: 418, slug: "dallas-brava-slate",                   system: "Composite Slate · Brava Multi-Width", scope: "Composite Slate Re-Roof", blurb: "Brava Multi-Width composite slate in Light Arendale over a Dallas residence, with copper at the eaves and valleys.", image: "assets/projects/dallas-brava-slate/01.webp" },
  { name: "Colleyville Residence · CertainTeed Grand Manor",  city: "Colleyville", state: "TX", metro: "Dallas–Fort Worth, TX",  x: 452, y: 412, slug: "colleyville-grand-manor",             system: "CertainTeed Grand Manor · Designer Shingle", scope: "Designer Shingle Re-Roof", blurb: "A CertainTeed Grand Manor roof with the depth of natural slate, detailed in copper at the turret and valleys.", image: "assets/projects/colleyville-grand-manor/06.webp" },
  { name: "Flower Mound Estate · Spanish S-Tile",             city: "Flower Mound", state: "TX", metro: "Dallas–Fort Worth, TX", x: 455, y: 410, slug: "flower-mound-s-tile",                  system: "Clay Tile · Westlake 1-Piece S",    scope: "Tile Roof",                blurb: "Westlake 1-Piece S clay tile in Madera Rustic across a sprawling Flower Mound estate.", image: "assets/projects/flower-mound-s-tile/01.webp" },
  { name: "St. Louis Residence · La Escandella Clay Tile",    city: "St. Louis", state: "MO", metro: "St. Louis, MO",            x: 580, y: 284, slug: "st-louis-la-escandella-tile",         system: "Clay Tile · La Escandella Spanish S", scope: "Clay Tile Restoration",  blurb: "La Escandella Spanish S clay tile in H-Selection Provence over a St. Louis residence, with hand-formed copper.", image: "assets/projects/st-louis-la-escandella-tile/01.webp" },
  // 2026-06-17 (Jack): upcoming jobs added for geographic reach, no photos yet, so these
  // carry `coming: true` (the existing "Project Coming" pin/popup treatment) and no `slug`/`image`
  // (popup shows the badge instead of a thumbnail + deep-link). x/y from the same affine lat/lng
  // fit as the rest (see comment above; residuals <3px on all anchors). KC client name omitted per
  // no-client-names rule; the Cheyenne cathedral is an institutional landmark name and is retained.
  { name: "Wisconsin Estate · Natural Slate",                city: "Madison", state: "WI", metro: "Wisconsin",            x: 601, y: 174, coming: true, system: "Natural Slate",            scope: "Full Slate Restoration",   blurb: "An upcoming natural-slate estate restoration in Wisconsin, scheduled for August 2026." },
  { name: "Kansas City Residence · Natural Slate",           city: "Kansas City", state: "MO", metro: "Kansas City, MO",   x: 508, y: 263, coming: true, system: "Natural Slate",            scope: "Full Slate Restoration",   blurb: "An upcoming natural-slate residence in the Kansas City metro." },
  { name: "St. Joseph's Catholic Cathedral · Cheyenne, WY",  city: "Cheyenne", state: "WY", metro: "Cheyenne, WY",         x: 340, y: 190, coming: true, system: "Specialty · Cathedral Roofing", scope: "Cathedral Restoration",    blurb: "An upcoming cathedral restoration at St. Joseph's in Cheyenne, Wyoming." },
];

// Hero variants A/C, featured projects with real photos.
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
  { slug: "highland-park-variegated-slate-copper", name: "Highland Park Estate · Variegated Slate & Copper", image: "assets/projects/highland-park-variegated-slate-copper/02.webp" },
  { slug: "westlake-designer-shingle",  name: "Westlake Estate · Designer Shingle + Copper", image: "assets/projects/westlake-designer-shingle/hero.webp" },
  { slug: "carmel-coastal-slate",       name: "Coastal California Estate · Composite Slate", image: "assets/projects/carmel-coastal-slate/01.webp" },
];

// Three reasons we see roofs fail, replaces the era-based HistoricalContext per
// Jack's 2026-05-29 feedback. Mirrors the homepage SystemsNote framing.
// TODO(jack): provide company-cam failure photos for each reason.
const THREE_REASONS = [
  {
    num: "01",
    title: "Felt",
    subtitle: "What you don't see is what determines whether a roof leaks.",
    body: "We replace many roofs because they have an old #30 lb felt underneath or a failed ice and water shield. We cover all specialty roofs we install in a high-temperature ice and water shield. This is above industry standard. It is our own standard.",
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
    body: "Failures come from not using the proper material, copper or steel that will corrode long after the slate or tile ever would, or from over- and under-driven nails that let wind-driven rain in. The fastener holding the roof determines whether the system reaches its rated life.",
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

// Lifecycle ROI, expanded from slate-vs-asphalt to all 5 materials Jack confirmed
// on 2026-05-29 (asphalt 30, synthetic 50, metal 50, clay 75, slate 150).
const LIFECYCLE_MATERIALS = [
  { key: "asphalt",   name: "Asphalt Shingle",   years: 30,  tone: "hot",   note: "5 full replacements in 150 years", segments: 5 },
  { key: "synthetic", name: "Synthetic Slate",   years: 50,  tone: "cool",  note: "3 full replacements in 150 years", segments: 3 },
  { key: "metal",     name: "Metal · Standing Seam", years: 50, tone: "steel", note: "3 full replacements in 150 years", segments: 3 },
  { key: "clay",      name: "Clay Tile",         years: 75,  tone: "copper", note: "2 full replacements in 150 years", segments: 2 },
  { key: "slate",     name: "Natural Slate",     years: 150, tone: "slate", note: "One installation",                  segments: 1 },
];

// Materials page install process, replaces the previous Portfolio-style steps.
const INSTALL_STEPS = [
  { num: "01", title: "Material Arrives & QC", body: "Every bundle and crate is inspected on delivery against the original purchase order: profile, color, lot number, and quantity. Variants outside spec get refused before they ever reach the roof." },
  { num: "02", title: "Tear-Off & Decking",    body: "We strip in controlled sections so the structure is never exposed beyond what we can dry in the same day. Deck condition is documented; structural plywood or solid 1× nailing surface replaces anything that has lost integrity." },
  { num: "03", title: "Underlayment & Flashing", body: "Self-adhered membrane rated for the substrate above. Copper, lead, or stainless flashings hand-formed on site at every wall, chimney, valley, and penetration before the field material is touched." },
  { num: "04", title: "Field Installation",    body: "The same crew that assessed the roof installs it. Stainless or copper-only fasteners, torqued to manufacturer spec. Every course is checked before the next begins." },
  { num: "05", title: "Final Walkthrough",     body: "Owner walkthrough, written documentation of all work performed, and a punch-list of any future conditions to monitor. You receive the package before final payment, not after." },
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
          "assets/discontinued/fiber-cement-asbestos/02.webp",
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
        images: ["assets/discontinued/heinz-clay-tile/01.webp"],
      },
      {
        title: "Mineral Wells Tile Co.",
        sub: "c. Early–Mid 20th Century · Mineral Wells, Texas",
        desc: "A prominent historic manufacturer based in Mineral Wells, Texas. Mineral Wells tiles are characterized by richly colored, artisanal clay with a distinctly varied 'bee-hive' kiln firing that creates buff-to-flashed tones. A single original batch naturally contains a blend of buffs, deep rust-reds, oranges, and smoky browns. Because they were fired in historic regional kilns, each tile is today classified as a reclaimed antique building material.",
        images: ["assets/discontinued/mineral-wells-tile/01.webp"],
      },
      {
        title: "Mound City Roofing Tile Co.",
        sub: "c. 1900–1930s · St. Louis, Missouri",
        desc: "Organized to serve the booming Midwestern building market, Mound City manufactured a full line of terra-cotta roofing tile from high-grade Missouri shale. Their 'Catalog D' (c. 1911) survives in the National Building Arts Center archive and documents a comprehensive product line: interlocking Spanish, Mission, Greek, and shingle profiles, plus a full accessory suite. Available in natural burnt-red or full-glazed finishes in green, yellow, blue, brown, and black.",
        images: ["assets/discontinued/mound-city-tile/01.webp"],
      },
      {
        title: "Cincinnati Roofing Tile & Terra Cotta Co.",
        sub: "c. 1890s–Early 20th Century · Cincinnati, Ohio",
        desc: "Founded between 1895 and 1898 by Jacob Freund, the Cincinnati Roofing Tile & Terra Cotta Company operated a highly mechanized plunger-press plant in the Winton Place neighborhood of Cincinnati. Known for their vitrified 'True S'-style Spanish tiles, their products are documented on prominent historic buildings including the East Lake Golf Club clubhouse and the Atlanta Post Office. Their original catalogues are preserved in the HathiTrust Digital Library.",
        images: ["assets/discontinued/cincinnati-roofing-tile/01.webp"],
      },
      {
        title: "B. Mifflin Hood Brick Co.",
        sub: "c. 1904–1940s · Atlanta, Georgia",
        desc: "Founded by ceramicist and theologian Benjamin Mifflin Hood in Atlanta in 1904, the company expanded to six plants across Georgia, North Carolina, Tennessee, and Alabama. Hood pioneered shale-based clay-tile production in the American South and was known for distinctively matte, hand-pressed aesthetics. Signature shades included deep natural reds and 'Fire Flashed Autumn,' a multi-toned mottled brown and orange. The company dissolved in 1946, and its Atlanta showroom was added to the National Register of Historic Places in 2018.",
        images: ["assets/discontinued/mifflin-hood-tile/01.webp"],
      },
      {
        title: "Gladding, McBean & Co.",
        sub: "Est. 1875 · Lincoln, California",
        desc: "Gladding, McBean has produced architectural terra-cotta and clay roof tile in Lincoln, California since 1875 and remains one of the few historic American makers still operating. Their roof-tile lines, including the interlocking Mission, Spanish, and French profiles, sit on landmark homes and institutional buildings across the West. Many original profiles and glazes have been retired over the decades, so a discontinued Gladding, McBean roof is matched from salvage stock or a custom run rather than an off-the-shelf part.",
        images: ["assets/discontinued/gladding-mcbean-tile/01.webp"],
      },
      {
        title: "Sharps Brand Clay Roof Tile",
        sub: "c. 1890s–1940s · Denver, Colorado Region",
        desc: "Sharps tiles were widely used across the Rocky Mountain West and Great Plains, prized for their highly vitrified, dense clay and exceptional resistance to freeze-thaw cycles. Their signature product was a French-style interlocking tile with a pronounced center rib, slightly smaller than Ludowici's French but similar in character. Sharps tiles remain on thousands of homes across Colorado, Kansas, Nebraska, and surrounding states.",
        images: ["assets/discontinued/sharps-clay-tile/01.webp"],
      },
    ],
  },
  Synthetic: {
    label: "Synthetics: Rubber and Plastic",
    items: [
      {
        title: "DaVinci Bellaforté Slate & Shake",
        sub: "Composite Slate & Shake · Often Combined",
        desc: "DaVinci Bellaforté has failed in numerous ways. First, each piece had a tab at the bottom right corner connecting it with the subsequent piece. This has struggled under wind, but more importantly under the expansion and contraction that comes with freeze-thaw cycles. The inability to move has led to cracking right at the bottom right corner of almost every piece, which is then exacerbated by high winds. Second, the UV stabilizer has failed, which causes the plastic to thin out and show the backing of the material, weakening each piece's durability.",
        images: [
          "assets/discontinued/davinci-bellaforte/01.webp",
          "assets/discontinued/davinci-bellaforte/02.webp",
          "assets/discontinued/davinci-bellaforte/03.webp",
          "assets/discontinued/davinci-bellaforte/04.webp",
        ],
      },
      {
        title: "EcoStar Majestic Slate (Carlisle)",
        sub: "Rubberized Synthetic Slate",
        desc: "EcoStar Majestic is a rubberized synthetic slate with a history of curling due to thermal cycles and the material itself. Curling is when the bottom corner peels upward, exposing the nail holes and allowing leaks. The rubber also became faulty, allowing crack lines along the nail line. We have replaced dozens of these across the country.",
        images: ["assets/discontinued/ecostar-majestic/01.webp"],
      },
      {
        title: "TAMKO Lamarite Slate",
        sub: "Discontinued · Manufacturing Defects",
        desc: "TAMKO Lamarite Slate was discontinued due to manufacturing defects that caused the composite formulation to prematurely degrade, resulting in severe embrittlement, cracking, and curling. Because this synthetic material is no longer produced, proper repairs cannot be made to match the existing footprint; consequently, any verified storm or wind damage can frequently justify a comprehensive, insurance-funded total roof replacement.",
        images: ["assets/discontinued/tamko-lamarite/01.webp"],
      },
      {
        title: "Royal DuraSlate",
        sub: "Discontinued · Royal Building Products",
        desc: "Royal Dura-Slate was permanently discontinued by Royal Building Products after formula issues caused the synthetic composite shingles to experience severe 'cupping,' curling, and warping within just a few years of installation. This rapid structural distortion broke the roof's interlocking integrity, leading to compromised weather barriers, water intrusion, and internal leaking.",
        images: ["assets/discontinued/royal-duraslate/01.webp"],
      },
      {
        title: "CertainTeed Symphony Slate",
        sub: "Discontinued June 2018 · CertainTeed",
        desc: "CertainTeed Symphony Slate was discontinued following widespread field performance issues, including severe UV degradation, cracking, and perimeter curling. This early-generation composite material failed to maintain its structural integrity over long-term weather exposure, compromising the roof's interlocking system and weather barrier.",
      },
    ],
  },
  "Concrete Tile": {
    label: "Concrete Tile",
    items: [
      {
        title: "Monier / LifeTile / Boral",
        sub: "No Longer Produced in North America",
        desc: "Monier (later LifeTile and Boral, now Westlake Royal Building Products) concrete tiles are no longer produced in North America. Only salvage or replication options exist. Discontinued profiles include Saxony, Capri, Villa, Spanish 'S' Nuevo, and the flat and S-profile Lifetile lines (often stamped 'Boral Lifetile BUSA'). We document the original profile for insurance and HOA submissions.",
        images: ["assets/discontinued/monier-lifetile-boral/01.webp"],
      },
      {
        title: "Newpoint Concrete Roof Tiles",
        sub: "Westlake Royal · Katy, TX Profiles",
        desc: "Newpoint concrete roof tiles produced at the Katy, Texas plant, including the Tejas España, Barcelona Impact, and Saxony profiles, are out of production. Matching requires salvage stock or a compatible-profile substitution, which we document for HOA and insurance review.",
        images: ["assets/discontinued/newpoint-concrete/01.webp"],
      },
      {
        title: "Eagle Roofing: Double Eagle",
        sub: "Discontinued Concrete Profile",
        desc: "The Double Eagle profile from Eagle Roofing Products has been discontinued. As with most discontinued concrete tile, mixing current profiles into the field creates interlock and wind-uplift incompatibilities, so we document the original and plan a matched repair or full section replacement rather than a mismatched patch.",
        images: ["assets/discontinued/eagle-double-eagle/01.webp"],
      },
    ],
  },
  "Designer Shingles": {
    label: "Designer Asphalt Shingles",
    items: [
      {
        title: "GAF Designer Shingles",
        sub: "Discontinued Luxury & Designer Lines",
        desc: "GAF's discontinued designer shingles include Country Mansion (and Ultra Premium / Country Mansion 2), Camelot and Camelot Ultra, Grand Slate and Grand Slate 2, Capstone, Timberline Grande, Monaco, and Sienna, plus discontinued colorways of still-current lines such as Grand Canyon, Slateline (e.g. Sedona Sunset), and Woodland / Glenwood. These profiles and colors are no longer produced, so a matched repair depends on salvage stock, but often results in replacement.",
        images: ["assets/discontinued/gaf-designer/01.webp"],
        imgCaption: "Pictured: GAF Capstone",
      },
      {
        title: "CertainTeed Designer Shingles",
        sub: "Discontinued Luxury Profiles",
        desc: "CertainTeed's discontinued luxury / designer asphalt shingles include Centennial Slate (2010), Landmark TL Impact-Resistant (2012), Hatteras (2016), Highland Slate IR (2019), and Arcadia (2020). These profiles are no longer produced, so a matched repair depends on salvage stock, but often results in replacement.",
        images: ["assets/discontinued/certainteed-designer/01.webp"],
        imgCaption: "Pictured: CertainTeed Centennial Slate",
      },
      {
        title: "Atlas StormMaster Slate",
        sub: "Discontinued Designer Shingle",
        desc: "Storm Master Slate was sold as a Class IV designer shingle for the cost of a standard architectural shingle, but sometimes things are too good to be true. The adhesive at the butt of these shingles fails and leads to melting and/or exacerbated wind damage, which exposes the nail heads of the course below and can lead to leaking.",
        images: [
          "assets/discontinued/atlas-stormmaster/01.webp",
          "assets/discontinued/atlas-stormmaster/02.webp",
        ],
      },
    ],
  },
  Underlayment: {
    label: "Underlayment",
    items: [
      {
        title: "TAMKO TW Underlayment",
        sub: "Discontinued Synthetic · Tile & Slate Substrate",
        desc: "TAMKO's TW synthetic underlayment was specified beneath tile and slate before it was pulled from the line. We document where it was used, check for the brittleness and seam separation it develops under heat load, and re-underlay with a self-adhered membrane rated for the material above, saving the tile or slate wherever it remains serviceable.",
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
    body: "What you don't see is what determines whether a roof leaks. We replace many roofs because they have an old #30 lb felt underneath or a failed ice and water shield. We cover all specialty roofs we install in a high-temperature ice and water shield, above industry standard, our own standard.",
    image: "https://images.unsplash.com/photo-1605000797499-95a51c5269ae?w=1200&auto=format&fit=crop&q=80",
  },
  {
    num: "02 / 03",
    title: "Fasteners",
    body: "Not using the proper material, copper or steel that corrodes long after the slate or tile ever would, or over- and under-driven nails that let wind-driven rain in. The fastener decides whether the system reaches its rated life.",
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
    bio: "A decade of historic exterior restoration across the DFW Metroplex. Jack founded Priority Designer in 2016 with a singular focus: do the work that mass-market contractors won't: source discontinued profiles, hand-form copper flashings, and stand behind every fastener. Bio and photo coming soon.",
    image: "",
  },
];

Object.assign(window, {
  MANUFACTURERS, PROJECTS, MAP_PROJECTS, DISCONTINUED, ROOF_SYSTEMS, PARTNERS, PRESERVATION, TRADE_CIVIC, CERTIFICATIONS, TRUST, NAV_ITEMS, TEAM, TESTIMONIALS,
  HERO_TOP_FIVE, THREE_REASONS, LIFECYCLE_MATERIALS, INSTALL_STEPS, INSTALL_STEP_PHOTOS,
});
