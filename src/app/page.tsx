"use client";

import React, { useState, useEffect, useMemo, useRef } from 'react';

// ============================================
// TYPE DEFINITIONS
// ============================================
type ClothingItem = {
  name: string;
  imageKey: string; // Primary image key (first variant)
  imageVariants: string[]; // Array of all image variants for this item
  selectedVariant?: number; // Index of selected variant (0-based)
};

// Generic outfit type that works for all groups
type Outfit = {
  // Primary clothing items (names vary by group)
  top: ClothingItem;        // Shirt/Top/T-shirt/Dress/Top
  bottom: ClothingItem;     // Pants/Skirt/Jeans/Bottom
  shoes: ClothingItem;      // Shoes for all groups
  accessory1: ClothingItem; // Watch/Bag/Sneakers (for Boy)
  accessory2: ClothingItem; // Accessories/Jewelry/None
  // Metadata
  tip: string;
  tags: string[];
  rating: number;
  formalityLevel?: number; // 0-100: 0-30 Street, 31-70 Smart Casual, 71-100 Formal
};

// Category labels for each group
type CategoryLabels = {
  top: string;
  bottom: string;
  shoes: string;
  accessory1: string;
  accessory2: string;
};

const CATEGORY_LABELS: Record<string, CategoryLabels> = {
  men: {
    top: 'Shirt',
    bottom: 'Pants',
    shoes: 'Shoes',
    accessory1: 'Watch',
    accessory2: 'Accessories'
  },
  women: {
    top: 'Top',
    bottom: 'Bottom',
    shoes: 'Shoes',
    accessory1: 'Bag',
    accessory2: 'Jewelry'
  },
  boy: {
    top: 'T-Shirt',
    bottom: 'Jeans',
    shoes: 'Sneakers',
    accessory1: 'Cap',
    accessory2: 'Extras'
  },
  girl: {
    top: 'Top',
    bottom: 'Bottom',
    shoes: 'Shoes',
    accessory1: 'Bag',
    accessory2: 'Accessories'
  }
};

// ============================================
// HELPER: Create clothing item with multiple image variants
// ============================================
const item = (name: string, ...imageVariants: string[]): ClothingItem => ({
  name,
  imageKey: imageVariants[0] || '',
  imageVariants: imageVariants.length > 0 ? imageVariants : [''],
  selectedVariant: 0
});

// Helper to get the currently selected image key from a clothing item
const getSelectedImageKey = (item: ClothingItem): string => {
  const variantIndex = item.selectedVariant ?? 0;
  return item.imageVariants[variantIndex] || item.imageKey || '';
};

// ============================================
// HELPER: Calculate formality level from items
// ============================================
const calculateFormalityLevel = (outfit: Omit<Outfit, 'formalityLevel'>): number => {
  let score = 50; // Start at middle (Smart Casual)
  
  const topName = outfit.top.name.toLowerCase();
  const bottomName = outfit.bottom.name.toLowerCase();
  const shoesName = outfit.shoes.name.toLowerCase();
  const acc1Name = outfit.accessory1.name.toLowerCase();
  
  // Top formality adjustments
  if (topName.includes('tee') || topName.includes('graphic') || topName.includes('hoodie') || topName.includes('sweatshirt') || topName.includes('t-shirt')) {
    score -= 25;
  } else if (topName.includes('henley') || topName.includes('flannel') || topName.includes('crop')) {
    score -= 15;
  } else if (topName.includes('polo') || topName.includes('knit') || topName.includes('blouse')) {
    score -= 5;
  } else if (topName.includes('oxford') || topName.includes('button') || topName.includes('shirt')) {
    score += 10;
  } else if (topName.includes('blazer') || topName.includes('silk') || topName.includes('dinner') || topName.includes('velvet') || topName.includes('dress')) {
    score += 25;
  }
  
  // Bottom formality adjustments
  if (bottomName.includes('jogger') || bottomName.includes('shorts') || bottomName.includes('mini')) {
    score -= 20;
  } else if (bottomName.includes('distressed') || bottomName.includes('denim') || bottomName.includes('jeans')) {
    score -= 10;
  } else if (bottomName.includes('chino') || bottomName.includes('skirt')) {
    score += 5;
  } else if (bottomName.includes('dress') || bottomName.includes('wool') || bottomName.includes('trouser') || bottomName.includes('slacks')) {
    score += 15;
  }
  
  // Shoes formality adjustments
  if (shoesName.includes('sneaker') || shoesName.includes('canvas') || shoesName.includes('slip')) {
    score -= 15;
  } else if (shoesName.includes('boot') || shoesName.includes('chelsea')) {
    score += 5;
  } else if (shoesName.includes('loafer') || shoesName.includes('derby') || shoesName.includes('flat') || shoesName.includes('heel')) {
    score += 10;
  } else if (shoesName.includes('patent') || shoesName.includes('oxford') || shoesName.includes('pump')) {
    score += 20;
  }
  
  // Accessory1 formality adjustments (watch/bag/cap)
  if (acc1Name.includes('digital') || acc1Name.includes('casio') || acc1Name.includes('apple') || acc1Name.includes('cap') || acc1Name.includes('backpack')) {
    score -= 10;
  } else if (acc1Name.includes('dress') || acc1Name.includes('gold') || acc1Name.includes('ceramic') || acc1Name.includes('tote') || acc1Name.includes('clutch')) {
    score += 10;
  }
  
  // Clamp between 0 and 100
  return Math.max(0, Math.min(100, score));
};

// ============================================
// HELPER: Add formality level to outfit
// ============================================
const outfitWithFormality = (outfit: Omit<Outfit, 'formalityLevel'>): Outfit => ({
  ...outfit,
  formalityLevel: calculateFormalityLevel(outfit)
});

// ============================================
// OUTFITS DATA - MEN
// ============================================
const MEN_OUTFITS: Record<string, Record<string, Record<string, Outfit[]>>> = {
  college: {
    black: {
      casual: [
        { top: item("Washed White Tee", "shirt-white-tee"), bottom: item("Slim Black Jeans", "pants-black-jeans"), shoes: item("Black Low Sneakers", "shoes-black-sneakers"), accessory1: item("Digital Casio", "watch-casio"), accessory2: item("Canvas Backpack", "acc-backpack"), tip: "Roll sleeves for campus cool. Keep it effortless.", tags: ["Casual", "Street"], rating: 0 },
        { top: item("Navy Polo", "shirt-navy-polo"), bottom: item("Khaki Chinos", "pants-khaki-chinos"), shoes: item("Black Derby", "shoes-black-derby"), accessory1: item("Minimalist Leather Watch", "watch-leather"), accessory2: item("Silver Ring", "acc-ring"), tip: "Tuck in for smart-casual lectures.", tags: ["Smart", "Clean"], rating: 0 }
      ],
      confident: [
        { top: item("Charcoal Henley", "shirt-charcoal-henley"), bottom: item("Black Skinny Jeans", "pants-black-skinny"), shoes: item("Black Combat Boots", "shoes-black-boots"), accessory1: item("Matte Black Chronograph", "watch-black-chrono"), accessory2: item("Leather Bracelet Stack", "acc-bracelet"), tip: "Unbutton top two for confident edge.", tags: ["Bold", "Edgy"], rating: 0 },
        { top: item("Burgundy Oxford", "shirt-burgundy-oxford"), bottom: item("Dark Grey Trousers", "pants-grey-trousers"), shoes: item("Black Loafers", "shoes-black-loafers"), accessory1: item("Rose Gold Minimalist", "watch-rose-gold"), accessory2: item("Tortoise Sunglasses", "acc-sunglasses"), tip: "Roll sleeves to show that watch.", tags: ["Sophisticated", "Bold"], rating: 0 }
      ],
      minimal: [
        { top: item("Heather Grey Tee", "shirt-grey-tee"), bottom: item("Black Joggers", "pants-black-joggers"), shoes: item("Black Slip-Ons", "shoes-black-slip"), accessory1: item("White Minimalist Watch", "watch-white-minimal"), accessory2: item("None", ""), tip: "Less is more. Quality over quantity.", tags: ["Minimal", "Clean"], rating: 0 },
        { top: item("Crisp White Button-Up", "shirt-white-button"), bottom: item("Black Chinos", "pants-black-chinos"), shoes: item("Black Canvas", "shoes-black-canvas"), accessory1: item("Slim Silver Watch", "watch-silver"), accessory2: item("None", ""), tip: "Keep it clean, keep it simple.", tags: ["Minimal", "Preppy"], rating: 0 }
      ]
    },
    white: {
      casual: [
        { top: item("Oversized Graphic Tee", "shirt-graphic-tee"), bottom: item("Light Wash Denim", "pants-light-denim"), shoes: item("White Air Force 1s", "shoes-white-af1"), accessory1: item("Apple Watch", "watch-apple"), accessory2: item("Crossbody Bag", "acc-crossbody"), tip: "Fresh whites make everything pop.", tags: ["Fresh", "Casual"], rating: 0 },
        { top: item("Striped Rugby", "shirt-rugby"), bottom: item("Navy Chinos", "pants-navy-chinos"), shoes: item("White Canvas Sneakers", "shoes-white-canvas"), accessory1: item("Timex Weekender", "watch-timex"), accessory2: item("Beanie", "acc-beanie"), tip: "Classic campus vibes never fail.", tags: ["Preppy", "Casual"], rating: 0 }
      ],
      confident: [
        { top: item("Cream Linen Shirt", "shirt-cream-linen"), bottom: item("Olive Chinos", "pants-olive-chinos"), shoes: item("White Leather Sneakers", "shoes-white-leather"), accessory1: item("Gold Chain Watch", "watch-gold-chain"), accessory2: item("Gold Necklace", "acc-necklace"), tip: "Light colors, confident energy.", tags: ["Bold", "Summer"], rating: 0 },
        { top: item("White Denim Jacket", "shirt-white-denim"), bottom: item("Black Jeans", "pants-black-jeans-2"), shoes: item("White High-Tops", "shoes-white-hightop"), accessory1: item("Silver Chrono", "watch-silver-chrono"), accessory2: item("Diamond Studs", "acc-diamonds"), tip: "Statement piece for the bold.", tags: ["Statement", "Bold"], rating: 0 }
      ],
      minimal: [
        { top: item("Pure White Tee", "shirt-pure-white"), bottom: item("Grey Wool Trousers", "pants-grey-wool"), shoes: item("White Minimal Sneakers", "shoes-white-minimal"), accessory1: item("White Ceramic Watch", "watch-white-ceramic"), accessory2: item("None", ""), tip: "Monochrome mastery in motion.", tags: ["Minimal", "Clean"], rating: 0 },
        { top: item("Sand Knit Polo", "shirt-sand-polo"), bottom: item("Cream Chinos", "pants-cream-chinos"), shoes: item("White Loafers", "shoes-white-loafers"), accessory1: item("Thin Gold Watch", "watch-thin-gold"), accessory2: item("None", ""), tip: "Tonal dressing at its finest.", tags: ["Minimal", "Neutral"], rating: 0 }
      ]
    },
    brown: {
      casual: [
        { top: item("Earth Tone Flannel", "shirt-flannel"), bottom: item("Distressed Denim", "pants-distressed"), shoes: item("Brown Desert Boots", "shoes-brown-desert"), accessory1: item("Wooden Watch", "watch-wooden"), accessory2: item("Canvas Tote", "acc-tote"), tip: "Earthy tones for autumn campus.", tags: ["Earthy", "Casual"], rating: 0 },
        { top: item("Cream Sweatshirt", "shirt-cream-sweat"), bottom: item("Olive Joggers", "pants-olive-joggers"), shoes: item("Tan Sneakers", "shoes-tan-sneakers"), accessory1: item("Leather Cuff", "watch-leather-cuff"), accessory2: item("Wool Cap", "acc-cap"), tip: "Cozy meets cool effortlessly.", tags: ["Cozy", "Casual"], rating: 0 }
      ],
      confident: [
        { top: item("Camel Overcoat", "shirt-camel-coat"), bottom: item("Charcoal Trousers", "pants-charcoal"), shoes: item("Brown Chelsea Boots", "shoes-brown-chelsea"), accessory1: item("Vintage Gold Watch", "watch-vintage-gold"), accessory2: item("Silk Pocket Square", "acc-pocket-square"), tip: "Stand out with warm confidence.", tags: ["Dapper", "Bold"], rating: 0 },
        { top: item("Mustard Knit", "shirt-mustard-knit"), bottom: item("Navy Chinos", "pants-navy-chinos-2"), shoes: item("Brown Brogues", "shoes-brown-brogues"), accessory1: item("Brown Leather Chrono", "watch-brown-chrono"), accessory2: item("Tortoise Frames", "acc-frames"), tip: "Bold colors, confident you.", tags: ["Colorful", "Bold"], rating: 0 }
      ],
      minimal: [
        { top: item("Beige Merino Tee", "shirt-beige-merino"), bottom: item("Tan Chinos", "pants-tan-chinos"), shoes: item("Brown Suede Loafers", "shoes-brown-suede"), accessory1: item("Minimalist Leather Watch", "watch-leather-2"), accessory2: item("None", ""), tip: "Neutral palette, maximum impact.", tags: ["Neutral", "Minimal"], rating: 0 },
        { top: item("Stone Linen Shirt", "shirt-stone-linen"), bottom: item("Khaki Shorts", "pants-khaki-shorts"), shoes: item("Brown Boat Shoes", "shoes-brown-boat"), accessory1: item("Rope Bracelet", "watch-rope"), accessory2: item("None", ""), tip: "Effortless summer minimal.", tags: ["Summer", "Minimal"], rating: 0 }
      ]
    }
  },
  date: {
    black: {
      casual: [
        { top: item("Burgundy Henley", "shirt-burgundy-henley"), bottom: item("Dark Jeans", "pants-dark-jeans"), shoes: item("Black Boots", "shoes-black-boots-2"), accessory1: item("Leather Band Watch", "watch-leather-band"), accessory2: item("Silver Bracelet", "acc-silver-bracelet"), tip: "Dark and mysterious for romance.", tags: ["Romantic", "Casual"], rating: 0 },
        { top: item("Navy Sweater", "shirt-navy-sweater"), bottom: item("Black Jeans", "pants-black-jeans-3"), shoes: item("Black Chelsea Boots", "shoes-black-chelsea"), accessory1: item("Minimal Black Watch", "watch-black-minimal"), accessory2: item("Leather Belt", "acc-belt"), tip: "Comfortable but date-ready.", tags: ["Cozy", "Date-Ready"], rating: 0 }
      ],
      confident: [
        { top: item("Jet Black Silk Shirt", "shirt-black-silk"), bottom: item("Black Slim Trousers", "pants-black-slim"), shoes: item("Black Chelsea Boots", "shoes-black-chelsea-2"), accessory1: item("Silver Chronograph", "watch-silver-chrono-2"), accessory2: item("Gold Chain", "acc-gold-chain"), tip: "All black with gold = quiet power.", tags: ["Confident", "Luxury"], rating: 0 },
        { top: item("Matte Black Blazer", "shirt-black-blazer"), bottom: item("Black Dress Pants", "pants-black-dress"), shoes: item("Black Patent Oxfords", "shoes-black-patent"), accessory1: item("Black Ceramic Watch", "watch-black-ceramic"), accessory2: item("Onyx Cufflinks", "acc-cufflinks"), tip: "Own the room without saying a word.", tags: ["Power", "Luxury"], rating: 0 }
      ],
      minimal: [
        { top: item("Black Knit Polo", "shirt-black-polo"), bottom: item("Black Slim Chinos", "pants-black-slim-chinos"), shoes: item("Black Minimal Sneakers", "shoes-black-minimal"), accessory1: item("Ultra-Thin Watch", "watch-ultra-thin"), accessory2: item("None", ""), tip: "Less effort, more impact.", tags: ["Minimal", "Elegant"], rating: 0 },
        { top: item("Charcoal Turtleneck", "shirt-charcoal-turtle"), bottom: item("Black Wool Trousers", "pants-black-wool"), shoes: item("Black Ankle Boots", "shoes-black-ankle"), accessory1: item("Silver Mesh Watch", "watch-silver-mesh"), accessory2: item("None", ""), tip: "Steve Jobs meets James Bond.", tags: ["Minimal", "Sophisticated"], rating: 0 }
      ]
    },
    white: {
      casual: [
        { top: item("Light Blue Linen", "shirt-blue-linen"), bottom: item("Cream Chinos", "pants-cream-chinos-2"), shoes: item("White Sneakers", "shoes-white-sneakers"), accessory1: item("Brown Leather Watch", "watch-brown-leather"), accessory2: item("Woven Bracelet", "acc-woven"), tip: "Fresh and approachable.", tags: ["Fresh", "Romantic"], rating: 0 },
        { top: item("White Henley", "shirt-white-henley"), bottom: item("Light Wash Jeans", "pants-light-wash"), shoes: item("White Canvas", "shoes-white-canvas-2"), accessory1: item("Wooden Watch", "watch-wooden-2"), accessory2: item("Leather Wrap", "acc-leather-wrap"), tip: "Daytime date perfection.", tags: ["Daytime", "Casual"], rating: 0 }
      ],
      confident: [
        { top: item("Cream Dinner Jacket", "shirt-cream-dinner"), bottom: item("Black Trousers", "pants-black-trousers"), shoes: item("White Patent Shoes", "shoes-white-patent"), accessory1: item("Rose Gold Dress Watch", "watch-rose-dress"), accessory2: item("Black Bow Tie", "acc-bow-tie"), tip: "White jacket energy is unmatched.", tags: ["Bold", "Formal"], rating: 0 },
        { top: item("Ivory Silk Button-Up", "shirt-ivory-silk"), bottom: item("Grey Dress Pants", "pants-grey-dress"), shoes: item("White Loafers", "shoes-white-loafers-2"), accessory1: item("Gold Dress Watch", "watch-gold-dress"), accessory2: item("Pocket Square", "acc-pocket-square-2"), tip: "Light colors demand attention.", tags: ["Statement", "Elegant"], rating: 0 }
      ],
      minimal: [
        { top: item("White Oxford", "shirt-white-oxford"), bottom: item("Navy Chinos", "pants-navy-chinos-3"), shoes: item("White Minimal Sneakers", "shoes-white-minimal-2"), accessory1: item("White Minimal Watch", "watch-white-minimal-2"), accessory2: item("None", ""), tip: "Classic, clean, confident.", tags: ["Classic", "Minimal"], rating: 0 },
        { top: item("Cream Cashmere Crew", "shirt-cream-cashmere"), bottom: item("Off-White Trousers", "pants-off-white"), shoes: item("White Leather Sneakers", "shoes-white-leather-2"), accessory1: item("Silver Ultra-Thin", "watch-silver-ultra"), accessory2: item("None", ""), tip: "Tonal elegance at its best.", tags: ["Tonal", "Minimal"], rating: 0 }
      ]
    },
    brown: {
      casual: [
        { top: item("Olive Knit Polo", "shirt-olive-polo"), bottom: item("Tan Chinos", "pants-tan-chinos-2"), shoes: item("Brown Boots", "shoes-brown-boots"), accessory1: item("Green Dial Watch", "watch-green-dial"), accessory2: item("Suede Belt", "acc-suede-belt"), tip: "Earth tones show depth.", tags: ["Earthy", "Romantic"], rating: 0 },
        { top: item("Rust Sweater", "shirt-rust-sweater"), bottom: item("Dark Denim", "pants-dark-denim"), shoes: item("Brown Desert Boots", "shoes-brown-desert-2"), accessory1: item("Leather Band Watch", "watch-leather-3"), accessory2: item("Wool Scarf", "acc-scarf"), tip: "Warm colors, warm heart.", tags: ["Warm", "Cozy"], rating: 0 }
      ],
      confident: [
        { top: item("Cognac Leather Jacket", "shirt-cognac-leather"), bottom: item("Black Jeans", "pants-black-jeans-4"), shoes: item("Brown Cowboy Boots", "shoes-brown-cowboy"), accessory1: item("Vintage Gold", "watch-vintage-2"), accessory2: item("Silver Ring", "acc-ring-2"), tip: "Leather and confidence go together.", tags: ["Edgy", "Bold"], rating: 0 },
        { top: item("Tan Blazer", "shirt-tan-blazer"), bottom: item("Navy Trousers", "pants-navy-trousers"), shoes: item("Brown Double Monks", "shoes-brown-monks"), accessory1: item("Gold Chronograph", "watch-gold-chrono"), accessory2: item("Pocket Square", "acc-pocket-square-3"), tip: "Sophisticated warmth.", tags: ["Dapper", "Warm"], rating: 0 }
      ],
      minimal: [
        { top: item("Sand Knit", "shirt-sand-knit"), bottom: item("Khaki Chinos", "pants-khaki-chinos-2"), shoes: item("Brown Suede Sneakers", "shoes-brown-suede-sneak"), accessory1: item("Beige Minimal Watch", "watch-beige-minimal"), accessory2: item("None", ""), tip: "Desert minimalism.", tags: ["Neutral", "Minimal"], rating: 0 },
        { top: item("Taupe Long Sleeve", "shirt-taupe-long"), bottom: item("Olive Chinos", "pants-olive-chinos-2"), shoes: item("Tan Loafers", "shoes-tan-loafers"), accessory1: item("Brown Mesh Watch", "watch-brown-mesh"), accessory2: item("None", ""), tip: "Understated elegance.", tags: ["Muted", "Elegant"], rating: 0 }
      ]
    }
  },
  party: {
    black: {
      casual: [
        { top: item("Graphic Black Tee", "shirt-graphic-black"), bottom: item("Distressed Denim", "pants-distressed-2"), shoes: item("Black High-Tops", "shoes-black-hightop"), accessory1: item("Apple Watch", "watch-apple-2"), accessory2: item("Chain Necklace", "acc-chain"), tip: "Club casual done right.", tags: ["Edgy", "Casual"], rating: 0 },
        { top: item("Black Bomber Jacket", "shirt-black-bomber"), bottom: item("Grey Joggers", "pants-grey-joggers"), shoes: item("Black Sneakers", "shoes-black-sneakers-2"), accessory1: item("Digital Casio", "watch-casio-2"), accessory2: item("Snapback", "acc-snapback"), tip: "Street style party vibes.", tags: ["Street", "Casual"], rating: 0 }
      ],
      confident: [
        { top: item("Sequin Black Shirt", "shirt-sequin-black"), bottom: item("Black Slim Pants", "pants-black-slim-pants"), shoes: item("Black Patent Loafers", "shoes-black-patent-loaf"), accessory1: item("Diamond Watch", "watch-diamond"), accessory2: item("Gold Chain", "acc-gold-chain-2"), tip: "Shine bright in the dark.", tags: ["Flashy", "Bold"], rating: 0 },
        { top: item("Velvet Black Blazer", "shirt-velvet-blazer"), bottom: item("Black Dress Pants", "pants-black-dress-2"), shoes: item("Black Velvet Slippers", "shoes-black-velvet"), accessory1: item("Black Diamond Watch", "watch-black-diamond"), accessory2: item("Pocket Square", "acc-pocket-square-4"), tip: "Velvet is power at night.", tags: ["Luxury", "Night"], rating: 0 }
      ],
      minimal: [
        { top: item("Black Mock Neck", "shirt-black-mock"), bottom: item("Black Tailored Pants", "pants-black-tailored"), shoes: item("Black Minimal Sneakers", "shoes-black-minimal-2"), accessory1: item("Black Ceramic Watch", "watch-black-ceramic-2"), accessory2: item("None", ""), tip: "Let the fit speak.", tags: ["Clean", "Night"], rating: 0 },
        { top: item("Black Mesh Top", "shirt-black-mesh"), bottom: item("Black Skinny Jeans", "pants-black-skinny-2"), shoes: item("Black Chelsea Boots", "shoes-black-chelsea-3"), accessory1: item("None", ""), accessory2: item("Silver Earring", "acc-earring"), tip: "Minimal but memorable.", tags: ["Edgy", "Minimal"], rating: 0 }
      ]
    },
    white: {
      casual: [
        { top: item("White Oversized Tee", "shirt-white-oversized"), bottom: item("Light Wash Denim", "pants-light-denim-2"), shoes: item("White Platform Sneakers", "shoes-white-platform"), accessory1: item("Apple Watch", "watch-apple-3"), accessory2: item("Bucket Hat", "acc-bucket"), tip: "Fresh party energy.", tags: ["Fresh", "Casual"], rating: 0 },
        { top: item("White Cropped Jacket", "shirt-white-cropped"), bottom: item("High-Waist Jeans", "pants-high-waist"), shoes: item("White Chunky Sneakers", "shoes-white-chunky"), accessory1: item("Silver Watch", "watch-silver-2"), accessory2: item("Mini Bag", "acc-mini-bag"), tip: "Y2K party vibes.", tags: ["Trendy", "Fresh"], rating: 0 }
      ],
      confident: [
        { top: item("White Sequin Jacket", "shirt-white-sequin"), bottom: item("White Trousers", "pants-white-trousers"), shoes: item("White Patent Shoes", "shoes-white-patent-2"), accessory1: item("Diamond Watch", "watch-diamond-2"), accessory2: item("Crystal Cufflinks", "acc-crystal"), tip: "All white everything.", tags: ["Statement", "Bold"], rating: 0 },
        { top: item("Pearl Button-Up", "shirt-pearl-button"), bottom: item("Cream Dress Pants", "pants-cream-dress"), shoes: item("White Loafers", "shoes-white-loafers-3"), accessory1: item("Mother of Pearl Watch", "watch-pearl"), accessory2: item("Gold Chain", "acc-gold-chain-3"), tip: "Ivory party perfection.", tags: ["Elegant", "Luxury"], rating: 0 }
      ],
      minimal: [
        { top: item("White Minimalist Shirt", "shirt-white-minimal"), bottom: item("White Slim Pants", "pants-white-slim"), shoes: item("White Leather Sneakers", "shoes-white-leather-3"), accessory1: item("White Ceramic Watch", "watch-white-ceramic-2"), accessory2: item("None", ""), tip: "Monochrome mastery.", tags: ["Monochrome", "Clean"], rating: 0 },
        { top: item("Cream Knit Top", "shirt-cream-knit"), bottom: item("Off-White Trousers", "pants-off-white-2"), shoes: item("White Minimal Sneakers", "shoes-white-minimal-3"), accessory1: item("Silver Mesh Watch", "watch-silver-mesh-2"), accessory2: item("None", ""), tip: "Clean lines, no noise.", tags: ["Tonal", "Minimal"], rating: 0 }
      ]
    },
    brown: {
      casual: [
        { top: item("Camel Shirt Jacket", "shirt-camel-jacket"), bottom: item("Olive Jeans", "pants-olive-jeans"), shoes: item("Brown Sneakers", "shoes-brown-sneakers"), accessory1: item("Wooden Watch", "watch-wooden-3"), accessory2: item("Fedora", "acc-fedora"), tip: "Boho party energy.", tags: ["Boho", "Casual"], rating: 0 },
        { top: item("Rust Corduroy Shirt", "shirt-rust-corduroy"), bottom: item("Tan Jeans", "pants-tan-jeans"), shoes: item("Brown Chukka Boots", "shoes-brown-chukka"), accessory1: item("Brown Leather Watch", "watch-brown-leather-2"), accessory2: item("Beaded Bracelet", "acc-beaded"), tip: "Earthy party vibes.", tags: ["Vintage", "Warm"], rating: 0 }
      ],
      confident: [
        { top: item("Cognac Leather Jacket", "shirt-cognac-leather-2"), bottom: item("Black Jeans", "pants-black-jeans-5"), shoes: item("Brown Cowboy Boots", "shoes-brown-cowboy-2"), accessory1: item("Turquoise Watch", "watch-turquoise"), accessory2: item("Bolo Tie", "acc-bolo"), tip: "Western party dominance.", tags: ["Western", "Bold"], rating: 0 },
        { top: item("Tan Velvet Blazer", "shirt-tan-velvet"), bottom: item("Brown Dress Pants", "pants-brown-dress"), shoes: item("Brown Suede Loafers", "shoes-brown-suede-2"), accessory1: item("Gold Dress Watch", "watch-gold-dress-2"), accessory2: item("Pocket Square", "acc-pocket-square-5"), tip: "Velvet warmth stands out.", tags: ["Luxury", "Warm"], rating: 0 }
      ],
      minimal: [
        { top: item("Beige Linen Shirt", "shirt-beige-linen"), bottom: item("Sand Chinos", "pants-sand-chinos"), shoes: item("Tan Loafers", "shoes-tan-loafers-2"), accessory1: item("Brown Minimal Watch", "watch-brown-minimal"), accessory2: item("None", ""), tip: "Desert minimalist energy.", tags: ["Desert", "Minimal"], rating: 0 },
        { top: item("Stone Knit Top", "shirt-stone-knit"), bottom: item("Khaki Trousers", "pants-khaki-trousers"), shoes: item("Brown Suede Sneakers", "shoes-brown-suede-sneak-2"), accessory1: item("Rose Gold Watch", "watch-rose-gold-2"), accessory2: item("None", ""), tip: "Neutral party perfection.", tags: ["Neutral", "Clean"], rating: 0 }
      ]
    }
  }
};

