import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Product, Comment } from '../types';
import { COLORS, ICONS } from '../constants';

interface ProductDetailViewProps {
  product: Product;
  allProducts: Product[];
  onBack: () => void;
  onProductClick: (product: Product) => void;
  WatermarkedImage: React.FC<any>;
  VideoPlayer: React.FC<any>;
  Banner: React.FC<any>;
  comments: Comment[];
  commentCount: number;
  onFetchComments: () => void;
  onAddComment: (content: string) => Promise<Comment | null>;
  onLikeComment: (commentId: string) => Promise<boolean>;
  onDeleteComment: (commentId: string) => Promise<boolean>;
  isLoadingComments: boolean;
  viewCount: number;
  onRecordView: () => void;
}

const ProductDetailView: React.FC<ProductDetailViewProps> = ({
  product,
  allProducts,
  onBack,
  onProductClick,
  WatermarkedImage,
  VideoPlayer,
  Banner,
  comments,
  commentCount,
  onFetchComments,
  onAddComment,
  onLikeComment,
  onDeleteComment,
  isLoadingComments,
  viewCount,
  onRecordView,
}) => {
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [activeTab, setActiveTab] = useState<'details' | 'comments' | 'related'>('details');
  const [imageLoadError, setImageLoadError] = useState<Record<string, boolean>>({});
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const commentsEndRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const commentInputRef = useRef<HTMLInputElement>(null);

  // Get all product images
  const productImages = useMemo(() => {
    const images: string[] = [];
    
    if (product.images && Array.isArray(product.images)) {
      images.push(...product.images.filter(Boolean));
    }
    
    if (product.image && !images.includes(product.image)) {
      images.unshift(product.image);
    }
    
    if (product.image_url && !images.includes(product.image_url)) {
      images.unshift(product.image_url);
    }
    
    if (product.descriptionImages && Array.isArray(product.descriptionImages)) {
      images.push(...product.descriptionImages.filter(Boolean));
    }
    
    return images.filter((url, index, self) => 
      url && typeof url === 'string' && self.indexOf(url) === index
    );
  }, [product]);

  // Set initial selected image
  useEffect(() => {
    if (productImages.length > 0) {
      setSelectedImage(productImages[0]);
    } else if (product.image) {
      setSelectedImage(product.image);
    } else if (product.image_url) {
      setSelectedImage(product.image_url);
    }
  }, [product, productImages]);

  // Record view when component mounts
  useEffect(() => {
    onRecordView();
  }, [onRecordView]);

  // Scroll to bottom of comments when new comment added
  useEffect(() => {
    if (commentsEndRef.current && showComments) {
      commentsEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [comments, showComments]);

  // Fetch comments if not already loaded
  useEffect(() => {
    if (comments.length === 0 && !isLoadingComments) {
      onFetchComments();
    }
  }, [comments.length, isLoadingComments, onFetchComments]);

  const handleImageSelect = (image: string, index: number) => {
    setSelectedImage(image);
    setSelectedImageIndex(index);
  };

  const handleNextImage = () => {
    if (selectedImageIndex < productImages.length - 1) {
      const newIndex = selectedImageIndex + 1;
      setSelectedImageIndex(newIndex);
      setSelectedImage(productImages[newIndex]);
    }
  };

  const handlePrevImage = () => {
    if (selectedImageIndex > 0) {
      const newIndex = selectedImageIndex - 1;
      setSelectedImageIndex(newIndex);
      setSelectedImage(productImages[newIndex]);
    }
  };

  const handlePlayVideo = () => {
    if (videoRef.current) {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  const handlePauseVideo = () => {
    if (videoRef.current) {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const handleShare = async () => {
    const shareData = {
      title: product.title || product.name,
      text: `Check out ${product.title || product.name} at Sonko Sound`,
      url: window.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        // Fallback - copy to clipboard
        await navigator.clipboard.writeText(window.location.href);
        alert('Link copied to clipboard!');
      }
    } catch (error) {
      console.error('Share failed:', error);
    }
    setShowShareMenu(false);
  };

  const handleAddComment = async () => {
    if (!newComment.trim() || isSubmittingComment) return;

    setIsSubmittingComment(true);
    try {
      await onAddComment(newComment.trim());
      setNewComment('');
      if (commentInputRef.current) {
        commentInputRef.current.focus();
      }
    } catch (error) {
      console.error('Failed to add comment:', error);
    } finally {
      setIsSubmittingComment(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleAddComment();
    }
  };

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} min ago`;
    if (diffHours < 24) return `${diffHours} hour ago`;
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
    });
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const handleImageError = (imageUrl: string) => {
    setImageLoadError(prev => ({ ...prev, [imageUrl]: true }));
  };

  // Get related products (same category, excluding current product)
  const relatedProducts = useMemo(() => {
    return allProducts
      .filter(p => 
        p.id !== product.id && 
        (p.category === product.category || 
         (p as any).category_name === (product as any).category_name)
      )
      .slice(0, 6);
  }, [allProducts, product]);

  const discount = product.discount || (product as any).discount_percentage || 0;
  const originalPrice = product.original_price || product.price;
  const currentPrice = product.sellingPrice || product.price;
  const hasDiscount = discount > 0 && originalPrice > currentPrice;

  return (
    <div className="min-h-screen bg-white pb-16">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-white border-b border-gray-200">
        <div className="flex items-center justify-between px-4 py-3">
          <button
            onClick={onBack}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Go back"
          >
            <ICONS.ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-sm font-black text-gray-900 truncate flex-1 text-center px-2">
            Product Details
          </h1>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowShareMenu(!showShareMenu)}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors relative"
              aria-label="Share"
            >
              <ICONS.Share className="w-5 h-5" />
            </button>
            {showShareMenu && (
              <div className="absolute top-12 right-4 bg-white rounded-xl shadow-2xl border border-gray-200 p-2 z-50">
                <button
                  onClick={handleShare}
                  className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 rounded-lg w-full text-left"
                >
                  <ICONS.Share className="w-5 h-5 text-orange-500" />
                  <div>
                    <p className="font-bold text-sm">Share Product</p>
                    <p className="text-xs text-gray-500">Share via WhatsApp, Email, etc.</p>
                  </div>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-[600px] mx-auto">
        {/* Image Gallery */}
        <div className="relative bg-gray-50">
          {/* Main Image */}
          <div 
            className="relative aspect-square cursor-pointer"
            onClick={toggleFullscreen}
          >
            <WatermarkedImage
              src={selectedImage || product.image || product.image_url || ''}
              alt={product.title || product.name}
              containerClass="w-full h-full"
              productId={product.id}
              isProduct={true}
            />
            
            {/* Image Counter */}
            {productImages.length > 1 && (
              <div className="absolute bottom-4 right-4 bg-black/60 text-white text-xs px-2 py-1 rounded-full">
                {selectedImageIndex + 1} / {productImages.length}
              </div>
            )}
          </div>

          {/* Thumbnail Strip */}
          {productImages.length > 1 && (
            <div className="px-4 py-3 overflow-x-auto hide-scrollbar">
              <div className="flex gap-2">
                {productImages.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleImageSelect(img, idx)}
                    className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                      selectedImage === img
                        ? 'border-orange-500 opacity-100'
                        : 'border-transparent opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={img}
                      alt={`${product.title} ${idx + 1}`}
                      className="w-full h-full object-cover"
                      onError={() => handleImageError(img)}
                    />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Navigation Arrows for images */}
          {productImages.length > 1 && (
            <>
              <button
                onClick={handlePrevImage}
                disabled={selectedImageIndex === 0}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-black/30 hover:bg-black/50 text-white rounded-full flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <ICONS.ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={handleNextImage}
                disabled={selectedImageIndex === productImages.length - 1}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-black/30 hover:bg-black/50 text-white rounded-full flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <ICONS.ChevronRight className="w-6 h-6" />
              </button>
            </>
          )}
        </div>

        {/* Product Info */}
        <div className="p-4 border-b border-gray-200">
          {/* Title */}
          <h1 className="text-xl font-black text-gray-900 mb-2">
            {product.title || product.name}
          </h1>

          {/* Category & Views */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="px-2 py-1 bg-orange-100 text-orange-600 text-xs font-bold rounded-full">
                {(product as any).category_name || product.category || 'General'}
              </span>
              {product.brand && (
                <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs font-bold rounded-full">
                  {product.brand}
                </span>
              )}
            </div>
            <div className="flex items-center gap-1 text-gray-500">
              <ICONS.Eye className="w-4 h-4" />
              <span className="text-xs font-medium">{viewCount || 0} views</span>
            </div>
          </div>

          {/* Price */}
          <div className="flex items-end gap-3 mb-4">
            <div>
              <p className="text-xs text-gray-500 font-medium mb-1">Price</p>
              <p className="text-3xl font-black text-orange-600">
                TSh {currentPrice.toLocaleString()}
              </p>
            </div>
            {hasDiscount && (
              <div className="mb-1">
                <p className="text-xs text-gray-500 line-through mb-1">
                  TSh {originalPrice.toLocaleString()}
                </p>
                <p className="text-sm font-bold text-green-600">
                  Save {discount}%
                </p>
              </div>
            )}
          </div>

          {/* Stock Status */}
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${product.stock && product.stock > 0 ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
            <span className="text-sm font-medium text-gray-700">
              {product.stock && product.stock > 0 
                ? `In Stock (${product.stock} available)` 
                : 'Out of Stock'}
            </span>
          </div>
        </div>

        {/* Video Player (if available) */}
        {product.videoUrl && (
          <div className="p-4 border-b border-gray-200">
            <h3 className="text-sm font-black text-gray-900 mb-3">Product Video</h3>
            <VideoPlayer
              src={product.videoUrl}
              containerClass="aspect-video"
              autoPlay={false}
              controls={true}
            />
          </div>
        )}

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <div className="flex">
            <button
              onClick={() => setActiveTab('details')}
              className={`flex-1 py-3 text-sm font-bold transition-colors relative ${
                activeTab === 'details'
                  ? 'text-orange-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Details
              {activeTab === 'details' && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-600" />
              )}
            </button>
            <button
              onClick={() => setActiveTab('comments')}
              className={`flex-1 py-3 text-sm font-bold transition-colors relative ${
                activeTab === 'comments'
                  ? 'text-orange-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Comments ({commentCount})
              {activeTab === 'comments' && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-600" />
              )}
            </button>
            <button
              onClick={() => setActiveTab('related')}
              className={`flex-1 py-3 text-sm font-bold transition-colors relative ${
                activeTab === 'related'
                  ? 'text-orange-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Related
              {activeTab === 'related' && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-600" />
              )}
            </button>
          </div>
        </div>

        {/* Tab Content */}
        <div className="p-4">
          {/* Details Tab */}
          {activeTab === 'details' && (
            <div className="space-y-4">
              {/* Description */}
              {product.description && (
                <div>
                  <h3 className="text-sm font-black text-gray-900 mb-2">Description</h3>
                  <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
                    {product.description}
                  </p>
                </div>
              )}

              {/* Specifications */}
              {(product.specifications || (product as any).specs) && (
                <div>
                  <h3 className="text-sm font-black text-gray-900 mb-2">Specifications</h3>
                  <div className="bg-gray-50 rounded-xl p-4">
                    {Object.entries(product.specifications || (product as any).specs || {}).map(([key, value]) => (
                      <div key={key} className="flex py-2 border-b border-gray-200 last:border-0">
                        <span className="w-1/3 text-xs font-medium text-gray-500 capitalize">
                          {key.replace(/_/g, ' ')}
                        </span>
                        <span className="w-2/3 text-xs font-bold text-gray-900">
                          {String(value)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Features */}
              {product.features && Array.isArray(product.features) && product.features.length > 0 && (
                <div>
                  <h3 className="text-sm font-black text-gray-900 mb-2">Key Features</h3>
                  <ul className="space-y-2">
                    {product.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-orange-500 text-lg">•</span>
                        <span className="text-sm text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* Comments Tab */}
          {activeTab === 'comments' && (
            <div className="space-y-4">
              {/* Add Comment */}
              <div className="flex items-center gap-2">
                <input
                  ref={commentInputRef}
                  type="text"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Write a comment..."
                  className="flex-1 px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-orange-500"
                  disabled={isSubmittingComment}
                />
                <button
                  onClick={handleAddComment}
                  disabled={!newComment.trim() || isSubmittingComment}
                  className="px-6 py-3 bg-orange-500 text-white font-bold rounded-xl hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmittingComment ? '...' : 'Send'}
                </button>
              </div>

              {/* Comments List */}
              {isLoadingComments ? (
                <div className="py-8 flex justify-center">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-orange-500 rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-orange-500 rounded-full animate-bounce [animation-delay:0.2s]" />
                    <div className="w-2 h-2 bg-orange-500 rounded-full animate-bounce [animation-delay:0.4s]" />
                  </div>
                </div>
              ) : comments.length > 0 ? (
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {comments.map((comment) => (
                    <div key={comment.id} className="bg-gray-50 rounded-xl p-3">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div className={`w-8 h-8 rounded-full ${comment.userColor} flex items-center justify-center`}>
                            <span className={`text-xs font-black ${comment.textColor}`}>
                              {comment.userInitials}
                            </span>
                          </div>
                          <div>
                            <p className="text-xs font-black text-gray-900">{comment.userName}</p>
                            <p className="text-[10px] text-gray-500">{formatDate(comment.timestamp)}</p>
                          </div>
                        </div>
                        <button
                          onClick={() => onDeleteComment(comment.id)}
                          className="text-gray-400 hover:text-red-500 transition-colors"
                        >
                          <ICONS.Trash className="w-4 h-4" />
                        </button>
                      </div>
                      <p className="text-sm text-gray-700 ml-10">{comment.content}</p>
                      <div className="flex items-center gap-4 mt-2 ml-10">
                        <button
                          onClick={() => onLikeComment(comment.id)}
                          className={`flex items-center gap-1 text-xs transition-colors ${
                            comment.isLiked ? 'text-orange-600' : 'text-gray-500 hover:text-orange-600'
                          }`}
                        >
                          <ICONS.Heart className={`w-4 h-4 ${comment.isLiked ? 'fill-current' : ''}`} />
                          <span>{comment.likes}</span>
                        </button>
                      </div>
                    </div>
                  ))}
                  <div ref={commentsEndRef} />
                </div>
              ) : (
                <div className="py-8 text-center">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <ICONS.Comment className="w-6 h-6 text-gray-400" />
                  </div>
                  <p className="text-gray-700 font-bold mb-1">No comments yet</p>
                  <p className="text-xs text-gray-500">Be the first to comment</p>
                </div>
              )}
            </div>
          )}

          {/* Related Products Tab */}
          {activeTab === 'related' && (
            <div>
              {relatedProducts.length > 0 ? (
                <ProductGrid
                  products={relatedProducts}
                  onProductClick={onProductClick}
                  WatermarkedImage={WatermarkedImage}
                />
              ) : (
                <div className="py-8 text-center">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <ICONS.Product className="w-6 h-6 text-gray-400" />
                  </div>
                  <p className="text-gray-700 font-bold mb-1">No related products</p>
                  <p className="text-xs text-gray-500">Check back later for more items</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Fullscreen Image Modal */}
      {isFullscreen && (
        <div className="fixed inset-0 z-50 bg-black flex items-center justify-center">
          <button
            onClick={toggleFullscreen}
            className="absolute top-4 right-4 text-white bg-black/50 hover:bg-black/70 rounded-full p-2 z-10"
          >
            <ICONS.Close className="w-6 h-6" />
          </button>
          
          {productImages.length > 1 && (
            <>
              <button
                onClick={handlePrevImage}
                disabled={selectedImageIndex === 0}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-3 disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <ICONS.ChevronLeft className="w-8 h-8" />
              </button>
              <button
                onClick={handleNextImage}
                disabled={selectedImageIndex === productImages.length - 1}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-3 disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <ICONS.ChevronRight className="w-8 h-8" />
              </button>
            </>
          )}

          <div className="relative max-w-4xl max-h-full">
            <img
              src={selectedImage || product.image || product.image_url || ''}
              alt={product.title || product.name}
              className="max-w-full max-h-screen object-contain"
            />
            
            {/* Image Counter in Fullscreen */}
            {productImages.length > 1 && (
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/60 text-white text-sm px-4 py-2 rounded-full">
                {selectedImageIndex + 1} / {productImages.length}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetailView;
