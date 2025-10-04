// Mock data for the application
// This file contains sample data for development purposes

// Product items for ShopPage
export const shopItems = [
  {
    id: 1,
    name: 'Áo sơ mi trắng công sở',
    category: 'Áo sơ mi',
    price: 150000,
    originalPrice: 300000,
    image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=400',
    condition: 'Như mới',
    size: 'M',
    isNew: true,
    discount: 50,
    isEcoFriendly: true,
    ecoPoints: 50,
    rating: 4.8,
    sold: 45
  },
  {
    id: 2,
    name: 'Áo thun basic cotton',
    category: 'Áo thun',
    price: 89000,
    originalPrice: 150000,
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400',
    condition: 'Đã qua sử dụng',
    size: 'L',
    isEcoFriendly: true,
    ecoPoints: 30,
    rating: 4.9,
    sold: 120
  },
  {
    id: 3,
    name: 'Quần jean slim fit',
    category: 'Quần',
    price: 250000,
    originalPrice: 500000,
    image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=400',
    condition: 'Như mới',
    size: '30',
    discount: 50,
    isEcoFriendly: true,
    ecoPoints: 70,
    rating: 4.7,
    sold: 78
  },
  {
    id: 4,
    name: 'Đầm dạ hội sang trọng',
    category: 'Đầm',
    price: 450000,
    image: 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=400',
    condition: 'Như mới',
    size: 'S',
    isNew: true,
    isEcoFriendly: true,
    ecoPoints: 100,
    rating: 5.0,
    sold: 23
  },
  {
    id: 5,
    name: 'Áo khoác hoodie unisex',
    category: 'Áo khoác',
    price: 180000,
    originalPrice: 350000,
    image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400',
    condition: 'Đã qua sử dụng',
    size: 'XL',
    discount: 48,
    isEcoFriendly: true,
    ecoPoints: 60,
    rating: 4.6,
    sold: 95
  },
  {
    id: 6,
    name: 'Váy midi hoa nhí',
    category: 'Váy',
    price: 220000,
    image: 'https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?w=400',
    condition: 'Như mới',
    size: 'M',
    isEcoFriendly: true,
    ecoPoints: 55,
    rating: 4.8,
    sold: 67
  },
  {
    id: 7,
    name: 'Túi xách tote vải canvas',
    category: 'Phụ kiện',
    price: 120000,
    originalPrice: 200000,
    image: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=400',
    condition: 'Như mới',
    discount: 40,
    isNew: true,
    isEcoFriendly: true,
    ecoPoints: 40,
    rating: 4.9,
    sold: 156
  },
  {
    id: 8,
    name: 'Giày sneaker trắng',
    category: 'Giày',
    price: 350000,
    originalPrice: 700000,
    image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400',
    condition: 'Đã qua sử dụng',
    size: '42',
    discount: 50,
    isEcoFriendly: true,
    ecoPoints: 80,
    rating: 4.7,
    sold: 89
  }
]

// Product detail for ProductDetail page
export const productDetail = {
  id: 1,
  name: "Áo sơ mi trắng công sở cao cấp",
  category: "Áo sơ mi",
  price: 150000,
  originalPrice: 300000,
  discount: 50,
  condition: "Như mới",
  brand: "ZARA",
  size: "M",
  color: "Trắng",
  material: "Cotton 100%",
  ecoPoints: 50,
  isAvailable: true,
  images: [
    "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600",
    "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=600",
    "https://images.unsplash.com/photo-1603252109303-2751441dd157?w=600",
    "https://images.unsplash.com/photo-1620799139834-6b8f844fbe61?w=600",
  ],
  description:
    "Áo sơ mi trắng cao cấp với chất liệu cotton 100% mềm mại, thoáng mát. Thiết kế basic dễ phối đồ, phù hợp cho môi trường công sở. Sản phẩm được quyên góp từ người dùng trong tình trạng như mới, đã qua kiểm định chất lượng kỹ càng.",
  features: [
    "Chất liệu cotton 100% cao cấp",
    "Form dáng slim fit hiện đại",
    "Dễ dàng giặt ủi và bảo quản",
    "Màu trắng thanh lịch, dễ phối đồ",
    "Đã được vệ sinh, khử trùng",
  ],
  donor: {
    name: "Nguyễn Minh Anh",
    avatar:
      "https://ui-avatars.com/api/?name=Nguyen+Minh+Anh&background=10b981&color=fff",
    donatedItems: 15,
    joinedDate: "2024-01-15",
    verified: true,
    ecoScore: 450,
  },
}

// Related products for ProductDetail page
export const relatedProducts = [
  {
    id: 2,
    name: "Áo sơ mi xanh navy",
    price: 180000,
    image:
      "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=400",
    rating: 4.9,
  },
  {
    id: 3,
    name: "Áo sơ mi kẻ sọc",
    price: 160000,
    image:
      "https://images.unsplash.com/photo-1603252109303-2751441dd157?w=400",
    rating: 4.7,
  },
  {
    id: 4,
    name: "Áo sơ mi hồng pastel",
    price: 170000,
    image:
      "https://images.unsplash.com/photo-1620799139834-6b8f844fbe61?w=400",
    rating: 4.8,
  },
]

