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

