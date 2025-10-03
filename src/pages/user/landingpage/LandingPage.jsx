import React from 'react'
import { motion } from 'framer-motion'
import heroImage from '../../../assets/images/herosection.jpg'

const LandingPage = () => {
  const priceRanges = [
    { label: 'DƯỚI', price: '19k' },
    { label: 'DƯỚI', price: '29k' },
    { label: 'DƯỚI', price: '49k' },
    { label: 'DƯỚI', price: '69k' },
  ]

  const brands = [
    { name: 'H&M', image: 'https://via.placeholder.com/150?text=H%26M', subtitle: 'Thời trang phổ thông' },
    { name: 'MANGO', image: 'https://via.placeholder.com/150?text=MANGO', subtitle: 'Thương hiệu cao cấp' },
    { name: 'M.A.C', image: 'https://via.placeholder.com/150?text=MAC', subtitle: 'Thương hiệu nổi tiếng' },
    { name: 'MIKI', image: 'https://via.placeholder.com/150?text=MIKI', subtitle: 'Thương hiệu nội địa' },
  ]

  const categories = [
    { name: 'Đầm Dạ', image: 'https://via.placeholder.com/200?text=Dam+Da' },
    { name: 'Áo Thun', image: 'https://via.placeholder.com/200?text=Ao+Thun' },
    { name: 'Chân Váy', image: 'https://via.placeholder.com/200?text=Chan+Vay' },
    { name: 'Giày Cao Gót', image: 'https://via.placeholder.com/200?text=Giay' },
    { name: 'Quần Jean', image: 'https://via.placeholder.com/200?text=Quan+Jean' },
    { name: 'Áo Sơ Mi', image: 'https://via.placeholder.com/200?text=Ao+So+Mi' },
    { name: 'Áo Hoodie', image: 'https://via.placeholder.com/200?text=Hoodie' },
    { name: 'Túi Xách', image: 'https://via.placeholder.com/200?text=Tui+Xach' },
  ]

  const partnerBrands = [
    { name: 'ROYAL LONDON', logo: 'https://via.placeholder.com/150x50?text=ROYAL+LONDON' },
    { name: 'IMPERIAL', logo: 'https://via.placeholder.com/150x50?text=IMPERIAL' },
  ]

  // Animation variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 60 },
    visible: { opacity: 1, y: 0 }
  }

  const fadeIn = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 }
  }

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const scaleIn = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1 }
  }

  return (
    <div className="bg-white overflow-hidden">
      {/* Hero Banner */}
      <section className="relative h-[600px] bg-cover bg-center" style={{backgroundImage: `url(${heroImage})`}}>
        {/* Overlay */}
        <div className="absolute inset-0 bg-white/70"></div>
        
        {/* Content */}
        <div className="relative h-full flex items-center">
          <div className="max-w-7xl mx-auto px-6 w-full">
            <motion.div 
              className="max-w-2xl"
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
            >
              {/* Logo Icon + Title */}
              <motion.div 
                className="flex items-center gap-3 mb-6"
                variants={fadeInUp}
                transition={{ duration: 0.6 }}
              >
                <motion.svg 
                  className="w-16 h-16 text-green-600" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </motion.svg>
                <h1 className="text-6xl font-bold text-gray-900">GreenLoop</h1>
              </motion.div>

              {/* Tagline */}
              <motion.h2 
                className="text-3xl font-semibold text-green-700 mb-6"
                variants={fadeInUp}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                Quyên góp. Nhận điểm. Mua sắm bền vững.
              </motion.h2>

              {/* Description */}
              <motion.p 
                className="text-lg text-gray-700 mb-8 leading-relaxed"
                variants={fadeInUp}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                Tham gia cộng đồng để trao đổi cũ một cuộc sống mới, kiếm điểm sinh thái,<br />
                và khám phá những kho báu bền vững.
              </motion.p>

              {/* CTA Buttons */}
              <motion.div 
                className="flex gap-4"
                variants={fadeInUp}
                transition={{ duration: 0.6, delay: 0.6 }}
              >
                <motion.button 
                  className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition flex items-center gap-2"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Khám phá sự kiện
                </motion.button>
                <motion.button 
                  className="bg-white hover:bg-gray-50 text-gray-800 px-6 py-3 rounded-lg font-semibold border-2 border-gray-300 transition flex items-center gap-2"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                  Mua sắm ngay
                </motion.button>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* How it works section */}
      <motion.section 
        className="py-16 bg-white"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={fadeInUp}
        transition={{ duration: 0.6 }}
      >
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Cách GreenLoop hoạt động</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Khám phá các tính năng để bắt đầu hành trình bền vững của bạn
          </p>
        </div>
      </motion.section>

      {/* Price Range Section */}
      <section className="py-16 bg-gradient-to-b from-green-50 to-white">
        <div className="max-w-7xl mx-auto px-4">
          <motion.h2 
            className="text-3xl font-bold text-center mb-12 text-gray-800"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            transition={{ duration: 0.6 }}
          >
            Chọn mức giá mua sắm
          </motion.h2>
          <motion.div 
            className="grid grid-cols-2 md:grid-cols-4 gap-6"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            {priceRanges.map((range, index) => (
              <motion.div 
                key={index} 
                className="text-center p-6 bg-white rounded-lg shadow-md cursor-pointer"
                variants={scaleIn}
                whileHover={{ scale: 1.05, boxShadow: "0 10px 30px rgba(0,0,0,0.1)" }}
                transition={{ duration: 0.3 }}
              >
                <p className="text-gray-600 text-sm mb-2">{range.label}</p>
                <p className="text-4xl font-bold text-green-600">{range.price}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* GreenLoop Section */}
      <motion.section 
        className="py-16"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={fadeInUp}
        transition={{ duration: 0.6 }}
      >
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <motion.div 
              className="bg-green-100 p-12 rounded-lg"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3 }}
            >
              <h3 className="text-3xl font-bold mb-4">
                Cùng <span className="text-green-600">GreenLoop</span> giúp đỡ các phụ nữ dân tộc
              </h3>
              <p className="text-gray-600 mb-6">
                Mỗi sản phẩm bạn mua đều góp phần hỗ trợ phụ nữ vùng cao có cuộc sống tốt đẹp hơn
              </p>
              <motion.button 
                className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-full font-semibold transition"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Tìm hiểu thêm
              </motion.button>
            </motion.div>
            <div className="grid grid-cols-2 gap-4">
              <motion.img 
                src="https://via.placeholder.com/250?text=Image+1" 
                alt="GreenLoop" 
                className="rounded-lg shadow-md"
                whileHover={{ scale: 1.05, rotate: -2 }}
                transition={{ duration: 0.3 }}
              />
              <motion.img 
                src="https://via.placeholder.com/250?text=Image+2" 
                alt="GreenLoop" 
                className="rounded-lg shadow-md"
                whileHover={{ scale: 1.05, rotate: 2 }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>
        </div>
      </motion.section>

      {/* Brand Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <motion.h2 
            className="text-3xl font-bold text-center mb-4"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            Thương hiệu bạn <span className="text-red-500">yêu thích</span>
          </motion.h2>
          <motion.p 
            className="text-center text-gray-600 mb-12"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            transition={{ delay: 0.2 }}
          >
            Các thương hiệu uy tín hàng đầu
          </motion.p>
          <motion.div 
            className="grid grid-cols-2 md:grid-cols-4 gap-6"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            {brands.map((brand, index) => (
              <motion.div 
                key={index} 
                className="bg-white p-6 rounded-lg shadow-md cursor-pointer text-center"
                variants={scaleIn}
                whileHover={{ y: -10, boxShadow: "0 20px 40px rgba(0,0,0,0.1)" }}
                transition={{ duration: 0.3 }}
              >
                <img src={brand.image} alt={brand.name} className="w-full h-40 object-cover rounded-lg mb-4" />
                <h4 className="font-bold text-xl mb-2">{brand.name}</h4>
                <p className="text-sm text-gray-600">{brand.subtitle}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Save Money Section */}
      <motion.section 
        className="py-16 bg-purple-100"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={fadeIn}
        transition={{ duration: 0.8 }}
      >
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-4xl font-bold mb-4">
                Tiết kiệm hơn <span className="text-purple-600">50%</span> khi chi tiêu
              </h2>
              <p className="text-gray-600 mb-6">
                Luôn luôn có hàng ngàn chương trình giảm giá dành cho bạn
              </p>
              <div className="grid grid-cols-3 gap-4">
                {[1, 2, 3].map((i) => (
                  <motion.img 
                    key={i}
                    src={`https://via.placeholder.com/150?text=Product`} 
                    alt="Product" 
                    className="rounded-lg shadow-md"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ duration: 0.3 }}
                  />
                ))}
              </div>
            </div>
            <div className="flex justify-center">
              <motion.img 
                src="https://via.placeholder.com/400?text=Sale+Banner" 
                alt="Sale" 
                className="rounded-lg shadow-xl"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>
        </div>
      </motion.section>

      {/* Categories Section */}
      <section className="py-16 bg-gradient-to-b from-green-50 to-white">
        <div className="max-w-7xl mx-auto px-4">
          <motion.h2 
            className="text-3xl font-bold text-center mb-4"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            Hàng nghìn sản phẩm các loại
          </motion.h2>
          <motion.p 
            className="text-center text-gray-600 mb-12"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            transition={{ delay: 0.2 }}
          >
            <span className="text-green-600 font-semibold cursor-pointer hover:underline">Xem tất cả</span>
          </motion.p>
          <motion.div 
            className="grid grid-cols-2 md:grid-cols-4 gap-6"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            {categories.map((category, index) => (
              <motion.div 
                key={index} 
                className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer"
                variants={scaleIn}
                whileHover={{ y: -10, boxShadow: "0 20px 40px rgba(0,0,0,0.15)" }}
                transition={{ duration: 0.3 }}
              >
                <motion.img 
                  src={category.image} 
                  alt={category.name} 
                  className="w-full h-48 object-cover"
                  whileHover={{ scale: 1.1 }}
                  transition={{ duration: 0.3 }}
                />
                <div className="p-4 text-center">
                  <h4 className="font-semibold text-gray-800">{category.name}</h4>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Campaign Section */}
      <motion.section 
        className="py-16 bg-gradient-to-r from-green-600 to-green-800 text-white"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={fadeIn}
        transition={{ duration: 0.8 }}
      >
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-4xl font-bold mb-4">TIẾP TÁC ĐỘNG</h2>
              <h3 className="text-3xl font-bold mb-6">CHIẾN DỊCH PHỦ XANH MẢNG ĐEN</h3>
              <p className="mb-4">KẾT NỐI TỪ 01/01/2025 🌿 Sự kiện được tham gia cùng</p>
              <div className="flex gap-4 mb-6">
                {[1, 2, 3].map((i) => (
                  <motion.img 
                    key={i}
                    src={`https://via.placeholder.com/100x60?text=Event`} 
                    alt="Event" 
                    className="rounded"
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.3 }}
                  />
                ))}
              </div>
            </div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
            >
              <img src="https://via.placeholder.com/500x300?text=Campaign+Image" alt="Campaign" className="rounded-lg shadow-xl" />
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Circular Fashion Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <motion.h2 
            className="text-3xl font-bold text-center mb-4"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <span className="text-green-600">GreenLoop</span> tuần hoàn quần áo như thế nào?
          </motion.h2>
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            <motion.div 
              className="bg-green-50 p-8 rounded-lg shadow-md relative"
              variants={scaleIn}
              whileHover={{ scale: 1.02, boxShadow: "0 20px 40px rgba(0,0,0,0.1)" }}
            >
              <div className="absolute -top-6 left-8 w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-white font-bold text-xl">1</div>
              <h3 className="text-2xl font-bold mb-4 mt-4">GREENLOOP NHẬN QUẦN ÁO TỪ BẠN</h3>
              <p className="text-gray-600 mb-6">
                Để sở hữu những món đồ mới, hãy gửi quần áo cũ cho chúng tôi. Những món đồ này sẽ được tái chế và tái sử dụng.
              </p>
              <motion.button 
                className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-full font-semibold transition"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Gửi ngay
              </motion.button>
            </motion.div>
            <motion.div 
              className="bg-blue-50 p-8 rounded-lg shadow-md relative"
              variants={scaleIn}
              whileHover={{ scale: 1.02, boxShadow: "0 20px 40px rgba(0,0,0,0.1)" }}
            >
              <div className="absolute -top-6 left-8 w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-xl">2</div>
              <h3 className="text-2xl font-bold mb-4 mt-4">TỰ DO DÙNG QUẦN ÁO</h3>
              <p className="text-gray-600 mb-6">
                Bạn có thể tự do lựa chọn những món đồ bạn yêu thích từ kho quần áo của chúng tôi. Hãy mặc và tận hưởng!
              </p>
              <motion.button 
                className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-full font-semibold transition"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Tìm hiểu thêm
              </motion.button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Partner Brands Section */}
      <motion.section 
        className="py-16 bg-green-50"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeInUp}
        transition={{ duration: 0.6 }}
      >
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Các thương hiệu đồng hành</h2>
          <div className="flex justify-center items-center gap-12">
            {partnerBrands.map((brand, index) => (
              <motion.div 
                key={index} 
                className="bg-white p-8 rounded-lg shadow-md"
                whileHover={{ scale: 1.1, rotate: 2 }}
                transition={{ duration: 0.3 }}
              >
                <img src={brand.logo} alt={brand.name} className="h-12" />
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Sustainability Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <motion.h2 
            className="text-3xl font-bold text-center mb-4"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            HÃY CÙNG <span className="text-green-600">GREENLOOP</span>
          </motion.h2>
          <motion.p 
            className="text-center text-gray-600 mb-12"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            transition={{ delay: 0.2 }}
          >
            Tuần hoàn hóa kho quần áo trong năm 2025 của bạn, vì tương lai xanh trong sạch hơn
          </motion.p>
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            {[
              {
                icon: "M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15",
                title: "Tái chế quần áo cũ",
                desc: "Biến quần áo cũ thành nguồn tài nguyên mới"
              },
              {
                icon: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
                title: "Tiết kiệm ngân sách của bạn",
                desc: "Mua sắm thông minh, tiết kiệm hơn 50%"
              },
              {
                icon: "M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
                title: "Bảo vệ môi trường",
                desc: "Góp phần giảm thiểu rác thải thời trang"
              }
            ].map((item, index) => (
              <motion.div 
                key={index}
                className="text-center"
                variants={scaleIn}
                whileHover={{ y: -10 }}
                transition={{ duration: 0.3 }}
              >
                <motion.div 
                  className="w-24 h-24 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center"
                  whileHover={{ rotate: 360, backgroundColor: "#10b981" }}
                  transition={{ duration: 0.6 }}
                >
                  <svg className="w-12 h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                  </svg>
                </motion.div>
                <h4 className="font-bold text-xl mb-2">{item.title}</h4>
                <p className="text-gray-600">{item.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default LandingPage