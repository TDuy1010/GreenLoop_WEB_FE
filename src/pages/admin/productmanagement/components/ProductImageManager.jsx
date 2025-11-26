import React, { useEffect, useState } from 'react'
import { Modal, Upload, Image, message, Button, Space } from 'antd'
import { PlusOutlined, LoadingOutlined, ReloadOutlined, DeleteOutlined } from '@ant-design/icons'
import { uploadProductAssets, replaceProductAsset, deleteProductAsset } from '../../../../service/api/productApi'

const mapImagesToFileList = (images = []) =>
  (Array.isArray(images) ? images : [])
    .map((img, index) => {
      const url = typeof img === 'string'
        ? img
        : img?.productAssetUrl || img?.url || img?.thumbnailUrl
      const assetId = typeof img === 'object'
        ? img?.productAssetId || img?.assetId || img?.id
        : undefined
      if (!url) return null
      return {
        uid: `img-${index}`,
        name: `image-${index + 1}`,
        status: 'done',
        url,
        assetId
      }
    })
    .filter(Boolean)

const extractAssetEntries = (payload) => {
  const entries = []
  const pushEntry = (url, assetId) => {
    if (url) {
      entries.push({ url, assetId })
    }
  }

  if (!payload) return entries

  if (Array.isArray(payload)) {
    payload.forEach(item => {
      if (typeof item === 'string') {
        pushEntry(item)
      } else if (item) {
        pushEntry(
          item.productAssetUrl || item.url || item.thumbnailUrl,
          item.productAssetId || item.assetId || item.id
        )
      }
    })
    return entries
  }

  if (typeof payload === 'string') {
    pushEntry(payload)
    return entries
  }

  if (payload.productAssetUrl || payload.url || payload.thumbnailUrl) {
    pushEntry(
      payload.productAssetUrl || payload.url || payload.thumbnailUrl,
      payload.productAssetId || payload.assetId || payload.id
    )
    return entries
  }

  if (Array.isArray(payload.data)) {
    return extractAssetEntries(payload.data)
  }

  return entries
}

