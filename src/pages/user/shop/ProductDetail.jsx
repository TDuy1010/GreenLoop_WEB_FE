import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate, useParams } from "react-router-dom";
import { relatedProducts } from "../../../data/mockData";
import { getProductById } from "../../../service/api/productApi";
import { addToCart } from "../../../service/api/cartApi";
import { notifyCartUpdated } from "../../../utils/cartEvents";

const ProductDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // Lấy product ID từ URL
  const [selectedImage, setSelectedImage] = useState(0);
  
  // Data states
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [adding, setAdding] = useState(false);
  const [buying, setBuying] = useState(false);
  const [toast, setToast] = useState(null);
  const showToast = (type, text) => {
    setToast({ type, text });
    setTimeout(() => setToast(null), 3000);
  };

  const handleAddToCart = async () => {
    if (!product?.id || adding || !product.isAvailable) return;

    try {
      setAdding(true);
      await addToCart(product.id);
      showToast("success", "Đã thêm sản phẩm vào giỏ hàng");
      notifyCartUpdated();
    } catch (err) {
      const message = err?.message || "Không thể thêm vào giỏ hàng";
      showToast("error", message);
    } finally {
      setAdding(false);
    }
  };

  const handleBuyNow = async () => {
    if (!product?.id || buying || !product.isAvailable) return;

    try {
      setBuying(true);
      await addToCart(product.id);
      notifyCartUpdated();
      navigate("/payment", { state: { from: "product-detail", productId: product.id } });
    } catch (err) {
      const message = err?.message || "Không thể mua ngay lúc này";
      showToast("error", message);
    } finally {
      setBuying(false);
    }
  };


  // Fetch product detail from API
  useEffect(() => {
    const fetchProductDetail = async () => {
      try {
        setLoading(true);
        setError(null);

        console.log('🔍 Fetching product detail for ID:', id);

        const response = await getProductById(id);
        
        console.log('✅ Product detail response:', response);

        if (response.success && response.data) {
          // Transform API data to match UI format
          const apiProduct = response.data;
          
          const imageList =
            Array.isArray(apiProduct.imageUrls) && apiProduct.imageUrls.length > 0
              ? apiProduct.imageUrls.map((img) => img.productAssetUrl || img.url || img)
              : [
                  'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=600',
                  'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=600'
                ]

          let conditionLabel = 'Đã qua sử dụng'
          if (apiProduct.conditionGrade === 'LIKE_NEW') conditionLabel = 'Như mới'
          else if (apiProduct.conditionGrade === 'GOOD') conditionLabel = 'Tốt'
          else if (apiProduct.conditionGrade === 'FAIR') conditionLabel = 'Khá'
          else if (apiProduct.conditionGrade === 'NEW') conditionLabel = 'Mới 100%'

          const transformedProduct = {
            id: apiProduct.id,
            code: apiProduct.code,
            name: apiProduct.name,
            description: apiProduct.description,
            price: apiProduct.price,
            category: apiProduct.categoryName,
            brand: 'N/A', // API không có brand
            size: 'N/A', // API không có size
            color: 'N/A', // API không có color
            material: 'N/A', // API không có material
            condition: conditionLabel,
            ecoPoints: apiProduct.ecoPointValue,
            isAvailable: apiProduct.status === 'AVAILABLE',
            type: apiProduct.type === 'DONATION' ? 'Quyên góp' : 'Mua bán',
            images: imageList,
            features: [
              apiProduct.description,
              `Tình trạng: ${apiProduct.conditionGrade}`,
              `Loại: ${apiProduct.type === 'DONATION' ? 'Quyên góp' : 'Mua bán'}`,
              'Đã được vệ sinh, khử trùng'
            ],
            // Mock donor data vì API không có
            donor: {
              name: 'Người quyên góp',
              avatar: 'https://ui-avatars.com/api/?name=Donor&background=10b981&color=fff',
              donatedItems: 0,
              joinedDate: '2024',
              verified: false,
              ecoScore: 0
            }
          };

          setProduct(transformedProduct);
        }
      } catch (err) {
        console.error('❌ Error fetching product detail:', err);
        setError('Không thể tải thông tin sản phẩm. Vui lòng thử lại sau.');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProductDetail();
    }
  }, [id]);

  // Reset selected image when product changes
  useEffect(() => {
    setSelectedImage(0);
  }, [product]);

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  // Loading State
  if (loading) {
    return (
      <div className="bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto px-6 py-20">
          <div className="flex flex-col items-center justify-center">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-green-600 mb-4"></div>
            <p className="text-gray-600 font-semibold">Đang tải thông tin sản phẩm...</p>
          </div>
        </div>
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div className="bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto px-6 py-20">
          <div className="bg-red-50 border border-red-200 rounded-lg p-8 text-center max-w-md mx-auto">
            <svg className="w-16 h-16 text-red-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="text-xl font-bold text-red-700 mb-2">Không thể tải sản phẩm</h3>
            <p className="text-red-600 mb-6">{error}</p>
            <div className="flex gap-4 justify-center">
              <Link
                to="/shop"
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
              >
                Về cửa hàng
              </Link>
              <button
                onClick={() => window.location.reload()}
                className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition"
              >
                Thử lại
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Not Found State
  if (!product) {
    return (
      <div className="bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto px-6 py-20">
          <div className="bg-gray-100 border border-gray-200 rounded-lg p-8 text-center max-w-md mx-auto">
            <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
            <h3 className="text-xl font-bold text-gray-700 mb-2">Không tìm thấy sản phẩm</h3>
            <p className="text-gray-600 mb-6">Sản phẩm này có thể đã bị xóa hoặc không tồn tại.</p>
            <Link
              to="/shop"
              className="inline-block px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
            >
              Về cửa hàng
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Link to="/" className="hover:text-green-600 transition">
              Trang chủ
            </Link>
            <span>/</span>
            <Link to="/shop" className="hover:text-green-600 transition">
              Cửa hàng
            </Link>
            <span>/</span>
            <span className="text-gray-900 font-medium">{product.name}</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Image Gallery */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeIn}
            transition={{ duration: 0.5 }}
          >
            {/* Main Image */}
            <div className="bg-white rounded-xl overflow-hidden shadow-lg mb-4">
              <motion.img
                key={selectedImage}
                src={product.images[selectedImage]}
                alt={product.name}
                className="w-full h-[500px] object-cover"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              />
            </div>

            {/* Thumbnails */}
            <div className="grid grid-cols-4 gap-4">
              {product.images.map((image, index) => (
                <motion.button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`rounded-lg overflow-hidden border-2 transition ${
                    selectedImage === index
                      ? "border-green-600"
                      : "border-gray-200"
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <img
                    src={image}
                    alt={`Thumbnail ${index + 1}`}
                    className="w-full h-24 object-cover"
                  />
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* Product Info */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeIn}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="bg-white rounded-xl shadow-lg p-6">
              {/* Badges */}
              <div className="flex gap-2 mb-4">
                {product.discount && (
                  <span className="bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                    -{product.discount}% OFF
                  </span>
                )}
                <span className="bg-green-100 text-green-700 text-xs font-bold px-3 py-1 rounded-full">
                  🌿 Bền vững
                </span>
                <span className="bg-blue-100 text-blue-700 text-xs font-bold px-3 py-1 rounded-full">
                  {product.condition}
                </span>
              </div>

              {/* Title */}
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                {product.name}
              </h1>

              {/* Category & Brand */}
              <div className="flex items-center gap-4 mb-6 text-sm">
                <span className="text-gray-600">
                  Danh mục:{" "}
                  <span className="font-semibold text-gray-800">
                    {product.category}
                  </span>
                </span>
                
              </div>

              {/* Price */}
              <div className="mb-8">
                <div className="flex items-center gap-4 mb-3">
                  <span className="text-4xl font-bold text-green-600">
                    {product.price.toLocaleString("vi-VN")}đ
                  </span>
                  {product.originalPrice && (
                    <span className="text-xl text-gray-400 line-through">
                      {product.originalPrice.toLocaleString("vi-VN")}đ
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2 text-green-600 bg-green-50 px-4 py-3 rounded-lg">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                    />
                  </svg>
                  <span className="font-semibold">
                    Nhận +{product.ecoPoints} điểm sinh thái khi mua
                  </span>
                </div>
              </div>

              {/* Product Info */}
              <div className="mb-8 pb-8 border-b">
                <h3 className="font-semibold text-gray-800 mb-4">
                  Thông tin sản phẩm:
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Size:</span>
                    <span className="font-semibold text-gray-800">
                      {product.size}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Màu sắc:</span>
                    <span className="font-semibold text-gray-800">
                      {product.color}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Chất liệu:</span>
                    <span className="font-semibold text-gray-800">
                      {product.material}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Tình trạng:</span>
                    <span className="font-semibold text-green-600">
                      {product.condition}
                    </span>
                  </div>
                </div>
              </div>

              

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <motion.button
                  className={`flex-1 font-bold py-4 rounded-lg flex items-center justify-center gap-2 shadow-lg transition ${
                    !product.isAvailable || buying
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : "bg-amber-500 hover:bg-amber-600 text-white"
                  }`}
                  whileHover={
                    product.isAvailable && !buying ? { scale: 1.02 } : {}
                  }
                  whileTap={
                    product.isAvailable && !buying ? { scale: 0.98 } : {}
                  }
                  disabled={!product.isAvailable || buying}
                  onClick={handleBuyNow}
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8c1.104 0 2-.672 2-1.5S13.104 5 12 5s-2 .672-2 1.5S10.896 8 12 8zm0 0v11m-7-6h14"
                    />
                  </svg>
                  {!product.isAvailable
                    ? "Hết hàng"
                    : buying
                    ? "Đang xử lý..."
                    : "Mua ngay"}
                </motion.button>
                <motion.button
                  className={`flex-1 font-bold py-4 rounded-lg flex items-center justify-center gap-2 shadow-lg transition ${
                    !product.isAvailable || adding
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : "bg-green-600 hover:bg-green-700 text-white"
                  }`}
                  whileHover={
                    product.isAvailable && !adding ? { scale: 1.02 } : {}
                  }
                  whileTap={
                    product.isAvailable && !adding ? { scale: 0.98 } : {}
                  }
                  disabled={!product.isAvailable || adding}
                  onClick={handleAddToCart}
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                  {!product.isAvailable
                    ? "Hết hàng"
                    : adding
                    ? "Đang thêm..."
                    : "Thêm vào giỏ hàng"}
                </motion.button>
              </div>

              {/* Quick Info */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <svg
                    className="w-5 h-5 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span>Giao hàng miễn phí</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg
                    className="w-5 h-5 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span>Đảm bảo chất lượng</span>
                </div>

                <div className="flex items-center gap-2">
                  <svg
                    className="w-5 h-5 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span>Thanh toán an toàn</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Related Products */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeIn}
        >
          <h2 className="text-2xl font-bold mb-6">Sản phẩm tương tự</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedProducts.map((item) => (
              <motion.div
                key={item.id}
                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition cursor-pointer"
                whileHover={{ y: -8 }}
              >
                <div className="relative h-64">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-gray-800 mb-2">
                    {item.name}
                  </h3>
                  <div className="flex items-center justify-between">
                    <span className="text-xl font-bold text-green-600">
                      {item.price.toLocaleString("vi-VN")}đ
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
      {toast && (
        <div
          className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-6 py-3 rounded-2xl text-sm font-semibold shadow-lg ${
            toast.type === "error"
              ? "bg-red-600 text-white"
              : "bg-emerald-600 text-white"
          }`}
        >
          {toast.text}
        </div>
      )}
    </div>
  );
};

export default ProductDetail;
