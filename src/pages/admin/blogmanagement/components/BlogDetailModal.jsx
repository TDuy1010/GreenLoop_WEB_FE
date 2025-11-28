import React from 'react';
import { Modal, Descriptions, Image, Spin, Tag } from 'antd';
import dayjs from 'dayjs';

const BlogDetailModal = ({ visible, loading, blog, onClose, getStatusMeta }) => (
  <Modal
    title={blog?.title || 'Chi tiết bài viết'}
    open={visible}
    onCancel={onClose}
    footer={null}
    width={960}
    bodyStyle={{ maxHeight: '80vh', overflowY: 'auto' }}
  >
    {loading ? (
      <div className="flex items-center justify-center py-12">
        <Spin />
      </div>
    ) : blog ? (
      <div className="space-y-6">
        <Descriptions column={1} bordered size="small">
          <Descriptions.Item label="Tiêu đề">{blog.title}</Descriptions.Item>
          <Descriptions.Item label="Tác giả">
            {blog.authorName} ({blog.authorEmail})
          </Descriptions.Item>
          <Descriptions.Item label="Trạng thái">
            <Tag color={getStatusMeta(blog.status).color}>
              {getStatusMeta(blog.status).label}
            </Tag>
          </Descriptions.Item>
          <Descriptions.Item label="Xuất bản">
            {blog.publishedAt ? dayjs(blog.publishedAt).format('DD/MM/YYYY HH:mm') : '—'}
          </Descriptions.Item>
        </Descriptions>

        {blog.thumbnailUrl && (
          <Image
            src={blog.thumbnailUrl}
            alt="Blog thumbnail"
            width="100%"
            height={240}
            style={{ objectFit: 'cover', borderRadius: 12 }}
            preview
          />
        )}

        <div
          className="blog-content text-gray-800 leading-relaxed"
          style={{ wordBreak: 'break-word' }}
          dangerouslySetInnerHTML={{ __html: blog.content || '<p>Không có nội dung</p>' }}
        />
      </div>
    ) : (
      <p>Không có dữ liệu để hiển thị.</p>
    )}
  </Modal>
);

export default BlogDetailModal;

