import React, { useState } from 'react';
import { Product, Category } from '../types';

interface AdminViewProps {
  products: Product[];
  categories: Category[];
  onAddProduct: (product: Product) => Promise<boolean>;
  onDeleteProduct: (id: string) => Promise<void>;
  WatermarkedImage: React.FC<any>;
  VideoPlayer: React.FC<any>;
  Banner: React.FC<any>;
}

const AdminView: React.FC<AdminViewProps> = ({
  products,
  categories,
  onAddProduct,
  onDeleteProduct,
  WatermarkedImage,
  VideoPlayer,
  Banner,
}) => {
  const [newProduct, setNewProduct] = useState<Partial<Product>>({
    title: '',
    price: 0,
    discount: 0,
    category: '',
    image: '',
    images: [],
    videoUrl: '',
    description: '',
  });

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewProduct(prev => ({
      ...prev,
      [name]: name === 'price' || name === 'discount' ? Number(value) : value,
    }));
  };

  const handleArrayInputChange = (e: React.ChangeEvent<HTMLInputElement>, field: 'images') => {
    const values = e.target.value.split(',').map(item => item.trim());
    setNewProduct(prev => ({
      ...prev,
      [field]: values,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const product: Product = {
        id: `temp_${Date.now()}`,
        title: newProduct.title || '',
        price: newProduct.price || 0,
        discount: newProduct.discount || 0,
        category: newProduct.category || '',
        image: newProduct.image || '',
        images: newProduct.images || [],
        videoUrl: newProduct.videoUrl || '',
        description: newProduct.description || '',
      };
      
      const success = await onAddProduct(product);
      if (success) {
        setNewProduct({
          title: '',
          price: 0,
          discount: 0,
          category: '',
          image: '',
          images: [],
          videoUrl: '',
          description: '',
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredProducts = products.filter(p => {
    const matchesCategory = selectedCategory === 'all' || p.category === selectedCategory;
    const matchesSearch = searchTerm === '' || 
      p.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.description?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FFF4E8] to-[#FFE4D6]">
      {/* Header with Alibaba orange gradient */}
      <div className="sticky top-0 z-10 bg-gradient-to-r from-[#FF6A00] to-[#FF8533] text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                <span className="text-white text-xl font-bold">SS</span>
              </div>
              <div>
                <h1 className="text-xl font-bold tracking-tight">Admin Dashboard</h1>
                <p className="text-xs text-orange-100">Sonko Sound Management</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <span className="px-3 py-1 bg-white/20 rounded-full text-xs font-semibold backdrop-blur-sm border border-white/30">
                ©SonkoSound
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column - Add Product Form - Keep original layout */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-orange-100">
              <div className="bg-gradient-to-r from-[#FF6A00] to-[#FF8533] px-5 py-4">
                <h2 className="text-white font-semibold flex items-center space-x-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Add New Product</span>
                </h2>
              </div>

              <form onSubmit={handleSubmit} className="p-5 space-y-4">
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                      Product Title
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={newProduct.title}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-orange-50/30 border border-orange-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6A00]/20 focus:border-[#FF6A00] transition-all"
                      placeholder="e.g., Wireless Speaker Pro"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                        Price (TZS)
                      </label>
                      <input
                        type="number"
                        name="price"
                        value={newProduct.price}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-orange-50/30 border border-orange-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6A00]/20 focus:border-[#FF6A00] transition-all"
                        placeholder="0"
                        min="0"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                        Discount %
                      </label>
                      <input
                        type="number"
                        name="discount"
                        value={newProduct.discount}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-orange-50/30 border border-orange-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6A00]/20 focus:border-[#FF6A00] transition-all"
                        placeholder="0"
                        min="0"
                        max="100"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                      Category
                    </label>
                    <select
                      name="category"
                      value={newProduct.category}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-orange-50/30 border border-orange-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6A00]/20 focus:border-[#FF6A00] transition-all appearance-none"
                      required
                    >
                      <option value="">Select category</option>
                      {categories.map(cat => (
                        <option key={cat.id} value={cat.name}>{cat.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                      Main Image URL
                    </label>
                    <input
                      type="url"
                      name="image"
                      value={newProduct.image}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-orange-50/30 border border-orange-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6A00]/20 focus:border-[#FF6A00] transition-all"
                      placeholder="https://..."
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                      Additional Images (comma separated)
                    </label>
                    <input
                      type="text"
                      value={newProduct.images?.join(', ')}
                      onChange={(e) => handleArrayInputChange(e, 'images')}
                      className="w-full px-4 py-3 bg-orange-50/30 border border-orange-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6A00]/20 focus:border-[#FF6A00] transition-all"
                      placeholder="url1, url2, url3"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                      Video URL (optional)
                    </label>
                    <input
                      type="url"
                      name="videoUrl"
                      value={newProduct.videoUrl}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-orange-50/30 border border-orange-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6A00]/20 focus:border-[#FF6A00] transition-all"
                      placeholder="https://..."
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                      Description
                    </label>
                    <textarea
                      name="description"
                      value={newProduct.description}
                      onChange={handleInputChange}
                      rows={3}
                      className="w-full px-4 py-3 bg-orange-50/30 border border-orange-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6A00]/20 focus:border-[#FF6A00] transition-all resize-none"
                      placeholder="Product description..."
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-[#FF6A00] to-[#FF8533] text-white font-semibold py-3 rounded-xl hover:from-[#FF8533] hover:to-[#FF6A00] transition-all duration-300 shadow-lg shadow-[#FF6A00]/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span>Adding...</span>
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                      <span>Add Product</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Right Column - Product List - Keep original layout */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-orange-100">
              <div className="bg-gradient-to-r from-[#FF6A00] to-[#FF8533] px-5 py-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
                  <h2 className="text-white font-semibold flex items-center space-x-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                    <span>Product Inventory</span>
                  </h2>
                  
                  <div className="flex flex-col sm:flex-row gap-3">
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Search products..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full sm:w-64 px-4 py-2 bg-white/20 border border-white/30 rounded-xl text-sm text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-white/30 transition-all"
                      />
                      <svg className="absolute right-3 top-2.5 w-4 h-4 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </div>
                    
                    <select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="px-4 py-2 bg-white/20 border border-white/30 rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-white/30 transition-all"
                    >
                      <option value="all">All Categories</option>
                      {categories.map(cat => (
                        <option key={cat.id} value={cat.name}>{cat.name}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <div className="divide-y divide-orange-100 max-h-[600px] overflow-y-auto">
                {filteredProducts.length > 0 ? (
                  filteredProducts.map((product) => (
                    <div key={product.id} className="p-4 hover:bg-orange-50/50 transition-colors group">
                      <div className="flex items-center space-x-4">
                        {/* Product Image with Watermark - Using Sonko Sound watermark */}
                        <div className="w-20 h-20 flex-shrink-0 rounded-xl overflow-hidden bg-orange-50 border border-orange-100 shadow-sm">
                          <WatermarkedImage
                            src={product.image || ''}
                            alt={product.title}
                            containerClass="w-full h-full"
                            productId={product.id}
                            isProduct={true}
                          />
                        </div>

                        {/* Product Details */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className="text-sm font-semibold text-gray-900 truncate max-w-xs">
                                {product.title}
                              </h3>
                              <div className="flex items-center space-x-3 mt-1">
                                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-[#FF6A00]/10 text-[#FF6A00] border border-[#FF6A00]/20">
                                  {product.category}
                                </span>
                                <span className="text-xs text-gray-500">
                                  ID: {product.id.slice(0, 8)}...
                                </span>
                              </div>
                              <div className="flex items-center space-x-3 mt-2">
                                <span className="text-sm font-bold text-gray-900">
                                  TZS {product.price?.toLocaleString()}
                                </span>
                                {product.discount ? (
                                  <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                                    -{product.discount}%
                                  </span>
                                ) : null}
                              </div>
                            </div>

                            <button
                              onClick={() => onDeleteProduct(product.id)}
                              className="opacity-0 group-hover:opacity-100 transition-opacity p-2 hover:bg-red-50 rounded-lg text-red-500 hover:text-red-600"
                              title="Delete product"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-12 text-center">
                    <div className="w-20 h-20 mx-auto bg-orange-50 rounded-full flex items-center justify-center mb-4">
                      <svg className="w-10 h-10 text-[#FF6A00]/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">No products found</h3>
                    <p className="text-sm text-gray-500">
                      {searchTerm || selectedCategory !== 'all' 
                        ? 'Try adjusting your search or filter' 
                        : 'Add your first product to get started'}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Sonko Sound watermark footer - Added without changing layout */}
            <div className="mt-4 text-center">
              <span className="text-xs text-gray-400">©SonkoSound - Product images protected</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminView;
