export interface Category {
  id: string;
  name_en: string;
  name_bn: string;
  description_en: string;
  description_bn: string;
  icon: string;
  display_order: number;
}

export interface ProductVariant {
  id: string;
  name_en: string;
  name_bn: string;
  additional_price_bdt: number;
  is_default?: boolean;
}

export interface ProductAddon {
  id: string;
  name_en: string;
  name_bn: string;
  price_bdt: number;
}

export interface Product {
  id: string;
  category_id: string;
  name_en: string;
  name_bn: string;
  description_en: string;
  description_bn: string;
  price_bdt: number;
  image_url: string;
  is_popular?: boolean;
  is_featured?: boolean;
  is_available: boolean;
  preparation_time_minutes: number;
  spicy_level: number; // 0 to 3
  calories?: number;
  dietary_tags: string[]; // 'Halal', 'Seafood', 'Gluten-Free', 'Chef Special', 'Vegetarian'
  variants?: ProductVariant[];
  addons?: ProductAddon[];
}

export interface Coupon {
  code: string;
  discount_percentage?: number;
  discount_amount_bdt?: number;
  minimum_spend_bdt: number;
  description: string;
  is_active: boolean;
}

export interface Review {
  id: string;
  customer_name: string;
  customer_location: string;
  rating: number;
  comment: string;
  comment_bn?: string;
  dish_ordered: string;
  date: string;
  is_approved: boolean;
  is_featured: boolean;
}

export interface RestaurantSettings {
  name: string;
  logo_url?: string;
  hero_banner_url: string;
  hero_title: string;
  tagline_en: string;
  tagline_bn: string;
  location: string;
  address_line: string;
  phone: string;
  email: string;
  support_phone: string;
  support_email: string;
  currency: string;
  currency_symbol: string;
  timezone: string;
  opening_hours_en: string;
  opening_hours_bn: string;
  delivery_charge_bdt: number;
  free_delivery_threshold_bdt: number;
  estimated_delivery_time: string;
  is_open_now: boolean;
  bkash_merchant_number: string;
  nagad_merchant_number: string;
}

export const INITIAL_SETTINGS: RestaurantSettings = {
  name: "YŌKOSO",
  logo_url: "",
  hero_banner_url: "/src/assets/images/hero_japanese_dining_1793346958891.jpg",
  hero_title: "YŌKOSO RESTAURANT",
  tagline_en: "Sylhet's Finest Japanese & Pan-Asian Gastronomy",
  tagline_bn: "সিলেটের বুকে খাঁটি জাপানিজ ও প্যান-এশিয়ান ভোজনবিলাস",
  location: "Sylhet, Bangladesh",
  address_line: "2nd Floor, Al-Madani Tower, Mirboxtula, Sylhet, Bangladesh",
  phone: "+8801841965676",
  email: "yokoso.syl@gmail.com",
  support_phone: "+8801841965676",
  support_email: "yokoso.syl@gmail.com",
  currency: "BDT",
  currency_symbol: "৳",
  timezone: "Asia/Dhaka",
  opening_hours_en: "12:30 PM – 11:00 PM (Everyday)",
  opening_hours_bn: "প্রতিদিন দুপুর ১২:৩০ – রাত ১১:০০",
  delivery_charge_bdt: 70,
  free_delivery_threshold_bdt: 2000,
  estimated_delivery_time: "35 - 50 mins",
  is_open_now: true,
  bkash_merchant_number: "01841965676",
  nagad_merchant_number: "01841965676",
};