// ============================================
// OUTFITS DATA - WOMEN
// ============================================
const WOMEN_OUTFITS: Record<string, Record<string, Record<string, Outfit[]>>> = {
  college: {
    black: {
      casual: [
        { top: item("Black Crop Top", "women-top-crop-black"), bottom: item("High Waist Jeans", "women-bottom-jeans"), shoes: item("Black Sneakers", "women-shoes-sneakers"), accessory1: item("Mini Backpack", "women-bag-backpack"), accessory2: item("Gold Hoops", "women-jewelry-hoops"), tip: "Effortless campus chic.", tags: ["Casual", "Trendy"], rating: 0 },
        { top: item("White Basic Tee", "women-top-tee-white"), bottom: item("Black Leggings", "women-bottom-leggings"), shoes: item("White Sneakers", "women-shoes-white-sneak"), accessory1: item("Canvas Tote", "women-bag-tote"), accessory2: item("Simple Necklace", "women-jewelry-necklace"), tip: "Comfort meets style for long classes.", tags: ["Comfortable", "Casual"], rating: 0 }
      ],
      confident: [
        { top: item("Black Blazer", "women-top-blazer-black"), bottom: item("Skinny Jeans", "women-bottom-skinny"), shoes: item("Ankle Boots", "women-shoes-ankle"), accessory1: item("Leather Tote", "women-bag-leather"), accessory2: item("Statement Earrings", "women-jewelry-statement"), tip: "Power through your day in style.", tags: ["Bold", "Professional"], rating: 0 }
      ],
      minimal: [
        { top: item("Black Turtleneck", "women-top-turtleneck"), bottom: item("Black Trousers", "women-bottom-trousers"), shoes: item("Black Loafers", "women-shoes-loafers"), accessory1: item("Minimalist Bag", "women-bag-minimal"), accessory2: item("None", ""), tip: "Monochrome magic.", tags: ["Minimal", "Elegant"], rating: 0 }
      ]
    },
    white: {
      casual: [
        { top: item("White Blouse", "women-top-blouse"), bottom: item("Blue Jeans", "women-bottom-blue-jeans"), shoes: item("White Canvas", "women-shoes-canvas"), accessory1: item("Crossbody Bag", "women-bag-crossbody"), accessory2: item("Delicate Bracelet", "women-jewelry-bracelet"), tip: "Fresh and ready for anything.", tags: ["Fresh", "Casual"], rating: 0 }
      ],
      confident: [
        { top: item("Cream Knit Sweater", "women-top-sweater"), bottom: item("White Skirt", "women-bottom-skirt"), shoes: item("White Heels", "women-shoes-heels"), accessory1: item("Structured Bag", "women-bag-structured"), accessory2: item("Gold Chain", "women-jewelry-chain"), tip: "Stand out effortlessly.", tags: ["Elegant", "Bold"], rating: 0 }
      ],
      minimal: [
        { top: item("White Tee", "women-top-tee"), bottom: item("Beige Chinos", "women-bottom-chinos"), shoes: item("White Flats", "women-shoes-flats"), accessory1: item("Simple Tote", "women-bag-simple"), accessory2: item("None", ""), tip: "Less is definitely more.", tags: ["Minimal", "Clean"], rating: 0 }
      ]
    },
    brown: {
      casual: [
        { top: item("Camel Sweater", "women-top-sweater-camel"), bottom: item("Dark Jeans", "women-bottom-dark-jeans"), shoes: item("Brown Boots", "women-shoes-boots"), accessory1: item("Leather Satchel", "women-bag-satchel"), accessory2: item("Stackable Rings", "women-jewelry-rings"), tip: "Cozy autumn vibes.", tags: ["Cozy", "Casual"], rating: 0 }
      ],
      confident: [
        { top: item("Burgundy Blouse", "women-top-blouse-burgundy"), bottom: item("Brown Skirt", "women-bottom-brown-skirt"), shoes: item("Knee High Boots", "women-shoes-knee-boots"), accessory1: item("Statement Bag", "women-bag-statement"), accessory2: item("Layered Necklaces", "women-jewelry-layered"), tip: "Rich tones for a bold look.", tags: ["Bold", "Autumn"], rating: 0 }
      ],
      minimal: [
        { top: item("Tan Cardigan", "women-top-cardigan"), bottom: item("Cream Pants", "women-bottom-cream"), shoes: item("Tan Flats", "women-shoes-tan-flats"), accessory1: item("Neutral Tote", "women-bag-neutral"), accessory2: item("None", ""), tip: "Neutral perfection.", tags: ["Neutral", "Minimal"], rating: 0 }
      ]
    }
  },
  date: {
    black: {
      casual: [
        { top: item("Black Lace Top", "women-top-lace"), bottom: item("Dark Jeans", "women-bottom-dark-jeans-2"), shoes: item("Black Heels", "women-shoes-heels-black"), accessory1: item("Clutch", "women-bag-clutch"), accessory2: item("Drop Earrings", "women-jewelry-drop"), tip: "Romantic and effortless.", tags: ["Romantic", "Date"], rating: 0 }
      ],
      confident: [
        { top: item("Little Black Dress", "women-top-dress-black"), bottom: item("Black Tights", "women-bottom-tights"), shoes: item("Stilettos", "women-shoes-stilettos"), accessory1: item("Evening Bag", "women-bag-evening"), accessory2: item("Diamond Studs", "women-jewelry-diamonds"), tip: "Classic date night perfection.", tags: ["Classic", "Elegant"], rating: 0 }
      ],
      minimal: [
        { top: item("Black Slip Dress", "women-top-slip"), bottom: item("Black Tights", "women-bottom-tights-2"), shoes: item("Black Boots", "women-shoes-boots-black"), accessory1: item("Mini Bag", "women-bag-mini"), accessory2: item("None", ""), tip: "Simple and stunning.", tags: ["Minimal", "Chic"], rating: 0 }
      ]
    },
    white: {
      casual: [
        { top: item("Floral Blouse", "women-top-floral"), bottom: item("White Jeans", "women-bottom-white-jeans"), shoes: item("Strappy Sandals", "women-shoes-sandals"), accessory1: item("Woven Bag", "women-bag-woven"), accessory2: item("Flower Earrings", "women-jewelry-flower"), tip: "Fresh and feminine.", tags: ["Feminine", "Fresh"], rating: 0 }
      ],
      confident: [
        { top: item("White Midi Dress", "women-top-dress-white"), bottom: item("White Slip", "women-bottom-slip"), shoes: item("White Heels", "women-shoes-heels-white"), accessory1: item("Pearl Clutch", "women-bag-pearl"), accessory2: item("Pearl Necklace", "women-jewelry-pearl"), tip: "Angelic and unforgettable.", tags: ["Elegant", "Statement"], rating: 0 }
      ],
      minimal: [
        { top: item("Cream Sweater", "women-top-cream"), bottom: item("White Pants", "women-bottom-white-pants"), shoes: item("Nude Flats", "women-shoes-nude"), accessory1: item("Beige Bag", "women-bag-beige"), accessory2: item("None", ""), tip: "Soft and sophisticated.", tags: ["Soft", "Minimal"], rating: 0 }
      ]
    },
    brown: {
      casual: [
        { top: item("Olive Top", "women-top-olive"), bottom: item("Brown Skirt", "women-bottom-brown"), shoes: item("Ankle Boots", "women-shoes-ankle-brown"), accessory1: item("Leather Bag", "women-bag-leather-brown"), accessory2: item("Earth Tone Jewelry", "women-jewelry-earth"), tip: "Natural beauty vibes.", tags: ["Natural", "Casual"], rating: 0 }
      ],
      confident: [
        { top: item("Rust Dress", "women-top-dress-rust"), bottom: item("Nude Slip", "women-bottom-nude-slip"), shoes: item("Brown Heels", "women-shoes-heels-brown"), accessory1: item("Gold Clutch", "women-bag-gold"), accessory2: item("Gold Jewelry", "women-jewelry-gold"), tip: "Warm and alluring.", tags: ["Warm", "Alluring"], rating: 0 }
      ],
      minimal: [
        { top: item("Beige Knit", "women-top-beige"), bottom: item("Tan Pants", "women-bottom-tan"), shoes: item("Brown Loafers", "women-shoes-loafers-brown"), accessory1: item("Tan Bag", "women-bag-tan"), accessory2: item("None", ""), tip: "Effortlessly elegant.", tags: ["Effortless", "Minimal"], rating: 0 }
      ]
    }
  },
  party: {
    black: {
      casual: [
        { top: item("Sequin Top", "women-top-sequin"), bottom: item("Black Jeans", "women-bottom-black-jeans"), shoes: item("Platform Heels", "women-shoes-platform"), accessory1: item("Mini Clutch", "women-bag-mini-clutch"), accessory2: item("Sparkly Earrings", "women-jewelry-sparkly"), tip: "Ready to dance!", tags: ["Party", "Sparkly"], rating: 0 }
      ],
      confident: [
        { top: item("Black Jumpsuit", "women-top-jumpsuit"), bottom: item("Black Tights", "women-bottom-tights-3"), shoes: item("Strappy Heels", "women-shoes-strappy"), accessory1: item("Statement Clutch", "women-bag-statement-clutch"), accessory2: item("Chandelier Earrings", "women-jewelry-chandelier"), tip: "Own the night.", tags: ["Bold", "Night"], rating: 0 }
      ],
      minimal: [
        { top: item("Black Tank", "women-top-tank"), bottom: item("Leather Pants", "women-bottom-leather"), shoes: item("Black Boots", "women-shoes-boots-party"), accessory1: item("Simple Bag", "women-bag-simple-black"), accessory2: item("None", ""), tip: "Edgy minimal.", tags: ["Edgy", "Minimal"], rating: 0 }
      ]
    },
    white: {
      casual: [
        { top: item("White Crop", "women-top-crop-white"), bottom: item("Silver Skirt", "women-bottom-silver"), shoes: item("White Platforms", "women-shoes-platforms-white"), accessory1: item("Metal Bag", "women-bag-metal"), accessory2: item("Silver Jewelry", "women-jewelry-silver"), tip: "Shine bright!", tags: ["Shiny", "Party"], rating: 0 }
      ],
      confident: [
        { top: item("White Gown", "women-top-gown"), bottom: item("White Slip", "women-bottom-slip-white"), shoes: item("Crystal Heels", "women-shoes-crystal"), accessory1: item("Beaded Clutch", "women-bag-beaded"), accessory2: item("Crystal Jewelry", "women-jewelry-crystal"), tip: "Be the star of the night.", tags: ["Glamorous", "Star"], rating: 0 }
      ],
      minimal: [
        { top: item("White Silk Top", "women-top-silk"), bottom: item("White Pants", "women-bottom-white-pants-2"), shoes: item("White Mules", "women-shoes-mules"), accessory1: item("White Clutch", "women-bag-white-clutch"), accessory2: item("None", ""), tip: "Pure elegance.", tags: ["Pure", "Elegant"], rating: 0 }
      ]
    },
    brown: {
      casual: [
        { top: item("Bronze Top", "women-top-bronze"), bottom: item("Brown Pants", "women-bottom-brown-pants"), shoes: item("Gold Heels", "women-shoes-gold"), accessory1: item("Embellished Bag", "women-bag-embellished"), accessory2: item("Bronze Jewelry", "women-jewelry-bronze"), tip: "Glow all night.", tags: ["Glow", "Party"], rating: 0 }
      ],
      confident: [
        { top: item("Gold Dress", "women-top-dress-gold"), bottom: item("Gold Slip", "women-bottom-gold-slip"), shoes: item("Metallic Heels", "women-shoes-metallic"), accessory1: item("Gold Clutch", "women-bag-gold-clutch"), accessory2: item("Statement Jewelry", "women-jewelry-statement-gold"), tip: "Be unforgettable.", tags: ["Unforgettable", "Gold"], rating: 0 }
      ],
      minimal: [
        { top: item("Tan Silk Top", "women-top-silk-tan"), bottom: item("Brown Skirt", "women-bottom-brown-skirt-2"), shoes: item("Tan Heels", "women-shoes-tan-heels"), accessory1: item("Neutral Bag", "women-bag-neutral-2"), accessory2: item("None", ""), tip: "Understated glamour.", tags: ["Glamour", "Understated"], rating: 0 }
      ]
    }
  }
};

