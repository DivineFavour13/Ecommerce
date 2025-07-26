// products-data.js - Complete product database

const products = [
  {
    id: 1,
    name: "iPhone 15 Pro Max",
    price: 1299999,
    originalPrice: 1499999,
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
  }
];

// Make sure products are available globally
window.products = products;

console.log('Products loaded:', products.length);