// Price ranges for LandingPage
export const priceRanges = [
  { label: 'DƯỚI', price: '19k' },
  { label: 'DƯỚI', price: '29k' },
  { label: 'DƯỚI', price: '49k' },
  { label: 'DƯỚI', price: '69k' },
]

// Brands for LandingPage
export const brands = [
  { name: 'H&M', image: 'https://via.placeholder.com/150?text=H%26M', subtitle: 'Thời trang phổ thông' },
  { name: 'MANGO', image: 'https://via.placeholder.com/150?text=MANGO', subtitle: 'Thương hiệu cao cấp' },
  { name: 'M.A.C', image: 'https://via.placeholder.com/150?text=MAC', subtitle: 'Thương hiệu nổi tiếng' },
  { name: 'MIKI', image: 'https://via.placeholder.com/150?text=MIKI', subtitle: 'Thương hiệu nội địa' },
]

// Categories for LandingPage
export const categories = [
  { name: 'Đầm Dạ', image: 'https://via.placeholder.com/200?text=Dam+Da' },
  { name: 'Áo Thun', image: 'https://via.placeholder.com/200?text=Ao+Thun' },
  { name: 'Chân Váy', image: 'https://via.placeholder.com/200?text=Chan+Vay' },
  { name: 'Giày Cao Gót', image: 'https://via.placeholder.com/200?text=Giay' },
  { name: 'Quần Jean', image: 'https://via.placeholder.com/200?text=Quan+Jean' },
  { name: 'Áo Sơ Mi', image: 'https://via.placeholder.com/200?text=Ao+So+Mi' },
  { name: 'Áo Hoodie', image: 'https://via.placeholder.com/200?text=Hoodie' },
  { name: 'Túi Xách', image: 'https://via.placeholder.com/200?text=Tui+Xach' },
]

// Partner brands for LandingPage
export const partnerBrands = [
  { name: 'ROYAL LONDON', logo: 'https://via.placeholder.com/150x50?text=ROYAL+LONDON' },
  { name: 'IMPERIAL', logo: 'https://via.placeholder.com/150x50?text=IMPERIAL' },
]

// Sort options for ShopPage
export const sortOptions = [
  { value: 'newest', label: 'Mới nhất' },
  { value: 'price-low', label: 'Giá thấp đến cao' },
  { value: 'price-high', label: 'Giá cao đến thấp' },
  { value: 'popular', label: 'Phổ biến nhất' }
]

