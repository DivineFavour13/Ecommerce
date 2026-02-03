const products = [
  {
    id: 1,
    name: "iPhone 15 Pro Max",
    price: 1299999,
    // originalPrice: 1499999,
    category: "electronics",
    brand: "Apple",
    rating: 4.8,
    reviews: 245,
    image: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=400&fit=crop"
    ],
    description: "The most advanced iPhone yet with titanium design, A17 Pro chip, and advanced camera system.",
    specifications: {
      "Screen Size": "6.7 inches",
      "Storage": "256GB",
      "Camera": "48MP main camera",
      "Battery": "All-day battery life",
      "Color": "Natural Titanium"
    },
    inStock: true,
    stock: 25,
    isFlashSale: true,
    flashPrice: 1199999,
    isNewArrival: true,
    isTopSeller: true
  },
  {
    id: 2,
    name: "Samsung Galaxy S24 Ultra",
    price: 1199999,
    category: "electronics",
    brand: "Samsung",
    rating: 4.7,
    reviews: 189,
    image: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=400&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1574944985070-8f3ebc6b79d2?w=400&h=400&fit=crop"
    ],
    description: "Flagship Android phone with S Pen, 200MP camera, and AI features.",
    specifications: {
      "Screen Size": "6.8 inches",
      "Storage": "512GB",
      "Camera": "200MP main camera",
      "Battery": "5000mAh",
      "Color": "Titanium Gray"
    },
    inStock: true,
    stock: 18,
    isTopSeller: true
  },
  {
    id: 3,
    name: "Nike Air Force 1",
    price: 89999,
    category: "fashion",
    brand: "Nike",
    rating: 4.5,
    reviews: 567,
    image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=400&fit=crop"
    ],
    description: "Classic basketball shoe with timeless style and comfort.",
    specifications: {
      "Material": "Leather upper",
      "Sole": "Rubber outsole",
      "Closure": "Lace-up",
      "Size Range": "US 6-13",
      "Color": "White"
    },
    inStock: true,
    stock: 89,
    isTopSeller: true,
    isFlashSale: true,
    flashPrice: 79999
  },
  {
    id: 4,
    name: "MacBook Pro 16-inch",
    price: 2499999,
    category: "electronics",
    brand: "Apple",
    rating: 4.9,
    reviews: 156,
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=400&fit=crop"
    ],
    description: "Professional laptop with M3 chip, stunning Liquid Retina XDR display.",
    specifications: {
      "Processor": "Apple M3 chip",
      "Memory": "16GB unified memory",
      "Storage": "512GB SSD",
      "Display": "16-inch Liquid Retina XDR",
      "Color": "Space Gray"
    },
    inStock: true,
    stock: 12,
    isNewArrival: true,
    isTopSeller: true
  },
  {
    id: 5,
    name: "Sony WH-1000XM5",
    price: 399999,
    originalPrice: 449999,
    category: "electronics",
    brand: "Sony",
    rating: 4.6,
    reviews: 298,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop"
    ],
    description: "Industry-leading noise canceling wireless headphones with premium sound.",
    specifications: {
      "Type": "Over-ear wireless",
      "Battery Life": "30 hours",
      "Noise Cancelling": "Industry-leading",
      "Connectivity": "Bluetooth 5.2",
      "Color": "Black"
    },
    inStock: true,
    stock: 45,
    isFlashSale: true,
    flashPrice: 349999,
    isTopSeller: true
  },
  {
    id: 6,
    name: "PlayStation 5 Console",
    price: 499999,
    originalPrice: 549999,
    category: "gaming",
    brand: "Sony",
    rating: 4.9,
    reviews: 456,
    image: "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=400&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=400&h=400&fit=crop"
    ],
    description: "Next-gen gaming console with ultra-high speed SSD and ray tracing.",
    specifications: {
      "CPU": "AMD Zen 2",
      "GPU": "AMD RDNA 2",
      "Storage": "825GB SSD",
      "Memory": "16GB GDDR6",
      "Resolution": "Up to 8K"
    },
    inStock: true,
    stock: 8,
    isFlashSale: true,
    flashPrice: 459999,
    isTopSeller: true
  },
  {
    id: 7,
    name: "Fenty Beauty Foundation",
    price: 34999,
    category: "beauty",
    brand: "Fenty Beauty",
    rating: 4.5,
    reviews: 678,
    image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=400&fit=crop"
    ],
    description: "Pro Filt'r Soft Matte Longwear Foundation with 50 shades.",
    specifications: {
      "Volume": "32ml",
      "Coverage": "Medium to full",
      "Finish": "Soft matte",
      "Shades": "50 shades available",
      "Type": "Longwear foundation"
    },
    inStock: true,
    stock: 89,
    isTopSeller: true,
    isNewArrival: true
  },
  {
    id: 8,
    name: "iPad Pro 12.9-inch",
    price: 1099999,
    category: "phones",
    brand: "Apple",
    rating: 4.7,
    reviews: 167,
    image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400&h=400&fit=crop"
    ],
    description: "The ultimate iPad experience with M2 chip and Liquid Retina XDR display.",
    specifications: {
      "Screen Size": "12.9 inches",
      "Processor": "Apple M2 chip",
      "Storage": "128GB",
      "Display": "Liquid Retina XDR",
      "Color": "Space Gray"
    },
    inStock: true,
    stock: 34,
    isNewArrival: true,
    isTopSeller: true
  },
  {
    id: 9,
    name: "Apple Watch Series 9",
    price: 599999,
    category: "electronics",
    brand: "Apple",
    rating: 4.6,
    reviews: 214,
    image: "https://images.unsplash.com/photo-1516574187841-cb9cc2ca948b?w=400&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1516574187841-cb9cc2ca948b?w=400&h=400&fit=crop"
    ],
    description: "Advanced smartwatch with health tracking, fitness insights, and always-on Retina display.",
    specifications: {
      "Display": "Always-On Retina",
      "Health": "ECG, Blood Oxygen",
      "Connectivity": "GPS + Cellular",
      "Battery": "18 hours",
      "Color": "Midnight"
    },
    inStock: true,
    stock: 40,
    isNewArrival: true,
    isTopSeller: true
  },
  {
    id: 10,
    name: "Dell XPS 15",
    price: 1899999,
    category: "electronics",
    brand: "Dell",
    rating: 4.7,
    reviews: 132,
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&h=400&fit=crop"
    ],
    description: "Premium Windows laptop with InfinityEdge display and powerful performance.",
    specifications: {
      "Processor": "Intel Core i7",
      "Memory": "16GB RAM",
      "Storage": "1TB SSD",
      "Display": "15.6-inch 4K UHD",
      "Color": "Silver"
    },
    inStock: true,
    stock: 15,
    isTopSeller: true
  },
  {
    id: 11,
    name: "ADIDAS VultRun M MEN",
    price: 101900,
    category: "fashion",
    brand: "Adidas",
    rating: "4.6",
    reviews: 175,
    image: "https://ng.jumia.is/unsafe/fit-in/680x680/filters:fill(white)/product/96/9049472/1.jpg?8225",
    description: "High-performance running shoes with responsive Boost cushioning.",
    specifications: {
      "SKU": "AD002FS4WRPBNNAFAMZ",
      "Product Line": "Adidas Official Store",
      "Model": "GB1777",
      "Weight (kg)": "0.8",
      "Color": "Blue",
      "Main Material": "TEXTILE/SYNTHETICS",
      "Shop Type": "Jumia Mall"
    },
    inStock: true,
    stock: 60,
    isFlashSale: true,
    flashPrice: 37267
  },
  {
    id: 12,
    name: "Canon Ink Cart Eos Canon1100D Camera With 18 - 55mm Lens",
    price: 300000,
    category: "electronics",
    brand: " Canon Ink Cart ",
    rating: "3/5",
    reviews: 1,
    image: "https://ng.jumia.is/unsafe/fit-in/680x680/filters:fill(white)/product/10/2900433/1.jpg?2690",
    description: "A reliable entry-level DSLR kit that captures sharp photos and smooth videos, perfect for beginners and everyday shooting.",
    specifications: {
      "SKU": "CA587CM54QLBVNAFAMZ",
      "Product Line": "Endy Best",
      "Model": "1100D",
      "Weight (kg)": 5,
      "Color": "Black"
    },
    inStock: true,
    stock: 10,
    isTopSeller: true
  },
  {
    id: 13,
    name: "Logitech MX Master 3S Mouse",
    price: 89999,
    category: "electronics",
    brand: "Logitech",
    rating: 4.7,
    reviews: 421,
    image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=400&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=400&h=400&fit=crop"
    ],
    description: "Advanced wireless mouse with ultra-fast scrolling and ergonomic design.",
    specifications: {
      "Connectivity": "Bluetooth / USB Receiver",
      "Battery": "Up to 70 days",
      "Sensor": "8000 DPI",
      "Compatibility": "Windows & macOS",
      "Color": "Graphite"
    },
    inStock: true,
    stock: 55,
    isTopSeller: true
  },
  {
    id: 14,
    name: "JBL Charge 5 Bluetooth Speaker",
    price: 159999,
    category: "electronics",
    brand: "JBL",
    rating: 4.5,
    reviews: 384,
    image: "https://images.unsplash.com/photo-1612441804231-77a36b284856?w=400&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1612441804231-77a36b284856?w=400&h=400&fit=crop"
    ],
    description: "Portable Bluetooth speaker with powerful sound and long battery life.",
    specifications: {
      "Battery Life": "20 hours",
      "Waterproof": "IP67",
      "Connectivity": "Bluetooth",
      "Powerbank": "Yes",
      "Color": "Black"
    },
    inStock: true,
    stock: 70,
    isFlashSale: true,
    flashPrice: 139999
  },
  {
    id: 15,
    name: "NIVEA Sun UV Sunscreen Face Shine Control Cream SPF 50 - 50ml",
    price: 21840,
    category: "beauty",
    brand: "NIVEA",
    rating: 4.4,
    reviews: 411,
    image: "https://ng.jumia.is/unsafe/fit-in/680x680/filters:fill(white)/product/04/3634404/1.jpg?2636",
    images: [
      "https://ng.jumia.is/unsafe/fit-in/680x680/filters:fill(white)/product/04/3634404/2.jpg?2618",
      "https://ng.jumia.is/unsafe/fit-in/680x680/filters:fill(white)/product/04/3634404/3.jpg?2618",
      "https://ng.jumia.is/unsafe/fit-in/680x680/filters:fill(white)/product/04/3634404/5.jpg?2618",
      "https://ng.jumia.is/unsafe/fit-in/680x680/filters:fill(white)/product/04/3634404/7.jpg?2618"
    ],
    description: "NIVEA Sun UV Face Shine Control SPF 50 provides powerful UVA/UVB protection with a lightweight, non-greasy formula that keeps your skin matte and shine-free all day.",
    specifications: {
      "SKU": "NI930ST7C1C08NAFAMZ",
      "Weight (kg)": "1",
      "Shop Type": "Luxora Mall"
    },
    inStock: true,
    stock: 70,
    isFlashSale: true,
    flashPrice: 16578
  },
  {
    id: 16,
    name: "BAMBOO COOL Men's Ultra Breathable Underwear,No Riding Up Boxer Briefs with ComfortFlexible Waistband,Multipack",
    price: 51651,
    category: "fashion",
    brand: "Bamboo Cool",
    rating: 4.5,
    reviews: 15456,
    image: "https://m.media-amazon.com/images/I/71juzQ+JLzL._AC_SX679_.jpg",
    images: [
      "https://m.media-amazon.com/images/I/81sxMqaXKUL._AC_SX679_.jpg",
      "https://m.media-amazon.com/images/I/711MqAgQzBL._AC_SX679_.jpg",
      "https://m.media-amazon.com/images/I/91KLGzWEd4L._AC_SX679_.jpg"
    ],
    description: "BAMBOO COOL Men's Boxer Briefs (4-Pack) experience all-day comfort with these ultra-breathable men's boxer briefs made from soft, moisture-wicking fabric. Designed to prevent riding up, they feature a flexible waistband that stays secure without digging in. Lightweight, stretchy, and durable—perfect for everyday wear, work, or workouts.",
    specifications: {
      "SKU": "FA203MW2WP9H9NAFAMZ",
      "Model": "Underwear",
      "Weight (kg)": "0.2",
      "Color": "multicolor",
      "Main Material": "92% viscose made from bamboo, 8% spandex",
      "Care Label": "washable"
    },
    inStock: true,
    stock: 659,
    isFlashSale: true,
    flashPrice: 43900
  }
];

// Make sure products are available globally
window.products = products;

console.log('Products loaded:', products.length);