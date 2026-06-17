import type { Restaurant, MenuItem, Order, User } from "@/types";
import { COVER_IMG, FOOD_IMG } from "@/utils/constants";

export const MOCK_RESTAURANTS: Restaurant[] = [
  {
    id: "southern-delight",
    name: "Southern Delight",
    cuisine: "South Indian",
    cuisineTags: ["South Indian"],
    rating: 4.5,
    deliveryTime: "15-20 mins",
    deliveryMin: 15,
    minOrder: 80,
    coverImage: COVER_IMG.southIndian,
    isOpen: true,
    floor: "Ground Floor, Block A",
    description: "Authentic South Indian breakfast & meals served fresh all day.",
  },
  {
    id: "kaffeehaus",
    name: "Kaffeehaus",
    cuisine: "Café & Beverages",
    cuisineTags: ["Café", "Beverages"],
    rating: 4.3,
    deliveryTime: "10-15 mins",
    deliveryMin: 10,
    minOrder: 60,
    coverImage: COVER_IMG.cafe,
    isOpen: true,
    floor: "1st Floor, Block B",
    description: "Specialty coffee, sandwiches and quick bakes for your work breaks.",
  },
  {
    id: "saravana-bhavan",
    name: "Saravana Bhavan",
    cuisine: "South Indian",
    cuisineTags: ["South Indian"],
    rating: 4.7,
    deliveryTime: "15-25 mins",
    deliveryMin: 15,
    minOrder: 80,
    coverImage: COVER_IMG.saravana,
    isOpen: true,
    floor: "Ground Floor, Block C",
    description: "The classic Saravana Bhavan experience — dosas, vadas, filter coffee.",
  },
  {
    id: "supreme-bakers",
    name: "Supreme Bakers",
    cuisine: "Bakery & Snacks",
    cuisineTags: ["Bakery"],
    rating: 4.4,
    deliveryTime: "10-15 mins",
    deliveryMin: 10,
    minOrder: 50,
    coverImage: COVER_IMG.bakery,
    isOpen: true,
    floor: "Ground Floor, Block A",
    description: "Fresh-baked puffs, pastries, breads and quick snacks throughout the day.",
  },
  {
    id: "anandam",
    name: "Anandam",
    cuisine: "North Indian & South Indian",
    cuisineTags: ["North Indian", "South Indian"],
    rating: 4.6,
    deliveryTime: "20-25 mins",
    deliveryMin: 20,
    minOrder: 100,
    coverImage: COVER_IMG.anandam,
    isOpen: true,
    floor: "2nd Floor, Block D",
    description: "Hearty North & South Indian thalis, curries and home-style meals.",
  },
  {
    id: "edf-juice",
    name: "EDF Juice",
    cuisine: "Juices & Health Drinks",
    cuisineTags: ["Beverages"],
    rating: 4.5,
    deliveryTime: "5-10 mins",
    deliveryMin: 5,
    minOrder: 40,
    coverImage: COVER_IMG.edf,
    isOpen: true,
    floor: "Ground Floor, Block B",
    description: "Cold-pressed juices, smoothies and healthy refreshers.",
  },
  {
    id: "cococane-juicery",
    name: "Cococane Juicery",
    cuisine: "Beverages",
    cuisineTags: ["Beverages"],
    rating: 4.4,
    deliveryTime: "5-10 mins",
    deliveryMin: 5,
    minOrder: 40,
    coverImage: COVER_IMG.cococane,
    isOpen: true,
    floor: "Ground Floor, Block C",
    description: "Sugarcane, tender coconut and refreshing beverages on the go.",
  },
  {
    id: "mamta-food-restaurant",
    name: "Mamta Food Restaurant",
    cuisine: "North Indian",
    cuisineTags: ["North Indian"],
    rating: 4.3,
    deliveryTime: "20-30 mins",
    deliveryMin: 20,
    minOrder: 100,
    coverImage: COVER_IMG.mamta,
    isOpen: true,
    floor: "1st Floor, Block D",
    description: "Generous North Indian portions with classic dal, sabzi and biryani.",
  },
];

