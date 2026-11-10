export const INITIAL_PRODUCTS = [
  // ===================== WOMEN'S COLLECTION =====================
  {
    id: "krmu-w-01",
    name: "Oversized Minimalist Trench Coat",
    slug: "oversized-minimalist-trench-coat",
    category: "women",
    subcategory: "outerwear",
    badge: "New Season",
    isNewArrival: true,
    isBestseller: true,
    price: 8999,
    originalPrice: 11999,
    stock: 6,
    rating: 4.9,
    reviewCount: 38,
    images: [
      "https://images.unsplash.com/photo-1544441893-675973e31985?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=1200&auto=format&fit=crop"
    ],
    colors: [
      { name: "Raw Sand", hex: "#D8CCBC" },
      { name: "Onyx Black", hex: "#1A1A1A" },
      { name: "Warm Olive", hex: "#5C5843" }
    ],
    sizes: ["XS", "S", "M", "L", "XL"],
    description: "Architectural drape meets timeless functionalism. Cut from heavy water-repellent organic cotton gabardine, featuring a storm flap, drop shoulders, horn buttons, and an exaggerated belt that can be cinched tight or worn loose.",
    details: [
      "100% Organic Heavyweight Cotton Gabardine",
      "Signature double-layer storm collar with throat latch",
      "Genuine recycled buffalo horn buttons",
      "Full cupro lining for effortless layering"
    ],
    care: "Dry clean only. Store on shaped wooden hanger.",
    fit: "Designed for a modern oversized silhouette. True to size.",
    reviews: [
      { id: "rev-w-1", author: "Meera Sen", rating: 5, date: "2026-10-14", verified: true, title: "Perfection in craftsmanship", comment: "The weight and drape of this trench coat are unmatched. It feels like high-end designer pieces." }
    ]
  },
  {
    id: "krmu-w-02",
    name: "Pure Mulberry Silk Bias Slip Dress",
    slug: "pure-mulberry-silk-bias-slip-dress",
    category: "women",
    subcategory: "dresses",
    badge: "Editor's Pick",
    isNewArrival: true,
    isBestseller: true,
    price: 6799,
    originalPrice: 8499,
    stock: 4,
    rating: 4.9,
    reviewCount: 29,
    images: [
      "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=1200&auto=format&fit=crop"
    ],
    colors: [
      { name: "Champagne Lustre", hex: "#D6C6A5" },
      { name: "Midnight Onyx", hex: "#111215" },
      { name: "Terracotta Rouge", hex: "#9E4839" }
    ],
    sizes: ["XS", "S", "M", "L"],
    description: "An evening staple engineered with a pure diagonal bias grain that skims your natural contours without clinging. Features delicate adjustable French rouleau straps.",
    details: [
      "100% 22-Momme Grade 6A Mulberry Silk",
      "French seams throughout for skin comfort",
      "Subtle side-slit hem for effortless movement"
    ],
    care: "Hand wash cold with silk detergent or dry clean.",
    fit: "Fluid drape. Designed to float gently over curves.",
    reviews: []
  },
  {
    id: "krmu-w-03",
    name: "Pleated Wide-Leg Studio Trouser",
    slug: "pleated-wide-leg-studio-trouser",
    category: "women",
    subcategory: "trousers",
    badge: "Bestseller",
    isNewArrival: false,
    isBestseller: true,
    price: 4999,
    originalPrice: 6299,
    stock: 7,
    rating: 4.8,
    reviewCount: 53,
    images: [
      "https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1551803091-e20673f15770?q=80&w=1200&auto=format&fit=crop"
    ],
    colors: [
      { name: "Warm Taupe", hex: "#9E9080" },
      { name: "Midnight Black", hex: "#18181A" },
      { name: "Bone Ecru", hex: "#E9E5DB" }
    ],
    sizes: ["XS", "S", "M", "L", "XL"],
    description: "High-waisted trousers with deep front double pleats that cascade down into an expansive wide-leg hem. Tailored with an internal grip waistband.",
    details: [
      "Wool-viscose blend with fluid drape",
      "High-rise with clean tailored waistband",
      "Concealed zip fly and hook-and-bar closure"
    ],
    care: "Dry clean or gentle hand wash with wool detergent.",
    fit: "High waist with dramatic wide leg.",
    reviews: []
  },
  {
    id: "krmu-w-04",
    name: "Sculptural Ribbed Knit Cardigan",
    slug: "sculptural-ribbed-knit-cardigan",
    category: "women",
    subcategory: "outerwear",
    badge: "New Arrival",
    isNewArrival: true,
    isBestseller: false,
    price: 5299,
    originalPrice: 6999,
    stock: 9,
    rating: 4.8,
    reviewCount: 22,
    images: [
      "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1485968579580-b6d095142e6e?q=80&w=1200&auto=format&fit=crop"
    ],
    colors: [
      { name: "Oatmeal Heather", hex: "#E4DCD3" },
      { name: "Espresso", hex: "#382923" },
      { name: "Deep Indigo", hex: "#1C2536" }
    ],
    sizes: ["XS", "S", "M", "L"],
    description: "Knitted in 7-gauge pure extrafine Merino wool. Features a deep V-neckline, bell sleeves, and genuine freshwater shell closures.",
    details: [
      "100% Australian Extrafine Merino Wool",
      "Zero-waste 3D knit construction",
      "Natural mother-of-pearl buttons"
    ],
    care: "Hand wash cold with wool wash. Dry flat.",
    fit: "Relaxed body with architectural wide sleeves.",
    reviews: []
  },
  {
    id: "krmu-w-05",
    name: "Japanese Poplin Sculpted Shirtdress",
    slug: "japanese-poplin-sculpted-shirtdress",
    category: "women",
    subcategory: "dresses",
    badge: "Atelier Classic",
    isNewArrival: false,
    isBestseller: true,
    price: 5899,
    originalPrice: 7499,
    stock: 11,
    rating: 4.9,
    reviewCount: 31,
    images: [
      "https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1200&auto=format&fit=crop"
    ],
    colors: [
      { name: "Crisp Porcelain", hex: "#F7F5F0" },
      { name: "Sky Mist", hex: "#9EB6C2" },
      { name: "Noir", hex: "#151515" }
    ],
    sizes: ["XS", "S", "M", "L"],
    description: "Woven in Okayama from 120-count high-density cotton poplin. Features asymmetric hidden placket buttons and an adjustable tie sash.",
    details: [
      "100% Long-Staple Japanese Cotton Poplin",
      "Removable sash belt with architectural buckle",
      "Mother-of-pearl buttons"
    ],
    care: "Machine wash delicate cold. Hang dry.",
    fit: "Tailored shoulders falling into an A-line skirt.",
    reviews: []
  },
  {
    id: "krmu-w-06",
    name: "Double-Faced Cashmere Wrap Coat",
    slug: "double-faced-cashmere-wrap-coat",
    category: "women",
    subcategory: "outerwear",
    badge: "Couture Edition",
    isNewArrival: true,
    isBestseller: true,
    price: 14999,
    originalPrice: 18999,
    stock: 3,
    rating: 5.0,
    reviewCount: 17,
    images: [
      "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1544441893-675973e31985?q=80&w=1200&auto=format&fit=crop"
    ],
    colors: [
      { name: "Camel Melton", hex: "#A9815B" },
      { name: "Charcoal Heather", hex: "#343438" }
    ],
    sizes: ["S", "M", "L"],
    description: "Hand-finished double-faced cashmere with invisible split-edge seams. Features an oversized shawl collar and tie belt.",
    details: [
      "90% Cashmere, 10% Extra-Fine Virgin Wool",
      "Hand-sewn edges with no visible machine stitching",
      "Unlined for pure natural breathability"
    ],
    care: "Specialist dry clean only.",
    fit: "Relaxed drape designed for layering over chunky knitwear.",
    reviews: []
  },
  {
    id: "krmu-w-07",
    name: "Mulberry Silk Satin Bias Maxi Skirt",
    slug: "mulberry-silk-satin-bias-maxi-skirt",
    category: "women",
    subcategory: "trousers",
    badge: "Bestseller",
    isNewArrival: false,
    isBestseller: true,
    price: 4899,
    originalPrice: 6199,
    stock: 8,
    rating: 4.8,
    reviewCount: 44,
    images: [
      "https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?q=80&w=1200&auto=format&fit=crop"
    ],
    colors: [
      { name: "Espresso Gloss", hex: "#31231E" },
      { name: "Silver Moonlight", hex: "#C5C7CA" },
      { name: "Golden Sand", hex: "#D2BF9D" }
    ],
    sizes: ["XS", "S", "M", "L"],
    description: "An effortless slip maxi skirt tailored with an elasticated waistband and fluid ankle sweep.",
    details: [
      "100% Pure Mulberry Silk",
      "Bias cut that glides over hips",
      "Enclosed elastic waistband"
    ],
    care: "Hand wash cold or dry clean.",
    fit: "True to size. Flows into a delicate fluted hem.",
    reviews: []
  },
  {
    id: "krmu-w-08",
    name: "Architectural Linen Halter Blouse",
    slug: "architectural-linen-halter-blouse",
    category: "women",
    subcategory: "tops",
    badge: "Summer Atelier",
    isNewArrival: true,
    isBestseller: false,
    price: 2899,
    originalPrice: 3699,
    stock: 14,
    rating: 4.7,
    reviewCount: 19,
    images: [
      "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1200&auto=format&fit=crop"
    ],
    colors: [
      { name: "Flax Ecru", hex: "#EBE3D5" },
      { name: "Terracotta Earth", hex: "#A8533F" }
    ],
    sizes: ["XS", "S", "M", "L"],
    description: "High-neck halter top in enzyme-washed Normandy linen featuring open back ties and sculptural pleating.",
    details: [
      "100% Certified European Flax Linen",
      "Self-tie neck and back closures",
      "Double lined bodice"
    ],
    care: "Machine wash cold delicate.",
    fit: "Close fit across the chest, relaxing at waist.",
    reviews: []
  },

  // ===================== MEN'S COLLECTION =====================
  {
    id: "krmu-m-01",
    name: "Architectural Double-Breasted Blazer",
    slug: "architectural-double-breasted-blazer",
    category: "men",
    subcategory: "outerwear",
    badge: "Bestseller",
    isNewArrival: false,
    isBestseller: true,
    price: 9499,
    originalPrice: 12499,
    stock: 8,
    rating: 4.8,
    reviewCount: 47,
    images: [
      "https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?q=80&w=1200&auto=format&fit=crop"
    ],
    colors: [
      { name: "Charcoal Slate", hex: "#2A2E33" },
      { name: "Espresso Brown", hex: "#3B2F2F" },
      { name: "Ecru Ivory", hex: "#EBE5D8" }
    ],
    sizes: ["S", "M", "L", "XL"],
    description: "Sharp peak lapels balanced by soft, unpadded shoulders for structured ease. Cut from a breathable high-twist wool blend with natural stretch.",
    details: [
      "75% Super 120s Wool, 25% Fine Mulberry Silk",
      "Unstructured roped shoulder with soft canvas chest piece",
      "Working cuff buttonholes with mother-of-pearl hardware"
    ],
    care: "Specialist dry clean only. Steam refresh recommended.",
    fit: "Tailored contemporary fit. Model wears size M.",
    reviews: []
  },
  {
    id: "krmu-m-02",
    name: "Relaxed Organic Linen Overshirt",
    slug: "relaxed-organic-linen-overshirt",
    category: "men",
    subcategory: "tops",
    badge: "Sustainable",
    isNewArrival: true,
    isBestseller: false,
    price: 3499,
    originalPrice: 4499,
    stock: 12,
    rating: 4.7,
    reviewCount: 31,
    images: [
      "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?q=80&w=1200&auto=format&fit=crop"
    ],
    colors: [
      { name: "Pure Chalk", hex: "#F5F3EF" },
      { name: "Desert Sage", hex: "#8A9483" },
      { name: "Washed Navy", hex: "#2B3A4A" }
    ],
    sizes: ["S", "M", "L", "XL", "XXL"],
    description: "Woven from Normandy flax and washed with pumice stones for immediate softness. Cut boxy with twin chest utility pockets.",
    details: [
      "100% French Normandy Flax Linen",
      "Garment enzyme washed to eliminate shrinkage",
      "Double needle felled seams for longevity"
    ],
    care: "Machine wash cold inside-out on gentle cycle.",
    fit: "Boxy, relaxed drape. True to size.",
    reviews: []
  },
  {
    id: "krmu-m-03",
    name: "Pleated Tapered Wool Trouser",
    slug: "pleated-tapered-wool-trouser",
    category: "men",
    subcategory: "trousers",
    badge: "Tailored",
    isNewArrival: true,
    isBestseller: true,
    price: 5499,
    originalPrice: 7299,
    stock: 11,
    rating: 4.9,
    reviewCount: 36,
    images: [
      "https://images.unsplash.com/photo-1479064555552-3ef4979f8908?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=1200&auto=format&fit=crop"
    ],
    colors: [
      { name: "Charcoal Marl", hex: "#323336" },
      { name: "Rich Camel", hex: "#A87A4A" },
      { name: "Midnight Navy", hex: "#19202E" }
    ],
    sizes: ["30", "32", "34", "36", "38"],
    description: "Rooted in classic Savile Row tailoring with modern relaxed proportions. High rise with single reverse pleats and side waist adjusters.",
    details: [
      "100% Wool Flannel from Biella, Italy",
      "Stainless steel side tab adjusters",
      "Split back waistband for bespoke comfort"
    ],
    care: "Dry clean only. Steam press as needed.",
    fit: "Roomy through the thigh tapering cleanly to a 7.5\" leg opening.",
    reviews: []
  },
  {
    id: "krmu-m-04",
    name: "Heavyweight Supima Cotton Raw Tee",
    slug: "heavyweight-supima-cotton-raw-tee",
    category: "men",
    subcategory: "tops",
    badge: "Essentials",
    isNewArrival: false,
    isBestseller: true,
    price: 1899,
    originalPrice: 2499,
    stock: 25,
    rating: 4.9,
    reviewCount: 88,
    images: [
      "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?q=80&w=1200&auto=format&fit=crop"
    ],
    colors: [
      { name: "Bone White", hex: "#FAF8F2" },
      { name: "Cast Iron", hex: "#222326" },
      { name: "Vintage Moss", hex: "#4C5446" }
    ],
    sizes: ["S", "M", "L", "XL", "XXL"],
    description: "Engineered from 280 GSM extra-long staple Supima cotton. Offers a substantial structured drape that never loses its shape.",
    details: [
      "280 GSM American Supima combed cotton",
      "Dense 1x1 rib knit collar that resists stretching",
      "Blind-stitched cuffs and hem"
    ],
    care: "Machine wash cold with like colors.",
    fit: "Slightly boxy, relaxed modern cut.",
    reviews: []
  },
  {
    id: "krmu-m-05",
    name: "Minimalist Italian Wool Overcoat",
    slug: "minimalist-italian-wool-overcoat",
    category: "men",
    subcategory: "outerwear",
    badge: "Couture Edition",
    isNewArrival: true,
    isBestseller: true,
    price: 12999,
    originalPrice: 16999,
    stock: 5,
    rating: 4.9,
    reviewCount: 27,
    images: [
      "https://images.unsplash.com/photo-1544441893-675973e31985?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=1200&auto=format&fit=crop"
    ],
    colors: [
      { name: "Midnight Noir", hex: "#111114" },
      { name: "Vicuna Camel", hex: "#B8864E" }
    ],
    sizes: ["S", "M", "L", "XL"],
    description: "Calf-length overcoat cut from 650 GSM heavy Italian wool melton. Features concealed horn button placket and deep welt hand pockets.",
    details: [
      "100% Virgin Italian Melton Wool",
      "Full Bemberg cupro lining for smooth glide",
      "Internal chest wallet and passport pockets"
    ],
    care: "Dry clean only.",
    fit: "Substantial architectural silhouette.",
    reviews: []
  },
  {
    id: "krmu-m-06",
    name: "Cashmere-Silk Knit Polo",
    slug: "cashmere-silk-knit-polo",
    category: "men",
    subcategory: "tops",
    badge: "New Arrival",
    isNewArrival: true,
    isBestseller: false,
    price: 4999,
    originalPrice: 6499,
    stock: 10,
    rating: 4.8,
    reviewCount: 23,
    images: [
      "https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?q=80&w=1200&auto=format&fit=crop"
    ],
    colors: [
      { name: "Alabaster Cream", hex: "#F2EDE4" },
      { name: "Navy Heather", hex: "#1C2738" },
      { name: "Earthy Taupe", hex: "#8A7D70" }
    ],
    sizes: ["S", "M", "L", "XL"],
    description: "A decadent 16-gauge blend of Grade-A Mongolian cashmere and fine mulberry silk. Features a collar without buttons for clean minimal lines.",
    details: [
      "70% Cashmere, 30% Mulberry Silk",
      "Seamless knitted collar that rests flat",
      "Ribbed cuffs and waistband"
    ],
    care: "Hand wash cold or dry clean.",
    fit: "Tailored fit that skims the torso comfortably.",
    reviews: []
  },
  {
    id: "krmu-m-07",
    name: "Japanese Selvedge Denim Trouser",
    slug: "japanese-selvedge-denim-trouser",
    category: "men",
    subcategory: "trousers",
    badge: "Limited Drop",
    isNewArrival: true,
    isBestseller: true,
    price: 6499,
    originalPrice: 8299,
    stock: 9,
    rating: 4.9,
    reviewCount: 41,
    images: [
      "https://images.unsplash.com/photo-1542272604-780c96856592?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=1200&auto=format&fit=crop"
    ],
    colors: [
      { name: "Raw Indigo", hex: "#1B283E" },
      { name: "Cast Black", hex: "#18181A" }
    ],
    sizes: ["30", "32", "34", "36"],
    description: "Woven on vintage shuttle looms in Kojima, Japan from 14oz raw selvedge cotton. Finished with custom copper rivets and red-line ticker.",
    details: [
      "14oz Kuroki Mills Raw Selvedge Denim",
      "Reinforced rear pocket lining with hidden rivets",
      "Solid brass button fly"
    ],
    care: "Wear dry for 6 months before first cold soak.",
    fit: "Straight leg with gentle taper below knee.",
    reviews: []
  },
  {
    id: "krmu-m-08",
    name: "Relaxed Poplin Camp Collar Shirt",
    slug: "relaxed-poplin-camp-collar-shirt",
    category: "men",
    subcategory: "tops",
    badge: "Essentials",
    isNewArrival: false,
    isBestseller: true,
    price: 2999,
    originalPrice: 3899,
    stock: 18,
    rating: 4.7,
    reviewCount: 52,
    images: [
      "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=1200&auto=format&fit=crop"
    ],
    colors: [
      { name: "Optic Chalk", hex: "#FAF8F5" },
      { name: "Slate Blue", hex: "#4B6178" },
      { name: "Dusty Olive", hex: "#5C6351" }
    ],
    sizes: ["S", "M", "L", "XL", "XXL"],
    description: "Crisp 80s two-ply organic cotton poplin shirt with Cuban camp collar and straight hem with side vents.",
    details: [
      "100% Organic GOTS Certified Cotton Poplin",
      "Straight hem designed to be worn untucked",
      "Genuine freshwater shell buttons"
    ],
    care: "Machine wash cold. Warm iron.",
    fit: "Relaxed easy fit.",
    reviews: []
  },

  // ===================== ATELIER ACCESSORIES =====================
  {
    id: "krmu-a-01",
    name: "Full-Grain Leather Minimalist Tote",
    slug: "full-grain-leather-minimalist-tote",
    category: "accessories",
    subcategory: "accessories",
    badge: "Atelier Classic",
    isNewArrival: true,
    isBestseller: true,
    price: 7999,
    originalPrice: 9999,
    stock: 5,
    rating: 5.0,
    reviewCount: 33,
    images: [
      "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?q=80&w=1200&auto=format&fit=crop"
    ],
    colors: [
      { name: "Tuscan Cognac", hex: "#7E4826" },
      { name: "Onyx Black", hex: "#141416" }
    ],
    sizes: ["One Size"],
    description: "Handcrafted from vegetable-tanned full-grain leather that patinas with beauty. Padded 15-inch laptop compartment inside.",
    details: [
      "Vegetable-tanned full-grain calf leather",
      "Solid antique brass hardware",
      "Magnetic top clasp and interior zip pocket"
    ],
    care: "Wipe with damp cloth. Apply natural leather balm biannually.",
    fit: "Spacious everyday tote. Fits 16\" laptop easily.",
    reviews: []
  },
  {
    id: "krmu-a-02",
    name: "Pure Handwoven Pashmina Stole",
    slug: "pure-handwoven-pashmina-stole",
    category: "accessories",
    subcategory: "accessories",
    badge: "Heritage Edition",
    isNewArrival: false,
    isBestseller: true,
    price: 6999,
    originalPrice: 8999,
    stock: 7,
    rating: 5.0,
    reviewCount: 28,
    images: [
      "https://images.unsplash.com/photo-1607522370275-f14206abe5d3?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?q=80&w=1200&auto=format&fit=crop"
    ],
    colors: [
      { name: "Natural Ivory", hex: "#EFEBE2" },
      { name: "Charcoal Ash", hex: "#3A3B3E" },
      { name: "Rich Cinnamon", hex: "#8F4B2E" }
    ],
    sizes: ["One Size"],
    description: "Spun from Changthangi mountain goat fleece and hand-loomed in Kashmir. Featherlight yet exceptionally warm.",
    details: [
      "100% Certified Authentic Pashmina",
      "Hand-spun on wooden charkha",
      "Traditional eyelash fringe hem"
    ],
    care: "Specialist dry clean only.",
    fit: "Generous 200cm x 70cm proportions.",
    reviews: []
  }
];

export const CATEGORIES = [
  { id: "all", name: "All Collection", description: "The complete KRMU repertoire" },
  { id: "men", name: "Men", description: "Directional tailoring & elevated essentials" },
  { id: "women", name: "Women", description: "Sculptural forms & effortless drapery" },
  { id: "new-arrivals", name: "New Arrivals", description: "Latest drops from the seasonal atelier" },
  { id: "accessories", name: "Accessories", description: "Handcrafted leather & artisanal textiles" }
];