const ProductImageManager = ({ visible, onClose, product, onImagesUpdated, onAssetsUpdated }) => {
  const [fileList, setFileList] = useState([])
  const [uploading, setUploading] = useState(false)
  const [replacing, setReplacing] = useState(null)
  const [deleting, setDeleting] = useState(null)

  useEffect(() => {
    if (visible && product) {
      setFileList(mapImagesToFileList(product.imageAssets || product.imageUrls || product.images || []))
    } else {
      setFileList([])
    }
  }, [visible, product])

  const handleChange = ({ fileList: newList }) => {
    setFileList(newList)
  }

  const notifyImagesChanged = (nextList) => {
    if (typeof onImagesUpdated === 'function' && product?.id) {
      const urls = nextList.map(item => item.url).filter(Boolean)
      onImagesUpdated(product.id, urls)
    }
    if (typeof onAssetsUpdated === 'function' && product?.id) {
      const assets = nextList
        .filter(item => item.url)
        .map(item => ({
          productAssetUrl: item.url,
          productAssetId: item.assetId
        }))
      onAssetsUpdated(product.id, assets)
    }
  }

  const handleUpload = async ({ file, onSuccess, onError }) => {
    if (!product?.id) {
      const err = new Error('Không xác định được sản phẩm để tải ảnh.')
      message.error(err.message)
      onError?.(err)
      return
    }

    const actualFile = file?.originFileObj || file
    if (!actualFile) {
      const err = new Error('Ảnh không hợp lệ.')
      onError?.(err)
      return
    }

    try {
      setUploading(true)
      const response = await uploadProductAssets(product.id, [actualFile])
      const body = response?.data ?? response ?? {}
      const payload = body.data ?? body
      const entries = extractAssetEntries(payload)
      const uploaded = entries[0] || {}
      const uploadedUrl = uploaded.url || ''
      const assetId = uploaded.assetId

      setFileList(prev => {
        const next = prev.map(item =>
          item.uid === file.uid
            ? {
                ...item,
                status: 'done',
                url: uploadedUrl || item.url || URL.createObjectURL(actualFile),
                assetId: assetId || item.assetId
              }
            : item
        )
        notifyImagesChanged(next)
        return next
      })

      message.success(body.message || 'Tải ảnh thành công!')
      onSuccess?.('ok')
    } catch (error) {
      console.error('Upload product assets failed:', error)
      message.error(error?.response?.data?.message || 'Không thể tải ảnh, vui lòng thử lại.')
      setFileList(prev => prev.filter(item => item.uid !== file.uid))
      onError?.(error)
    } finally {
      setUploading(false)
    }
  }

  const handleReplaceUpload = async (assetId, file, onSuccess, onError) => {
    if (!assetId) {
      const err = new Error('Ảnh này không hỗ trợ thay thế (thiếu mã asset).')
      message.error(err.message)
      onError?.(err)
      return
    }

    const actualFile = file?.originFileObj || file
    if (!actualFile) {
      const err = new Error('Ảnh không hợp lệ.')
      onError?.(err)
      return
    }

    try {
      setReplacing(assetId)
      const response = await replaceProductAsset(assetId, actualFile)
      const body = response?.data ?? response ?? {}
      const payload = body.data ?? body
      const entries = extractAssetEntries(payload)
      const updated = entries[0] || {}
      const updatedUrl = updated.url || URL.createObjectURL(actualFile)

      setFileList(prev => {
        const next = prev.map(item =>
          item.assetId === assetId
            ? { ...item, url: updatedUrl }
            : item
        )
        notifyImagesChanged(next)
        return next
      })

      message.success(body.message || 'Thay ảnh thành công!')
      onSuccess?.('ok')
    } catch (error) {
      console.error('Replace product asset failed:', error)
      message.error(error?.response?.data?.message || 'Không thể thay ảnh, vui lòng thử lại.')
      onError?.(error)
    } finally {
      setReplacing(null)
    }
  }

  const handleDeleteAsset = async (assetId) => {
    if (!assetId) {
      message.error('Ảnh này không hỗ trợ xoá (thiếu mã asset).')
      return
    }
    try {
      setDeleting(assetId)
      const response = await deleteProductAsset(assetId)
      const body = response?.data ?? response ?? {}
      message.success(body.message || 'Đã xoá ảnh.')
      setFileList(prev => {
        const next = prev.filter(item => item.assetId !== assetId)
        notifyImagesChanged(next)
        return next
      })
    } catch (error) {
      console.error('Delete product asset failed:', error)
      message.error(error?.response?.data?.message || 'Không thể xoá ảnh, vui lòng thử lại.')
    } finally {
      setDeleting(null)
    }
  }

  const uploadButton = (
    <div>
      {uploading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>{uploading ? 'Đang tải...' : 'Thêm ảnh'}</div>
    </div>
  )

  return (
    <Modal
      title={`Quản lý ảnh - ${product?.name || product?.productName || ''}`}
      open={visible}
      onCancel={onClose}
      footer={null}
      width={720}
    >
      <Upload
        listType="picture-card"
        fileList={fileList}
        onChange={handleChange}
        customRequest={handleUpload}
        accept="image/*"
        multiple
        showUploadList={{ showRemoveIcon: false }}
        maxCount={20}
      >
        {uploadButton}
      </Upload>
      <p className="text-xs text-gray-500 mt-2">
        Ảnh được tải lên ngay khi bạn chọn tệp. Vui lòng sử dụng ảnh &lt; 5MB. Hiện chưa hỗ trợ xoá ảnh.
      </p>
      <div className="grid grid-cols-3 gap-3 mt-4">
        {fileList
          .filter(item => item.url)
          .map(item => (
            <div key={item.uid} className="space-y-2">
              <Image
                src={item.url}
                alt={item.name}
                height={140}
                className="rounded object-cover w-full"
              />
              <Space>
                <Upload
                  showUploadList={false}
                  accept="image/*"
                  customRequest={({ file, onSuccess, onError }) =>
                    handleReplaceUpload(item.assetId, file, onSuccess, onError)
                  }
                >
                  <Button
                    type="primary"
                    size="small"
                    icon={<ReloadOutlined />}
                    loading={replacing === item.assetId}
                    disabled={!item.assetId}
                  >
                    Thay ảnh
                  </Button>
                </Upload>
                <Button
                  danger
                  size="small"
                  icon={<DeleteOutlined />}
                  loading={deleting === item.assetId}
                  onClick={() => handleDeleteAsset(item.assetId)}
                  disabled={!item.assetId}
                >
                  Xoá
                </Button>
              </Space>
              {!item.assetId && (
                <p className="text-[10px] text-gray-400">
                  Ảnh không có mã asset nên chưa thể thay hoặc xoá trực tiếp.
                </p>
              )}
            </div>
          ))}
      </div>
    </Modal>
  )
}

export default ProductImageManager