// ---------- Menu builders ----------
const southIndianMenu = (restaurantId: string): MenuItem[] => [
  { id: `${restaurantId}-masala-dosa`, restaurantId, name: "Masala Dosa", description: "Crisp dosa stuffed with spiced potato masala", price: 60, image: FOOD_IMG.dosa, veg: true, category: "Breakfast", popular: true },
  { id: `${restaurantId}-plain-dosa`, restaurantId, name: "Plain Dosa", description: "Classic golden crisp dosa with chutney & sambar", price: 45, image: FOOD_IMG.dosa, veg: true, category: "Breakfast" },
  { id: `${restaurantId}-idli`, restaurantId, name: "Idli (2 pcs) with Sambar & Chutney", description: "Soft steamed rice cakes with hot sambar", price: 40, image: FOOD_IMG.idli, veg: true, category: "Breakfast", popular: true },
  { id: `${restaurantId}-medu-vada`, restaurantId, name: "Medu Vada (2 pcs)", description: "Crispy lentil donuts served with chutney", price: 45, image: FOOD_IMG.idli, veg: true, category: "Breakfast" },
  { id: `${restaurantId}-pongal`, restaurantId, name: "Pongal with Sambar", description: "Comforting rice & lentil porridge with ghee", price: 55, image: FOOD_IMG.thali, veg: true, category: "Breakfast" },
  { id: `${restaurantId}-mini-meals`, restaurantId, name: "Mini Meals", description: "Light meal with rice, sambar, rasam & curd", price: 90, image: FOOD_IMG.thali, veg: true, category: "Mains" },
  { id: `${restaurantId}-full-meals`, restaurantId, name: "Full Meals", description: "Traditional South Indian thali with sides & sweet", price: 120, image: FOOD_IMG.thali, veg: true, category: "Mains", popular: true },
  { id: `${restaurantId}-uthappam`, restaurantId, name: "Uthappam", description: "Thick pancake topped with onion & tomato", price: 65, image: FOOD_IMG.dosa, veg: true, category: "Mains" },
  { id: `${restaurantId}-filter-coffee`, restaurantId, name: "Filter Coffee", description: "Strong South Indian style filter coffee", price: 25, image: FOOD_IMG.coffee, veg: true, category: "Beverages" },
  { id: `${restaurantId}-lemon-rice`, restaurantId, name: "Lemon Rice", description: "Tangy lemon rice with peanuts & curry leaves", price: 55, image: FOOD_IMG.thali, veg: true, category: "Mains" },
];

const northIndianMenu = (restaurantId: string): MenuItem[] => [
  { id: `${restaurantId}-paneer-butter`, restaurantId, name: "Paneer Butter Masala with 2 Rotis", description: "Creamy tomato-based paneer curry with rotis", price: 130, image: FOOD_IMG.paneer, veg: true, category: "Mains", popular: true },
  { id: `${restaurantId}-dal-tadka`, restaurantId, name: "Dal Tadka with Rice", description: "Yellow dal tempered with ghee, served with rice", price: 100, image: FOOD_IMG.thali, veg: true, category: "Mains" },
  { id: `${restaurantId}-veg-biryani`, restaurantId, name: "Veg Biryani", description: "Fragrant basmati rice with mixed vegetables", price: 120, image: FOOD_IMG.biryani, veg: true, category: "Mains", popular: true },
  { id: `${restaurantId}-chole-bhature`, restaurantId, name: "Chole Bhature", description: "Spicy chickpea curry with fluffy bhature", price: 90, image: FOOD_IMG.paneer, veg: true, category: "Mains" },
  { id: `${restaurantId}-rajma-chawal`, restaurantId, name: "Rajma Chawal", description: "Kidney bean curry with steamed rice", price: 100, image: FOOD_IMG.thali, veg: true, category: "Mains" },
  { id: `${restaurantId}-aloo-paratha`, restaurantId, name: "Aloo Paratha with Curd", description: "Stuffed potato paratha with fresh curd", price: 80, image: FOOD_IMG.paneer, veg: true, category: "Breakfast" },
  { id: `${restaurantId}-veg-thali`, restaurantId, name: "Veg Thali", description: "Complete meal with curries, dal, roti & rice", price: 140, image: FOOD_IMG.thali, veg: true, category: "Mains" },
  { id: `${restaurantId}-matar-paneer`, restaurantId, name: "Matar Paneer", description: "Cottage cheese & green peas in spiced gravy", price: 120, image: FOOD_IMG.paneer, veg: true, category: "Mains" },
  { id: `${restaurantId}-mixed-veg`, restaurantId, name: "Mixed Veg Curry", description: "Seasonal vegetables in onion-tomato gravy", price: 100, image: FOOD_IMG.paneer, veg: true, category: "Mains" },
  { id: `${restaurantId}-lassi`, restaurantId, name: "Lassi (Sweet/Salted)", description: "Chilled yogurt drink, sweet or salted", price: 45, image: FOOD_IMG.juice, veg: true, category: "Beverages" },
];

