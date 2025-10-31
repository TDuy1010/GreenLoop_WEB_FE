import React from 'react'
import { motion } from 'framer-motion'

const AboutUsPage = () => {
  const stats = [
    { number: '10,000+', label: 'Sản phẩm đã được tái sử dụng', icon: '♻️' },
    { number: '5,000+', label: 'Thành viên cộng đồng', icon: '👥' },
    { number: '50+', label: 'Sự kiện đã tổ chức', icon: '📅' },
    { number: '100+', label: 'Tấn rác thải giảm thiểu', icon: '🌍' }
  ]

  const team = [
    {
      name: 'Nguyễn Văn An',
      role: 'Founder & CEO',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
      bio: '10 năm kinh nghiệm trong lĩnh vực môi trường và phát triển bền vững'
    },
    {
      name: 'Trần Thị Bình',
      role: 'COO - Giám đốc Vận hành',
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400',
      bio: 'Chuyên gia logistics với 8 năm kinh nghiệm trong quản lý chuỗi cung ứng'
    },
    {
      name: 'Lê Văn Cường',
      role: 'CTO - Giám đốc Công nghệ',
      image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400',
      bio: 'Kỹ sư phần mềm với đam mê xây dựng giải pháp công nghệ xanh'
    },
    {
      name: 'Phạm Thị Dung',
      role: 'CMO - Giám đốc Marketing',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400',
      bio: 'Chuyên gia marketing với hơn 7 năm kinh nghiệm xây dựng thương hiệu'
    }
  ]

  const values = [
    {
      icon: '🌱',
      title: 'Bền vững',
      description: 'Cam kết với tương lai xanh, giảm thiểu tác động tiêu cực đến môi trường'
    },
    {
      icon: '💚',
      title: 'Cộng đồng',
      description: 'Xây dựng cộng đồng gắn kết, cùng nhau hành động vì môi trường'
    },
    {
      icon: '♻️',
      title: 'Tuần hoàn',
      description: 'Thúc đẩy nền kinh tế tuần hoàn, biến đồ cũ thành nguồn tài nguyên mới'
    },
    {
      icon: '🤝',
      title: 'Minh bạch',
      description: 'Hoạt động công khai, minh bạch trong mọi quy trình và giao dịch'
    }
  ]

  const milestones = [
    { year: '2023 Q1', title: 'Khởi đầu', description: 'GreenLoop được thành lập với sứ mệnh tạo nên sự thay đổi' },
    { year: '2023 Q2', title: 'Ra mắt nền tảng', description: 'Website và app mobile chính thức hoạt động' },
    { year: '2023 Q3', title: 'Mở rộng', description: 'Khai trương 5 kho tại các thành phố lớn' },
    { year: '2023 Q4', title: 'Cột mốc 10,000', description: 'Đạt 10,000 sản phẩm được tái sử dụng' },
    { year: '2024 Q1', title: 'Đối tác', description: 'Hợp tác với 50+ tổ chức và doanh nghiệp' },
    { year: '2024 Q2', title: 'Tương lai', description: 'Mục tiêu 100,000 sản phẩm và mở rộng toàn quốc' }
  ]

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
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

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <motion.div 
        className="bg-gradient-to-br from-green-600 via-green-700 to-blue-600 text-white py-20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <div className="max-w-7xl mx-auto px-6 text-center">
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
          >
            <motion.svg 
              className="w-20 h-20 mx-auto mb-6 text-white" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </motion.svg>
            <h1 className="text-5xl font-bold mb-6">Về GreenLoop</h1>
            <p className="text-2xl text-green-100 mb-4 max-w-3xl mx-auto">
              Kết nối cộng đồng, lan tỏa giá trị
            </p>
            <p className="text-lg text-green-50 max-w-2xl mx-auto">
              Chúng tôi tin rằng mỗi món đồ đều xứng đáng có cơ hội thứ hai, và mỗi hành động nhỏ đều góp phần tạo nên sự thay đổi lớn cho hành tinh
            </p>
          </motion.div>
        </div>
      </motion.div>

      {/* Stats Section */}
      <motion.div 
        className="py-16 bg-gray-50"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
      >
        <div className="max-w-7xl mx-auto px-6">
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                className="text-center p-6 bg-white rounded-2xl shadow-md hover:shadow-xl transition"
                variants={fadeInUp}
                whileHover={{ y: -5 }}
              >
                <div className="text-5xl mb-3">{stat.icon}</div>
                <div className="text-4xl font-bold text-green-600 mb-2">{stat.number}</div>
                <div className="text-gray-600">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.div>

      {/* Story Section */}
      <motion.div 
        className="py-20"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              variants={fadeInUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <h2 className="text-4xl font-bold text-gray-900 mb-6">Câu chuyện của chúng tôi</h2>
              <div className="space-y-4 text-gray-600 leading-relaxed">
                <p>
                  GreenLoop ra đời từ một ý tưởng đơn giản nhưng mạnh mẽ: tạo ra một nền tảng nơi mọi người có thể dễ dàng quyên góp đồ cũ và tìm kiếm những món đồ có giá trị với mức giá phải chăng.
                </p>
                <p>
                  Chúng tôi nhận thấy rằng hàng triệu món đồ vẫn còn sử dụng tốt đang bị vứt bỏ mỗi năm, trong khi nhiều người khác đang cần đến chúng. Đồng thời, việc sản xuất hàng hóa mới đang gây ra áp lực lớn lên môi trường.
                </p>
                <p>
                  Với GreenLoop, chúng tôi không chỉ giúp kéo dài vòng đời của sản phẩm mà còn xây dựng một cộng đồng người tiêu dùng có ý thức, cùng nhau hành động vì một tương lai bền vững hơn.
                </p>
              </div>
            </motion.div>

            <motion.div
              className="relative"
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <img
                src="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800"
                alt="GreenLoop Story"
                className="rounded-2xl shadow-2xl"
              />
              <div className="absolute -bottom-6 -left-6 bg-green-600 text-white p-6 rounded-xl shadow-xl">
                <div className="text-3xl font-bold">1 năm</div>
                <div className="text-green-100">Hành trình thay đổi</div>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Values Section */}
      <motion.div 
        className="py-20 bg-gradient-to-br from-green-50 to-blue-50"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
      >
        <div className="max-w-7xl mx-auto px-6">
          <motion.div 
            className="text-center mb-16"
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Giá trị cốt lõi</h2>
            <p className="text-xl text-gray-600">Những nguyên tắc dẫn lối mọi hành động của chúng tôi</p>
          </motion.div>

          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {values.map((value, index) => (
              <motion.div
                key={index}
                className="bg-white p-8 rounded-2xl shadow-md hover:shadow-xl transition text-center"
                variants={fadeInUp}
                whileHover={{ y: -5 }}
              >
                <div className="text-6xl mb-4">{value.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.div>

      {/* Team Section */}
      <motion.div 
        className="py-20"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
      >
        <div className="max-w-7xl mx-auto px-6">
          <motion.div 
            className="text-center mb-16"
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Đội ngũ của chúng tôi</h2>
            <p className="text-xl text-gray-600">Những con người đam mê tạo nên sự khác biệt</p>
          </motion.div>

          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {team.map((member, index) => (
              <motion.div
                key={index}
                className="text-center group"
                variants={fadeInUp}
                whileHover={{ y: -5 }}
              >
                <div className="relative mb-4 overflow-hidden rounded-2xl">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-80 object-cover group-hover:scale-110 transition duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition duration-300"></div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-1">{member.name}</h3>
                <p className="text-green-600 font-medium mb-3">{member.role}</p>
                <p className="text-sm text-gray-600">{member.bio}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.div>

      {/* Timeline Section */}
      <motion.div 
        className="py-20 bg-gray-900 text-white"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
      >
        <div className="max-w-7xl mx-auto px-6">
          <motion.div 
            className="text-center mb-16"
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold mb-4">Hành trình phát triển</h2>
            <p className="text-xl text-gray-400">Từ ý tưởng đến hiện thực</p>
          </motion.div>

          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-green-600"></div>

            <motion.div 
              className="space-y-12"
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              {milestones.map((milestone, index) => (
                <motion.div
                  key={index}
                  className={`flex items-center ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}
                  variants={fadeInUp}
                >
                  <div className={`w-1/2 ${index % 2 === 0 ? 'pr-12 text-right' : 'pl-12 text-left'}`}>
                    <div className="bg-gray-800 p-6 rounded-xl">
                      <div className="text-green-400 font-bold mb-2">{milestone.year}</div>
                      <h3 className="text-xl font-bold mb-2">{milestone.title}</h3>
                      <p className="text-gray-400">{milestone.description}</p>
                    </div>
                  </div>
                  <div className="w-12 h-12 bg-green-600 rounded-full border-4 border-gray-900 z-10 flex items-center justify-center">
                    <div className="w-4 h-4 bg-white rounded-full"></div>
                  </div>
                  <div className="w-1/2"></div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* CTA Section */}
      <motion.div 
        className="py-20 bg-gradient-to-r from-green-600 to-blue-600 text-white"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
      >
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold mb-6">Hãy cùng chúng tôi tạo nên sự thay đổi</h2>
            <p className="text-xl text-green-100 mb-8">
              Mỗi món đồ bạn quyên góp, mỗi sản phẩm bạn mua đều góp phần xây dựng một tương lai bền vững hơn
            </p>
            <div className="flex gap-4 justify-center">
              <motion.button 
                className="bg-white text-green-600 hover:bg-gray-100 px-8 py-4 rounded-lg font-semibold text-lg transition"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Bắt đầu quyên góp
              </motion.button>
              <motion.button 
                className="bg-transparent border-2 border-white hover:bg-white hover:text-green-600 px-8 py-4 rounded-lg font-semibold text-lg transition"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Khám phá cửa hàng
              </motion.button>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  )
}

export default AboutUsPage