// ============================================
// OUTFITS DATA - BOYS
// ============================================
const BOY_OUTFITS: Record<string, Record<string, Record<string, Outfit[]>>> = {
  college: {
    black: {
      casual: [
        { top: item("Black Graphic Tee", "boy-top-graphic-black"), bottom: item("Blue Jeans", "boy-bottom-jeans"), shoes: item("Black Sneakers", "boy-shoes-sneakers"), accessory1: item("Baseball Cap", "boy-cap-baseball"), accessory2: item("Wristband", "boy-extras-wristband"), tip: "Cool school vibes!", tags: ["Cool", "Casual"], rating: 0 }
      ],
      confident: [
        { top: item("Navy Hoodie", "boy-top-hoodie"), bottom: item("Black Joggers", "boy-bottom-joggers"), shoes: item("High Tops", "boy-shoes-hightops"), accessory1: item("Snapback Cap", "boy-cap-snapback"), accessory2: item("Chain", "boy-extras-chain"), tip: "Stand out in the halls!", tags: ["Bold", "Sporty"], rating: 0 }
      ],
      minimal: [
        { top: item("Grey T-Shirt", "boy-top-grey"), bottom: item("Black Jeans", "boy-bottom-black-jeans"), shoes: item("Slip-Ons", "boy-shoes-slipons"), accessory1: item("Simple Cap", "boy-cap-simple"), accessory2: item("None", ""), tip: "Simple and clean.", tags: ["Simple", "Clean"], rating: 0 }
      ]
    },
    white: {
      casual: [
        { top: item("White Logo Tee", "boy-top-logo-white"), bottom: item("Blue Denim", "boy-bottom-denim"), shoes: item("White Sneakers", "boy-shoes-white"), accessory1: item("Sport Cap", "boy-cap-sport"), accessory2: item("Watch", "boy-extras-watch"), tip: "Fresh for school!", tags: ["Fresh", "School"], rating: 0 }
      ],
      confident: [
        { top: item("Striped Polo", "boy-top-polo"), bottom: item("Khaki Pants", "boy-bottom-khaki"), shoes: item("White Trainers", "boy-shoes-trainers"), accessory1: item("Cool Cap", "boy-cap-cool"), accessory2: item("Bracelet", "boy-extras-bracelet"), tip: "Preppy with attitude!", tags: ["Preppy", "Cool"], rating: 0 }
      ],
      minimal: [
        { top: item("Plain White Tee", "boy-top-plain-white"), bottom: item("Grey Shorts", "boy-bottom-shorts"), shoes: item("White Canvas", "boy-shoes-canvas"), accessory1: item("None", ""), accessory2: item("None", ""), tip: "Keep it simple.", tags: ["Simple", "Summer"], rating: 0 }
      ]
    },
    brown: {
      casual: [
        { top: item("Brown Striped Tee", "boy-top-striped"), bottom: item("Tan Pants", "boy-bottom-tan"), shoes: item("Brown Sneakers", "boy-shoes-brown"), accessory1: item("Adventure Cap", "boy-cap-adventure"), accessory2: item("Compass", "boy-extras-compass"), tip: "Adventure awaits!", tags: ["Adventure", "Casual"], rating: 0 }
      ],
      confident: [
        { top: item("Camouflage Jacket", "boy-top-camo"), bottom: item("Cargo Pants", "boy-bottom-cargo"), shoes: item("Boots", "boy-shoes-boots"), accessory1: item("Army Cap", "boy-cap-army"), accessory2: item("Dog Tags", "boy-extras-tags"), tip: "Ready for action!", tags: ["Action", "Bold"], rating: 0 }
      ],
      minimal: [
        { top: item("Tan T-Shirt", "boy-top-tan"), bottom: item("Beige Shorts", "boy-bottom-beige"), shoes: item("Tan Slip-Ons", "boy-shoes-tan"), accessory1: item("None", ""), accessory2: item("None", ""), tip: "Easy and breezy.", tags: ["Easy", "Minimal"], rating: 0 }
      ]
    }
  },
  date: {
    black: {
      casual: [
        { top: item("Cool Print Tee", "boy-top-print"), bottom: item("Dark Jeans", "boy-bottom-dark-jeans"), shoes: item("Black Sneakers", "boy-shoes-black-sneak"), accessory1: item("Cool Cap", "boy-cap-cool-black"), accessory2: item("Cool Watch", "boy-extras-watch-cool"), tip: "Look your best!", tags: ["Cool", "Date"], rating: 0 }
      ],
      confident: [
        { top: item("Button-Up Shirt", "boy-top-button"), bottom: item("Dark Pants", "boy-bottom-dark-pants"), shoes: item("Dress Shoes", "boy-shoes-dress"), accessory1: item("Nice Cap", "boy-cap-nice"), accessory2: item("Belt", "boy-extras-belt"), tip: "Looking sharp!", tags: ["Sharp", "Dapper"], rating: 0 }
      ],
      minimal: [
        { top: item("Black Polo", "boy-top-polo-black"), bottom: item("Black Pants", "boy-bottom-black-pants"), shoes: item("Black Loafers", "boy-shoes-loafers"), accessory1: item("None", ""), accessory2: item("None", ""), tip: "Simple elegance.", tags: ["Simple", "Elegant"], rating: 0 }
      ]
    },
    white: {
      casual: [
        { top: item("Light Blue Shirt", "boy-top-blue"), bottom: item("Khaki Shorts", "boy-bottom-khaki-shorts"), shoes: item("White Sneakers", "boy-shoes-white-2"), accessory1: item("Summer Cap", "boy-cap-summer"), accessory2: item("Sunglasses", "boy-extras-sunglasses"), tip: "Summer vibes!", tags: ["Summer", "Fresh"], rating: 0 }
      ],
      confident: [
        { top: item("White Blazer", "boy-top-blazer"), bottom: item("Navy Pants", "boy-bottom-navy"), shoes: item("White Dress Shoes", "boy-shoes-dress-white"), accessory1: item("Fancy Cap", "boy-cap-fancy"), accessory2: item("Pocket Square", "boy-extras-pocket"), tip: "Special occasion ready!", tags: ["Special", "Dapper"], rating: 0 }
      ],
      minimal: [
        { top: item("White Henley", "boy-top-henley"), bottom: item("Grey Pants", "boy-bottom-grey"), shoes: item("White Canvas", "boy-shoes-canvas-2"), accessory1: item("None", ""), accessory2: item("None", ""), tip: "Clean and ready.", tags: ["Clean", "Ready"], rating: 0 }
      ]
    },
    brown: {
      casual: [
        { top: item("Green T-Shirt", "boy-top-green"), bottom: item("Brown Shorts", "boy-bottom-brown-shorts"), shoes: item("Brown Sneakers", "boy-shoes-brown-2"), accessory1: item("Nature Cap", "boy-cap-nature"), accessory2: item("Wristband", "boy-extras-wristband-2"), tip: "Nature explorer!", tags: ["Nature", "Explorer"], rating: 0 }
      ],
      confident: [
        { top: item("Plaid Shirt", "boy-top-plaid"), bottom: item("Brown Pants", "boy-bottom-brown-pants"), shoes: item("Boots", "boy-shoes-boots-2"), accessory1: item("Explorer Cap", "boy-cap-explorer"), accessory2: item("Compass", "boy-extras-compass-2"), tip: "Adventure style!", tags: ["Adventure", "Style"], rating: 0 }
      ],
      minimal: [
        { top: item("Beige Shirt", "boy-top-beige"), bottom: item("Tan Pants", "boy-bottom-tan-2"), shoes: item("Tan Sneakers", "boy-shoes-tan-2"), accessory1: item("None", ""), accessory2: item("None", ""), tip: "Simple explorer.", tags: ["Simple", "Explorer"], rating: 0 }
      ]
    }
  },
  party: {
    black: {
      casual: [
        { top: item("Cool Party Tee", "boy-top-party"), bottom: item("Black Jeans", "boy-bottom-black-jeans-2"), shoes: item("Party Sneakers", "boy-shoes-party"), accessory1: item("Party Cap", "boy-cap-party"), accessory2: item("Glow Band", "boy-extras-glow"), tip: "Party time!", tags: ["Party", "Fun"], rating: 0 }
      ],
      confident: [
        { top: item("Leather Jacket", "boy-top-leather"), bottom: item("Dark Pants", "boy-bottom-dark-2"), shoes: item("Boots", "boy-shoes-boots-3"), accessory1: item("Rock Cap", "boy-cap-rock"), accessory2: item("Chain", "boy-extras-chain-2"), tip: "Rock the party!", tags: ["Rock", "Bold"], rating: 0 }
      ],
      minimal: [
        { top: item("Black Tee", "boy-top-black-tee"), bottom: item("Black Pants", "boy-bottom-black-pants-2"), shoes: item("Black Sneakers", "boy-shoes-black-3"), accessory1: item("None", ""), accessory2: item("None", ""), tip: "Cool and mysterious.", tags: ["Cool", "Mystery"], rating: 0 }
      ]
    },
    white: {
      casual: [
        { top: item("White Party Shirt", "boy-top-party-white"), bottom: item("Light Jeans", "boy-bottom-light-jeans"), shoes: item("White Party Shoes", "boy-shoes-party-white"), accessory1: item("Cool Cap", "boy-cap-cool-white"), accessory2: item("Watch", "boy-extras-watch-2"), tip: "Fresh party look!", tags: ["Fresh", "Party"], rating: 0 }
      ],
      confident: [
        { top: item("White Dinner Jacket", "boy-top-dinner"), bottom: item("Black Pants", "boy-bottom-black-3"), shoes: item("Patent Shoes", "boy-shoes-patent"), accessory1: item("Bow Tie", "boy-cap-bowtie"), accessory2: item("Cufflinks", "boy-extras-cufflinks"), tip: "Best dressed!", tags: ["Best", "Dapper"], rating: 0 }
      ],
      minimal: [
        { top: item("Clean White Tee", "boy-top-clean-white"), bottom: item("White Pants", "boy-bottom-white-pants"), shoes: item("White Shoes", "boy-shoes-white-3"), accessory1: item("None", ""), accessory2: item("None", ""), tip: "Pure cool.", tags: ["Pure", "Cool"], rating: 0 }
      ]
    },
    brown: {
      casual: [
        { top: item("Rust T-Shirt", "boy-top-rust"), bottom: item("Khaki Pants", "boy-bottom-khaki-2"), shoes: item("Brown Sneakers", "boy-shoes-brown-3"), accessory1: item("Fall Cap", "boy-cap-fall"), accessory2: item("Wristband", "boy-extras-wristband-3"), tip: "Fall party vibes!", tags: ["Fall", "Party"], rating: 0 }
      ],
      confident: [
        { top: item("Suede Jacket", "boy-top-suede"), bottom: item("Brown Pants", "boy-bottom-brown-3"), shoes: item("Suede Boots", "boy-shoes-suede"), accessory1: item("Western Cap", "boy-cap-western"), accessory2: item("Belt Buckle", "boy-extras-buckle"), tip: "Western star!", tags: ["Western", "Star"], rating: 0 }
      ],
      minimal: [
        { top: item("Tan Shirt", "boy-top-tan-2"), bottom: item("Beige Pants", "boy-bottom-beige-2"), shoes: item("Tan Shoes", "boy-shoes-tan-3"), accessory1: item("None", ""), accessory2: item("None", ""), tip: "Earth tones party.", tags: ["Earth", "Party"], rating: 0 }
      ]
    }
  }
};