const cafeMenu = (restaurantId: string): MenuItem[] => [
  { id: `${restaurantId}-cappuccino`, restaurantId, name: "Cappuccino", description: "Espresso topped with steamed milk foam", price: 80, image: FOOD_IMG.coffee, veg: true, category: "Beverages", popular: true },
  { id: `${restaurantId}-latte`, restaurantId, name: "Latte", description: "Smooth espresso with steamed milk", price: 90, image: FOOD_IMG.coffee, veg: true, category: "Beverages" },
  { id: `${restaurantId}-cold-coffee`, restaurantId, name: "Cold Coffee", description: "Chilled blended coffee with ice cream", price: 95, image: FOOD_IMG.coffee, veg: true, category: "Beverages", popular: true },
  { id: `${restaurantId}-masala-chai`, restaurantId, name: "Masala Chai", description: "Spiced Indian milk tea", price: 30, image: FOOD_IMG.coffee, veg: true, category: "Beverages" },
  { id: `${restaurantId}-veg-club`, restaurantId, name: "Veg Club Sandwich", description: "Triple-decker with veggies, cheese & chutney", price: 110, image: FOOD_IMG.sandwich, veg: true, category: "Snacks" },
  { id: `${restaurantId}-paneer-grilled`, restaurantId, name: "Paneer Grilled Sandwich", description: "Grilled sandwich with spicy paneer filling", price: 120, image: FOOD_IMG.sandwich, veg: true, category: "Snacks" },
  { id: `${restaurantId}-croissant`, restaurantId, name: "Croissant", description: "Buttery, flaky French pastry", price: 70, image: FOOD_IMG.bakery, veg: true, category: "Snacks" },
  { id: `${restaurantId}-choco-muffin`, restaurantId, name: "Chocolate Muffin", description: "Warm chocolate muffin with chocolate chips", price: 65, image: FOOD_IMG.bakery, veg: true, category: "Desserts" },
  { id: `${restaurantId}-fries`, restaurantId, name: "French Fries", description: "Crispy golden fries with seasoning", price: 90, image: FOOD_IMG.sandwich, veg: true, category: "Snacks" },
  { id: `${restaurantId}-brownie`, restaurantId, name: "Brownie", description: "Dense, fudgy chocolate brownie", price: 75, image: FOOD_IMG.bakery, veg: true, category: "Desserts" },
];

