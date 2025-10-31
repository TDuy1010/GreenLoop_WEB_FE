import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const ChatPage = () => {
  const [activeTab, setActiveTab] = useState('ai')
  const [selectedConversation, setSelectedConversation] = useState('ai-assistant')
  
  const [conversations, setConversations] = useState([
    {
      id: 'ai-assistant',
      type: 'ai',
      title: 'Trợ lý AI GreenLoop',
      lastMessage: 'Xin chào! Tôi là trợ lý AI của GreenLoop...',
      timestamp: new Date(Date.now() - 3600000),
      unread: 0,
      avatar: null,
      isOnline: true
    },
    {
      id: 'staff-support',
      type: 'staff',
      title: 'Hỗ trợ khách hàng',
      lastMessage: 'Xin chào! Đội ngũ hỗ trợ GreenLoop...',
      timestamp: new Date(Date.now() - 7200000),
      unread: 2,
      avatar: 'https://ui-avatars.com/api/?name=Support&background=10b981&color=fff',
      staffName: 'Nguyễn Văn A',
      isOnline: true
    },
    {
      id: 'order-inquiry',
      type: 'staff',
      title: 'Hỗ trợ đơn hàng #1234',
      lastMessage: 'Đơn hàng của bạn đang được xử lý',
      timestamp: new Date(Date.now() - 86400000),
      unread: 0,
      avatar: 'https://ui-avatars.com/api/?name=Order&background=3b82f6&color=fff',
      staffName: 'Trần Thị B',
      isOnline: false
    }
  ])

  const [messages, setMessages] = useState({
    'ai-assistant': [
      {
        id: 1,
        type: 'bot',
        content: 'Xin chào! Tôi là trợ lý AI của GreenLoop. Tôi có thể giúp gì cho bạn về thời trang bền vững, quyên góp, hoặc sản phẩm của chúng tôi?',
        timestamp: new Date(Date.now() - 3600000)
      }
    ],
    'staff-support': [
      {
        id: 1,
        type: 'staff',
        content: 'Xin chào! Đội ngũ hỗ trợ GreenLoop rất vui được phục vụ bạn. Bạn cần hỗ trợ gì?',
        timestamp: new Date(Date.now() - 7200000),
        staffName: 'Nguyễn Văn A',
        staffAvatar: 'https://ui-avatars.com/api/?name=Nguyen+Van+A&background=10b981&color=fff'
      }
    ],
    'order-inquiry': [
      {
        id: 1,
        type: 'staff',
        content: 'Chào bạn! Tôi là Trần Thị B, tôi sẽ hỗ trợ bạn về đơn hàng #1234.',
        timestamp: new Date(Date.now() - 86400000),
        staffName: 'Trần Thị B',
        staffAvatar: 'https://ui-avatars.com/api/?name=Tran+Thi+B&background=3b82f6&color=fff'
      }
    ]
  })
  
  const [inputMessage, setInputMessage] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)

  const currentConversation = conversations.find(c => c.id === selectedConversation)
  const currentMessages = messages[selectedConversation] || []

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, selectedConversation])

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return

    const newUserMessage = {
      id: Date.now(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date()
    }

    setMessages(prev => ({
      ...prev,
      [selectedConversation]: [...(prev[selectedConversation] || []), newUserMessage]
    }))

    setConversations(prev => prev.map(conv => 
      conv.id === selectedConversation 
        ? { ...conv, lastMessage: inputMessage, timestamp: new Date() }
        : conv
    ))

    setInputMessage('')
    setIsTyping(true)

    setTimeout(() => {
      const isAI = currentConversation?.type === 'ai'
      const responseMessage = {
        id: Date.now() + 1,
        type: isAI ? 'bot' : 'staff',
        content: isAI 
          ? getAIResponse(inputMessage)
          : getStaffResponse(inputMessage),
        timestamp: new Date(),
        ...(!isAI && {
          staffName: currentConversation?.staffName || 'Staff',
          staffAvatar: currentConversation?.avatar
        })
      }

      setMessages(prev => ({
        ...prev,
        [selectedConversation]: [...(prev[selectedConversation] || []), responseMessage]
      }))

      setConversations(prev => prev.map(conv => 
        conv.id === selectedConversation 
          ? { ...conv, lastMessage: responseMessage.content.substring(0, 50) + '...', timestamp: new Date() }
          : conv
      ))

      setIsTyping(false)
    }, 1500)
  }

  const getAIResponse = (message) => {
    const lowerMessage = message.toLowerCase()
    
    if (lowerMessage.includes('giá') || lowerMessage.includes('bao nhiêu')) {
      return 'Sản phẩm của chúng tôi có nhiều mức giá khác nhau từ 19k - 500k tùy theo loại và tình trạng. Bạn có thể xem chi tiết tại trang Shop nhé!'
    } else if (lowerMessage.includes('quyên góp') || lowerMessage.includes('donate')) {
      return 'Để quyên góp quần áo, bạn có thể: 1) Tham gia sự kiện trao đổi, 2) Gửi qua kho của chúng tôi, hoặc 3) Đăng ký online. Bạn sẽ nhận điểm eco để mua sắm!'
    } else if (lowerMessage.includes('sự kiện') || lowerMessage.includes('event')) {
      return 'Chúng tôi tổ chức nhiều sự kiện như: Fashion Swap, Workshop tái chế, Green Market. Xem chi tiết tại trang Events nhé!'
    } else if (lowerMessage.includes('ship') || lowerMessage.includes('giao hàng')) {
      return 'Chúng tôi hỗ trợ giao hàng toàn quốc với phí ship từ 15k - 35k tùy khu vực. Đơn từ 200k được miễn phí ship!'
    } else {
      return 'Cảm ơn bạn đã liên hệ! Tôi đã ghi nhận câu hỏi của bạn. Bạn có thể hỏi về giá cả, quyên góp, sự kiện, hoặc giao hàng nhé!'
    }
  }

  const getStaffResponse = (message) => {
    return 'Cảm ơn bạn đã liên hệ! Chúng tôi đã nhận được tin nhắn và sẽ phản hồi sớm nhất có thể. Bạn có thể tiếp tục nhắn tin, chúng tôi sẽ trả lời ngay khi có thể.'
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const formatTime = (date) => {
    const now = new Date()
    const diffMs = now - date
    const diffMins = Math.floor(diffMs / 60000)
    
    if (diffMins < 1) return 'Vừa xong'
    if (diffMins < 60) return `${diffMins} phút trước`
    if (diffMins < 1440) return `${Math.floor(diffMins / 60)} giờ trước`
    return date.toLocaleDateString('vi-VN')
  }

  const quickReplies = currentConversation?.type === 'ai' 
    ? [
        '💰 Giá sản phẩm như thế nào?',
        '♻️ Làm sao để quyên góp?',
        '📅 Có sự kiện gì sắp tới?',
        '🚚 Chính sách giao hàng'
      ]
    : [
        '📦 Kiểm tra đơn hàng',
        '💳 Phương thức thanh toán',
        '🔄 Đổi trả hàng',
        '📞 Liên hệ hotline'
      ]

  const handleQuickReply = (reply) => {
    setInputMessage(reply.replace(/[^\w\s?]/gi, '').trim())
    inputRef.current?.focus()
  }

  const filteredConversations = conversations.filter(conv => {
    const matchesSearch = conv.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         conv.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesTab = activeTab === 'ai' ? conv.type === 'ai' : conv.type === 'staff'
    return matchesSearch && matchesTab
  })

  const handleNewConversation = () => {
    const newId = `new-${Date.now()}`
    const isAI = activeTab === 'ai'
    
    const newConv = {
      id: newId,
      type: isAI ? 'ai' : 'staff',
      title: isAI ? 'Trợ lý AI mới' : 'Hỗ trợ mới',
      lastMessage: 'Bắt đầu cuộc hội thoại...',
      timestamp: new Date(),
      unread: 0,
      avatar: isAI ? null : 'https://ui-avatars.com/api/?name=New&background=10b981&color=fff',
      staffName: isAI ? null : 'Nhân viên hỗ trợ',
      isOnline: true
    }

    setConversations(prev => [newConv, ...prev])
    setMessages(prev => ({
      ...prev,
      [newId]: []
    }))
    setSelectedConversation(newId)
  }

  return (
    <div className="min-h-screen bg-gray-100 py-6">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <motion.div 
          className="text-center mb-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
             Tin nhắn
          </h1>
          <p className="text-gray-600">Chat với AI hoặc đội ngũ hỗ trợ của chúng tôi</p>
        </motion.div>
        {/* Main Chat Container */}
        <motion.div 
          className="bg-white rounded-lg shadow-lg overflow-hidden flex"
          style={{ height: '75vh' }}
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
        >
          {/* Sidebar */}
          <div className="w-96 border-r border-gray-200 flex flex-col">
            {/* Sidebar Header */}
            <div className="p-4 border-b border-gray-200 bg-white">
              <div className="flex gap-2 mb-3">
                <button
                  onClick={() => setActiveTab('ai')}
                  className={`flex-1 py-2.5 px-4 rounded-lg font-medium text-sm transition-all ${
                    activeTab === 'ai'
                      ? 'bg-green-600 text-white shadow-sm'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  <div className="flex items-center justify-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                    <span>Chat AI</span>
                  </div>
                </button>

                <button
                  onClick={() => setActiveTab('staff')}
                  className={`flex-1 py-2.5 px-4 rounded-lg font-medium text-sm transition-all ${
                    activeTab === 'staff'
                      ? 'bg-green-600 text-white shadow-sm'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  <div className="flex items-center justify-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <span>Nhân viên</span>
                  </div>
                </button>
              </div>

              {/* Search */}
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Tìm kiếm tin nhắn..."
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-100 border-0 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:bg-white transition-all"
                />
                <svg className="w-5 h-5 absolute left-3 top-2.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>

            {/* New Conversation */}
            <div className="p-3 border-b border-gray-200">
              <button
                onClick={handleNewConversation}
                className="w-full py-2.5 px-4 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium text-sm flex items-center justify-center gap-2 transition-colors shadow-sm"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Tạo cuộc hội thoại mới
              </button>
            </div>

            {/* Conversations List */}
            <div className="flex-1 overflow-y-auto">
              {filteredConversations.length === 0 ? (
                <div className="p-8 text-center text-gray-500 text-sm">
                  Không tìm thấy cuộc hội thoại
                </div>
              ) : (
                filteredConversations.map(conv => (
                  <div
                    key={conv.id}
                    onClick={() => {
                      setSelectedConversation(conv.id)
                      setConversations(prev => prev.map(c => 
                        c.id === conv.id ? { ...c, unread: 0 } : c
                      ))
                    }}
                    className={`p-4 border-b border-gray-100 cursor-pointer transition-colors ${
                      selectedConversation === conv.id
                        ? 'bg-green-50'
                        : 'hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      {/* Avatar */}
                      <div className="flex-shrink-0 relative">
                        {conv.type === 'ai' ? (
                          <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center">
                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                            </svg>
                          </div>
                        ) : (
                          <img src={conv.avatar} alt={conv.title} className="w-12 h-12 rounded-full" />
                        )}
                        {conv.isOnline && (
                          <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full"></span>
                        )}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="font-semibold text-gray-900 truncate text-sm">
                            {conv.title}
                          </h4>
                          <span className="text-xs text-gray-500 ml-2 flex-shrink-0">
                            {formatTime(conv.timestamp)}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 truncate">
                          {conv.lastMessage}
                        </p>
                      </div>

                      {/* Unread Badge */}
                      {conv.unread > 0 && (
                        <span className="flex-shrink-0 bg-green-600 text-white text-xs font-semibold rounded-full w-5 h-5 flex items-center justify-center">
                          {conv.unread}
                        </span>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Chat Area */}
          <div className="flex-1 flex flex-col">
            {/* Chat Header */}
            <div className="h-16 px-6 border-b border-gray-200 flex items-center justify-between bg-white">
              <div className="flex items-center gap-3">
                {currentConversation?.type === 'ai' ? (
                  <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  </div>
                ) : (
                  <img 
                    src={currentConversation?.avatar} 
                    alt={currentConversation?.title}
                    className="w-10 h-10 rounded-full"
                  />
                )}
                <div>
                  <h3 className="font-semibold text-gray-900 text-sm">{currentConversation?.title}</h3>
                  <p className="text-xs text-gray-500">
                    {currentConversation?.isOnline ? (
                      <span className="flex items-center gap-1">
                        <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                        Đang hoạt động
                      </span>
                    ) : (
                      'Offline'
                    )}
                  </p>
                </div>
              </div>
              
              {currentConversation?.type === 'ai' && (
                <span className="bg-green-100 text-green-700 text-xs px-3 py-1 rounded-full font-semibold">
                  24/7
                </span>
              )}
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
              <AnimatePresence mode="wait">
                <motion.div
                  key={selectedConversation}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.2 }}
                >
                  {currentMessages.map((message, index) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className={`flex gap-2 mb-4 ${
                        message.type === 'user' ? 'flex-row-reverse' : 'flex-row'
                      }`}
                    >
                      {/* Avatar */}
                      {message.type !== 'user' && (
                        <div className="flex-shrink-0">
                          {message.type === 'bot' ? (
                            <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                              </svg>
                            </div>
                          ) : (
                            <img src={message.staffAvatar} alt={message.staffName} className="w-8 h-8 rounded-full" />
                          )}
                        </div>
                      )}

                      {/* Message Bubble */}
                      <div className={`max-w-[70%] ${message.type === 'user' ? 'items-end' : 'items-start'} flex flex-col`}>
                        {message.type === 'staff' && (
                          <span className="text-xs text-gray-500 mb-1 px-2">
                            {message.staffName}
                          </span>
                        )}
                        
                        <div className={`rounded-2xl px-4 py-2.5 ${
                          message.type === 'user'
                            ? 'bg-green-600 text-white'
                            : 'bg-white text-gray-800 border border-gray-200'
                        }`}>
                          <p className="text-sm leading-relaxed whitespace-pre-wrap">
                            {message.content}
                          </p>
                        </div>
                        
                        <span className="text-xs text-gray-400 mt-1 px-2">
                          {formatTime(message.timestamp)}
                        </span>
                      </div>

                      {/* User Avatar */}
                      {message.type === 'user' && (
                        <div className="flex-shrink-0">
                          <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                          </div>
                        </div>
                      )}
                    </motion.div>
                  ))}

                  {/* Typing Indicator */}
                  {isTyping && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex gap-2 mb-4"
                    >
                      <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                        </svg>
                      </div>
                      <div className="bg-white rounded-2xl px-4 py-2.5 border border-gray-200">
                        <div className="flex gap-1">
                          <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                          <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                          <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                        </div>
                      </div>
                    </motion.div>
                  )}

                  <div ref={messagesEndRef} />
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Quick Replies */}
            <div className="px-6 py-3 bg-white border-t border-gray-200">
              <div className="flex gap-2 overflow-x-auto pb-1">
                {quickReplies.map((reply, index) => (
                  <button
                    key={index}
                    onClick={() => handleQuickReply(reply)}
                    className="flex-shrink-0 px-3 py-1.5 bg-gray-100 hover:bg-green-100 text-gray-700 hover:text-green-700 rounded-full text-xs font-medium transition-colors"
                  >
                    {reply}
                  </button>
                ))}
              </div>
            </div>

            {/* Input Area */}
            <div className="p-4 bg-white border-t border-gray-200">
              <div className="flex gap-2 items-end">
                <button className="p-2 text-gray-400 hover:text-green-600 transition-colors">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                  </svg>
                </button>

                <div className="flex-1">
                  <textarea
                    ref={inputRef}
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Nhắn tin..."
                    className="w-full px-4 py-2.5 bg-gray-100 border-0 rounded-full focus:outline-none focus:ring-2 focus:ring-green-500 resize-none text-sm"
                    rows="1"
                    style={{ minHeight: '42px', maxHeight: '100px' }}
                  />
                </div>

                <button className="p-2 text-gray-400 hover:text-green-600 transition-colors">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </button>

                <button
                  onClick={handleSendMessage}
                  disabled={!inputMessage.trim()}
                  className={`p-2.5 rounded-full transition-all ${
                    inputMessage.trim()
                      ? 'bg-green-600 hover:bg-green-700 text-white'
                      : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default ChatPage