// ============================================
// OUTFITS DATA - GIRLS
// ============================================
const GIRL_OUTFITS: Record<string, Record<string, Record<string, Outfit[]>>> = {
  college: {
    black: {
      casual: [
        { top: item("Black Cute Tee", "girl-top-tee-black"), bottom: item("Denim Skirt", "girl-bottom-skirt"), shoes: item("Black Sneakers", "girl-shoes-sneakers"), accessory1: item("Mini Backpack", "girl-bag-backpack"), accessory2: item("Hair Clips", "girl-extras-clips"), tip: "Cute school style!", tags: ["Cute", "School"], rating: 0 }
      ],
      confident: [
        { top: item("Black Dress", "girl-top-dress-black"), bottom: item("Black Leggings", "girl-bottom-leggings"), shoes: item("Ankle Boots", "girl-shoes-boots"), accessory1: item("Cool Bag", "girl-bag-cool"), accessory2: item("Choker", "girl-extras-choker"), tip: "Trendy and bold!", tags: ["Trendy", "Bold"], rating: 0 }
      ],
      minimal: [
        { top: item("Black Turtleneck", "girl-top-turtleneck"), bottom: item("Black Pants", "girl-bottom-pants"), shoes: item("Black Flats", "girl-shoes-flats"), accessory1: item("Simple Bag", "girl-bag-simple"), accessory2: item("None", ""), tip: "Simple chic.", tags: ["Simple", "Chic"], rating: 0 }
      ]
    },
    white: {
      casual: [
        { top: item("White Blouse", "girl-top-blouse"), bottom: item("Blue Skirt", "girl-bottom-blue-skirt"), shoes: item("White Sneakers", "girl-shoes-white"), accessory1: item("School Bag", "girl-bag-school"), accessory2: item("Bow", "girl-extras-bow"), tip: "Pretty in white!", tags: ["Pretty", "School"], rating: 0 }
      ],
      confident: [
        { top: item("White Sweater", "girl-top-sweater"), bottom: item("Plaid Skirt", "girl-bottom-plaid"), shoes: item("Mary Janes", "girl-shoes-mary-janes"), accessory1: item("Satchel", "girl-bag-satchel"), accessory2: item("Headband", "girl-extras-headband"), tip: "Preppy perfection!", tags: ["Preppy", "Perfect"], rating: 0 }
      ],
      minimal: [
        { top: item("White Tee", "girl-top-tee"), bottom: item("White Shorts", "girl-bottom-shorts"), shoes: item("White Canvas", "girl-shoes-canvas"), accessory1: item("Simple Bag", "girl-bag-simple-2"), accessory2: item("None", ""), tip: "Clean and fresh.", tags: ["Clean", "Fresh"], rating: 0 }
      ]
    },
    brown: {
      casual: [
        { top: item("Brown Sweater", "girl-top-sweater-brown"), bottom: item("Tan Skirt", "girl-bottom-tan-skirt"), shoes: item("Brown Boots", "girl-shoes-boots-brown"), accessory1: item("Leather Bag", "girl-bag-leather"), accessory2: item("Hair Tie", "girl-extras-hairtie"), tip: "Cozy autumn!", tags: ["Cozy", "Autumn"], rating: 0 }
      ],
      confident: [
        { top: item("Burgundy Dress", "girl-top-dress-burgundy"), bottom: item("Burgundy Tights", "girl-bottom-tights"), shoes: item("Burgundy Boots", "girl-shoes-boots-burgundy"), accessory1: item("Statement Bag", "girl-bag-statement"), accessory2: item("Beret", "girl-extras-beret"), tip: "French chic!", tags: ["French", "Chic"], rating: 0 }
      ],
      minimal: [
        { top: item("Tan Cardigan", "girl-top-cardigan"), bottom: item("Beige Pants", "girl-bottom-beige"), shoes: item("Tan Flats", "girl-shoes-flats-tan"), accessory1: item("Neutral Bag", "girl-bag-neutral"), accessory2: item("None", ""), tip: "Neutral beauty.", tags: ["Neutral", "Beauty"], rating: 0 }
      ]
    }
  },
  date: {
    black: {
      casual: [
        { top: item("Polka Dot Top", "girl-top-polka"), bottom: item("Black Skirt", "girl-bottom-black-skirt"), shoes: item("Black Flats", "girl-shoes-flats-black"), accessory1: item("Cute Bag", "girl-bag-cute"), accessory2: item("Pearl Clips", "girl-extras-pearl"), tip: "Sweet date look!", tags: ["Sweet", "Date"], rating: 0 }
      ],
      confident: [
        { top: item("Black Party Dress", "girl-top-party-dress"), bottom: item("Black Tights", "girl-bottom-tights-black"), shoes: item("Patent Flats", "girl-shoes-patent"), accessory1: item("Sparkle Bag", "girl-bag-sparkle"), accessory2: item("Tiara", "girl-extras-tiara"), tip: "Princess vibes!", tags: ["Princess", "Sparkle"], rating: 0 }
      ],
      minimal: [
        { top: item("Black Shift Dress", "girl-top-shift"), bottom: item("Black Slip", "girl-bottom-slip"), shoes: item("Black Ballet Flats", "girl-shoes-ballet"), accessory1: item("Simple Clutch", "girl-bag-clutch"), accessory2: item("None", ""), tip: "Elegant simplicity.", tags: ["Elegant", "Simple"], rating: 0 }
      ]
    },
    white: {
      casual: [
        { top: item("Floral Top", "girl-top-floral"), bottom: item("White Skirt", "girl-bottom-white-skirt"), shoes: item("White Sandals", "girl-shoes-sandals"), accessory1: item("Flower Bag", "girl-bag-flower"), accessory2: item("Flower Crown", "girl-extras-flower"), tip: "Garden party ready!", tags: ["Garden", "Floral"], rating: 0 }
      ],
      confident: [
        { top: item("White Gown", "girl-top-gown"), bottom: item("White Slip", "girl-bottom-slip-white"), shoes: item("White Heels", "girl-shoes-heels"), accessory1: item("Beaded Bag", "girl-bag-beaded"), accessory2: item("Crystal Tiara", "girl-extras-crystal"), tip: "Fairytale princess!", tags: ["Fairytale", "Princess"], rating: 0 }
      ],
      minimal: [
        { top: item("White Sundress", "girl-top-sundress"), bottom: item("White Slip", "girl-bottom-slip-2"), shoes: item("White Flats", "girl-shoes-flats-white"), accessory1: item("Simple Bag", "girl-bag-simple-3"), accessory2: item("None", ""), tip: "Summer elegance.", tags: ["Summer", "Elegant"], rating: 0 }
      ]
    },
    brown: {
      casual: [
        { top: item("Cream Blouse", "girl-top-cream"), bottom: item("Brown Skirt", "girl-bottom-brown-skirt"), shoes: item("Brown Mary Janes", "girl-shoes-mary-janes-brown"), accessory1: item("Tan Bag", "girl-bag-tan"), accessory2: item("Ribbon", "girl-extras-ribbon"), tip: "Sweet autumn date!", tags: ["Sweet", "Autumn"], rating: 0 }
      ],
      confident: [
        { top: item("Gold Dress", "girl-top-dress-gold"), bottom: item("Gold Slip", "girl-bottom-slip-gold"), shoes: item("Gold Flats", "girl-shoes-gold"), accessory1: item("Gold Bag", "girl-bag-gold"), accessory2: item("Gold Crown", "girl-extras-crown"), tip: "Golden princess!", tags: ["Golden", "Princess"], rating: 0 }
      ],
      minimal: [
        { top: item("Beige Top", "girl-top-beige"), bottom: item("Tan Skirt", "girl-bottom-tan-skirt-2"), shoes: item("Tan Flats", "girl-shoes-flats-tan-2"), accessory1: item("Neutral Bag", "girl-bag-neutral-2"), accessory2: item("None", ""), tip: "Natural beauty.", tags: ["Natural", "Beauty"], rating: 0 }
      ]
    }
  },
  party: {
    black: {
      casual: [
        { top: item("Sparkle Top", "girl-top-sparkle"), bottom: item("Black Tutu", "girl-bottom-tutu"), shoes: item("Sparkle Sneakers", "girl-shoes-sparkle"), accessory1: item("Party Bag", "girl-bag-party"), accessory2: item("Glow Clips", "girl-extras-glow"), tip: "Sparkle and shine!", tags: ["Sparkle", "Party"], rating: 0 }
      ],
      confident: [
        { top: item("Black Ball Gown", "girl-top-ball-gown"), bottom: item("Tulle Skirt", "girl-bottom-tulle"), shoes: item("Glass Slippers", "girl-shoes-glass"), accessory1: item("Evening Bag", "girl-bag-evening"), accessory2: item("Diamond Tiara", "girl-extras-diamond"), tip: "Ball princess!", tags: ["Ball", "Princess"], rating: 0 }
      ],
      minimal: [
        { top: item("Black Leotard", "girl-top-leotard"), bottom: item("Black Skirt", "girl-bottom-black-skirt-2"), shoes: item("Black Dance Shoes", "girl-shoes-dance"), accessory1: item("Simple Bag", "girl-bag-simple-4"), accessory2: item("None", ""), tip: "Dance ready!", tags: ["Dance", "Ready"], rating: 0 }
      ]
    },
    white: {
      casual: [
        { top: item("White Sparkle Dress", "girl-top-sparkle-white"), bottom: item("White Tulle", "girl-bottom-tulle-white"), shoes: item("White Party Shoes", "girl-shoes-party-white"), accessory1: item("Snowflake Bag", "girl-bag-snowflake"), accessory2: item("Snowflake Clips", "girl-extras-snowflake"), tip: "Winter wonderland!", tags: ["Winter", "Sparkle"], rating: 0 }
      ],
      confident: [
        { top: item("White Princess Gown", "girl-top-princess"), bottom: item("White Petticoat", "girl-bottom-petticoat"), shoes: item("Crystal Shoes", "girl-shoes-crystal"), accessory1: item("Royal Bag", "girl-bag-royal"), accessory2: item("Royal Crown", "girl-extras-royal"), tip: "True princess!", tags: ["Royal", "Princess"], rating: 0 }
      ],
      minimal: [
        { top: item("White Party Dress", "girl-top-party-dress-white"), bottom: item("White Slip", "girl-bottom-slip-3"), shoes: item("White Ballet", "girl-shoes-ballet-white"), accessory1: item("Simple Bag", "girl-bag-simple-5"), accessory2: item("None", ""), tip: "Pure elegance.", tags: ["Pure", "Elegant"], rating: 0 }
      ]
    },
    brown: {
      casual: [
        { top: item("Bronze Sparkle Top", "girl-top-bronze"), bottom: item("Gold Skirt", "girl-bottom-gold"), shoes: item("Gold Party Shoes", "girl-shoes-gold-party"), accessory1: item("Bronze Bag", "girl-bag-bronze"), accessory2: item("Gold Clips", "girl-extras-gold"), tip: "Shine like gold!", tags: ["Gold", "Shine"], rating: 0 }
      ],
      confident: [
        { top: item("Copper Princess Dress", "girl-top-copper"), bottom: item("Copper Tulle", "girl-bottom-copper"), shoes: item("Copper Heels", "girl-shoes-copper"), accessory1: item("Crown Bag", "girl-bag-crown"), accessory2: item("Copper Crown", "girl-extras-copper-crown"), tip: "Autumn princess!", tags: ["Autumn", "Princess"], rating: 0 }
      ],
      minimal: [
        { top: item("Tan Party Top", "girl-top-tan-party"), bottom: item("Beige Skirt", "girl-bottom-beige-skirt"), shoes: item("Tan Flats", "girl-shoes-flats-tan-3"), accessory1: item("Simple Bag", "girl-bag-simple-6"), accessory2: item("None", ""), tip: "Natural elegance.", tags: ["Natural", "Elegant"], rating: 0 }
      ]
    }
  }
};

// Combined outfits data by styling group
const ALL_OUTFITS: Record<string, Record<string, Record<string, Record<string, Outfit[]>>>> = {
  men: MEN_OUTFITS,
  women: WOMEN_OUTFITS,
  boy: BOY_OUTFITS,
  girl: GIRL_OUTFITS
};

// ============================================
// GLOBAL IMAGE CACHE (Handled by browser HTTP caching)
// ============================================

const preloadOutfitImagesBatch = async (...args: any[]) => {};
const preloadOutfitImages = async (...args: any[]) => {};

// Hook for intersection observer lazy loading
const useIntersectionObserver = (ref: React.RefObject<Element>, options?: IntersectionObserverInit) => {
  const [isIntersecting, setIsIntersecting] = React.useState(false);
  
  React.useEffect(() => {
    const element = ref.current;
    if (!element) return;
    
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsIntersecting(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: '100px', ...options }
    );
    
    observer.observe(element);
    return () => observer.disconnect();
  }, [ref, options]);
  
  return isIntersecting;
};

