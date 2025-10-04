import React, { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { productDetail, relatedProducts } from "../../../data/mockData";

const ProductDetail = () => {
  const [selectedImage, setSelectedImage] = useState(0);

  // Use mock data from imported file - replace with API call
  const product = productDetail;

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

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
                <span className="text-gray-400">•</span>
                <span className="text-gray-600">
                  Thương hiệu:{" "}
                  <span className="font-semibold text-gray-800">
                    {product.brand}
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

              {/* Availability Status */}
              <div className="mb-6">
                {product.isAvailable ? (
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
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <span className="font-semibold">
                      Sản phẩm còn hàng - Số lượng: 1
                    </span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-red-600 bg-red-50 px-4 py-3 rounded-lg">
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
                        d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <span className="font-semibold">Sản phẩm đã được bán</span>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 mb-8">
                <motion.button
                  className={`flex-1 font-bold py-4 rounded-lg flex items-center justify-center gap-2 shadow-lg transition ${
                    product.isAvailable
                      ? "bg-green-600 hover:bg-green-700 text-white"
                      : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  }`}
                  whileHover={product.isAvailable ? { scale: 1.02 } : {}}
                  whileTap={product.isAvailable ? { scale: 0.98 } : {}}
                  disabled={!product.isAvailable}
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
                  {product.isAvailable ? "Thêm vào giỏ hàng" : "Hết hàng"}
                </motion.button>
                <motion.button
                  className="px-6 py-4 border-2 border-green-600 text-green-600 rounded-lg hover:bg-green-50 transition"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  title="Yêu thích"
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
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                    />
                  </svg>
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

        {/* Donor Information */}
        <motion.div
          className="bg-white rounded-xl shadow-lg p-6 mb-8"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeIn}
        >
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <svg
              className="w-6 h-6 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
            Thông tin người quyên góp
          </h2>

          <div className="flex items-center gap-6">
            <img
              src={product.donor.avatar}
              alt={product.donor.name}
              className="w-20 h-20 rounded-full border-4 border-green-100"
            />

            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <h3 className="text-xl font-bold text-gray-900">
                  {product.donor.name}
                </h3>
                {product.donor.verified && (
                  <svg
                    className="w-6 h-6 text-blue-500"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </div>

              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="text-gray-600">Đã quyên góp</p>
                  <p className="font-bold text-green-600">
                    {product.donor.donatedItems} sản phẩm
                  </p>
                </div>
                <div>
                  <p className="text-gray-600">Tham gia từ</p>
                  <p className="font-semibold text-gray-800">01/2024</p>
                </div>
                <div>
                  <p className="text-gray-600">Điểm sinh thái</p>
                  <p className="font-bold text-green-600">
                    {product.donor.ecoScore} điểm
                  </p>
                </div>
              </div>
            </div>

            <motion.button
              className="px-6 py-3 bg-green-100 text-green-700 font-semibold rounded-lg hover:bg-green-200 transition"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Xem trang cá nhân
            </motion.button>
          </div>
        </motion.div>
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
    </div>
  );
};

export default ProductDetail;