export const INITIAL_CATEGORIES: Category[] = [
  { id: "sushi", name_en: "Sushi", name_bn: "সুশি", description_en: "Handcrafted nigiri, uramaki, and sashimi with ocean-fresh fish", description_bn: "তাজা সামুদ্রিক মাছের সুস্বাদু নিগিরি ও উরামাকি", icon: "Fish", display_order: 1 },
  { id: "appetizers", name_en: "Appetizers", name_bn: "অ্যাপেটাইজার", description_en: "Crispy edamame, gyoza, and Japanese tempura starters", description_bn: "মুচমুচে এদামেমে, গিওজা ও ঐতিহ্যবাহী স্টার্টার", icon: "Utensils", display_order: 2 },
  { id: "salad", name_en: "Salad", name_bn: "সালাদ", description_en: "Fresh wakame seaweed, kani crunch, and sesame garden bowls", description_bn: "তাজা ওয়াকামে সিউইড ও ক্রাঞ্চি সিজেনাল সালাদ", icon: "Salad", display_order: 3 },
  { id: "soup", name_en: "Soup", name_bn: "সুপ", description_en: "Silky miso, tom yum, and comforting hot pot broths", description_bn: "উষ্ণ মিসো সুপ ও সুস্বাদু ঐতিহ্যবাহী ঝোল", icon: "Soup", display_order: 4 },
  { id: "dimsum", name_en: "Dim Sum", name_bn: "ডিম সাম", description_en: "Steamed crystal prawn dumplings and juicy Cantonese baos", description_bn: "ভাপে তৈরি নরম ও রসালো ডিম সাম ও বাও", icon: "CircleDot", display_order: 5 },
  { id: "chicken", name_en: "Chicken", name_bn: "চিকেন", description_en: "Teriyaki glazed chicken, katsu curry, and karaage bites", description_bn: "জাপানিজ তেরিয়াকি চিকেন ও খাস্তা কাতসু কারি", icon: "Drumstick", display_order: 6 },
  { id: "beef", name_en: "Beef", name_bn: "বিফ", description_en: "Tender Wagyu-style beef striploin, bulgogi, and sizzling black pepper beef", description_bn: "নরম প্রিমিয়াম বিফ স্ট্রিপলয়েন ও ব্ল্যাক পেপার বিফ", icon: "Flame", display_order: 7 },
  { id: "seafood", name_en: "Seafood", name_bn: "সিফুড", description_en: "Jumbo tiger prawns, Norwegian grilled salmon, and Asian calamari", description_bn: "জাপানিজ স্টাইলে ভাজা টাইগার প্রন ও গ্রিলড স্যালমন", icon: "Anchor", display_order: 8 },
  { id: "noodles", name_en: "Noodles", name_bn: "নুডুলস", description_en: "Wok-tossed yaki udon, spicy Dan Dan, and soba noodles", description_bn: "স্পাইসি ইয়াকি উদোন ও খাঁটি সোবা নুডুলস", icon: "ChefHat", display_order: 9 },
  { id: "rice", name_en: "Rice", name_bn: "রাইস", description_en: "Japanese garlic fried rice, egg chahan, and Pan-Asian jasmine blends", description_bn: "গার্লিক ফ্রাইড রাইস ও স্পেশাল এগ চাহান", icon: "Sparkles", display_order: 10 },
  { id: "ramen", name_en: "Ramen", name_bn: "রামেন", description_en: "Slow-simmered rich broths with springy noodles, ajitsuke egg, and nori", description_bn: "১২ ঘণ্টা রান্না করা খাঁটি জাপানিজ রামেন বাটি", icon: "CupSoda", display_order: 11 },
  { id: "bento", name_en: "Bento Box", name_bn: "বেন্তো বক্স", description_en: "Balanced artisanal lunch boxes with mains, sides, rice, and gyoza", description_bn: "রাইস, মেইন ডিশ ও সাইড সহ সম্পূর্ণ জাপানিজ মিল", icon: "Box", display_order: 12 },
];