// ============================================
// CSS STYLES
// ============================================
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&display=swap');
  
  * { box-sizing: border-box; margin: 0; padding: 0; }
  
  body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    background: #0a0a0a;
    color: #f5f5f5;
    min-height: 100vh;
  }
  
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }
  
  @keyframes shimmer {
    0% { background-position: -200% center; }
    100% { background-position: 200% center; }
  }
  
  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.7; }
  }
  
  @keyframes twinkle {
    0%, 100% { opacity: 0.3; }
    50% { opacity: 1; }
  }
  
  @keyframes glow {
    0%, 100% { box-shadow: 0 0 20px rgba(212, 175, 55, 0.3); }
    50% { box-shadow: 0 0 40px rgba(212, 175, 55, 0.6); }
  }
  
  @keyframes fadeInRow {
    from { opacity: 0; transform: translateX(-10px); }
    to { opacity: 1; transform: translateX(0); }
  }
  
  @keyframes shimmerLoad {
    0% { background-position: -200% 0; }
    100% { background-position: 200% 0; }
  }
  
  @keyframes skeletonPulse {
    0%, 100% { opacity: 0.4; }
    50% { opacity: 0.8; }
  }
  
  .fade-up { animation: fadeUp 0.4s ease-out forwards; }
  
  .shimmer-text {
    background: linear-gradient(90deg, #D4AF37 0%, #FFD700 25%, #D4AF37 50%, #FFD700 75%, #D4AF37 100%);
    background-size: 200% auto;
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
    animation: shimmer 3s linear infinite;
  }
  
  .glow-button { animation: glow 2s ease-in-out infinite; }
  .bounce-save { animation: pulse 0.5s ease-in-out; }
  
  .item-row { animation: fadeInRow 0.3s ease-out forwards; opacity: 0; }
  
  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
  
  .image-skeleton {
    background: linear-gradient(135deg, 
      rgba(212, 175, 55, 0.05) 0%, 
      rgba(212, 175, 55, 0.15) 25%, 
      rgba(212, 175, 55, 0.25) 50%, 
      rgba(212, 175, 55, 0.15) 75%, 
      rgba(212, 175, 55, 0.05) 100%
    );
    background-size: 400% 400%;
    animation: shimmerLoad 2s ease-in-out infinite;
    position: relative;
    overflow: hidden;
  }
  
  .image-skeleton::after {
    content: '';
    position: absolute;
    inset: 0;
    background: radial-gradient(circle at center, transparent 40%, rgba(0,0,0,0.3) 100%);
  }
  
  .clothing-image {
    transition: transform 0.3s ease, box-shadow 0.3s ease;
  }
  
  .clothing-image:hover {
    transform: scale(1.05);
    box-shadow: 0 8px 25px rgba(212, 175, 55, 0.4);
  }
  
  ::-webkit-scrollbar { width: 4px; }
  ::-webkit-scrollbar-track { background: #1a1a1a; }
  ::-webkit-scrollbar-thumb { background: #D4AF37; border-radius: 2px; }

  .formality-slider::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: #FFD700;
    cursor: pointer;
    box-shadow: 0 0 10px rgba(255, 215, 0, 0.3);
  }
  .formality-slider::-moz-range-thumb {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: #FFD700;
    cursor: pointer;
    border: none;
    box-shadow: 0 0 10px rgba(255, 215, 0, 0.3);
  }
`;

// ============================================
// STARS BACKGROUND COMPONENT
// ============================================
function StarsBackground() {
  const stars = useMemo(() => {
    return Array.from({ length: 50 }, (_, i) => ({
      id: i,
      left: `${((i * 73) % 100) + ((i * 17) % 10) / 10}%`,
      top: `${((i * 47) % 100) + ((i * 23) % 10) / 10}%`,
      delay: `${(i * 0.1) % 3}s`,
      size: 1 + (i % 3) * 0.5
    }));
  }, []);

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      pointerEvents: 'none', zIndex: 0, overflow: 'hidden'
    }}>
      {stars.map(star => (
        <div key={star.id} style={{
          position: 'absolute', left: star.left, top: star.top,
          width: `${star.size}px`, height: `${star.size}px`,
          background: '#D4AF37', borderRadius: '50%',
          animation: `twinkle ${2 + (star.id % 3)}s ease-in-out infinite`,
          animationDelay: star.delay, opacity: 0.3
        }} />
      ))}
    </div>
  );
}

// ============================================
// CLOTHING IMAGE COMPONENT
// ============================================
function ClothingImage({ imageKey, alt, size = 100, preload = false, wardrobeItems = [], clothingItem }: { 
  imageKey: string; 
  alt: string; 
  size?: number;
  preload?: boolean;
  wardrobeItems?: WardrobeItem[];
  clothingItem?: ClothingItem; // Optional: for getting selected variant
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [error, setError] = useState(false);
  
  // Get the variant to use (default to 0)
  const variant = clothingItem?.selectedVariant ?? 0;
  
  // Check if this is a wardrobe item
  const wardrobeImage = useMemo(() => {
    if (imageKey?.startsWith('wardrobe-')) {
      const wardrobeId = imageKey.replace('wardrobe-', '');
      const wardrobeItem = wardrobeItems.find(item => item.id === wardrobeId);
      return wardrobeItem?.image || null;
    }
    return null;
  }, [imageKey, wardrobeItems]);

  const containerStyle: React.CSSProperties = {
    width: size,
    height: size,
    borderRadius: 16,
    overflow: 'hidden',
    flexShrink: 0,
    position: 'relative',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.4), 0 0 15px rgba(212, 175, 55, 0.15)',
    backgroundColor: 'rgba(26, 26, 24, 0.8)',
  };

  // If no imageKey, return null to hide the entire row
  if (!imageKey || imageKey === '') {
    return null;
  }

  if (error) {
    const getCategoryLabel = () => {
      const lower = alt.toLowerCase();
      if (lower.includes('shirt') || lower.includes('tee') || lower.includes('polo') || lower.includes('henley') || lower.includes('sweater') || lower.includes('jacket') || lower.includes('blazer') || lower.includes('top') || lower.includes('dress')) return 'TOP';
      if (lower.includes('pants') || lower.includes('jeans') || lower.includes('chino') || lower.includes('trouser') || lower.includes('skirt') || lower.includes('bottom')) return 'BOTTOM';
      if (lower.includes('shoe') || lower.includes('sneaker') || lower.includes('boot') || lower.includes('loafer')) return 'SHOES';
      if (lower.includes('watch') || lower.includes('bag') || lower.includes('cap')) return 'ACCESSORY';
      return 'ITEM';
    };
    return (
      <div 
        style={{
          ...containerStyle,
          background: 'linear-gradient(145deg, #1a1a18 0%, #0d0d0b 100%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          border: '1px solid rgba(212, 175, 55, 0.15)',
        }}>
        <div style={{ width: 24, height: 2, background: 'linear-gradient(90deg, transparent, #D4AF37, transparent)', marginBottom: 8 }} />
        <span style={{ fontSize: 9, color: '#D4AF37', fontWeight: 600, letterSpacing: 1.5, textTransform: 'uppercase' }}>
          {getCategoryLabel()}
        </span>
        <div style={{ width: 24, height: 2, background: 'linear-gradient(90deg, transparent, #D4AF37, transparent)', marginTop: 8 }} />
      </div>
    );
  }

  const imageUrl = wardrobeImage || `/api/outfits/images?item=${imageKey}&variant=${variant}`;

  return (
    <div 
      ref={containerRef}
      style={containerStyle}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <img 
        src={imageUrl} 
        alt={alt}
        loading={preload ? "eager" : "lazy"}
        decoding="async"
        onError={() => setError(true)}
        className="clothing-image"
        style={{ 
          width: '100%', 
          height: '100%', 
          objectFit: 'cover',
          transform: isHovered ? 'scale(1.08)' : 'scale(1)',
          transition: 'transform 0.3s ease',
        }}
      />
    </div>
  );
}

// ============================================
// HERO OUTFIT CARD - MODERN FASHION STYLE
// ============================================
function HeroOutfitCard({ top, outfitName, styleSubtitle }: { 
  top: ClothingItem;
  outfitName: string;
  styleSubtitle: string;
}) {
  const variant = top.selectedVariant ?? 0;
  const imageUrl = `/api/outfits/images?item=${top.imageKey}&variant=${variant}`;

  return (
    <div style={{ margin: '20px', marginBottom: 0 }}>
      {/* Hero Image - 360px height */}
      <div style={{
        width: '100%',
        height: 360,
        borderRadius: 20,
        overflow: 'hidden',
        position: 'relative',
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)',
        background: '#1a1a1a',
      }}>
        <img 
          src={imageUrl}
          alt={top.name}
          loading="eager"
          decoding="async"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'center 20%',
          }}
        />
        
        {/* Subtle Gradient Overlay at bottom only */}
        <div style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '40%',
          background: 'linear-gradient(to top, rgba(10,10,10,0.6) 0%, transparent 100%)',
        }} />
      </div>

      {/* Outfit Title - BELOW the image */}
      <div style={{ padding: '24px 8px 0', textAlign: 'center' }}>
        <h1 style={{ fontFamily: 'Georgia, "Playfair Display", serif', fontSize: 26, fontWeight: 600, color: '#fff', marginBottom: 8, letterSpacing: '0.3px' }}>
          {outfitName}
        </h1>
        <p style={{ fontSize: 13, color: '#D4AF37', fontWeight: 500, letterSpacing: 1.5, textTransform: 'uppercase' }}>
          {styleSubtitle}
        </p>
      </div>
    </div>
  );
}

// ============================================
// HEADER COMPONENT
// ============================================
function Header({ screen, setScreen, savedOutfitsLength, resetFilters }) {
  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 100,
      background: 'rgba(10, 10, 10, 0.85)',
      backdropFilter: 'blur(20px)',
      borderBottom: '1px solid rgba(212, 175, 55, 0.1)',
      padding: '16px 20px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between'
    }}>
      {screen !== 'home' && (
        <button onClick={() => screen === 'saved' ? setScreen('home') : resetFilters()} style={{
          background: 'none', border: 'none', color: '#D4AF37',
          fontSize: '24px', cursor: 'pointer', padding: '4px 8px', marginRight: '12px'
        }}>
          ←
        </button>
      )}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <img src="/logo.svg" alt="Drip Logo" style={{ width: '28px', height: '28px', objectFit: 'contain' }} />
        <h1 style={{
          fontFamily: 'Georgia, serif', fontSize: '22px', fontWeight: 600,
          color: '#D4AF37', letterSpacing: '2px'
        }}>
          Drip
        </h1>
      </div>
      <div style={{ display: 'flex', gap: '16px' }}>
        <button onClick={() => setScreen('home')} style={{
          background: 'none', border: 'none',
          color: screen === 'home' ? '#D4AF37' : '#666',
          fontSize: '14px', cursor: 'pointer', fontWeight: 500, position: 'relative'
        }}>
          Style
          {screen === 'home' && (
            <div style={{
              position: 'absolute', bottom: -8, left: '50%',
              transform: 'translateX(-50%)', width: '4px', height: '4px',
              background: '#D4AF37', borderRadius: '50%'
            }} />
          )}
        </button>
        <button onClick={() => setScreen('saved')} style={{
          background: 'none', border: 'none',
          color: screen === 'saved' ? '#D4AF37' : '#666',
          fontSize: '14px', cursor: 'pointer', fontWeight: 500,
          position: 'relative', display: 'flex', alignItems: 'center', gap: '4px'
        }}>
          Saved
          {savedOutfitsLength > 0 && (
            <span style={{
              position: 'absolute', top: -4, right: -8,
              background: '#D4AF37', color: '#0a0a0a',
              fontSize: '10px', fontWeight: 700,
              padding: '2px 5px', borderRadius: '10px',
              minWidth: '16px', textAlign: 'center'
            }}>
              {savedOutfitsLength}
            </span>
          )}
        </button>
      </div>
    </header>
  );
}

// ============================================
// BOTTOM NAV COMPONENT
// ============================================
function BottomNav({ screen, setScreen, savedOutfitsLength, wardrobeCount }) {
  const tabs = [
    { id: 'home', icon: '✦', label: 'Style' },
    { id: 'wardrobe', icon: '👔', label: 'Wardrobe' },
    { id: 'explore', icon: '🔍', label: 'Explore' },
    { id: 'saved', icon: '🔖', label: 'Saved' },
  ];

  return (
    <nav style={{
      position: 'fixed', bottom: 0, left: '50%',
      transform: 'translateX(-50%)', width: '100%', maxWidth: '420px',
      background: 'rgba(10, 10, 10, 0.95)', backdropFilter: 'blur(20px)',
      borderTop: '1px solid rgba(212, 175, 55, 0.1)',
      padding: '10px 16px 24px', display: 'flex', justifyContent: 'space-around', zIndex: 100
    }}>
      {tabs.map(tab => (
        <button
          key={tab.id}
          onClick={() => setScreen(tab.id)}
          style={{
            background: 'none', border: 'none',
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px',
            cursor: 'pointer', color: screen === tab.id ? '#D4AF37' : '#666',
            position: 'relative', padding: '4px 12px'
          }}
        >
          <span style={{ fontSize: '22px' }}>{tab.icon}</span>
          <span style={{ fontSize: '10px', fontWeight: 500 }}>{tab.label}</span>
          {tab.id === 'saved' && savedOutfitsLength > 0 && (
            <span style={{
              position: 'absolute', top: -4, right: 4,
              background: '#D4AF37', color: '#0a0a0a',
              fontSize: '9px', fontWeight: 700,
              padding: '1px 5px', borderRadius: '8px', minWidth: '14px'
            }}>
              {savedOutfitsLength}
            </span>
          )}
          {tab.id === 'wardrobe' && wardrobeCount > 0 && (
            <span style={{
              position: 'absolute', top: -4, right: 4,
              background: '#D4AF37', color: '#0a0a0a',
              fontSize: '9px', fontWeight: 700,
              padding: '1px 5px', borderRadius: '8px', minWidth: '14px'
            }}>
              {wardrobeCount}
            </span>
          )}
          {screen === tab.id && (
            <div style={{ width: '4px', height: '4px', background: '#D4AF37', borderRadius: '50%', marginTop: '2px' }} />
          )}
        </button>
      ))}
    </nav>
  );
}

// ============================================
// PROGRESS INDICATOR
// ============================================
function ProgressIndicator({ selectedCount }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '24px' }}>
      <span style={{ fontSize: '13px', color: '#888', fontWeight: 500 }}>
        {selectedCount}/3 Selected
      </span>
      <div style={{ display: 'flex', gap: '6px' }}>
        {[0, 1, 2].map(i => (
          <div key={i} style={{
            width: i < selectedCount ? '20px' : '8px', height: '8px', borderRadius: '4px',
            background: i < selectedCount 
              ? 'linear-gradient(90deg, #D4AF37, #FFD700)' 
              : 'rgba(212, 175, 55, 0.2)',
            transition: 'all 0.3s ease'
          }} />
        ))}
      </div>
    </div>
  );
}

// ============================================
// SELECTION CARD
// ============================================
function SelectionCard({ emoji, label, subtitle, selected, onClick }) {
  return (
    <button onClick={onClick} style={{
      flex: 1,
      background: selected 
        ? 'linear-gradient(135deg, rgba(212, 175, 55, 0.15), rgba(255, 215, 0, 0.1))'
        : 'rgba(26, 24, 0, 0.5)',
      border: selected ? '2px solid #D4AF37' : '1px solid rgba(212, 175, 55, 0.15)',
      borderRadius: '16px', padding: '16px 8px', cursor: 'pointer',
      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px',
      transition: 'all 0.2s ease',
      transform: selected ? 'scale(0.98)' : 'scale(1)',
      boxShadow: selected 
        ? '0 0 20px rgba(212, 175, 55, 0.3), inset 0 0 20px rgba(212, 175, 55, 0.05)'
        : 'none'
    }}
    onMouseEnter={(e) => {
      if (!selected) {
        e.currentTarget.style.transform = 'translateY(-3px)';
        e.currentTarget.style.borderColor = 'rgba(212, 175, 55, 0.4)';
      }
    }}
    onMouseLeave={(e) => {
      if (!selected) {
        e.currentTarget.style.transform = 'scale(1)';
        e.currentTarget.style.borderColor = 'rgba(212, 175, 55, 0.15)';
      }
    }}
    >
      <span style={{ fontSize: '32px' }}>{emoji}</span>
      <span style={{
        fontSize: '13px', fontWeight: 600,
        color: selected ? '#D4AF37' : '#ccc', letterSpacing: '0.5px'
      }}>
        {label}
      </span>
      {subtitle && (
        <span style={{
          fontSize: '10px',
          color: selected ? 'rgba(212, 175, 55, 0.7)' : '#666',
          textAlign: 'center'
        }}>
          {subtitle}
        </span>
      )}
    </button>
  );
}

// ============================================
// STYLING FOR SELECTOR
// ============================================
function StylingForSelector({ stylingFor, setStylingFor }: {
  stylingFor: string;
  setStylingFor: (value: string) => void;
}) {
  const options = [
    { id: 'men', emoji: '👨', label: 'Men' },
    { id: 'women', emoji: '👩', label: 'Women' },
    { id: 'boy', emoji: '👦', label: 'Boy' },
    { id: 'girl', emoji: '👧', label: 'Girl' },
  ];

  return (
    <div style={{ display: 'flex', gap: '8px' }}>
      {options.map((option) => (
        <button
          key={option.id}
          onClick={() => setStylingFor(option.id)}
          style={{
            flex: 1,
            background: stylingFor === option.id 
              ? 'linear-gradient(135deg, rgba(212, 175, 55, 0.15), rgba(255, 215, 0, 0.1))'
              : 'rgba(26, 24, 0, 0.5)',
            border: stylingFor === option.id ? '2px solid #D4AF37' : '1px solid rgba(212, 175, 55, 0.15)',
            borderRadius: '12px',
            padding: '12px 4px',
            cursor: 'pointer',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '6px',
            transition: 'all 0.2s ease',
            boxShadow: stylingFor === option.id 
              ? '0 0 15px rgba(212, 175, 55, 0.3)' 
              : 'none'
          }}
        >
          <span style={{ fontSize: '24px' }}>{option.emoji}</span>
          <span style={{
            fontSize: '11px',
            fontWeight: 600,
            color: stylingFor === option.id ? '#D4AF37' : '#888',
          }}>
            {option.label}
          </span>
        </button>
      ))}
    </div>
  );
}

// ============================================
// SECTION LABEL
// ============================================
function SectionLabel({ children, marginBottom = '12px', marginTop = '24px' }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom, marginTop }}>
      <div style={{ flex: 1, height: '1px', background: 'linear-gradient(90deg, transparent, rgba(212, 175, 55, 0.3))' }} />
      <span style={{
        fontSize: '11px', fontWeight: 600, color: '#D4AF37',
        letterSpacing: '2px', textTransform: 'uppercase'
      }}>
        {children}
      </span>
      <div style={{ flex: 1, height: '1px', background: 'linear-gradient(90deg, rgba(212, 175, 55, 0.3), transparent)' }} />
    </div>
  );
}

// ============================================
// SHOE COLOR SWATCH
// ============================================
function ShoeColorSwatch({ color, selected, onClick }) {
  const colors = {
    black: { bg: '#1a1a1a', border: '#333' },
    white: { bg: '#f5f5f5', border: '#ccc' },
    brown: { bg: '#8B5E3C', border: '#6B4E2C' }
  };
  
  return (
    <button onClick={onClick} style={{
      flex: 1,
      background: selected 
        ? 'linear-gradient(135deg, rgba(212, 175, 55, 0.15), rgba(255, 215, 0, 0.1))'
        : 'rgba(26, 24, 0, 0.5)',
      border: selected ? '2px solid #D4AF37' : '1px solid rgba(212, 175, 55, 0.15)',
      borderRadius: '16px', padding: '16px 8px', cursor: 'pointer',
      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px',
      transition: 'all 0.2s ease',
      boxShadow: selected ? '0 0 20px rgba(212, 175, 55, 0.3)' : 'none'
    }}>
      <div style={{
        width: '48px', height: '48px', borderRadius: '50%',
        background: colors[color].bg,
        border: color === 'white' ? '3px inset #ddd' : `2px solid ${colors[color].border}`,
        boxShadow: selected ? '0 0 15px rgba(212, 175, 55, 0.5)' : '0 4px 12px rgba(0,0,0,0.3)'
      }} />
      <span style={{
        fontSize: '13px', fontWeight: 600,
        color: selected ? '#D4AF37' : '#ccc'
      }}>
        {color.charAt(0).toUpperCase() + color.slice(1)}
      </span>
    </button>
  );
}

// ============================================
// HOME SCREEN
// ============================================
function HomeScreen({ 
  stylingFor, setStylingFor,
  occasion, setOccasion, shoeColor, setShoeColor, mood, setMood,
  weather, setWeather, formality, setFormality, budget, setBudget,
  showPreferences, setShowPreferences, selectedCount, isComplete,
  generateOutfits, surpriseMe, wardrobe, useWardrobe, setUseWardrobe,
  wardrobeOnly, setWardrobeOnly, isLoadingOutfits
}: {
  stylingFor: string;
  setStylingFor: (value: string) => void;
  occasion: string | null;
  setOccasion: (value: string | null) => void;
  shoeColor: string | null;
  setShoeColor: (value: string | null) => void;
  mood: string | null;
  setMood: (value: string | null) => void;
  weather: string;
  setWeather: (value: string) => void;
  formality: number;
  setFormality: (value: number) => void;
  budget: string;
  setBudget: (value: string) => void;
  showPreferences: boolean;
  setShowPreferences: (value: boolean) => void;
  selectedCount: number;
  isComplete: boolean;
  generateOutfits: () => void;
  surpriseMe: () => void;
  wardrobe: WardrobeItem[];
  useWardrobe: boolean;
  setUseWardrobe: (value: boolean) => void;
  wardrobeOnly: boolean;
  setWardrobeOnly: (value: boolean) => void;
  isLoadingOutfits: boolean;
}) {
  return (
    <div className="fade-up" style={{ padding: '20px', paddingBottom: '120px' }}>
      {/* Hero */}
      <div style={{ textAlign: 'center', marginBottom: '24px' }}>
        <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '32px', fontWeight: 600, marginBottom: '8px' }}>
          <span className="shimmer-text">Style Your Look</span>
        </h2>
        <p style={{ fontSize: '14px', color: '#888', fontStyle: 'italic' }}>
          Curated outfits for every moment
        </p>
      </div>

      {/* Who Are You Styling? - PROMINENT AT TOP */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(212, 175, 55, 0.1), rgba(212, 175, 55, 0.05))',
        borderRadius: '20px',
        padding: '20px',
        marginBottom: '20px',
        border: '1px solid rgba(212, 175, 55, 0.2)'
      }}>
        <SectionLabel marginBottom="0">Who Are You Styling For?</SectionLabel>
        <div style={{ marginTop: '12px' }}>
          <StylingForSelector stylingFor={stylingFor} setStylingFor={setStylingFor} />
        </div>
      </div>

      <ProgressIndicator selectedCount={selectedCount} />

      {/* Occasion */}
      <SectionLabel>Occasion</SectionLabel>
      <div style={{ display: 'flex', gap: '12px' }}>
        <SelectionCard emoji="🎓" label="College" subtitle="Casual Campus" selected={occasion === 'College'} onClick={() => setOccasion('College')} />
        <SelectionCard emoji="💝" label="Date Night" subtitle="Romantic Vibes" selected={occasion === 'Date Night'} onClick={() => setOccasion('Date Night')} />
        <SelectionCard emoji="🎉" label="Party" subtitle="Stand Out" selected={occasion === 'Party'} onClick={() => setOccasion('Party')} />
      </div>

      {/* Shoe Color */}
      <SectionLabel>Shoe Color</SectionLabel>
      <div style={{ display: 'flex', gap: '12px' }}>
        <ShoeColorSwatch color="black" selected={shoeColor === 'Black'} onClick={() => setShoeColor('Black')} />
        <ShoeColorSwatch color="white" selected={shoeColor === 'White'} onClick={() => setShoeColor('White')} />
        <ShoeColorSwatch color="brown" selected={shoeColor === 'Brown'} onClick={() => setShoeColor('Brown')} />
      </div>

      {/* Mood */}
      <SectionLabel>Mood</SectionLabel>
      <div style={{ display: 'flex', gap: '12px' }}>
        <SelectionCard emoji="😊" label="Casual" subtitle="Relaxed & Easy" selected={mood === 'Casual'} onClick={() => setMood('Casual')} />
        <SelectionCard emoji="🦁" label="Confident" subtitle="Bold & Sharp" selected={mood === 'Confident'} onClick={() => setMood('Confident')} />
        <SelectionCard emoji="🧘" label="Minimal" subtitle="Clean & Simple" selected={mood === 'Minimal'} onClick={() => setMood('Minimal')} />
      </div>

      {/* Style Preferences */}
      <div style={{ marginTop: '28px' }}>
        <button onClick={() => setShowPreferences(!showPreferences)} style={{
          background: 'none', border: '1px solid rgba(212, 175, 55, 0.2)',
          borderRadius: '12px', padding: '12px 16px', width: '100%',
          cursor: 'pointer', display: 'flex', alignItems: 'center',
          justifyContent: 'space-between', color: '#888'
        }}>
          <span style={{ fontSize: '13px' }}>Style Preferences</span>
          <span style={{ 
            transform: showPreferences ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.2s'
          }}>▼</span>
        </button>
        
        {showPreferences && (
          <div style={{
            background: 'rgba(26, 24, 0, 0.5)', borderRadius: '12px',
            padding: '16px', marginTop: '12px',
            border: '1px solid rgba(212, 175, 55, 0.1)'
          }}>
            {/* Weather */}
            <div style={{ marginBottom: '16px' }}>
              <label style={{
                display: 'block', fontSize: '11px', color: '#888',
                marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '1px'
              }}>
                Weather
              </label>
              <div style={{ display: 'flex', gap: '8px' }}>
                {['hot', 'mild', 'cold'].map(w => (
                  <button key={w} onClick={() => setWeather(w)} style={{
                    flex: 1, padding: '8px 12px',
                    background: weather === w ? 'rgba(212, 175, 55, 0.2)' : 'transparent',
                    border: weather === w ? '1px solid #D4AF37' : '1px solid rgba(212, 175, 55, 0.2)',
                    borderRadius: '8px', color: weather === w ? '#D4AF37' : '#888',
                    fontSize: '12px', cursor: 'pointer', transition: 'all 0.2s'
                  }}>
                    {w.charAt(0).toUpperCase() + w.slice(1)}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Formality - Slider */}
            <div style={{ marginBottom: '24px' }}>
              <label style={{
                display: 'block', fontSize: '11px', color: '#888',
                marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '1px'
              }}>
                Formality
              </label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ fontSize: '12px', color: '#888' }}>Street</span>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={formality}
                  onChange={(e) => setFormality(parseInt(e.target.value))}
                  style={{
                    flex: 1,
                    WebkitAppearance: 'none',
                    appearance: 'none',
                    height: '4px',
                    background: `linear-gradient(90deg, #D4AF37 ${formality}%, rgba(212, 175, 55, 0.1) ${formality}%)`,
                    borderRadius: '2px',
                    outline: 'none'
                  }}
                  className="formality-slider"
                />
                <span style={{ fontSize: '12px', color: '#888' }}>Formal</span>
              </div>
            </div>
            
            {/* Budget */}
            <div>
              <label style={{
                display: 'block', fontSize: '11px', color: '#888',
                marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '1px'
              }}>
                Budget
              </label>
              <div style={{ display: 'flex', gap: '8px' }}>
                {['budget', 'mid', 'premium'].map(b => (
                  <button key={b} onClick={() => setBudget(b)} style={{
                    flex: 1, padding: '8px 12px',
                    background: budget === b ? 'rgba(212, 175, 55, 0.2)' : 'transparent',
                    border: budget === b ? '1px solid #D4AF37' : '1px solid rgba(212, 175, 55, 0.2)',
                    borderRadius: '8px', color: budget === b ? '#D4AF37' : '#888',
                    fontSize: '12px', cursor: 'pointer', transition: 'all 0.2s'
                  }}>
                    {b.charAt(0).toUpperCase() + b.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Wardrobe Toggle */}
      {wardrobe && wardrobe.length >= 3 && (
        <div style={{
          background: 'rgba(26, 24, 0, 0.5)',
          borderRadius: '12px',
          padding: '12px 16px',
          marginBottom: '16px',
          border: '1px solid rgba(212, 175, 55, 0.15)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: useWardrobe ? '12px' : '0' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '18px' }}>👔</span>
              <div>
                <span style={{ fontSize: '13px', color: '#fff', fontWeight: 500 }}>Use My Wardrobe</span>
                <span style={{ fontSize: '11px', color: '#888', display: 'block' }}>{wardrobe.length} items available</span>
              </div>
            </div>
            <button
              onClick={() => {
                setUseWardrobe(!useWardrobe);
                if (useWardrobe) setWardrobeOnly(false);
              }}
              style={{
                width: '48px',
                height: '28px',
                borderRadius: '14px',
                background: useWardrobe ? 'linear-gradient(135deg, #D4AF37, #FFD700)' : 'rgba(212, 175, 55, 0.2)',
                border: 'none',
                cursor: 'pointer',
                position: 'relative',
                transition: 'all 0.2s'
              }}
            >
              <div style={{
                width: '22px',
                height: '22px',
                borderRadius: '50%',
                background: useWardrobe ? '#0a0a0a' : '#666',
                position: 'absolute',
                top: '3px',
                left: useWardrobe ? '23px' : '3px',
                transition: 'all 0.2s'
              }} />
            </button>
          </div>
          
          {/* Wardrobe Only Mode - shown when wardrobe is enabled */}
          {useWardrobe && (
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between',
              paddingTop: '12px',
              borderTop: '1px solid rgba(212, 175, 55, 0.1)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '16px' }}>🔒</span>
                <span style={{ fontSize: '12px', color: wardrobeOnly ? '#D4AF37' : '#888' }}>
                  Wardrobe Only (no fallback)
                </span>
              </div>
              <button
                onClick={() => setWardrobeOnly(!wardrobeOnly)}
                style={{
                  width: '40px',
                  height: '24px',
                  borderRadius: '12px',
                  background: wardrobeOnly ? 'linear-gradient(135deg, #D4AF37, #FFD700)' : 'rgba(212, 175, 55, 0.15)',
                  border: 'none',
                  cursor: 'pointer',
                  position: 'relative',
                  transition: 'all 0.2s'
                }}
              >
                <div style={{
                  width: '18px',
                  height: '18px',
                  borderRadius: '50%',
                  background: wardrobeOnly ? '#0a0a0a' : '#555',
                  position: 'absolute',
                  top: '3px',
                  left: wardrobeOnly ? '19px' : '3px',
                  transition: 'all 0.2s'
                }} />
              </button>
            </div>
          )}
        </div>
      )}

      {/* Buttons */}
      <div style={{ marginTop: '32px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <button 
          onClick={generateOutfits} 
          disabled={!isComplete || isLoadingOutfits} 
          style={{
            background: isComplete && !isLoadingOutfits
              ? 'linear-gradient(135deg, #D4AF37, #FFD700, #D4AF37)'
              : 'rgba(40, 38, 30, 0.8)',
            border: 'none', borderRadius: '16px', padding: '18px 32px',
            fontSize: '16px', fontWeight: 600,
            color: isComplete && !isLoadingOutfits ? '#0a0a0a' : '#444',
            cursor: isComplete && !isLoadingOutfits ? 'pointer' : 'not-allowed',
            transition: 'all 0.3s ease',
            boxShadow: isComplete && !isLoadingOutfits ? '0 0 30px rgba(212, 175, 55, 0.4)' : 'none',
            animation: isComplete && !isLoadingOutfits ? 'glow 2s ease-in-out infinite' : 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
          }}>
          {isLoadingOutfits ? (
            <>
              <div style={{
                width: 18, height: 18,
                border: '2px solid rgba(10, 10, 10, 0.3)',
                borderTopColor: '#0a0a0a',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite',
              }} />
              Loading...
            </>
          ) : (
            '✦ Get My Outfit'
          )}
        </button>
        
        <button 
          onClick={surpriseMe} 
          disabled={isLoadingOutfits}
          style={{
            background: 'transparent', 
            border: '1px solid rgba(212, 175, 55, 0.3)',
            borderRadius: '16px', padding: '16px 32px',
            fontSize: '14px', fontWeight: 500, 
            color: isLoadingOutfits ? '#666' : '#D4AF37',
            cursor: isLoadingOutfits ? 'not-allowed' : 'pointer', 
            transition: 'all 0.2s',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
          }}>
          {isLoadingOutfits ? (
            <>
              <div style={{
                width: 14, height: 14,
                border: '2px solid rgba(212, 175, 55, 0.3)',
                borderTopColor: '#D4AF37',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite',
              }} />
              Loading...
            </>
          ) : (
            '🔀 Shuffle'
          )}
        </button>
      </div>
    </div>
  );
}

// ============================================
// OUTFIT ITEM CARD - CLEAN MODERN STYLE (100px images)
// ============================================
function OutfitItemCard({ category, item, wardrobeItems }: {
  category: string;
  item: ClothingItem;
  wardrobeItems?: WardrobeItem[];
}) {
  // If no imageKey, return null to hide the row
  if (!item.imageKey || item.imageKey === '') {
    return null;
  }
  
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: 16,
    }}>
      {/* Thumbnail - 100px x 100px with rounded corners and shadow */}
      <ClothingImage 
        imageKey={item.imageKey} 
        alt={item.name}
        size={100}
        wardrobeItems={wardrobeItems}
        clothingItem={item}
      />
      
      {/* Item Details */}
      <div style={{ flex: 1 }}>
        <span style={{
          display: 'block',
          fontSize: 12,
          color: '#888',
          marginBottom: 4,
          fontWeight: 500,
          textTransform: 'uppercase',
          letterSpacing: 0.5,
        }}>
          {category}
        </span>
        <span style={{
          display: 'block',
          fontSize: 16,
          color: '#fff',
          fontWeight: 500,
        }}>
          {item.name}
        </span>
      </div>
    </div>
  );
}

// ============================================
// RESULTS SCREEN - MODERN FASHION APP STYLE
// ============================================
function ResultsScreen({
  stylingFor,
  occasion, shoeColor, mood,
  outfits, currentOutfitIndex, setCurrentOutfitIndex,
  saveAnimation, saveOutfit, rateOutfit,
  resetFilters, surpriseMe,
  wardrobeItems
}) {
  const currentOutfit = outfits[currentOutfitIndex];
  
  if (!currentOutfit) return null;

  // Get category labels for current styling group
  const categoryLabels = CATEGORY_LABELS[stylingFor] || CATEGORY_LABELS.men;

  // Generate outfit name and subtitle
  const generateOutfitName = (top: ClothingItem) => {
    const words = top.name.split(' ');
    if (words.length >= 2) {
      return `${words[words.length - 2]} ${words[words.length - 1]} Outfit`;
    }
    return `${top.name} Outfit`;
  };

  const generateStyleSubtitle = (mood: string, occasion: string) => {
    const moodStyles: Record<string, string> = {
      'Casual': 'Relaxed',
      'Confident': 'Bold',
      'Minimal': 'Clean'
    };
    const occasionStyles: Record<string, string> = {
      'College': 'Campus Style',
      'Date Night': 'Evening Look',
      'Party': 'Night Out'
    };
    return `${moodStyles[mood] || 'Stylish'} ${occasionStyles[occasion] || 'Look'}`;
  };

  const outfitName = generateOutfitName(currentOutfit.top);
  const styleSubtitle = generateStyleSubtitle(mood, occasion);

  const items: { category: string; item: ClothingItem }[] = [
    { category: categoryLabels.top, item: currentOutfit.top },
    { category: categoryLabels.bottom, item: currentOutfit.bottom },
    { category: categoryLabels.shoes, item: currentOutfit.shoes },
    { category: categoryLabels.accessory1, item: currentOutfit.accessory1 },
    { category: categoryLabels.accessory2, item: currentOutfit.accessory2 }
  ].filter(i => i.item.imageKey && i.item.imageKey !== ''); // Hide items without images
  
  return (
    <div className="fade-up" style={{ paddingBottom: '140px' }}>
      {/* Hero Section - Image + Title Below */}
      <HeroOutfitCard 
        top={currentOutfit.top}
        outfitName={outfitName}
        styleSubtitle={styleSubtitle}
      />

      {/* Content Section */}
      <div style={{ padding: '32px 20px 0' }}>
        
        {/* Outfit Counter Pills */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: 12,
          marginBottom: 16
        }}>
          {outfits.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentOutfitIndex(i)}
              style={{
                width: i === currentOutfitIndex ? 32 : 10,
                height: 10,
                borderRadius: 5,
                background: i === currentOutfitIndex 
                  ? 'linear-gradient(90deg, #D4AF37, #FFD700)' 
                  : 'rgba(212, 175, 55, 0.2)',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                padding: 0
              }}
            />
          ))}
        </div>
        
        {/* Formality Level Indicator */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: 8,
          marginBottom: 24
        }}>
          <span style={{
            fontSize: 11,
            color: currentOutfit.formalityLevel <= 30 ? '#D4AF37' : currentOutfit.formalityLevel <= 70 ? '#B8860B' : '#FFD700',
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: 1
          }}>
            {currentOutfit.formalityLevel <= 30 ? 'Street Style' : currentOutfit.formalityLevel <= 70 ? 'Smart Casual' : 'Formal'}
          </span>
          <span style={{ fontSize: 10, color: '#666' }}>
            ({currentOutfit.formalityLevel}%)
          </span>
        </div>

        {/* Outfit Breakdown - Clean Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr',
          gap: 20,
          marginBottom: 32
        }}>
          {items.map((item, i) => (
            <OutfitItemCard
              key={i}
              category={item.category}
              item={item.item}
              wardrobeItems={wardrobeItems}
            />
          ))}
        </div>

        {/* Style Tip Card */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(212, 175, 55, 0.08), rgba(212, 175, 55, 0.02))',
          borderRadius: 16,
          padding: '20px',
          marginBottom: 28,
        }}>
          <p style={{
            fontSize: 14,
            color: 'rgba(255,255,255,0.75)',
            lineHeight: 1.7,
            fontStyle: 'italic',
          }}>
            💡 {currentOutfit.tip}
          </p>
        </div>

        {/* Style Tags */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: 8,
          marginBottom: 28,
          flexWrap: 'wrap'
        }}>
          {currentOutfit.tags.map((tag, i) => (
            <span key={i} style={{
              background: 'rgba(212, 175, 55, 0.08)',
              borderRadius: 16,
              padding: '6px 14px',
              fontSize: 12,
              color: '#D4AF37',
              fontWeight: 500
            }}>
              {tag}
            </span>
          ))}
        </div>

        {/* Rating */}
        <div style={{
          textAlign: 'center',
          marginBottom: 28
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: 6
          }}>
            {[1, 2, 3, 4, 5].map(star => (
              <button 
                key={star} 
                onClick={() => rateOutfit(star)} 
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: 26,
                  cursor: 'pointer',
                  filter: star <= currentOutfit.rating 
                    ? 'drop-shadow(0 0 6px rgba(212, 175, 55, 0.6))'
                    : 'none',
                  transition: 'transform 0.2s',
                  padding: 0
                }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.15)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
              >
                {star <= currentOutfit.rating ? '★' : '☆'}
              </button>
            ))}
          </div>
        </div>

        {/* Pagination */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 24
        }}>
          <button 
            onClick={() => setCurrentOutfitIndex(Math.max(0, currentOutfitIndex - 1))}
            disabled={currentOutfitIndex === 0}
            style={{
              background: 'transparent',
              border: 'none',
              borderRadius: 12,
              padding: '12px 16px',
              fontSize: 15,
              color: currentOutfitIndex === 0 ? '#333' : '#D4AF37',
              cursor: currentOutfitIndex === 0 ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s',
              fontWeight: 500
            }}
          >
            ← Prev
          </button>
          
          <span style={{
            fontSize: 13,
            color: '#666',
          }}>
            {currentOutfitIndex + 1} of {outfits.length}
          </span>
          
          <button 
            onClick={() => setCurrentOutfitIndex(Math.min(outfits.length - 1, currentOutfitIndex + 1))}
            disabled={currentOutfitIndex === outfits.length - 1}
            style={{
              background: 'transparent',
              border: 'none',
              borderRadius: 12,
              padding: '12px 16px',
              fontSize: 15,
              color: currentOutfitIndex === outfits.length - 1 ? '#333' : '#D4AF37',
              cursor: currentOutfitIndex === outfits.length - 1 ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s',
              fontWeight: 500
            }}
          >
            Next →
          </button>
        </div>

        {/* Save Button */}
        <button 
          onClick={saveOutfit} 
          className={saveAnimation ? 'bounce-save' : ''} 
          style={{
            width: '100%',
            background: saveAnimation 
              ? 'linear-gradient(135deg, #22c55e, #16a34a)'
              : 'linear-gradient(135deg, #D4AF37, #FFD700, #D4AF37)',
            border: 'none',
            borderRadius: 14,
            padding: '16px 32px',
            fontSize: 15,
            fontWeight: 600,
            color: saveAnimation ? '#fff' : '#0a0a0a',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            boxShadow: saveAnimation 
              ? '0 0 25px rgba(34, 197, 94, 0.4)' 
              : '0 0 25px rgba(212, 175, 55, 0.25)'
          }}
        >
          {saveAnimation ? '✓ Saved to Wardrobe' : '✦ Save Outfit'}
        </button>

        {/* Secondary Actions */}
        <div style={{
          display: 'flex',
          gap: 12,
          marginTop: 12
        }}>
          <button 
            onClick={resetFilters} 
            style={{
              flex: 1,
              background: 'transparent',
              border: '1px solid rgba(212, 175, 55, 0.2)',
              borderRadius: 12,
              padding: '12px 16px',
              fontSize: 13,
              color: '#D4AF37',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            ↺ New Style
          </button>
          <button 
            onClick={surpriseMe} 
            style={{
              flex: 1,
              background: 'transparent',
              border: '1px solid rgba(212, 175, 55, 0.2)',
              borderRadius: 12,
              padding: '12px 16px',
              fontSize: 13,
              color: '#D4AF37',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            🔀 Shuffle
          </button>
        </div>
      </div>
    </div>
  );
}

// ============================================
// WARDROBE SCREEN - User uploaded clothing
// ============================================
type WardrobeItem = {
  id: string;
  category: 'top' | 'bottom' | 'shoes' | 'accessory1' | 'accessory2';
  name: string;
  image: string;
  color: string;
  uploadedAt: number;
};

const CATEGORY_OPTIONS = [
  { id: 'top', label: 'Shirt / Top', emoji: '👕' },
  { id: 'bottom', label: 'Pants / Bottoms', emoji: '👖' },
  { id: 'shoes', label: 'Shoes', emoji: '👟' },
  { id: 'accessory1', label: 'Watch / Bag', emoji: '⌚' },
  { id: 'accessory2', label: 'Accessories', emoji: '💎' },
];

function WardrobeScreen({ wardrobe, setWardrobe, stylingFor, setScreen, setUseWardrobe, setWardrobeOnly }: {
  wardrobe: WardrobeItem[];
  setWardrobe: React.Dispatch<React.SetStateAction<WardrobeItem[]>>;
  stylingFor: string;
  setScreen: (screen: string) => void;
  setUseWardrobe: (value: boolean) => void;
  setWardrobeOnly: (value: boolean) => void;
}) {
  const [showUpload, setShowUpload] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('top');
  const [itemName, setItemName] = useState('');
  const [itemColor, setItemColor] = useState('');
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const categoryLabels = CATEGORY_LABELS[stylingFor] || CATEGORY_LABELS.men;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setPreviewImage(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const addItemToWardrobe = () => {
    if (!itemName || !previewImage) return;
    
    const newItem: WardrobeItem = {
      id: `wardrobe-${Date.now()}`,
      category: selectedCategory as WardrobeItem['category'],
      name: itemName,
      image: previewImage,
      color: itemColor,
      uploadedAt: Date.now()
    };
    
    setWardrobe((prev: WardrobeItem[]) => [newItem, ...prev]);
    setItemName('');
    setItemColor('');
    setPreviewImage(null);
    setShowUpload(false);
  };

  const deleteItem = (id: string) => {
    setWardrobe((prev: WardrobeItem[]) => prev.filter(item => item.id !== id));
  };

  const filteredWardrobe = wardrobe.filter(item => item.category);

  return (
    <div className="fade-up" style={{ padding: '20px', paddingBottom: '120px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '28px', fontWeight: 600, marginBottom: '4px' }}>
            <span className="shimmer-text">My Wardrobe</span>
          </h2>
          <p style={{ fontSize: '14px', color: '#888' }}>{wardrobe.length} items uploaded</p>
        </div>
        <button 
          onClick={() => setShowUpload(!showUpload)}
          style={{
            background: 'linear-gradient(135deg, #D4AF37, #FFD700)',
            border: 'none', borderRadius: '12px', padding: '12px 16px',
            fontSize: '13px', fontWeight: 600, color: '#0a0a0a',
            cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px'
          }}
        >
          <span>+</span> Add Item
        </button>
      </div>

      {/* Upload Panel */}
      {showUpload && (
        <div style={{
          background: 'rgba(26, 24, 0, 0.6)',
          border: '1px solid rgba(212, 175, 55, 0.2)',
          borderRadius: '16px', padding: '20px', marginBottom: '24px'
        }}>
          <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '16px', color: '#D4AF37' }}>
            Add New Item
          </h3>
          
          {/* Category Selection */}
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '11px', color: '#888', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '1px' }}>
              Category
            </label>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {CATEGORY_OPTIONS.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  style={{
                    padding: '8px 12px',
                    background: selectedCategory === cat.id ? 'rgba(212, 175, 55, 0.2)' : 'transparent',
                    border: selectedCategory === cat.id ? '1px solid #D4AF37' : '1px solid rgba(212, 175, 55, 0.2)',
                    borderRadius: '8px', fontSize: '11px', cursor: 'pointer',
                    color: selectedCategory === cat.id ? '#D4AF37' : '#888', display: 'flex', alignItems: 'center', gap: '4px'
                  }}
                >
                  <span>{cat.emoji}</span> {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Image Upload */}
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '11px', color: '#888', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '1px' }}>
              Photo
            </label>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              style={{ display: 'none' }}
            />
            <div 
              onClick={() => fileInputRef.current?.click()}
              style={{
                width: '100%', height: '120px',
                border: '2px dashed rgba(212, 175, 55, 0.3)',
                borderRadius: '12px', display: 'flex',
                flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', background: previewImage ? 'transparent' : 'rgba(212, 175, 55, 0.05)',
                overflow: 'hidden'
              }}
            >
              {previewImage ? (
                <img src={previewImage} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <>
                  <span style={{ fontSize: '32px', marginBottom: '8px', opacity: 0.5 }}>📷</span>
                  <span style={{ fontSize: '12px', color: '#888' }}>Tap to upload photo</span>
                </>
              )}
            </div>
          </div>

          {/* Item Name */}
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '11px', color: '#888', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '1px' }}>
              Name
            </label>
            <input
              type="text"
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
              placeholder="e.g., Navy Blue Blazer"
              style={{
                width: '100%', padding: '12px 16px',
                background: 'rgba(10, 10, 10, 0.6)',
                border: '1px solid rgba(212, 175, 55, 0.2)',
                borderRadius: '10px', fontSize: '14px', color: '#fff',
                outline: 'none'
              }}
            />
          </div>

          {/* Color */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '11px', color: '#888', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '1px' }}>
              Primary Color (optional)
            </label>
            <input
              type="text"
              value={itemColor}
              onChange={(e) => setItemColor(e.target.value)}
              placeholder="e.g., Navy, White, Black"
              style={{
                width: '100%', padding: '12px 16px',
                background: 'rgba(10, 10, 10, 0.6)',
                border: '1px solid rgba(212, 175, 55, 0.2)',
                borderRadius: '10px', fontSize: '14px', color: '#fff',
                outline: 'none'
              }}
            />
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              onClick={() => setShowUpload(false)}
              style={{
                flex: 1, padding: '12px',
                background: 'transparent',
                border: '1px solid rgba(212, 175, 55, 0.2)',
                borderRadius: '10px', fontSize: '14px', color: '#888', cursor: 'pointer'
              }}
            >
              Cancel
            </button>
            <button
              onClick={addItemToWardrobe}
              disabled={!itemName || !previewImage}
              style={{
                flex: 1, padding: '12px',
                background: itemName && previewImage ? 'linear-gradient(135deg, #D4AF37, #FFD700)' : '#333',
                border: 'none', borderRadius: '10px',
                fontSize: '14px', fontWeight: 600, color: itemName && previewImage ? '#0a0a0a' : '#666',
                cursor: itemName && previewImage ? 'pointer' : 'not-allowed'
              }}
            >
              Add to Wardrobe
            </button>
          </div>
        </div>
      )}

      {/* Wardrobe Items by Category */}
      {wardrobe.length === 0 && !showUpload ? (
        <div style={{ textAlign: 'center', padding: '60px 20px' }}>
          <div style={{ fontSize: '80px', marginBottom: '20px', opacity: 0.5 }}>👔</div>
          <h3 style={{ fontFamily: 'Georgia, serif', fontSize: '20px', color: '#888', marginBottom: '12px' }}>
            Your wardrobe is empty
          </h3>
          <p style={{ fontSize: '14px', color: '#666', marginBottom: '24px' }}>
            Upload photos of your clothes to get personalized outfit recommendations
          </p>
          <button
            onClick={() => setShowUpload(true)}
            style={{
              background: 'linear-gradient(135deg, #D4AF37, #FFD700)',
              border: 'none', borderRadius: '12px', padding: '14px 28px',
              fontSize: '14px', fontWeight: 600, color: '#0a0a0a', cursor: 'pointer'
            }}
          >
            + Add Your First Item
          </button>
        </div>
      ) : (
        Object.entries(CATEGORY_OPTIONS).map(([_, cat]) => {
          const items = wardrobe.filter(item => item.category === cat.id);
          if (items.length === 0) return null;
          
          return (
            <div key={cat.id} style={{ marginBottom: '24px' }}>
              <h4 style={{ fontSize: '13px', fontWeight: 600, color: '#D4AF37', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span>{cat.emoji}</span> {cat.label}
                <span style={{ fontSize: '11px', color: '#666', fontWeight: 400 }}>({items.length})</span>
              </h4>
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                {items.map(item => (
                  <div key={item.id} style={{
                    width: '100px', position: 'relative',
                    background: 'rgba(26, 24, 0, 0.6)',
                    borderRadius: '12px', overflow: 'hidden',
                    border: '1px solid rgba(212, 175, 55, 0.15)'
                  }}>
                    <img src={item.image} alt={item.name} style={{ width: '100%', height: '100px', objectFit: 'cover' }} />
                    <div style={{ padding: '8px' }}>
                      <p style={{ fontSize: '10px', color: '#fff', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {item.name}
                      </p>
                      {item.color && <p style={{ fontSize: '9px', color: '#888' }}>{item.color}</p>}
                    </div>
                    <button
                      onClick={() => deleteItem(item.id)}
                      style={{
                        position: 'absolute', top: '4px', right: '4px',
                        width: '20px', height: '20px',
                        background: 'rgba(0,0,0,0.7)', border: 'none',
                        borderRadius: '50%', color: '#ff4444', fontSize: '12px',
                        cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center'
                      }}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
          );
        })
      )}

      {/* Use Wardrobe Button */}
      {wardrobe.length >= 3 && (
        <button
          onClick={() => {
            setUseWardrobe(true);
            setWardrobeOnly(true);
            setScreen('home');
          }}
          style={{
            width: '100%', padding: '14px',
            background: 'linear-gradient(135deg, rgba(212, 175, 55, 0.2), rgba(255, 215, 0, 0.1))',
            border: '1px solid #D4AF37',
            borderRadius: '12px', fontSize: '14px', fontWeight: 600,
            color: '#D4AF37', cursor: 'pointer', marginTop: '16px'
          }}
        >
          ✦ Generate Outfit From My Wardrobe
        </button>
      )}
    </div>
  );
}

// ============================================
// EXPLORE SCREEN - Trending outfit inspirations
// ============================================
const TRENDING_OUTFITS = [
  {
    id: 'trend-1',
    title: 'Cozy Autumn Layers',
    description: 'Warm textures and earth tones',
    image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=400',
    tags: ['Autumn', 'Layering', 'Warm'],
    items: ['Chunky Knit Sweater', 'Corduroy Pants', 'Chelsea Boots', 'Wool Scarf']
  },
  {
    id: 'trend-2',
    title: 'Minimalist Street Style',
    description: 'Clean lines, monochrome palette',
    image: 'https://images.unsplash.com/photo-1516826957135-700dedea698c?w=400',
    tags: ['Minimal', 'Street', 'Clean'],
    items: ['Oversized White Tee', 'Black Wide-Leg Pants', 'Platform Sneakers', 'Silver Chain']
  },
  {
    id: 'trend-3',
    title: 'Smart Casual Friday',
    description: 'Office to evening transition',
    image: 'https://images.unsplash.com/photo-1507680434567-5739c80be1ac?w=400',
    tags: ['Smart Casual', 'Office', 'Versatile'],
    items: ['Navy Blazer', 'White Oxford', 'Khaki Chinos', 'Brown Loafers', 'Classic Watch']
  },
  {
    id: 'trend-4',
    title: 'Weekend Wanderer',
    description: 'Comfortable yet stylish',
    image: 'https://images.unsplash.com/photo-1484627147104-f9f3f0e66f5d?w=400',
    tags: ['Weekend', 'Casual', 'Comfortable'],
    items: ['Graphic Hoodie', 'Distressed Jeans', 'White Sneakers', 'Canvas Backpack']
  },
  {
    id: 'trend-5',
    title: 'Date Night Elegance',
    description: 'Sophisticated evening look',
    image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=400',
    tags: ['Date Night', 'Elegant', 'Romantic'],
    items: ['Silk Button-Up', 'Slim Black Trousers', 'Chelsea Boots', 'Gold Watch']
  },
  {
    id: 'trend-6',
    title: 'Festival Ready',
    description: 'Bold and expressive style',
    image: 'https://images.unsplash.com/photo-1523398002811-999ca8dec234?w=400',
    tags: ['Festival', 'Bold', 'Expressive'],
    items: ['Printed Shirt', 'Denim Shorts', 'Combat Boots', 'Statement Accessories']
  }
];

function ExploreScreen({ setScreen, setMood, setOccasion }) {
  const [selectedTrend, setSelectedTrend] = useState<typeof TRENDING_OUTFITS[0] | null>(null);

  const recreateLook = (trend: typeof TRENDING_OUTFITS[0]) => {
    // Set mood and occasion based on trend tags
    if (trend.tags.includes('Casual') || trend.tags.includes('Weekend')) {
      setMood('Casual');
    } else if (trend.tags.includes('Elegant') || trend.tags.includes('Date Night')) {
      setMood('Confident');
    } else {
      setMood('Minimal');
    }
    
    if (trend.tags.includes('Date Night')) {
      setOccasion('Date Night');
    } else if (trend.tags.includes('Office') || trend.tags.includes('Smart Casual')) {
      setOccasion('College');
    } else if (trend.tags.includes('Festival') || trend.tags.includes('Bold')) {
      setOccasion('Party');
    } else {
      setOccasion('College');
    }
    
    setScreen('home');
  };

  return (
    <div className="fade-up" style={{ padding: '20px', paddingBottom: '120px' }}>
      <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '28px', fontWeight: 600, marginBottom: '8px' }}>
        <span className="shimmer-text">Explore</span>
      </h2>
      <p style={{ fontSize: '14px', color: '#888', marginBottom: '24px' }}>
        Discover trending outfit inspirations
      </p>

      {/* Trending Grid */}
      <div style={{ display: 'grid', gap: '16px' }}>
        {TRENDING_OUTFITS.map(trend => (
          <div 
            key={trend.id}
            style={{
              background: 'rgba(26, 24, 0, 0.6)',
              borderRadius: '16px',
              overflow: 'hidden',
              border: '1px solid rgba(212, 175, 55, 0.15)',
              cursor: 'pointer',
              transition: 'transform 0.2s, box-shadow 0.2s'
            }}
            onClick={() => setSelectedTrend(trend)}
          >
            <div style={{ position: 'relative', height: '180px' }}>
              <img 
                src={trend.image} 
                alt={trend.title}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              <div style={{
                position: 'absolute', inset: 0,
                background: 'linear-gradient(to top, rgba(10,10,10,0.9) 0%, transparent 60%)'
              }} />
              <div style={{
                position: 'absolute', bottom: '12px', left: '16px', right: '16px'
              }}>
                <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '4px' }}>
                  {trend.title}
                </h3>
                <p style={{ fontSize: '12px', color: '#888' }}>{trend.description}</p>
              </div>
            </div>
            
            {/* Tags */}
            <div style={{ padding: '12px 16px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {trend.tags.map(tag => (
                <span key={tag} style={{
                  background: 'rgba(212, 175, 55, 0.1)',
                  borderRadius: '12px', padding: '4px 10px',
                  fontSize: '10px', color: '#D4AF37', fontWeight: 500
                }}>
                  {tag}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Trend Detail Modal */}
      {selectedTrend && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.9)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 200, padding: '20px'
        }} onClick={() => setSelectedTrend(null)}>
          <div 
            style={{
              background: '#1a1a1a',
              borderRadius: '20px',
              maxWidth: '380px', width: '100%',
              maxHeight: '80vh', overflow: 'auto'
            }}
            onClick={e => e.stopPropagation()}
          >
            <img 
              src={selectedTrend.image} 
              alt={selectedTrend.title}
              style={{ width: '100%', height: '200px', objectFit: 'cover' }}
            />
            <div style={{ padding: '20px' }}>
              <h3 style={{ fontSize: '22px', fontWeight: 600, marginBottom: '8px' }}>
                {selectedTrend.title}
              </h3>
              <p style={{ fontSize: '14px', color: '#888', marginBottom: '16px' }}>
                {selectedTrend.description}
              </p>
              
              {/* Items List */}
              <div style={{ marginBottom: '20px' }}>
                <h4 style={{ fontSize: '12px', color: '#D4AF37', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '1px' }}>
                  Key Pieces
                </h4>
                {selectedTrend.items.map((item, i) => (
                  <div key={i} style={{
                    display: 'flex', alignItems: 'center', gap: '12px',
                    padding: '10px 0', borderBottom: '1px solid rgba(212, 175, 55, 0.1)'
                  }}>
                    <div style={{
                      width: '8px', height: '8px', background: '#D4AF37', borderRadius: '50%'
                    }} />
                    <span style={{ fontSize: '14px' }}>{item}</span>
                  </div>
                ))}
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', gap: '12px' }}>
                <button
                  onClick={() => setSelectedTrend(null)}
                  style={{
                    flex: 1, padding: '14px',
                    background: 'transparent',
                    border: '1px solid rgba(212, 175, 55, 0.2)',
                    borderRadius: '12px', fontSize: '14px', color: '#888', cursor: 'pointer'
                  }}
                >
                  Close
                </button>
                <button
                  onClick={() => recreateLook(selectedTrend)}
                  style={{
                    flex: 1, padding: '14px',
                    background: 'linear-gradient(135deg, #D4AF37, #FFD700)',
                    border: 'none', borderRadius: '12px',
                    fontSize: '14px', fontWeight: 600, color: '#0a0a0a', cursor: 'pointer'
                  }}
                >
                  ✦ Recreate Look
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================
// SAVED SCREEN
// ============================================
function SavedScreen({ savedOutfits, setSavedOutfits, setScreen, filterType, setFilterType, wardrobeItems }) {
  const filteredSaved = filterType === 'all' 
    ? savedOutfits 
    : savedOutfits.filter((o: any) => {
        if (filterType === 'College') return o.occasion === 'College';
        if (filterType === 'Date') return o.occasion === 'Date Night';
        if (filterType === 'Party') return o.occasion === 'Party';
        return true;
      });
  
  const deleteOutfit = (index: number) => {
    setSavedOutfits((prev: any[]) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="fade-up" style={{ padding: '20px', paddingBottom: '120px' }}>
      <h2 style={{
        fontFamily: 'Georgia, serif', fontSize: '28px',
        fontWeight: 600, marginBottom: '8px'
      }}>
        <span className="shimmer-text">My Wardrobe</span>
      </h2>
      <p style={{ fontSize: '14px', color: '#888', marginBottom: '24px' }}>
        {savedOutfits.length} saved outfits
      </p>

      {/* Filter Pills */}
      <div style={{
        display: 'flex', gap: '8px', marginBottom: '24px',
        overflowX: 'auto', paddingBottom: '8px'
      }}>
        {['all', 'College', 'Date', 'Party'].map(filter => (
          <button key={filter} onClick={() => setFilterType(filter)} style={{
            background: filterType === filter 
              ? 'rgba(212, 175, 55, 0.2)' : 'transparent',
            border: filterType === filter 
              ? '1px solid #D4AF37' : '1px solid rgba(212, 175, 55, 0.2)',
            borderRadius: '20px', padding: '8px 16px',
            fontSize: '12px', color: filterType === filter ? '#D4AF37' : '#888',
            cursor: 'pointer', whiteSpace: 'nowrap', transition: 'all 0.2s'
          }}>
            {filter === 'all' ? 'All' : filter}
          </button>
        ))}
      </div>

      {/* Empty State */}
      {savedOutfits.length === 0 && (
        <div style={{ textAlign: 'center', padding: '60px 20px' }}>
          <div style={{ fontSize: '80px', marginBottom: '20px', opacity: 0.5 }}>👔</div>
          <h3 style={{
            fontFamily: 'Georgia, serif', fontSize: '20px',
            color: '#888', marginBottom: '12px'
          }}>
            Your wardrobe is empty
          </h3>
          <p style={{ fontSize: '14px', color: '#666', marginBottom: '24px' }}>
            Start saving outfits to build your collection
          </p>
          <button onClick={() => setScreen('home')} style={{
            background: 'linear-gradient(135deg, #D4AF37, #FFD700)',
            border: 'none', borderRadius: '12px', padding: '14px 28px',
            fontSize: '14px', fontWeight: 600, color: '#0a0a0a',
            cursor: 'pointer'
          }}>
            Browse Outfits
          </button>
        </div>
      )}

      {/* Saved Outfit Cards */}
      {filteredSaved.map((outfit: any, index: number) => (
        <div key={outfit.savedAt} style={{
          background: 'rgba(26, 24, 0, 0.6)',
          border: '1px solid rgba(212, 175, 55, 0.15)',
          borderRadius: '20px', padding: '16px',
          marginBottom: '12px',
          display: 'flex', gap: '16px', alignItems: 'flex-start',
          position: 'relative'
        }}>
          {/* Delete Button */}
          <button onClick={() => deleteOutfit(savedOutfits.indexOf(outfit))} style={{
            position: 'absolute', top: '12px', right: '12px',
            background: 'rgba(255, 59, 48, 0.2)', border: 'none',
            borderRadius: '50%', width: '24px', height: '24px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', color: '#ff3b30', fontSize: '14px'
          }}>
            ×
          </button>

          {/* Outfit Image */}
          <ClothingImage 
            imageKey={outfit.top?.imageKey || ''}
            alt={outfit.top?.name || ''}
            size={80}
            wardrobeItems={wardrobeItems}
          />

          {/* Outfit Info */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <h4 style={{
              fontFamily: 'Georgia, serif', fontSize: '16px',
              fontWeight: 600, color: '#f5f5f5',
              marginBottom: '8px', paddingRight: '24px'
            }}>
              {outfit.top?.name}
            </h4>
            
            {/* Tags */}
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '8px' }}>
              <span style={{
                background: 'rgba(212, 175, 55, 0.1)',
                borderRadius: '8px', padding: '4px 8px',
                fontSize: '10px', color: '#D4AF37'
              }}>
                {outfit.occasion}
              </span>
              <span style={{
                background: 'rgba(212, 175, 55, 0.1)',
                borderRadius: '8px', padding: '4px 8px',
                fontSize: '10px', color: '#888'
              }}>
                {outfit.shoeColor} • {outfit.mood}
              </span>
            </div>
            
            {/* Accessory Chips */}
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '11px', color: '#666' }}>⌚ {outfit.accessory1?.name}</span>
              {outfit.accessory2?.name && outfit.accessory2.name !== 'None' && (
                <span style={{ fontSize: '11px', color: '#666' }}>💎 {outfit.accessory2.name}</span>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// ============================================
// MAIN APP COMPONENT
// ============================================
// LocalStorage key for wardrobe
const WARDROBE_STORAGE_KEY = 'drip-wardrobe-items';

// Helper to load wardrobe from localStorage
const loadWardrobeFromStorage = (): WardrobeItem[] => {
  if (typeof window === 'undefined') return [];
  try {
    const stored = localStorage.getItem(WARDROBE_STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed)) {
        return parsed;
      }
    }
  } catch (e) {
    console.error('Failed to load wardrobe from localStorage:', e);
  }
  return [];
};

export default function App() {
  const [screen, setScreen] = useState('home');
  const [stylingFor, setStylingFor] = useState('men');
  const [occasion, setOccasion] = useState<string | null>(null);
  const [shoeColor, setShoeColor] = useState<string | null>(null);
  const [mood, setMood] = useState<string | null>(null);
  const [weather, setWeather] = useState('mild');
  const [formality, setFormality] = useState(50); // 0-100: 50 = Smart Casual default
  const [budget, setBudget] = useState('mid');
  const [showPreferences, setShowPreferences] = useState(false);
  const [outfits, setOutfits] = useState<Outfit[]>([]);
  const [currentOutfitIndex, setCurrentOutfitIndex] = useState(0);
  const [savedOutfits, setSavedOutfits] = useState<any[]>([]);
  const [saveAnimation, setSaveAnimation] = useState(false);
  const [filterType, setFilterType] = useState('all');
  // Initialize wardrobe from localStorage using lazy initialization
  const [wardrobe, setWardrobe] = useState<WardrobeItem[]>(() => loadWardrobeFromStorage());
  const [useWardrobe, setUseWardrobe] = useState(false);
  const [wardrobeOnly, setWardrobeOnly] = useState(false); // Exclusive wardrobe mode
  const [shuffleSeed, setShuffleSeed] = useState(0); // Track shuffles for unique combinations
  const [isLoadingOutfits, setIsLoadingOutfits] = useState(false); // Loading state for outfit generation

  // Save wardrobe to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem(WARDROBE_STORAGE_KEY, JSON.stringify(wardrobe));
    } catch (e) {
      console.error('Failed to save wardrobe to localStorage:', e);
    }
  }, [wardrobe]);
  
  const selectedCount = [occasion, shoeColor, mood].filter(Boolean).length;
  const isComplete = selectedCount === 3;
  
  // Clothing pools for shuffle - includes both preset and wardrobe items
  const clothingPools = useMemo(() => {
    const outfitsData = ALL_OUTFITS[stylingFor] || ALL_OUTFITS.men;
    const tops: ClothingItem[] = [];
    const bottoms: ClothingItem[] = [];
    const shoes: ClothingItem[] = [];
    const acc1s: ClothingItem[] = [];
    const acc2s: ClothingItem[] = [];
    
    // Add preset outfits (skip if wardrobe-only mode)
    if (!wardrobeOnly) {
      Object.values(outfitsData).forEach(shoeColorData => {
        Object.values(shoeColorData).forEach(moodData => {
          Object.values(moodData).forEach((outfitList: Outfit[]) => {
            outfitList.forEach(outfit => {
              if (!tops.find(t => t.imageKey === outfit.top.imageKey)) tops.push(outfit.top);
              if (!bottoms.find(b => b.imageKey === outfit.bottom.imageKey)) bottoms.push(outfit.bottom);
              if (!shoes.find(s => s.imageKey === outfit.shoes.imageKey)) shoes.push(outfit.shoes);
              if (outfit.accessory1.imageKey && !acc1s.find(a => a.imageKey === outfit.accessory1.imageKey)) acc1s.push(outfit.accessory1);
              if (outfit.accessory2.imageKey && !acc2s.find(a => a.imageKey === outfit.accessory2.imageKey)) acc2s.push(outfit.accessory2);
            });
          });
        });
      });
    }
    
    // Add wardrobe items (always add when useWardrobe is true)
    if (useWardrobe && wardrobe.length > 0) {
      wardrobe.forEach(item => {
        const wardrobeItem: ClothingItem = {
          name: item.name,
          imageKey: `wardrobe-${item.id}`, // Special prefix for wardrobe items
          imageVariants: [`wardrobe-${item.id}`], // Wardrobe items have single variant
          selectedVariant: 0
        };
        
        switch (item.category) {
          case 'top':
            if (!tops.find(t => t.imageKey === wardrobeItem.imageKey)) tops.push(wardrobeItem);
            break;
          case 'bottom':
            if (!bottoms.find(b => b.imageKey === wardrobeItem.imageKey)) bottoms.push(wardrobeItem);
            break;
          case 'shoes':
            if (!shoes.find(s => s.imageKey === wardrobeItem.imageKey)) shoes.push(wardrobeItem);
            break;
          case 'accessory1':
            if (!acc1s.find(a => a.imageKey === wardrobeItem.imageKey)) acc1s.push(wardrobeItem);
            break;
          case 'accessory2':
            if (!acc2s.find(a => a.imageKey === wardrobeItem.imageKey)) acc2s.push(wardrobeItem);
            break;
        }
      });
    }
    
    return { tops, bottoms, shoes, acc1s, acc2s };
  }, [stylingFor, useWardrobe, wardrobe, wardrobeOnly]);
  
  // Generate new outfit combination from pools with unique seed
  const generateNewCombination = (seed: number): Outfit => {
    const { tops, bottoms, shoes, acc1s, acc2s } = clothingPools;
    
    // Use seeded random for deterministic but varied results
    const seededRandom = (max: number, offset: number = 0) => {
      const x = Math.sin(seed + offset) * 10000;
      return Math.floor((x - Math.floor(x)) * max);
    };
    
    // Helper to add random variant to a clothing item
    const withRandomVariant = (item: ClothingItem, variantSeed: number): ClothingItem => {
      // Randomly select a variant (0-7) for different image angles
      const variant = seededRandom(8, variantSeed);
      return {
        ...item,
        selectedVariant: variant
      };
    };
    
    const top = withRandomVariant(tops[seededRandom(tops.length, 1)] || tops[0], 100);
    const bottom = withRandomVariant(bottoms[seededRandom(bottoms.length, 7)] || bottoms[0], 200);
    const shoe = withRandomVariant(shoes[seededRandom(shoes.length, 13)] || shoes[0], 300);
    const acc1 = acc1s.length > 0 
      ? withRandomVariant(acc1s[seededRandom(acc1s.length, 17)], 400) 
      : { name: 'None', imageKey: '', imageVariants: [''], selectedVariant: 0 };
    const acc2 = acc2s.length > 0 
      ? withRandomVariant(acc2s[seededRandom(acc2s.length, 23)], 500) 
      : { name: 'None', imageKey: '', imageVariants: [''], selectedVariant: 0 };
    
    const tips = [
      "Mix textures for visual interest.",
      "Balance fitted and relaxed pieces.",
      "Accessories make the outfit.",
      "Confidence is the best accessory.",
      "Layer strategically for depth.",
      "Colors should complement, not match.",
      "Fit is everything.",
      "Start with a statement piece."
    ];
    
    const tagSets = [
      ["Fresh", "Stylish"],
      ["Clean", "Modern"],
      ["Bold", "Unique"],
      ["Classic", "Timeless"],
      ["Trendy", "Cool"],
      ["Elegant", "Refined"],
      ["Casual", "Comfortable"],
      ["Edgy", "Statement"]
    ];
    
    return {
      top,
      bottom,
      shoes: shoe,
      accessory1: acc1,
      accessory2: acc2,
      tip: tips[seededRandom(tips.length, 31)],
      tags: tagSets[seededRandom(tagSets.length, 37)],
      rating: 0,
      formalityLevel: formality
    };
  };
  
  const generateOutfits = async () => {
    if (!isComplete || !occasion || !shoeColor || !mood) return;
    
    setIsLoadingOutfits(true);
    
    const key = occasion.toLowerCase().replace(' ', '');
    let occasionKey = key === 'datenight' ? 'date' : key;
    
    // Get the correct outfits based on stylingFor
    const outfitsData = ALL_OUTFITS[stylingFor] || ALL_OUTFITS.men;
    
    // Get base outfits
    const baseOutfits = outfitsData[occasionKey]?.[shoeColor.toLowerCase()]?.[mood.toLowerCase()] || [];
    
    // Add formality level to each outfit
    const outfitsWithFormality = baseOutfits.map(o => outfitWithFormality(o as Omit<Outfit, 'formalityLevel'>));
    
    // Determine formality range based on formality value
    let minFormality: number, maxFormality: number;
    if (formality <= 30) {
      minFormality = 0;
      maxFormality = 40;
    } else if (formality <= 70) {
      minFormality = 25;
      maxFormality = 75;
    } else {
      minFormality = 60;
      maxFormality = 100;
    }
    
    // Filter outfits by formality range
    const filteredOutfits = outfitsWithFormality.filter(o => 
      (o.formalityLevel ?? 50) >= minFormality && (o.formalityLevel ?? 50) <= maxFormality
    );
    
    // If no outfits match, use all outfits but sort by closest to formality
    const results = filteredOutfits.length > 0 
      ? filteredOutfits.sort((a, b) => Math.abs((a.formalityLevel ?? 50) - formality) - Math.abs((b.formalityLevel ?? 50) - formality))
      : outfitsWithFormality.sort((a, b) => Math.abs((a.formalityLevel ?? 50) - formality) - Math.abs((b.formalityLevel ?? 50) - formality));
    
    // Add random image variants to each outfit item
    const resultsWithVariants = results.map((outfit, idx) => ({
      ...outfit,
      top: { ...outfit.top, selectedVariant: (idx * 3 + shuffleSeed) % 8 },
      bottom: { ...outfit.bottom, selectedVariant: (idx * 5 + shuffleSeed) % 8 },
      shoes: { ...outfit.shoes, selectedVariant: (idx * 7 + shuffleSeed) % 8 },
      accessory1: outfit.accessory1 ? { ...outfit.accessory1, selectedVariant: (idx * 11 + shuffleSeed) % 8 } : outfit.accessory1,
      accessory2: outfit.accessory2 ? { ...outfit.accessory2, selectedVariant: (idx * 13 + shuffleSeed) % 8 } : outfit.accessory2,
    }));
    
    // If using wardrobe, blend in some wardrobe-based outfits
    let finalOutfits: Outfit[];
    if (useWardrobe && wardrobe.length >= 3 && resultsWithVariants.length > 0) {
      // Replace some items with wardrobe items in each outfit
      const blendedResults = resultsWithVariants.map((outfit, idx) => {
        const wardrobeTop = wardrobe.find(w => w.category === 'top');
        const wardrobeBottom = wardrobe.find(w => w.category === 'bottom');
        const wardrobeShoes = wardrobe.find(w => w.category === 'shoes');
        
        // Randomly replace some items with wardrobe items based on seed
        const shouldReplaceTop = (idx + shuffleSeed) % 3 === 0 && wardrobeTop;
        const shouldReplaceBottom = (idx + shuffleSeed) % 4 === 1 && wardrobeBottom;
        const shouldReplaceShoes = (idx + shuffleSeed) % 5 === 2 && wardrobeShoes;
        
        return {
          ...outfit,
          top: shouldReplaceTop ? { name: wardrobeTop.name, imageKey: `wardrobe-${wardrobeTop.id}`, imageVariants: [`wardrobe-${wardrobeTop.id}`], selectedVariant: 0 } : outfit.top,
          bottom: shouldReplaceBottom ? { name: wardrobeBottom.name, imageKey: `wardrobe-${wardrobeBottom.id}`, imageVariants: [`wardrobe-${wardrobeBottom.id}`], selectedVariant: 0 } : outfit.bottom,
          shoes: shouldReplaceShoes ? { name: wardrobeShoes.name, imageKey: `wardrobe-${wardrobeShoes.id}`, imageVariants: [`wardrobe-${wardrobeShoes.id}`], selectedVariant: 0 } : outfit.shoes,
        };
      });
      finalOutfits = blendedResults;
    } else {
      finalOutfits = resultsWithVariants;
    }
    
    setOutfits(finalOutfits);
    setCurrentOutfitIndex(0);
    
    // Preload ALL outfit images in batch before showing results (with timeout)
    if (finalOutfits.length > 0) {
      // Start preloading all images
      const preloadPromise = preloadOutfitImagesBatch(finalOutfits, wardrobe);
      
      // Wait max 2 seconds for images to load, then show results anyway
      const timeoutPromise = new Promise<void>(resolve => setTimeout(resolve, 300));
      
      await Promise.race([preloadPromise, timeoutPromise]);
    }
    
    setIsLoadingOutfits(false);
    setScreen('results');
  };
  
  const surpriseMe = async () => {
    setIsLoadingOutfits(true);
    
    const SHUFFLE_SHIRTS = [
      item("White Shirt", "shirt-white"),
      item("Light Blue Shirt", "shirt-light-blue"),
      item("Navy Shirt", "shirt-navy"),
      item("Olive Shirt", "shirt-olive"),
      item("Beige Shirt", "shirt-beige"),
      item("Maroon Shirt", "shirt-maroon"),
      item("Black Shirt", "shirt-black"),
      item("Grey Shirt", "shirt-grey")
    ];

    const SHUFFLE_WATCHES = [
      item("Leather Watch", "watch-leather"),
      item("Silver Watch", "watch-silver"),
      item("Minimal Watch", "watch-minimal"),
      item("Sport Watch", "watch-sport")
    ];

    const SHUFFLE_ACCESSORIES = [
      item("Chain", "acc-chain"),
      item("Ring", "acc-ring"),
      item("Bracelet", "acc-bracelet"),
      item("Sunglasses", "acc-sunglasses"),
      item("None", "")
    ];
    
    // Create new arrays from the pools
    const availableShirts = [...SHUFFLE_SHIRTS];
    const availableWatches = [...SHUFFLE_WATCHES];
    const availableAccessories = [...SHUFFLE_ACCESSORIES];
    
    // Function to pick and remove random item to ensure they are all different
    const pickRandomMutate = (arr: any[]) => {
      if (arr.length === 0) return null;
      const idx = Math.floor(Math.random() * arr.length);
      return arr.splice(idx, 1)[0];
    };
    
    const newOutfits: Outfit[] = [];
    for (let i = 0; i < 3; i++) {
      const shirt = pickRandomMutate(availableShirts) || SHUFFLE_SHIRTS[0];
      const watch = pickRandomMutate(availableWatches) || SHUFFLE_WATCHES[0];
      const acc = pickRandomMutate(availableAccessories) || SHUFFLE_ACCESSORIES[0];
      
      newOutfits.push(outfitWithFormality({
        top: shirt,
        bottom: item("Bottoms", ""), // Empty image key hides it
        shoes: item("Shoes", ""), // Empty image key hides it
        accessory1: watch,
        accessory2: acc,
        tip: "A unique combination just for you.",
        tags: ["Shuffled", "Unique", "Style"],
        rating: 0,
      }));
    }
    
    setOutfits(newOutfits);
    setCurrentOutfitIndex(0);
    
    // Preload ALL outfit images in batch before showing results (with timeout)
    const preloadPromise = preloadOutfitImagesBatch(newOutfits, wardrobe);
    
    // Wait max 2 seconds for images to load, then show results anyway
    const timeoutPromise = new Promise<void>(resolve => setTimeout(resolve, 300));
    
    await Promise.race([preloadPromise, timeoutPromise]);
    
    setIsLoadingOutfits(false);
    setScreen('results');
  };
  
  const resetFilters = () => {
    setOccasion(null);
    setShoeColor(null);
    setMood(null);
    setOutfits([]);
    setCurrentOutfitIndex(0);
    setScreen('home');
  };
  
  const saveOutfit = () => {
    const currentOutfit = outfits[currentOutfitIndex];
    if (!currentOutfit) return;
    
    setSaveAnimation(true);
    
    const outfitToSave = {
      ...currentOutfit,
      occasion,
      shoeColor,
      mood,
      stylingFor,
      savedAt: Date.now()
    };
    
    setSavedOutfits(prev => [outfitToSave, ...prev]);
    
    setTimeout(() => setSaveAnimation(false), 1500);
  };
  
  const rateOutfit = (rating: number) => {
    setOutfits(prev => {
      const updated = [...prev];
      updated[currentOutfitIndex] = { ...updated[currentOutfitIndex], rating };
      return updated;
    });
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      maxWidth: '420px', 
      margin: '0 auto', 
      position: 'relative',
      background: '#0a0a0a'
    }}>
      <style>{styles}</style>
      <StarsBackground />
      
      <Header 
        screen={screen} 
        setScreen={setScreen} 
        savedOutfitsLength={savedOutfits.length}
        resetFilters={resetFilters}
      />
      
      {screen === 'home' && (
        <HomeScreen 
          stylingFor={stylingFor}
          setStylingFor={setStylingFor}
          occasion={occasion}
          setOccasion={setOccasion}
          shoeColor={shoeColor}
          setShoeColor={setShoeColor}
          mood={mood}
          setMood={setMood}
          weather={weather}
          setWeather={setWeather}
          formality={formality}
          setFormality={setFormality}
          budget={budget}
          setBudget={setBudget}
          showPreferences={showPreferences}
          setShowPreferences={setShowPreferences}
          selectedCount={selectedCount}
          isComplete={isComplete}
          generateOutfits={generateOutfits}
          surpriseMe={surpriseMe}
          wardrobe={wardrobe}
          useWardrobe={useWardrobe}
          setUseWardrobe={setUseWardrobe}
          wardrobeOnly={wardrobeOnly}
          setWardrobeOnly={setWardrobeOnly}
          isLoadingOutfits={isLoadingOutfits}
        />
      )}
      
      {screen === 'wardrobe' && (
        <WardrobeScreen 
          wardrobe={wardrobe}
          setWardrobe={setWardrobe}
          stylingFor={stylingFor}
          setScreen={setScreen}
          setUseWardrobe={setUseWardrobe}
          setWardrobeOnly={setWardrobeOnly}
        />
      )}
      
      {screen === 'explore' && (
        <ExploreScreen 
          setScreen={setScreen}
          setMood={setMood}
          setOccasion={setOccasion}
        />
      )}
      
      {screen === 'results' && (
        <ResultsScreen 
          stylingFor={stylingFor}
          occasion={occasion}
          shoeColor={shoeColor}
          mood={mood}
          outfits={outfits}
          currentOutfitIndex={currentOutfitIndex}
          setCurrentOutfitIndex={setCurrentOutfitIndex}
          saveAnimation={saveAnimation}
          saveOutfit={saveOutfit}
          rateOutfit={rateOutfit}
          resetFilters={resetFilters}
          surpriseMe={surpriseMe}
          wardrobeItems={wardrobe}
        />
      )}
      
      {screen === 'saved' && (
        <SavedScreen 
          savedOutfits={savedOutfits}
          setSavedOutfits={setSavedOutfits}
          setScreen={setScreen}
          filterType={filterType}
          setFilterType={setFilterType}
          wardrobeItems={wardrobe}
        />
      )}
      
      <BottomNav 
        screen={screen} 
        setScreen={setScreen} 
        savedOutfitsLength={savedOutfits.length}
        wardrobeCount={wardrobe.length}
      />
    </div>
  );
}
