import React from 'react';
import { Modal, Form, Input, Upload, Button } from 'antd';
import { InboxOutlined, DeleteOutlined } from '@ant-design/icons';

const BlogEditorModal = ({
  visible,
  confirmLoading,
  onSubmit,
  onCancel,
  form,
  quillRef,
  contentError,
  thumbnailPreview,
  thumbnailList,
  onThumbnailChange,
  onThumbnailClear,
  isEditing
}) => (
  <Modal
    title={isEditing ? 'Chỉnh sửa bài viết' : 'Thêm bài viết'}
    open={visible}
    onCancel={onCancel}
    onOk={onSubmit}
    confirmLoading={confirmLoading}
    okText={isEditing ? 'Lưu thay đổi' : 'Tạo mới'}
    cancelText="Hủy"
    width={860}
    bodyStyle={{ maxHeight: '75vh', overflowY: 'auto' }}
    forceRender
  >
    <Form layout="vertical" form={form} preserve={false}>
      <Form.Item
        label="Tiêu đề"
        name="title"
        rules={[
          { required: true, message: 'Vui lòng nhập tiêu đề' },
          { min: 5, message: 'Tiêu đề phải có ít nhất 5 ký tự' }
        ]}
      >
        <Input placeholder="Nhập tiêu đề bài viết" />
      </Form.Item>
      <Form.Item name="content" hidden>
        <Input type="hidden" />
      </Form.Item>
      <Form.Item
        label="Nội dung"
        required
        validateStatus={contentError ? 'error' : ''}
        help={contentError || ' '}
      >
        <div className="border border-gray-200 rounded-md overflow-hidden">
          <div ref={quillRef} className="min-h-[200px] max-h-[360px] overflow-y-auto" />
        </div>
      </Form.Item>
      <Form.Item label="Ảnh thumbnail (tùy chọn)">
        <Upload.Dragger
          fileList={thumbnailList}
          beforeUpload={() => false}
          accept="image/*"
          maxCount={1}
          showUploadList={false}
          onChange={onThumbnailChange}
        >
          <p className="ant-upload-drag-icon">
            <InboxOutlined />
          </p>
          <p className="ant-upload-text">Kéo thả hoặc bấm để tải ảnh lên</p>
          <p className="ant-upload-hint">Hỗ trợ định dạng ảnh phổ biến, dung lượng &lt; 5MB.</p>
        </Upload.Dragger>
        {thumbnailPreview && (
          <div className="mt-3 relative rounded-lg border border-dashed border-gray-300 p-1 bg-gray-50">
            <img
              src={thumbnailPreview}
              alt="Thumbnail preview"
              className="w-full h-48 object-cover rounded-md"
            />
            <Button
              type="text"
              size="small"
              icon={<DeleteOutlined />}
              className="!absolute top-2 right-2 bg-white/90"
              onClick={onThumbnailClear}
            >
              Xóa
            </Button>
          </div>
        )}
      </Form.Item>
    </Form>
  </Modal>
);

export default BlogEditorModal;