// Events data for EventPage
export const events = [
  {
    id: 1,
    title: 'GreenLoop Fashion Swap Meet #12',
    description: 'Sự kiện trao đổi quần áo lớn nhất tháng! Mang theo 5 món đồ cũ để đổi lấy những món đồ mới tuyệt vời.',
    date: '2025-01-15',
    time: '14:00 - 18:00',
    location: 'Công viên Tao Đàn, Quận 1, TP.HCM',
    address: '12 Trương Định, Phường Bến Thành, Quận 1',
    coordinates: { lat: 10.7769, lng: 106.7009 },
    image: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=600',
    category: 'Trao đổi',
    attendees: 156,
    maxAttendees: 200,
    price: 0,
    status: 'upcoming',
    organizer: {
      name: 'GreenLoop Team',
      avatar: 'https://ui-avatars.com/api/?name=GreenLoop&background=10b981&color=fff'
    },
    tags: ['Miễn phí', 'Trao đổi', 'Thời trang bền vững'],
    highlights: [
      'Trao đổi miễn phí quần áo',
      'Workshop về thời trang bền vững',
      'Gặp gỡ cộng đồng yêu môi trường',
      'Nhận điểm eco khi tham gia'
    ]
  },
  {
    id: 2,
    title: 'Workshop: Tái chế quần áo cũ',
    description: 'Học cách biến những món đồ cũ thành những thiết kế độc đáo và sáng tạo cùng các chuyên gia thời trang.',
    date: '2025-01-20',
    time: '09:00 - 12:00',
    location: 'Trung tâm Sáng tạo, Quận 3, TP.HCM',
    address: '45 Nguyễn Thị Minh Khai, Phường 6, Quận 3',
    coordinates: { lat: 10.7886, lng: 106.6917 },
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600',
    category: 'Workshop',
    attendees: 24,
    maxAttendees: 30,
    price: 150000,
    status: 'upcoming',
    organizer: {
      name: 'Chị Lan Anh - Fashion Designer',
      avatar: 'https://ui-avatars.com/api/?name=Lan+Anh&background=ec4899&color=fff'
    },
    tags: ['Có phí', 'Workshop', 'DIY', 'Sáng tạo'],
    highlights: [
      'Học từ chuyên gia 10 năm kinh nghiệm',
      'Tài liệu và dụng cụ được cung cấp',
      'Mang về sản phẩm handmade',
      'Certificate hoàn thành khóa học'
    ]
  },
  {
    id: 3,
    title: 'Green Market Weekend',
    description: 'Chợ cuối tuần với các sản phẩm thời trang bền vững, thực phẩm organic và các hoạt động giải trí cho cả gia đình.',
    date: '2025-01-25',
    time: '08:00 - 20:00',
    location: 'Công viên Gia Định, Quận Gò Vấp, TP.HCM',
    address: 'Hoàng Minh Giám, Phường 9, Quận Gò Vấp',
    coordinates: { lat: 10.8142, lng: 106.6438 },
    image: 'https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?w=600',
    category: 'Chợ phiên',
    attendees: 89,
    maxAttendees: 500,
    price: 0,
    status: 'upcoming',
    organizer: {
      name: 'GreenLoop Community',
      avatar: 'https://ui-avatars.com/api/?name=Community&background=059669&color=fff'
    },
    tags: ['Miễn phí', 'Gia đình', 'Chợ phiên', 'Organic'],
    highlights: [
      'Hơn 50 gian hàng thân thiện môi trường',
      'Hoạt động vui chơi cho trẻ em',
      'Food truck với đồ ăn organic',
      'Live music và entertainment'
    ]
  },
  {
    id: 4,
    title: 'Sustainable Fashion Talk',
    description: 'Buổi tọa đàm về tương lai của thời trang bền vững với sự tham gia của các chuyên gia hàng đầu trong ngành.',
    date: '2025-02-01',
    time: '19:00 - 21:30',
    location: 'Bitexco Financial Tower, Quận 1, TP.HCM',
    address: '2 Hải Triều, Phường Bến Nghé, Quận 1',
    coordinates: { lat: 10.7718, lng: 106.7045 },
    image: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=600',
    category: 'Tọa đàm',
    attendees: 67,
    maxAttendees: 100,
    price: 200000,
    status: 'upcoming',
    organizer: {
      name: 'Fashion Forward Vietnam',
      avatar: 'https://ui-avatars.com/api/?name=Fashion+Forward&background=7c3aed&color=fff'
    },
    tags: ['Có phí', 'Chuyên gia', 'Networking', 'Tọa đàm'],
    highlights: [
      'Diễn giả là CEO của các thương hiệu lớn',
      'Networking session với finger food',
      'Tặng voucher mua sắm GreenLoop',
      'Q&A trực tiếp với chuyên gia'
    ]
  },
  {
    id: 5,
    title: 'Eco Fashion Show 2025',
    description: 'Show diễn thời trang đặc biệt với các thiết kế từ vật liệu tái chế và thương hiệu bền vững.',
    date: '2025-02-10',
    time: '20:00 - 22:00',
    location: 'Nhà hát Thành phố, Quận 1, TP.HCM',
    address: '7 Lam Sơn, Phường Bến Nghé, Quận 1',
    coordinates: { lat: 10.7764, lng: 106.7017 },
    image: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=600',
    category: 'Show diễn',
    attendees: 245,
    maxAttendees: 300,
    price: 500000,
    status: 'upcoming',
    organizer: {
      name: 'Vietnam Fashion Week',
      avatar: 'https://ui-avatars.com/api/?name=VFW&background=dc2626&color=fff'
    },
    tags: ['Có phí', 'Show diễn', 'High-end', 'Exclusive'],
    highlights: [
      'Các nhà thiết kế nổi tiếng tham gia',
      'BST từ 100% vật liệu tái chế',
      'After party với DJ nổi tiếng',
      'Goodie bag trị giá 1 triệu đồng'
    ]
  },
  {
    id: 6,
    title: 'Kids Eco Art Workshop',
    description: 'Workshop sáng tạo dành cho trẻ em, học cách làm đồ chơi và trang trí từ vật liệu tái chế.',
    date: '2025-02-15',
    time: '14:00 - 16:30',
    location: 'Trung tâm Văn hóa Quận 7, TP.HCM',
    address: '123 Nguyễn Thị Thập, Phường Tân Phú, Quận 7',
    coordinates: { lat: 10.7411, lng: 106.6957 },
    image: 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=600',
    category: 'Workshop',
    attendees: 18,
    maxAttendees: 25,
    price: 80000,
    status: 'upcoming',
    organizer: {
      name: 'Green Kids Club',
      avatar: 'https://ui-avatars.com/api/?name=Green+Kids&background=f59e0b&color=fff'
    },
    tags: ['Trẻ em', 'Sáng tạo', 'Gia đình', 'Tái chế'],
    highlights: [
      'Dành cho trẻ 6-12 tuổi',
      'Phụ huynh được tham gia miễn phí',
      'Mang về 3-4 sản phẩm handmade',
      'Snack và nước uống cho trẻ'
    ]
  }
]

// Event categories for filtering
export const eventCategories = [
  { id: 'all', name: 'Tất cả', icon: '🎪' },
  { id: 'trao-doi', name: 'Trao đổi', icon: '🔄' },
  { id: 'workshop', name: 'Workshop', icon: '🛠️' },
  { id: 'cho-phien', name: 'Chợ phiên', icon: '🛒' },
  { id: 'toa-dam', name: 'Tọa đàm', icon: '💬' },
  { id: 'show-dien', name: 'Show diễn', icon: '👗' }
]