export const INITIAL_PRODUCTS: Product[] = [
  // SUSHI
  {
    id: "sushi-01",
    category_id: "sushi",
    name_en: "Imperial Dragon Roll",
    name_bn: "ইম্পেরিয়াল ড্রাগন রোল",
    description_en: "Crispy prawn tempura and cucumber wrapped with sliced buttery avocado, flame-torched salmon, unagi glaze, and Japanese tobiko caviar.",
    description_bn: "খাস্তা প্রন টেম্পুরা, শসা ও ওপরে টর্চ করা স্যালমন, উনাগি গ্লেজ ও টোবিকো ক্যাভিয়ার।",
    price_bdt: 850,
    image_url: "/src/assets/images/food_sushi_platter_1793346959147.jpg",
    is_popular: true,
    is_featured: true,
    is_available: true,
    preparation_time_minutes: 18,
    spicy_level: 1,
    calories: 420,
    dietary_tags: ["Chef Special", "Seafood", "Halal"],
    variants: [
      { id: "v1-8pcs", name_en: "8 Pieces (Standard)", name_bn: "৮ টুকরো (স্ট্যান্ডার্ড)", additional_price_bdt: 0, is_default: true },
      { id: "v1-12pcs", name_en: "12 Pieces (Large)", name_bn: "১২ টুকরো (লার্জ)", additional_price_bdt: 380 },
    ],
    addons: [
      { id: "ad1-spicy-mayo", name_en: "Spicy Japanese Truffle Mayo", name_bn: "স্পাইসি ট্রাফেল মেয়ো", price_bdt: 60 },
      { id: "ad1-extra-ginger", name_en: "Extra Pickled Ginger & Wasabi", name_bn: "অতিরিক্ত পিকেলড জিঞ্জার ও ওয়াসাবি", price_bdt: 40 },
    ],
  },
  {
    id: "sushi-02",
    category_id: "sushi",
    name_en: "Spicy Salmon Uramaki",
    name_bn: "স্পাইসি স্যালমন উরামাকি",
    description_en: "Fresh Norwegian salmon diced with sriracha spicy mayo, spring onion, toasted sesame seeds, and crunchy tanuki flakes.",
    description_bn: "নরওয়েজিয়ান স্যালমন, শ্রীরাচা স্পাইসি মেয়ো, পেঁয়াজ পাতা এবং মুচমুচে তানুকা ফ্লেকস।",
    price_bdt: 780,
    image_url: "/src/assets/images/food_sushi_platter_1793346959147.jpg",
    is_popular: true,
    is_featured: false,
    is_available: true,
    preparation_time_minutes: 15,
    spicy_level: 2,
    calories: 380,
    dietary_tags: ["Seafood", "Halal"],
    variants: [
      { id: "v2-8pcs", name_en: "8 Pieces", name_bn: "৮ টুকরো", additional_price_bdt: 0, is_default: true },
    ],
  },
  {
    id: "sushi-03",
    category_id: "sushi",
    name_en: "Yokoso Signature Nigiri Set",
    name_bn: "ইয়োকোসো সিগনেচার নিগিরি সেট",
    description_en: "Hand-pressed sushi rice topped with premium cuts of fresh salmon, yellowfin tuna, sweet ebi prawn, and tamago omelette with gold leaf finish.",
    description_bn: "হ্যান্ড-প্রেসড সুশি রাইসের ওপর খাঁটি স্যালমন, টুনা, মিষ্টি এবি প্রন এবং তামাগো অমলেট।",
    price_bdt: 1150,
    image_url: "/src/assets/images/food_sushi_platter_1793346959147.jpg",
    is_popular: false,
    is_featured: true,
    is_available: true,
    preparation_time_minutes: 20,
    spicy_level: 0,
    calories: 450,
    dietary_tags: ["Chef Special", "Seafood", "Halal"],
  },

  // RAMEN
  {
    id: "ramen-01",
    category_id: "ramen",
    name_en: "Tokyo Rich Shoyu Ramen",
    name_bn: "টোকিও রিচ শয়ু রামেন",
    description_en: "Signature 14-hour simmered aromatic dashi and poultry broth, handcrafted wheat noodles, tender rolled chashu slices, soft-boiled marinated ajitsuke egg, menma bamboo shoots, and roasted nori.",
    description_bn: "১৪ ঘণ্টা জ্বাল দেয়া বিশেষ ডিশি ঝোল, হাতে তৈরি নুডুলস, নরম চাশু স্লাইস, স্পেশাল রামেন ডিম ও নোরি সিউইড।",
    price_bdt: 790,
    image_url: "/src/assets/images/food_ramen_bowl_1793346960761.jpg",
    is_popular: true,
    is_featured: true,
    is_available: true,
    preparation_time_minutes: 20,
    spicy_level: 1,
    calories: 620,
    dietary_tags: ["Chef Special", "Halal"],
    variants: [
      { id: "v-ramen-med", name_en: "Medium Spicy Broth", name_bn: "মিডিয়াম স্পাইসি", additional_price_bdt: 0, is_default: true },
      { id: "v-ramen-fire", name_en: "Extra Spicy Chili Oil Broth", name_bn: "এক্সট্রা স্পাইসি চিলি অয়েল", additional_price_bdt: 40 },
    ],
    addons: [
      { id: "ad-extra-egg", name_en: "Extra Marinated Ajitsuke Tamago", name_bn: "অতিরিক্ত রামেন ডিম", price_bdt: 80 },
      { id: "ad-extra-chashu", name_en: "Extra Braised Chicken Chashu (2 pcs)", name_bn: "অতিরিক্ত চিকেন চাশু", price_bdt: 140 },
      { id: "ad-extra-noodles", name_en: "Extra Noodles Portion (Kaedama)", name_bn: "অতিরিক্ত নুডুলস", price_bdt: 120 },
    ],
  },
  {
    id: "ramen-02",
    category_id: "ramen",
    name_en: "Hokkaido Creamy Miso Ramen",
    name_bn: "হোক্কাইডো ক্রিমি মিসো রামেন",
    description_en: "Fermented red and white miso broth with sweet corn kernels, butter pat, wood ear mushrooms, fresh bean sprouts, and scallions.",
    description_bn: "সাদা ও লাল মিসোর ক্রিমি মিশ্রণ, মিষ্টি ভুট্টা, মাখন, মাশরুম ও ফ্রেশ স্প্রাউটস।",
    price_bdt: 760,
    image_url: "/src/assets/images/food_ramen_bowl_1793346960761.jpg",
    is_popular: true,
    is_featured: false,
    is_available: true,
    preparation_time_minutes: 18,
    spicy_level: 1,
    calories: 590,
    dietary_tags: ["Halal"],
  },

  // DIM SUM
  {
    id: "dimsum-01",
    category_id: "dimsum",
    name_en: "Har Gow Crystal Prawn Dumplings",
    name_bn: "হার গাউ ক্রিস্টাল প্রন ডাম্পলিং",
    description_en: "Translucent pleated steamed dumplings packed with juicy tiger prawn chunks, bamboo shoots, and ginger sesame essence (4 pcs).",
    description_bn: "স্বচ্ছ ভাপের খোলে মোড়ানো মিষ্টি টাইগার প্রন ও আদা-তিলের মিষ্টি সুবাস (৪ পিস)।",
    price_bdt: 540,
    image_url: "/src/assets/images/food_dimsum_bento_1793346960828.jpg",
    is_popular: true,
    is_featured: true,
    is_available: true,
    preparation_time_minutes: 15,
    spicy_level: 0,
    calories: 260,
    dietary_tags: ["Chef Special", "Seafood", "Halal"],
  },
  {
    id: "dimsum-02",
    category_id: "dimsum",
    name_en: "Steamed Chicken Xiao Long Bao",
    name_bn: "স্টিমড চিকেন শিয়াও লং বাও",
    description_en: "Delicate soup dumplings filled with seasoned tender chicken and piping hot, savory collagen broth. Served with ginger black vinegar.",
    description_bn: "ভেতরে গরম সুস্বাদু জুসি ব্রোথ ও চিকেন কিমা সমৃদ্ধ কিংবদন্তি স্যুপ ডাম্পলিং।",
    price_bdt: 580,
    image_url: "/src/assets/images/food_dimsum_bento_1793346960828.jpg",
    is_popular: true,
    is_featured: false,
    is_available: true,
    preparation_time_minutes: 16,
    spicy_level: 0,
    calories: 310,
    dietary_tags: ["Halal"],
  },

  // APPETIZERS
  {
    id: "app-01",
    category_id: "appetizers",
    name_en: "Pan-Fried Japanese Gyoza",
    name_bn: "প্যান-ফ্রাইড জাপানিজ গিওজা",
    description_en: "Handmade dumplings filled with minced chicken, garlic chives, and cabbage, crisp on the bottom and tender on top (6 pcs).",
    description_bn: "হাতে তৈরি খাস্তা ও জুসি চিকেন গিওজা, তিল ও সয়া ডিপিং সস সহ (৬ পিস)।",
    price_bdt: 440,
    image_url: "/src/assets/images/food_dimsum_bento_1793346960828.jpg",
    is_popular: true,
    is_featured: false,
    is_available: true,
    preparation_time_minutes: 12,
    spicy_level: 0,
    calories: 280,
    dietary_tags: ["Halal"],
  },
  {
    id: "app-02",
    category_id: "appetizers",
    name_en: "Crispy Ebi Tempura",
    name_bn: "ক্রিস্পি এবি টেম্পুরা",
    description_en: "Jumbo ocean prawns dipped in feather-light Japanese tempura batter and fried to golden perfection. Served with tentsuyu dipping sauce (4 pcs).",
    description_bn: "মুচমুচে জাপানিজ টেম্পুরা ব্যাটারে ভাজা বড় সাইজের সি প্রন (৪ পিস)।",
    price_bdt: 620,
    image_url: "/src/assets/images/food_sushi_platter_1793346959147.jpg",
    is_popular: false,
    is_featured: false,
    is_available: true,
    preparation_time_minutes: 14,
    spicy_level: 0,
    calories: 340,
    dietary_tags: ["Seafood", "Halal"],
  },

  // SALAD & SOUP
  {
    id: "salad-01",
    category_id: "salad",
    name_en: "Yokoso Kani Crunch Salad",
    name_bn: "ইয়োকোসো কানি ক্রাঞ্চ সালাদ",
    description_en: "Shredded crab stick, crisp English cucumber, sweet mango juliennes, flying fish roe, and panko crunch with Japanese citrus mayo dressing.",
    description_bn: "তাজা কাঁকড়ার মাংস, শসা, পাকা আমের কুচি ও সিট্রাস মেয়োনেজ ড্রেসিং।",
    price_bdt: 490,
    image_url: "/src/assets/images/food_sushi_platter_1793346959147.jpg",
    is_popular: false,
    is_featured: false,
    is_available: true,
    preparation_time_minutes: 10,
    spicy_level: 0,
    calories: 240,
    dietary_tags: ["Seafood", "Halal"],
  },
  {
    id: "soup-01",
    category_id: "soup",
    name_en: "Authentic Kyoto Miso Soup",
    name_bn: "ঐতিহ্যবাহী কিয়োটো মিসো সুপ",
    description_en: "Warm dashi stock infused with white miso paste, silken tofu cubes, wakame seaweed, and scallions.",
    description_bn: "সিল্কেন টোফু, ওয়াকামে সিউইড এবং সাদা মিসো পেস্ট দিয়ে প্রস্তুত পরম তৃপ্তিদায়ক সুপ।",
    price_bdt: 260,
    image_url: "/src/assets/images/food_ramen_bowl_1793346960761.jpg",
    is_popular: false,
    is_featured: false,
    is_available: true,
    preparation_time_minutes: 8,
    spicy_level: 0,
    calories: 90,
    dietary_tags: ["Vegetarian", "Halal"],
  },

  // CHICKEN & BEEF
  {
    id: "chicken-01",
    category_id: "chicken",
    name_en: "Charcoal Grilled Chicken Teriyaki",
    name_bn: "চারকোল গ্রিলড চিকেন তেরিয়াকি",
    description_en: "Juicy chicken thighs charred over high flame and glazed with house-made sweet mirin and soy reduction. Served with steamed broccoli.",
    description_bn: "চারকোলে পোড়ানো জুসি চিকেন থাই ও মিষ্টি মিরিন-সয়া তেরিয়াকি গ্লেজ।",
    price_bdt: 680,
    image_url: "/src/assets/images/food_dimsum_bento_1793346960828.jpg",
    is_popular: true,
    is_featured: true,
    is_available: true,
    preparation_time_minutes: 20,
    spicy_level: 0,
    calories: 520,
    dietary_tags: ["Halal"],
  },
  {
    id: "beef-01",
    category_id: "beef",
    name_en: "Sizzling Black Pepper Beef Striploin",
    name_bn: "সিজলিং ব্ল্যাক পেপার বিফ স্ট্রিপলয়েন",
    description_en: "Premium aged beef tenderloin strips wok-flashed with crushed Tellicherry black peppercorns, bell peppers, and scallions on a piping hot skillet.",
    description_bn: "প্রিমিয়াম বিফ টেন্ডারলয়েন ও গোলমরিচের ঝাঁঝালো স্বাদের গরম সিজলিং পরিবেশন।",
    price_bdt: 890,
    image_url: "/src/assets/images/hero_japanese_dining_1793346958891.jpg",
    is_popular: true,
    is_featured: true,
    is_available: true,
    preparation_time_minutes: 22,
    spicy_level: 2,
    calories: 580,
    dietary_tags: ["Chef Special", "Halal"],
  },

  // SEAFOOD
  {
    id: "seafood-01",
    category_id: "seafood",
    name_en: "Pan-Seared Norwegian Salmon Teriyaki",
    name_bn: "প্যান-সিয়ার্ড নরওয়েজিয়ান স্যালমন তেরিয়াকি",
    description_en: "Crispy-skinned fresh Norwegian salmon fillet resting on braised asparagus, finished with sweet ginger teriyaki glaze.",
    description_bn: "খাস্তা ত্বকের তাজা নরওয়েজিয়ান স্যালমন ফিলেট ও স্পেশাল তেরিয়াকি গ্লেজ।",
    price_bdt: 1250,
    image_url: "/src/assets/images/food_sushi_platter_1793346959147.jpg",
    is_popular: true,
    is_featured: true,
    is_available: true,
    preparation_time_minutes: 20,
    spicy_level: 0,
    calories: 510,
    dietary_tags: ["Chef Special", "Seafood", "Halal"],
  },

  // NOODLES & RICE
  {
    id: "noodles-01",
    category_id: "noodles",
    name_en: "Seafood Yaki Udon",
    name_bn: "সিফুড ইয়াকি উদোন",
    description_en: "Thick chewy udon noodles stir-fried with tiger prawns, squid rings, julienne carrots, shredded cabbage, and rich Japanese Worcestershire tare sauce.",
    description_bn: "মোটা উদোন নুডুলস, তাজা প্রন, স্কুইড ও সবজির সুস্বাদু সংমিশ্রণ।",
    price_bdt: 690,
    image_url: "/src/assets/images/food_ramen_bowl_1793346960761.jpg",
    is_popular: true,
    is_featured: false,
    is_available: true,
    preparation_time_minutes: 18,
    spicy_level: 1,
    calories: 540,
    dietary_tags: ["Seafood", "Halal"],
  },
  {
    id: "rice-01",
    category_id: "rice",
    name_en: "Japanese Garlic Butter Chahan",
    name_bn: "জাপানিজ গার্লিক বাটার চাহান",
    description_en: "Fragrant short-grain Japanese rice tossed in browned Normandy butter, toasted crispy garlic chips, scrambled farm egg, and scallions.",
    description_bn: "ব্রাউন বাটার, ভাজা রসুন ও ফ্রেশ ডিম সহযোগে বিশেষ জাপানিজ ফ্রাইড রাইস।",
    price_bdt: 460,
    image_url: "/src/assets/images/food_dimsum_bento_1793346960828.jpg",
    is_popular: false,
    is_featured: false,
    is_available: true,
    preparation_time_minutes: 12,
    spicy_level: 0,
    calories: 410,
    dietary_tags: ["Halal"],
  },

  // BENTO BOX
  {
    id: "bento-01",
    category_id: "bento",
    name_en: "Yokoso Deluxe Bento Box",
    name_bn: "ইয়োকোসো ডিলাক্স বেন্তো বক্স",
    description_en: "Complete culinary feast: Grilled Chicken Teriyaki, 4 pcs California Roll, 2 pcs crispy Gyoza, Japanese Garlic Rice, Kyoto Miso Soup, and fresh edamame.",
    description_bn: "সম্পূর্ণ লাঞ্চ মিল: তেরিয়াকি চিকেন, ক্যালিফোর্নিয়া রোল (৪ পিস), চিকেন গিওজা (২ পিস), ফ্রাইড রাইস ও মিসো সুপ।",
    price_bdt: 1080,
    image_url: "/src/assets/images/food_dimsum_bento_1793346960828.jpg",
    is_popular: true,
    is_featured: true,
    is_available: true,
    preparation_time_minutes: 25,
    spicy_level: 0,
    calories: 780,
    dietary_tags: ["Chef Special", "Halal"],
  },
];