const bakeryMenu = (restaurantId: string): MenuItem[] => [
  { id: `${restaurantId}-veg-puff`, restaurantId, name: "Veg Puff", description: "Flaky puff stuffed with spiced vegetables", price: 30, image: FOOD_IMG.bakery, veg: true, category: "Snacks", popular: true },
  { id: `${restaurantId}-paneer-puff`, restaurantId, name: "Paneer Puff", description: "Flaky puff with spicy paneer filling", price: 40, image: FOOD_IMG.bakery, veg: true, category: "Snacks" },
  { id: `${restaurantId}-bread-loaf`, restaurantId, name: "Bread Loaf", description: "Soft, fresh-baked bread loaf", price: 50, image: FOOD_IMG.bakery, veg: true, category: "Snacks" },
  { id: `${restaurantId}-butter-bun`, restaurantId, name: "Butter Bun", description: "Soft bun with a buttery glaze", price: 20, image: FOOD_IMG.bakery, veg: true, category: "Snacks" },
  { id: `${restaurantId}-cream-roll`, restaurantId, name: "Cream Roll", description: "Crisp pastry filled with sweet cream", price: 45, image: FOOD_IMG.bakery, veg: true, category: "Desserts" },
  { id: `${restaurantId}-black-forest`, restaurantId, name: "Black Forest Pastry", description: "Chocolate sponge with cream & cherries", price: 80, image: FOOD_IMG.bakery, veg: true, category: "Desserts", popular: true },
  { id: `${restaurantId}-truffle-cake`, restaurantId, name: "Chocolate Truffle Cake slice", description: "Rich chocolate truffle cake slice", price: 90, image: FOOD_IMG.bakery, veg: true, category: "Desserts" },
  { id: `${restaurantId}-cookies`, restaurantId, name: "Cookies (3 pcs)", description: "Assorted freshly-baked cookies", price: 50, image: FOOD_IMG.bakery, veg: true, category: "Snacks" },
  { id: `${restaurantId}-egg-puff`, restaurantId, name: "Egg Puff", description: "Flaky puff with spiced boiled egg", price: 35, image: FOOD_IMG.bakery, veg: false, category: "Snacks" },
  { id: `${restaurantId}-samosa`, restaurantId, name: "Samosa (2 pcs)", description: "Crispy samosa with potato-pea filling", price: 40, image: FOOD_IMG.bakery, veg: true, category: "Snacks" },
];

const juiceMenu = (restaurantId: string): MenuItem[] => [
  { id: `${restaurantId}-orange`, restaurantId, name: "Fresh Orange Juice", description: "100% freshly-squeezed orange juice", price: 60, image: FOOD_IMG.juice, veg: true, category: "Beverages", popular: true },
  { id: `${restaurantId}-watermelon`, restaurantId, name: "Watermelon Juice", description: "Chilled watermelon juice, no sugar added", price: 55, image: FOOD_IMG.juice, veg: true, category: "Beverages" },
  { id: `${restaurantId}-mango-shake`, restaurantId, name: "Mango Shake", description: "Thick mango milkshake with real mango", price: 80, image: FOOD_IMG.juice, veg: true, category: "Beverages", popular: true },
  { id: `${restaurantId}-mixed-fruit`, restaurantId, name: "Mixed Fruit Juice", description: "Seasonal fruits blended fresh", price: 70, image: FOOD_IMG.juice, veg: true, category: "Beverages" },
  { id: `${restaurantId}-sugarcane`, restaurantId, name: "Sugarcane Juice", description: "Fresh sugarcane juice with lemon & ginger", price: 40, image: FOOD_IMG.sugarcane, veg: true, category: "Beverages" },
  { id: `${restaurantId}-tender-coconut`, restaurantId, name: "Tender Coconut Water", description: "Naturally hydrating tender coconut water", price: 50, image: FOOD_IMG.sugarcane, veg: true, category: "Beverages" },
  { id: `${restaurantId}-lemon-mint`, restaurantId, name: "Lemon Mint Soda", description: "Refreshing lemon-mint sparkling soda", price: 45, image: FOOD_IMG.juice, veg: true, category: "Beverages" },
  { id: `${restaurantId}-avocado`, restaurantId, name: "Avocado Smoothie", description: "Creamy avocado smoothie with honey", price: 110, image: FOOD_IMG.juice, veg: true, category: "Beverages" },
  { id: `${restaurantId}-pineapple`, restaurantId, name: "Pineapple Juice", description: "Fresh pineapple juice, lightly chilled", price: 60, image: FOOD_IMG.juice, veg: true, category: "Beverages" },
  { id: `${restaurantId}-rose-milk`, restaurantId, name: "Rose Milk", description: "Chilled milk with rose syrup & basil seeds", price: 50, image: FOOD_IMG.juice, veg: true, category: "Beverages" },
];

