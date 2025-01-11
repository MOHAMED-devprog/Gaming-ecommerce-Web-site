import React, { useState, useEffect } from 'react';
import { 
  ShoppingCart, Search, Menu, X, GamepadIcon, Heart, 
  ChevronDown, Star, StarHalf, Filter, Trash2, Plus, Minus
} from 'lucide-react';

// Enhanced product data
const products = [
  {
    id: 1,
    name: "Elite Gaming Mouse",
    price: 79.99,
    image: "https://techspace.ma/cdn/shop/files/souri1_eed8f77d-26af-4799-8568-bd2af9369b53_800x.png?v=1728734477",
    category: "Accessories",
    rating: 4.5,
    reviews: 128,
    description: "High-precision gaming mouse with adjustable DPI and RGB lighting",
    specs: ["16000 DPI", "8 Programmable Buttons", "RGB Lighting"],
    stock: 15,
    discount: 10,
    isNew: true
  },
  {
    id: 2,
    name: "Mechanical Keyboard RGB",
    price: 159.99,
    image: "https://m.media-amazon.com/images/I/71fRP7KY9hL._AC_UF1000,1000_QL80_.jpg",
    category: "Accessories",
    rating: 5,
    reviews: 256,
    description: "Premium mechanical keyboard with Cherry MX switches",
    specs: ["Cherry MX Blue", "Full RGB", "Aluminum Frame"],
    stock: 8,
    discount: 0,
    isNew: true
  },
  {
    id: 3,
    name: "Gaming Headset Pro",
    price: 129.99,
    image: "https://images-cdn.ubuy.co.in/65f9a0296dfa5b5ace4e5222-razer-blackshark-v2-se-wired-gaming.jpg",
    category: "Audio",
    rating: 4,
    reviews: 89,
    description: "Immersive 7.1 surround sound gaming headset",
    specs: ["7.1 Surround", "Noise Cancelling", "Memory Foam"],
    stock: 20,
    discount: 15,
    isNew: false
  },
  {
    id: 4,
    name: "Gaming Chair",
    price: 299.99,
    image: "https://m.media-amazon.com/images/I/71DlNwhYT1L.jpg",
    category: "Furniture",
    rating: 4.5,
    reviews: 167,
    description: "Ergonomic gaming chair with lumbar support",
    specs: ["4D Armrests", "180° Recline", "Lumbar Support"],
    stock: 5,
    discount: 0,
    isNew: false
  },
  {
    id: 5,
    name: "4K Gaming Monitor",
    price: 499.99,
    image: "https://static1.xdaimages.com/wordpress/wp-content/uploads/2024/01/asus-rog-swift-pg32ucdm.jpg",
    category: "Displays",
    rating: 5,
    reviews: 203,
    description: "Ultra-smooth 144Hz 4K gaming monitor",
    specs: ["4K Resolution", "144Hz", "1ms Response"],
    stock: 12,
    discount: 5,
    isNew: true
  },
  {
    id: 6,
    name: "Gaming Mouse Pad XL",
    price: 29.99,
    image: "https://airgaming.com.au/cdn/shop/products/W2-scaled_750x750.jpg?v=1649992972",
    category: "Accessories",
    rating: 4,
    reviews: 78,
    description: "Extended gaming mouse pad with stitched edges",
    specs: ["900x400mm", "Anti-slip Base", "Waterproof"],
    stock: 30,
    discount: 0,
    isNew: false
  }
];

const categories = ["All", "Accessories", "Audio", "Displays", "Furniture"];

