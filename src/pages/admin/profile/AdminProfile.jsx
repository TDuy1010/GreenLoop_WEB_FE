/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { UserOutlined, LockOutlined } from '@ant-design/icons'
import { message } from 'antd'
import { getCurrentUserProfile } from '../../../service/api/userApi'
import { updateUserProfile, changePassword } from '../../../service/api/authApi'

// Import components
import ProfileHeader from './components/ProfileHeader'
import PersonalInfoTab from './components/PersonalInfoTab'
import ChangePasswordTab from './components/ChangePasswordTab'
import PasswordChangeSuccessModal from '../../../components/PasswordChangeSuccessModal'

const AdminProfile = () => {
  const [activeTab, setActiveTab] = useState('personal')
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(false)
  const [savingProfile, setSavingProfile] = useState(false)
  const [changingPassword, setChangingPassword] = useState(false)

  // Dữ liệu admin
  const [userData, setUserData] = useState({
    fullName: '—',
    email: '—',
    phoneNumber: '',
    gender: 'other',
    dateOfBirth: '',
    avatar: ''
  })

  const [editedData, setEditedData] = useState(userData)

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })

  const [passwordErrors, setPasswordErrors] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })

  const [showSuccessModal, setShowSuccessModal] = useState(false)

  // Nạp thông tin admin từ API
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true)
        const res = await getCurrentUserProfile()
        const data = res?.data || res
        if (!data) return

        const profile = {
          fullName: data.fullName || '—',
          email: data.email || '—',
          phoneNumber: data.phoneNumber || '',
          gender: data.gender || 'other',
          dateOfBirth: data.dateOfBirth || '',
          avatar: data.avatarUrl || ''
        }

        setUserData(profile)
        setEditedData(profile)
      } catch (error) {
        console.error('Error fetching profile:', error)
        message.error('Không thể tải thông tin cá nhân!')
      } finally {
        setLoading(false)
      }
    }
    fetchProfile()
  }, [])

  const handleEdit = () => {
    setIsEditing(true)
    setEditedData(userData)
  }

  const handleSave = async () => {
    try {
      setSavingProfile(true)
      
      await updateUserProfile(editedData)
      
      setUserData(editedData)
      setIsEditing(false)
      message.success('Cập nhật thông tin thành công!')
    } catch (error) {
      console.error('Error updating profile:', error)
      message.error('Không thể cập nhật thông tin!')
    } finally {
      setSavingProfile(false)
    }
  }

  const handleCancel = () => {
    setIsEditing(false)
    setEditedData(userData)
  }

  const handleInputChange = (field, value) => {
    setEditedData({
      ...editedData,
      [field]: value
    })
  }

  const handlePasswordChange = (field, value) => {
    const updatedPasswordData = {
      ...passwordData,
      [field]: value
    }
    
    setPasswordData(updatedPasswordData)

    // Validate real-time
    const newErrors = { ...passwordErrors }

    // Validate current password field
    if (field === 'currentPassword') {
      newErrors.currentPassword = value.trim() === '' ? 'Vui lòng nhập mật khẩu hiện tại' : ''
      
      // Re-validate newPassword if it exists (check if new password matches current)
      if (updatedPasswordData.newPassword) {
        if (updatedPasswordData.newPassword === value) {
          newErrors.newPassword = 'Mật khẩu mới không được trùng với mật khẩu hiện tại'
        } else if (updatedPasswordData.newPassword.length >= 6) {
          // Clear error if previously had "duplicate" error but now they're different
          newErrors.newPassword = ''
        }
      }
    }

    // Validate new password field
    if (field === 'newPassword') {
      if (value.trim() === '') {
        newErrors.newPassword = 'Vui lòng nhập mật khẩu mới'
      } else if (value.length < 6) {
        newErrors.newPassword = 'Mật khẩu phải có ít nhất 6 ký tự'
      } else if (updatedPasswordData.currentPassword && value === updatedPasswordData.currentPassword) {
        newErrors.newPassword = 'Mật khẩu mới không được trùng với mật khẩu hiện tại'
      } else {
        newErrors.newPassword = ''
      }

      // Re-validate confirmPassword if it has value
      if (updatedPasswordData.confirmPassword) {
        if (value !== updatedPasswordData.confirmPassword) {
          newErrors.confirmPassword = 'Mật khẩu xác nhận không khớp'
        } else {
          newErrors.confirmPassword = ''
        }
      }
    }

    // Validate confirm password field
    if (field === 'confirmPassword') {
      if (value.trim() === '') {
        newErrors.confirmPassword = 'Vui lòng xác nhận mật khẩu mới'
      } else if (value !== updatedPasswordData.newPassword) {
        newErrors.confirmPassword = 'Mật khẩu xác nhận không khớp'
      } else {
        newErrors.confirmPassword = ''
      }
    }

    setPasswordErrors(newErrors)
  }

  const handleChangePassword = async (e) => {
    e.preventDefault()
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      message.error('Mật khẩu xác nhận không khớp!')
      return
    }

    try {
      setChangingPassword(true)
      
      await changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
        confirmPassword: passwordData.confirmPassword
      })
      
      // Hiển thị modal thành công
      setShowSuccessModal(true)
      
      // Reset form
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      })
      setPasswordErrors({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      })
    } catch (error) {
      console.error('Error changing password:', error)
      message.error(error.response?.data?.message || 'Không thể đổi mật khẩu!')
    } finally {
      setChangingPassword(false)
    }
  }

  const tabs = [
    { id: 'personal', label: 'Thông tin cá nhân', icon: <UserOutlined /> },
    { id: 'password', label: 'Đổi mật khẩu', icon: <LockOutlined /> },
  ]

  return (
    <div className="min-h-screen bg-gray-50 py-6">
      <div className="max-w-7xl mx-auto px-4">
        {/* Profile Header Card */}
        <ProfileHeader userData={userData} loading={loading} />

        {/* Tab Navigation and Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar Tabs */}
          <motion.div 
            className="lg:col-span-1"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="bg-white rounded-xl shadow-md p-4 space-y-2">
              {tabs.map((tab) => (
                <motion.button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all font-medium ${
                    activeTab === tab.id
                      ? 'bg-green-600 text-white shadow-lg'
                      : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span className="text-lg">{tab.icon}</span>
                  <span>{tab.label}</span>
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* Content Area */}
          <motion.div 
            className="lg:col-span-3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <div className="bg-white rounded-xl shadow-md p-8">
              {/* Personal Info Tab */}
              {activeTab === 'personal' && (
                <PersonalInfoTab
                  userData={userData}
                  editedData={editedData}
                  isEditing={isEditing}
                  savingProfile={savingProfile}
                  onEdit={handleEdit}
                  onSave={handleSave}
                  onCancel={handleCancel}
                  onInputChange={handleInputChange}
                />
              )}

              {/* Change Password Tab */}
              {activeTab === 'password' && (
                <ChangePasswordTab
                  passwordData={passwordData}
                  passwordErrors={passwordErrors}
                  changingPassword={changingPassword}
                  onPasswordChange={handlePasswordChange}
                  onSubmit={handleChangePassword}
                />
              )}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Modal thông báo đổi mật khẩu thành công */}
      <PasswordChangeSuccessModal 
        show={showSuccessModal} 
        onClose={() => setShowSuccessModal(false)}
        userType="admin"
      />
    </div>
  )
}

export default AdminProfile