export const MOCK_MENUS: Record<string, MenuItem[]> = {
  "southern-delight": southIndianMenu("southern-delight"),
  "saravana-bhavan": southIndianMenu("saravana-bhavan"),
  "anandam": northIndianMenu("anandam"),
  "mamta-food-restaurant": northIndianMenu("mamta-food-restaurant"),
  "kaffeehaus": cafeMenu("kaffeehaus"),
  "supreme-bakers": bakeryMenu("supreme-bakers"),
  "edf-juice": juiceMenu("edf-juice"),
  "cococane-juicery": juiceMenu("cococane-juicery"),
};

// Curated set of "Popular on Campus Today" — across restaurants
export const POPULAR_TODAY: MenuItem[] = [
  MOCK_MENUS["saravana-bhavan"][0],   // Masala Dosa
  MOCK_MENUS["anandam"][0],           // Paneer Butter Masala
  MOCK_MENUS["mamta-food-restaurant"][2], // Veg Biryani
  MOCK_MENUS["kaffeehaus"][2],        // Cold Coffee
  MOCK_MENUS["edf-juice"][2],         // Mango Shake
  MOCK_MENUS["supreme-bakers"][5],    // Black Forest
];

export const MOCK_USER: User = {
  id: "user-001",
  fullName: "Aarav Kumar",
  email: "aarav.kumar@ust.com",
  employeeId: "UST-48291",
  department: "Engineering",
  floor: "5",
  wing: "A",
  phone: "+91 98765 43210",
  savedFloors: [
    { id: "f1", label: "My Desk", floor: "5", wing: "A" },
    { id: "f2", label: "Meeting Room 12B", floor: "12", wing: "B" },
  ],
};

const ORDERS_KEY = "ustbite_orders";

export const loadOrders = (): Order[] => {
  try {
    const raw = localStorage.getItem(ORDERS_KEY);
    return raw ? (JSON.parse(raw) as Order[]) : seedOrders();
  } catch {
    return seedOrders();
  }
};

export const saveOrders = (orders: Order[]): void => {
  try { localStorage.setItem(ORDERS_KEY, JSON.stringify(orders)); } catch { /* noop */ }
};

const seedOrders = (): Order[] => {
  const now = Date.now();
  const seeded: Order[] = [
    {
      id: "ORD-1042",
      restaurantId: "saravana-bhavan",
      restaurantName: "Saravana Bhavan",
      items: [
        { name: "Masala Dosa", qty: 2, price: 60 },
        { name: "Filter Coffee", qty: 1, price: 25 },
      ],
      subtotal: 145, deliveryFee: 0, total: 145,
      status: "DELIVERED",
      placedAt: new Date(now - 86400000 * 2).toISOString(),
      estimatedDelivery: new Date(now - 86400000 * 2 + 1200000).toISOString(),
      floor: "5", wing: "A", paymentMethod: "UPI",
    },
    {
      id: "ORD-1041",
      restaurantId: "kaffeehaus",
      restaurantName: "Kaffeehaus",
      items: [{ name: "Cold Coffee", qty: 1, price: 95 }, { name: "Brownie", qty: 1, price: 75 }],
      subtotal: 170, deliveryFee: 0, total: 170,
      status: "DELIVERED",
      placedAt: new Date(now - 86400000 * 5).toISOString(),
      estimatedDelivery: new Date(now - 86400000 * 5 + 900000).toISOString(),
      floor: "5", wing: "A", paymentMethod: "Card",
    },
  ];
  saveOrders(seeded);
  return seeded;
};