function App() {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [cart, setCart] = useState<Array<{ id: number; quantity: number }>>([]);
  const [wishlist, setWishlist] = useState<number[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState("featured");
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<number | null>(null);

  // Filter and sort products
  const filteredProducts = products
    .filter(product => {
      const matchesCategory = selectedCategory === "All" || product.category === selectedCategory;
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          product.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          return a.price - b.price;
        case "price-high":
          return b.price - a.price;
        case "rating":
          return b.rating - a.rating;
        default:
          return 0;
      }
    });

  const addToCart = (productId: number) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === productId);
      if (existingItem) {
        return prevCart.map(item =>
          item.id === productId ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevCart, { id: productId, quantity: 1 }];
    });
  };

  const removeFromCart = (productId: number) => {
    setCart(prevCart => prevCart.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId: number, delta: number) => {
    setCart(prevCart => {
      return prevCart.map(item => {
        if (item.id === productId) {
          const newQuantity = Math.max(1, item.quantity + delta);
          return { ...item, quantity: newQuantity };
        }
        return item;
      });
    });
  };

  const toggleWishlist = (productId: number) => {
    setWishlist(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const cartItemsCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = cart.reduce((sum, item) => {
    const product = products.find(p => p.id === item.id)!;
    const price = product.price * (1 - product.discount / 100);
    return sum + (price * item.quantity);
  }, 0);

  // Rating stars component
  const RatingStars = ({ rating }: { rating: number }) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    
    return (
      <div className="flex items-center">
        {[...Array(fullStars)].map((_, i) => (
          <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
        ))}
        {hasHalfStar && <StarHalf className="w-4 h-4 fill-yellow-400 text-yellow-400" />}
        {[...Array(5 - Math.ceil(rating))].map((_, i) => (
          <Star key={i} className="w-4 h-4 text-gray-300" />
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-gray-900 text-white sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <GamepadIcon className="h-8 w-8 text-purple-500" />
              <span className="ml-2 text-xl font-bold">GameGear</span>
            </div>
            
            <div className="hidden md:flex items-center space-x-8">
              <a href="#" className="hover:text-purple-400">Home</a>
              <a href="#" className="hover:text-purple-400">Shop</a>
              <div className="relative group">
                <button className="flex items-center hover:text-purple-400">
                  Categories <ChevronDown className="ml-1 h-4 w-4" />
                </button>
                <div className="absolute hidden group-hover:block w-48 bg-white text-gray-800 shadow-lg rounded-lg mt-2">
                  {categories.map(category => (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>
              <a href="#" className="hover:text-purple-400">Deals</a>
            </div>

            <div className="flex items-center space-x-4">
              {showSearch ? (
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-64 px-4 py-1 rounded-full text-gray-900 focus:outline-none"
                  />
                  <button
                    onClick={() => setShowSearch(false)}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2"
                  >
                    <X className="h-5 w-5 text-gray-500" />
                  </button>
                </div>
              ) : (
                <button 
                  className="p-2 hover:bg-gray-800 rounded-full"
                  onClick={() => setShowSearch(true)}
                >
                  <Search className="h-5 w-5" />
                </button>
              )}
              <button 
                className="p-2 hover:bg-gray-800 rounded-full relative"
                onClick={() => setIsCartOpen(!isCartOpen)}
              >
                <ShoppingCart className="h-5 w-5" />
                {cartItemsCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-purple-500 text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {cartItemsCount}
                  </span>
                )}
              </button>
              <button 
                className="md:hidden p-2 hover:bg-gray-800 rounded-full"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 py-24">
          <div className="text-center">
            <div className="text-purple-500 font-semibold mb-4">Special Offer - Up to 15% Off</div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Level Up Your Gaming Setup
            </h1>
            <p className="text-xl text-gray-300 mb-8">
              Premium gaming gear for the ultimate gaming experience
            </p>
            <div className="flex justify-center space-x-4">
              <button className="bg-purple-600 text-white px-8 py-3 rounded-full text-lg font-semibold hover:bg-purple-700 transition duration-300">
                Shop Now
              </button>
              
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 w-full h-20 bg-gradient-to-t from-gray-50 to-transparent"></div>
      </div>

      {/* Products Section */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        {/* Filters and Sort */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div className="flex items-center space-x-4 mb-4 md:mb-0">
            <Filter className="h-5 w-5 text-gray-500" />
            <div className="flex flex-wrap gap-2">
              {categories.map(category => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-full text-sm ${
                    selectedCategory === category
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="featured">Featured</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="rating">Highest Rated</option>
          </select>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProducts.map(product => (
            <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition duration-300">
              <div className="relative h-64">
                <img 
                  src={product.image} 
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
                {product.discount > 0 && (
                  <div className="absolute top-4 left-4 bg-red-500 text-white px-2 py-1 rounded-full text-sm font-semibold">
                    {product.discount}% OFF
                  </div>
                )}
                {product.isNew && (
                  <div className="absolute top-4 right-4 bg-green-500 text-white px-2 py-1 rounded-full text-sm font-semibold">
                    NEW
                  </div>
                )}
                <button
                  onClick={() => toggleWishlist(product.id)}
                  className="absolute bottom-4 right-4 p-2 rounded-full bg-white shadow-md hover:bg-gray-100 transition duration-300"
                >
                  <Heart 
                    className={`h-5 w-5 ${
                      wishlist.includes(product.id) 
                        ? 'fill-red-500 text-red-500' 
                        : 'text-gray-600'
                    }`} 
                  />
                </button>
              </div>
              <div className="p-6">
                <div className="text-sm text-purple-600 mb-2">{product.category}</div>
                <h3 className="text-xl font-semibold mb-2">{product.name}</h3>
                <p className="text-gray-600 text-sm mb-4">{product.description}</p>
                <div className="flex items-center space-x-2 mb-4">
                  <RatingStars rating={product.rating} />
                  <span className="text-sm text-gray-500">({product.reviews})</span>
                </div>
                <div className="flex flex-wrap gap-2 mb-4">
                  {product.specs.map((spec, index) => (
                    <span key={index} className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs">
                      {spec}
                    </span>
                  ))}
                </div>
                <div className="flex justify-between items-center">
                  <div>
                    {product.discount > 0 ? (
                      <div className="flex items-center space-x-2">
                        <span className="text-2xl font-bold">
                          ${(product.price * (1 - product.discount / 100)).toFixed(2)}
                        </span>
                        <span className="text-sm text-gray-500 line-through">
                          ${product.price}
                        </span>
                      </div>
                    ) : (
                      <span className="text-2xl font-bold">${product.price}</span>
                    )}
                  </div>
                  <button 
                    onClick={() => addToCart(product.id)}
                    disabled={product.stock === 0}
                    className={`px-4 py-2 rounded-full ${
                      product.stock > 0
                        ? 'bg-purple-600 text-white hover:bg-purple-700'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    } transition duration-300`}
                  >
                    {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
                  </button>
                </div>
                {product.stock <= 5 && product.stock > 0 && (
                  <div className="mt-2 text-sm text-red-500">
                    Only {product.stock} left in stock!
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Shopping Cart Sidebar */}
      {isCartOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50">
          <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-xl">
            <div className="flex flex-col h-full">
              <div className="p-6 border-b">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold">Your Cart</h2>
                  <button 
                    onClick={() => setIsCartOpen(false)}
                    className="p-2 hover:bg-gray-100 rounded-full"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-6">
                {cart.length === 0 ? (
                  <div className="text-center py-8">
                    <ShoppingCart className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">Your cart is empty</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {cart.map(item => {
                      const product = products.find(p => p.id === item.id)!;
                      const price = product.price * (1 - product.discount / 100);
                      return (
                        <div key={item.id} className="flex items-center">
                          <img 
                            src={product.image} 
                            alt={product.name}
                            className="w-20 h-20 object-cover rounded"
                          />
                          <div className="flex-1 ml-4">
                            <h3 className="font-semibold">{product.name}</h3>
                            <div className="text-sm text-gray-500 mb-2">{product.category}</div>
                            <div className="flex items-center">
                              <button
                                onClick={() => updateQuantity(item.id, -1)}
                                className="p-1 rounded-full hover:bg-gray-100"
                              >
                                <Minus className="h-4 w-4" />
                              </button>
                              <span className="mx-2">{item.quantity}</span>
                              <button
                                onClick={() => updateQuantity(item.id, 1)}
                                className="p-1 rounded-full hover:bg-gray-100"
                              >
                                <Plus className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                          <div className="text-right ml-4">
                            <div className="font-bold">${(price * item.quantity).toFixed(2)}</div>
                            <button
                              onClick={() => removeFromCart(item.id)}
                              className="text-red-500 hover:text-red-600 p-1"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {cart.length > 0 && (
                <div className="p-6 border-t">
                  <div className="mb-4">
                    <div className="flex justify-between text-sm mb-2">
                      <span>Subtotal</span>
                      <span>${cartTotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Shipping</span>
                      <span>Free</span>
                    </div>
                    <div className="flex justify-between text-xl font-bold">
                      <span>Total</span>
                      <span>${cartTotal.toFixed(2)}</span>
                    </div>
                  </div>
                  <button className="w-full bg-purple-600 text-white py-3 rounded-full hover:bg-purple-700 transition duration-300">
                    Proceed to Checkout
                  </button>
                  <button 
                    onClick={() => setIsCartOpen(false)}
                    className="w-full text-center mt-4 text-gray-600 hover:text-gray-800"
                  >
                    Continue Shopping
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 bg-gray-900 bg-opacity-95 z-40">
          <div className="flex flex-col items-center pt-24 space-y-8 text-white text-xl">
            <a href="#" className="hover:text-purple-400">Home</a>
            <a href="#" className="hover:text-purple-400">Shop</a>
            <a href="#" className="hover:text-purple-400">Categories</a>
            <a href="#" className="hover:text-purple-400">Deals</a>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;