export const INITIAL_COUPONS: Coupon[] = [
  { code: "YOKOSO10", discount_percentage: 10, minimum_spend_bdt: 1000, description: "10% off on all orders above ৳1,000", is_active: true },
  { code: "SYLHET50", discount_amount_bdt: 50, minimum_spend_bdt: 500, description: "৳50 off for Sylhet local deliveries", is_active: true },
  { code: "WELCOME15", discount_percentage: 15, minimum_spend_bdt: 1800, description: "15% off celebration discount for orders above ৳1,800", is_active: true },
];

export const INITIAL_REVIEWS: Review[] = [
  {
    id: "rev-1",
    customer_name: "Tanvir Rahman",
    customer_location: "Zindabazar, Sylhet",
    rating: 5,
    comment: "Undoubtedly the most authentic Japanese dining experience in Sylhet! The Dragon Roll was exceptionally fresh and the ambiance at Al-Madani Tower is world-class.",
    comment_bn: "সিলেটের বুকে এত নিখুঁত জাপানিজ খাবার সত্যি কল্পনাতীত! ড্রাগন রোল আর রামেনের স্বাদ এককথায় অসাধারণ।",
    dish_ordered: "Imperial Dragon Roll & Tonkotsu Ramen",
    date: "2026-10-24",
    is_approved: true,
    is_featured: true,
  },
  {
    id: "rev-2",
    customer_name: "Farhana Chowdhury",
    customer_location: "Upashahar, Sylhet",
    rating: 5,
    comment: "Reserved a family table for 6 people. Impeccable hospitality, quiet private shoji screens, and the dim sum came steaming hot. The online ordering is silky smooth too!",
    comment_bn: "৬ জনের ফ্যামিলি ডিনার রিজার্ভ করেছিলাম। পরিবেশন ও আতিথেয়তা দুটোই অত্যন্ত প্রিমিয়াম ছিল।",
    dish_ordered: "Har Gow & Deluxe Bento Box",
    date: "2026-10-26",
    is_approved: true,
    is_featured: true,
  },
  {
    id: "rev-3",
    customer_name: "Dr. Mahfuz Ahmed",
    customer_location: "Mirboxtula, Sylhet",
    rating: 5,
    comment: "Delivered to my clinic in less than 35 minutes! Packaging was pristine, wasabi and chopsticks properly sealed. 10/10 recommended for corporate lunches.",
    comment_bn: "অর্ডার করার ৩৫ মিনিটের মধ্যে গরম গরম খাবার পেয়ে গেছি। প্যাকেজিং ও পরিচ্ছন্নতা দারুণ।",
    dish_ordered: "Yokoso Deluxe Bento Box",
    date: "2026-10-28",
    is_approved: true,
    is_featured: true,
  },
];

export const INITIAL_GALLERY = [
  { id: "g1", title: "Main Dining Hall & Lantern Lattice", category: "Interior", image_url: "/src/assets/images/hero_japanese_dining_1793346958891.jpg" },
  { id: "g2", title: "Master Cut Sushi & Sashimi Platter", category: "Dishes", image_url: "/src/assets/images/food_sushi_platter_1793346959147.jpg" },
  { id: "g3", title: "Traditional Tonkotsu Ramen Craft", category: "Dishes", image_url: "/src/assets/images/food_ramen_bowl_1793346960761.jpg" },
  { id: "g4", title: "Bamboo Steamed Dim Sum Delicacies", category: "Dishes", image_url: "/src/assets/images/food_dimsum_bento_1793346960828.jpg" },
  { id: "g5", title: "Private Tatami & Shoji Dining Suite", category: "Interior", image_url: "/src/assets/images/restaurant_ambiance_interior_1793346962659.jpg" },
];
