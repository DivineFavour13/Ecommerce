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
      "data:image/avif;base64,AAAAIGZ0eXBhdmlmAAAAAGF2aWZtaWYxbWlhZk1BMUIAAADrbWV0YQAAAAAAAAAhaGRscgAAAAAAAAAAcGljdAAAAAAAAAAAAAAAAAAAAAAOcGl0bQAAAAAAAQAAAB5pbG9jAAAAAEQAAAEAAQAAAAEAAAETAAAM7gAAAChpaW5mAAAAAAABAAAAGmluZmUCAAAAAAEAAGF2MDFDb2xvcgAAAABqaXBycAAAAEtpcGNvAAAAFGlzcGUAAAAAAAAA+QAAARsAAAAQcGl4aQAAAAADCAgIAAAADGF2MUOBAAwAAAAAE2NvbHJuY2x4AAIAAgAGgAAAABdpcG1hAAAAAAAAAAEAAQQBAoMEAAAM9m1kYXQSAAoKGB4+I0wQICBoQDLdGRIAAooooUDYASQgU0iqqL8TJzWg45b97tojrnVu7kz76cG4biBao4wNzanBMTS0ShHcwehK3Spz7iL9pPjTQmjxdG+MQcrxoxQqOkxUZKmUnCsHSLc+64xOdn13gGqC2AYHX7+QcgfYFYSD0FnGzAaAOCebsEFo2/xbHx8Yh9EFs/wvOHCx8feiMyqJdCNfITB2aXxq4lk4z2zsWphAdC7PCu1AuQLTcT4N/7cz/vOCkoDiTxq23rE2Usk0sSdh05NHJ2HXvcNSRzE2CfEk8TS9zDBAX5Adr3hXeEWufgrnasvBrTX5N1gsAKSbSuFXcCsYYCJ6kvGKeniaywZ0As8fnnkgxyvo6wJoxhjZhDirkEeK8/LI/aIpaQXZaGqHjYkK2q6zy5nxEpyK9YBNw8u+Ae3K+GT8XBYzG28IbTqoxB92uvsWw1wbR8jQLQl8eA+HkwIuSyEd3kaPiyXDL/2q424Ff/rnhK6U01A/tXqKQrRb85ePEqHE3Pk/QOYOiZk03mNezturWEEWsMTUDB4ay0OOkgeK0uivDKbzrZ/hhiXqnmpsFENFy3gmOyuIjFHAp2de1dQMdnVtjUUrzC2VPDfogKfZ9UkTKdIpCR5pv1eSMYdlwvH103XiP4HWgxsZS4MyBo6wEMekfBegP7NiG9lF5k0facnt2yzpuyos7DjOmwteejLkFj+mO/BX2JZPEoy5RxUGmScApwpBJnXS8h1k6dD2VO7EPGPbOnzhAmH/kmisGZzZauj/Pb53BDAXdwNuz0arVdu6TXjGM6/+eeqSuB40Iv1Pz8gRZ+l8JzVSRoX0ioNPoVOb3g/oCB6DpTL5ZAXmAawwU9IOHR63wgOsRLY4fMqF9D0Fd3thkoGVjemxrvwnaxbVfJCMs9OBeDlk3ifkvXgBI+11G217b/s6hH3UbJNAKrIZu/D7ucxZkfwFLXP1el0J2XHViJuxbgUVnKQ/H4aaR8TqVfAkiNjE6fFBVQbsG5rR5wIDPIfaU+YA2fIc50xH3NEWszdOiPuwQZ9LwAoGTLMnkrktL8JYhalIaJ7oQLyV6sYNhcuPwGzWWJ0KdD4C4pvlzeaWHW5BCLCa4J2fVHtrUNxV19sR/J7o/KD7qqm/pMEEwtTygyV8HpL3jXfwhybKYm0EgnLDE7li7KUcV3w4uyYyq8gxz6DyrUqtsTCi0t3uqm8+dyJIod2/FFWlTTYzSmMtaioaWDKr111pQq2vJ4QaWNVGgrlb+jwnS+gfrdiq6q3zP3F+pCCqyikJyICTarptvyejWLutxXlHrl8dZKxPU+Zv5NfXpMq8n/r8wYQXEQgQfzOBDeOXUu9iiq3/rQHP4/E/Tl2TFG9KVIOlLXcCWpZ9eSelailhUeVzMEB1w9CWxQQMiPYKBAS2PIyMWU3k0y+EzEyucOybDWbn0/5WilX8tmyrrpJQbQzjm5CXV0s+tuZX9ywQ67U/GwQsiGEaHk000ZgLteWbBbxbd/mtXq9DwSX+PhWAUX75IkT4wRLzQqx5hnQhWQ3O9fP3YKPFc2vPa0HEnags4DqIZScYg8XAnd+GhyYBlUqtKEqOjig8daq9wf53BI8cjud/KWP2bUGIPBsBJQwtAi1wQX9tmq/IZ35nbmWH0idqLLw2mCjcn8r41sV8EOyfP1vvo878+U/BYLFcPA3FkKiIFUYGoJlLkMXs/6kEcHLbrctD4HAJl50yWV7pO1z9zarUhFBcMpubI61TJPDQFW1k74eklAqjo+5Mi3TGr30EcBoYCpdN8mPE26iuWpkaHSqzLmFE/Cc/n1mir4prevHLFqo9dNIOPDKQGh7K9VceoKFNEfkcriDA4Ld5FLEe9iAqJGDVrZ3zOypUB3b61WI8k3Jc9zTinvS8t0SounNXOVdxFjH21idIcgCo32kCZvV3wD6rHLXonYdyKWLT8cy+CMzg04dqobXqgjXmQ16LsuvPIBZXM3V2K+bCg+pBnYtY0UOfzbpl0OXNmc5iz6eJXvuvJ0s2WKWC/IXJRKfu96ifoTuSPJZQqWTfpOcO8lConexe6lkrHBhud2N66Gak2ih1BsImlTqMDYgwA7AzFcijGQChA1IVjjNAcXDn9RmWWCTPJUFK1z40uDv3jsEQrTRQjhzgwHjHf7qoQsrCUMZBKcx9ue8sCtf5q1VfgkQ9gnyDcvtMQ7aKLrLYKWMcPP8zDWqIqiHzG1yO7IDYTOI1KwIaazOF4I70RH22y4XwUdqChzgGR1/iDdEK6at028P2CEXc6OmYKmvH6XfNRkQS9aKYmVwkatXO09rhi8Lc072nvAd9QMlu38qBN2yP9xBHhdFuEHO9SOj95ZvgK8v+IlEUN02GNAkYQNulzImLCEY2+tXKRh9+vweOSmd2jzH1//3Tjxb4UdcZqpyX3yO65E/lMjxdG84ajcO8puMnHLwfZLkm4xDwRDZKtvS/5kHFC9bLcUFe9nYs6zHrymYKbDpelgAQRiIVmhNM8Aa9ivzvsjWBMcryOtjZXwo9UJ9Mw8eE8ilpKSKdlRRL6uoJ9rv6eKIUQSrq9y9xA7zoA3bz0zTvRG+Y2u4/8p8ekvsjunsDyp43u31pNyBejB0e29VNoBmHUJU7QqNSxJX+XzJEwMRLHJWbFQC4Zq8DOEKxkcaDadjde3Prthxb2a7rqBUUT6T5sh1VFRPCmhn3f2OVhyirtkFPyYWEPaPWNRwJYeJFLVCVYjR4AblqAsdM7vfDWeHIcOgJyFDfLeedvmEkaMl6vIVsO3Qym68+u/FcyFGS+QxBUd0Y9Xz0Hrtc6c3u6/UnOD4qf6xw7/6QkC/Swem7SxNa2W0ZYmqPr6V2oNKIi+J6e7rWVjqpJtBGqFmcmKKQbmtPn1DFYDM25/MTSY2i5k+NAEbXJEvk86IAyhCiB35IEw2pljbfOnNKoN8otMLSpVy5w6zpfcnEPnsoS38YC7mRwQj9uPjZCRuTxssFnEmiLZggeKqJa3mQF+wI5EjTlsAZXWawAYvOhv08NpS33cbTnox3QSbfpHBIYg0cmmz0sKmo4JFbDJzbbnxMuDnw/OQkn8KfQU49OLYGP+prew+4RvGfITKOYcVLsJ5JpoH+eWfTCySBQ+apgssdDq7nFSm814/+6KbAeG0ygJpxhV0TBDPFi/Xd5j1nYciVChYej/GsNQgVVypykxl2aPdPSkwNCN1gJYEngk3QZ4gDBYMwy9/KlAU+w0+p7/4qkN6MrLMEgmD9FswUbK//HniPAxn6o8ENT2gzqLJZDc18zFVSH889i5eIM+VNmIuaGjbmc98OIUwqRh8z9UogPJLrUdoOeaISgLx9rASSV2Dg7du3FZ3REk+MWYTQawPg5jGthFkhgUkUHbpZsgBf3eU1uq83OYHPELkwjShSiBljcFb2IPVALVbAnTBliQVt7gLuMpaTergdNPA6wF3wZeS7Y+Pr0LEHhL5ZfxoZuz766LNQVZQqVnH482g2SkeRMzTh3Zjuazm+WnNCyaKrdEzKhgj0PFygCs90No7GrJK0pOJq3vsQoDxH5W/DooMNGDZqp7yRgX5iM2TmeyX+wGdWGs4KUlmon1MtOlfwdES/YcVpeGF7ikCyP0iAi6siJ613ZJv7RaZo9H+jHvXR2S+TGXskj57x7FKHJ6PJOZQMMEBB064ZnCkaSAbfO00AjJ1CykM2ESeq36E31Ycr7duuWiDSQ2CEickX7W2s9Jr/k8LDQ2RkEEzwp29ygrZwRuDxBrlMg1O9z3I4xvObTg83eer2iBb/94oGGnXAeD3jHGD3nNodxzIWyD/4SfqGbNiLguFzlQYA3U0xs9Ff3QRYv8PtAcFvuwOmEzI1RwYbChkHfp8Rm/huzHK4B26/rsOCWodB7s2hC9I+6WYBoKbG+/0qYgasuKDG6brm4D3WFM5bK1w2RaXNhhi6zaKVFSKoWK24gHTVRxvfQv8Jo6/t+80C8fhAYWYz0DzfrhXiWyv7vMu019/+Cc5N8E4AsDalqeU44j+EneSp9r8TbjM8elDQHqrwLqNBqsxZ10410BRIZVPGalYRph56BcpuZlBDd/Nky+csmROhyWwwPOfnVXDKB8aHi3G0q8H5tc4im50scf+3EEHXaO94dvLDCzDtXPKViglxJiV3RdVMQ/5jj8udLE/pvsS6zliHiJsjRkTp2AVxj3q7vynegm7d258cAtbtU9z1j3gTRiddCrQau5F0z+w2LXn2YbtEvru9G7Nk3GY7w8aOxmaiQ+c52EibmRN4JiwmHGV0tNetIdkc/+NsyUAVdArZrIeJ9dmpi3JeLFiWTGTXfgsOz/6kWzvkQeDgrmJuZnNCpBSnmzvaehI9bVY8GT/sD1HK+uzPzVdtK3JMPf/lEESz1VwXgO3urWNPZlfA",
      "data:image/avif;base64,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",
      ""
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





