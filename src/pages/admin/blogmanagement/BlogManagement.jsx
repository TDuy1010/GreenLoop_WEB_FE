import React, { useState, useEffect, useRef, useCallback } from 'react';
import { message, Form } from 'antd';
import { useQuill } from 'react-quilljs';
import 'quill/dist/quill.snow.css';
import { getBlogs, createBlog, getBlogDetail, updateBlog, publishBlog, hideBlog, deleteBlog } from '../../../service/api/blogApi';
import BlogToolbar from './components/BlogToolbar';
import BlogTable from './components/BlogTable';
import BlogEditorModal from './components/BlogEditorModal';
import BlogDetailModal from './components/BlogDetailModal';

const STATUS_OPTIONS = [
  { value: 'all', label: 'Tất cả' },
  { value: 'Bản nháp', label: 'Bản nháp' },
  { value: 'Đã công khai', label: 'Đã công khai' },
  { value: 'Đã ẩn', label: 'Đã ẩn' }
];

const STATUS_COLORS = {
  'Bản nháp': 'default',
  'Đã công khai': 'green',
  'Đã ẩn': 'red'
};

const getStatusMeta = (status) => ({
  label: STATUS_OPTIONS.find(opt => opt.value === status)?.label || status || '—',
  color: STATUS_COLORS[status] || 'default'
});

const BlogManagement = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortDir, setSortDir] = useState('DESC');
  const [reloadToken, setReloadToken] = useState(0);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0
  });
  const { current, pageSize } = pagination;
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [createSubmitting, setCreateSubmitting] = useState(false);
  const [thumbnailList, setThumbnailList] = useState([]);
  const [contentError, setContentError] = useState('');
  const [thumbnailPreview, setThumbnailPreview] = useState(null);
  const [publishLoadingId, setPublishLoadingId] = useState(null);
  const [hideLoadingId, setHideLoadingId] = useState(null);
  const [deleteLoadingId, setDeleteLoadingId] = useState(null);
  const updateLocalBlog = useCallback((id, updater) => {
    setBlogs(prev =>
      prev.map(blog => (blog.id === id ? { ...blog, ...updater(blog) } : blog))
    );
  }, []);

  const editorResetRef = useRef(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingBlogId, setEditingBlogId] = useState(null);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [detailLoading, setDetailLoading] = useState(false);
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [createForm] = Form.useForm();
  const { quill, quillRef } = useQuill({
    placeholder: 'Nhập nội dung blog...',
    modules: {
      toolbar: [
        ['bold', 'italic', 'underline', 'strike'],
        [{ header: 1 }, { header: 2 }],
        [{ list: 'ordered' }, { list: 'bullet' }],
        [{ script: 'sub' }, { script: 'super' }],
        [{ indent: '-1' }, { indent: '+1' }],
        [{ align: [] }],
        ['link', 'image'],
        ['clean']
      ]
    },
    theme: 'snow'
  });

  useEffect(() => {
    let ignore = false;

    const fetchBlogs = async () => {
      setLoading(true);
      try {
        const response = await getBlogs({
          page: Math.max(0, current - 1),
          size: pageSize,
          search: searchText || undefined,
          status: statusFilter !== 'all' ? statusFilter : undefined,
          sortBy,
          sortDir
        });

        if (ignore) return;

        const payload = response?.data || response;
        const pageData = payload?.data || payload;
        const content = Array.isArray(pageData?.content) ? pageData.content : [];
        setBlogs(content);

        setPagination(prev => {
          const nextCurrent = (pageData?.pageNumber ?? Math.max(0, current - 1)) + 1;
          const nextPageSize = pageData?.pageSize ?? pageSize;
          const nextTotal = pageData?.totalElements ?? content.length;

          if (
            prev.current === nextCurrent &&
            prev.pageSize === nextPageSize &&
            prev.total === nextTotal
          ) {
            return prev;
          }

          return {
            ...prev,
            current: nextCurrent,
            pageSize: nextPageSize,
            total: nextTotal
          };
        });
      } catch (error) {
        if (!ignore) {
          console.error('Failed to fetch blogs:', error);
          message.error(error?.message || 'Không thể tải danh sách blog');
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    };

    fetchBlogs();

    return () => {
      ignore = true;
    };
  }, [current, pageSize, searchText, statusFilter, sortBy, sortDir, reloadToken]);

  useEffect(() => {
    if (createModalVisible && quill) {
      quill.focus();
    }
  }, [createModalVisible, quill]);

  useEffect(() => {
    if (!quill) return undefined;

    const handleTextChange = () => {
      if (editorResetRef.current) return;
      const htmlValue = quill.root?.innerHTML || '';
      createForm.setFieldValue('content', htmlValue);
      const plain = (quill.getText() || '').trim();
      if (!plain) {
        setContentError('Nội dung không được để trống');
      } else if (plain.length < 20) {
        setContentError('Nội dung phải có ít nhất 20 ký tự');
      } else {
        setContentError('');
      }
    };

    quill.on('text-change', handleTextChange);

    return () => {
      quill.off('text-change', handleTextChange);
    };
  }, [quill, createForm]);

  useEffect(() => {
    const file = thumbnailList[0];
    if (!file) {
      setThumbnailPreview(null);
      return undefined;
    }
    if (file.url || file.thumbUrl) {
      setThumbnailPreview(file.url || file.thumbUrl);
      return undefined;
    }
    if (file.originFileObj) {
      const objectUrl = URL.createObjectURL(file.originFileObj);
      setThumbnailPreview(objectUrl);
      return () => URL.revokeObjectURL(objectUrl);
    }
    setThumbnailPreview(null);
    return undefined;
  }, [thumbnailList]);

  const resetCreateModalState = () => {
    createForm.resetFields();
    setThumbnailList([]);
    setContentError('');
    if (quill) {
      editorResetRef.current = true;
      quill.setText('');
      quill.setSelection(0);
      setTimeout(() => {
        editorResetRef.current = false;
      }, 0);
    } else {
      editorResetRef.current = false;
    }
  };

  const handleCreate = () => {
    setIsEditing(false);
    setEditingBlogId(null);
    resetCreateModalState();
    setCreateModalVisible(true);
  };

  const handleRefresh = () => {
    setSearchInput('');
    setSearchText('');
    setStatusFilter('all');
    setSortBy('createdAt');
    setSortDir('DESC');
    setPagination(prev => ({ ...prev, current: 1, pageSize: 10 }));
    setReloadToken(prev => prev + 1);
    message.success('Đã làm mới danh sách blog');
  };

  const handleSearch = (value) => {
    const trimmed = value.trim();
    setSearchInput(trimmed);
    setSearchText(trimmed);
    setPagination(prev => ({ ...prev, current: 1 }));
  };

  const handleStatusChange = (value) => {
    setStatusFilter(value);
    setPagination(prev => ({ ...prev, current: 1 }));
  };

  const handleTableChange = (pager, _filters, sorter) => {
    const nextSortBy = sorter?.field || 'createdAt';
    const nextSortDir = sorter?.order === 'ascend' ? 'ASC' : 'DESC';

    setSortBy(nextSortBy);
    setSortDir(nextSortDir);
    setPagination(prev => ({
      ...prev,
      current: pager.current,
      pageSize: pager.pageSize
    }));
  };

  const closeCreateModal = () => {
    setCreateModalVisible(false);
    resetCreateModalState();
  };

  const closeDetailModal = () => {
    setDetailModalVisible(false);
    setSelectedBlog(null);
  };

  const handleViewBlog = async (blog) => {
    const blogId = typeof blog === 'number' ? blog : blog?.id;
    if (!blogId) return;
    setDetailModalVisible(true);
    setDetailLoading(true);
    try {
      const response = await getBlogDetail(blogId);
      const payload = response?.data || response;
      setSelectedBlog(payload?.data || payload);
    } catch (error) {
      message.error(error?.message || 'Không thể tải chi tiết blog');
      setDetailModalVisible(false);
    } finally {
      setDetailLoading(false);
    }
  };

  const handleCreateSubmit = async () => {
    try {
      const values = await createForm.validateFields();
      const trimmedTitle = (values.title || '').trim();
      const plainText = (quill?.getText() || '').replace(/\s+/g, ' ').trim();

      if (!trimmedTitle) {
        createForm.setFields([{ name: 'title', errors: ['Vui lòng nhập tiêu đề hợp lệ'] }]);
        return;
      }
      createForm.setFieldValue('title', trimmedTitle);

      if (!plainText) {
        setContentError('Nội dung không được để trống');
        return;
      }

      if (plainText.length < 20) {
        setContentError('Nội dung phải có ít nhất 20 ký tự');
        return;
      }

      const htmlContent = quill?.root?.innerHTML || '';
      const thumbnail = thumbnailList[0]?.originFileObj;

      setCreateSubmitting(true);
      if (isEditing && editingBlogId) {
        await updateBlog(editingBlogId, {
          blog: {
            title: trimmedTitle,
            content: htmlContent
          },
          thumbnail
        });
        message.success('Đã cập nhật bài viết');
      } else {
        await createBlog({
          blog: {
            title: trimmedTitle,
            content: htmlContent
          },
          thumbnail
        });
        message.success('Đã tạo bài viết mới');
      }

      setCreateModalVisible(false);
      resetCreateModalState();
      setReloadToken(prev => prev + 1);
    } catch (error) {
      if (error?.errorFields) return;
      console.error('Failed to create blog:', error);
      message.error(error?.message || 'Không thể tạo blog');
    } finally {
      setCreateSubmitting(false);
    }
  };

  const openEditModal = async (blog) => {
    const blogId = blog?.id;
    if (!blogId) return;
    setIsEditing(true);
    setEditingBlogId(blogId);
    setCreateModalVisible(true);
    setContentError('');
    editorResetRef.current = true;
    if (quill) {
      quill.setText('');
    }
    createForm.setFields([{ name: 'title', value: '...' }]);
    setTimeout(async () => {
      try {
        const response = await getBlogDetail(blogId);
        const payload = response?.data?.data || response?.data || response;
        createForm.setFields([{ name: 'title', value: payload.title || '' }]);
        if (quill) {
          quill.clipboard.dangerouslyPasteHTML(payload.content || '');
        }
        if (payload.thumbnailUrl) {
          setThumbnailList([
            {
              uid: '-1',
              name: 'current-thumbnail',
              status: 'done',
              url: payload.thumbnailUrl,
              thumbUrl: payload.thumbnailUrl
            }
          ]);
        } else {
          setThumbnailList([]);
        }
        setContentError('');
      } catch (error) {
        message.error(error?.message || 'Không thể tải thông tin bài viết');
        setCreateModalVisible(false);
        setIsEditing(false);
        setEditingBlogId(null);
      } finally {
        editorResetRef.current = false;
      }
    }, 0);
  };

  const handlePublish = async (blog) => {
    const blogId = blog?.id;
    if (!blogId) return;
    setPublishLoadingId(blogId);
    try {
      await publishBlog(blogId);
      message.success('Đã công khai bài viết');
      updateLocalBlog(blogId, () => ({
        status: 'Đã công khai',
        publishedAt: new Date().toISOString()
      }));
      setReloadToken(prev => prev + 1);
    } catch (error) {
      console.error('Publish blog failed:', error);
      message.error(error?.message || 'Không thể công khai bài viết');
    } finally {
      setPublishLoadingId(null);
    }
  };

  const handleHide = async (blog) => {
    const blogId = blog?.id;
    if (!blogId) return;
    setHideLoadingId(blogId);
    try {
      await hideBlog(blogId);
      message.success('Đã ẩn bài viết');
      updateLocalBlog(blogId, () => ({
        status: 'Đã ẩn',
        publishedAt: null
      }));
      setReloadToken(prev => prev + 1);
    } catch (error) {
      console.error('Hide blog failed:', error);
      message.error(error?.message || 'Không thể ẩn bài viết');
    } finally {
      setHideLoadingId(null);
    }
  };

  const handleDelete = async (blog) => {
    const blogId = blog?.id;
    if (!blogId) return;
    setDeleteLoadingId(blogId);
    try {
      await deleteBlog(blogId);
      message.success('Đã xóa bài viết');
      setBlogs(prev => prev.filter(item => item.id !== blogId));
    } catch (error) {
      console.error('Delete blog failed:', error);
      message.error(error?.message || 'Không thể xóa bài viết');
    } finally {
      setDeleteLoadingId(null);
    }
  };

  return (
    <div className="space-y-4">
      <BlogToolbar
        searchInput={searchInput}
        onSearchInputChange={(e) => setSearchInput(e.target.value)}
        onSearch={handleSearch}
        statusFilter={statusFilter}
        onStatusChange={handleStatusChange}
        onRefresh={handleRefresh}
        onCreate={handleCreate}
        statusOptions={STATUS_OPTIONS}
      />

      <BlogTable
        data={blogs}
        loading={loading}
        pagination={pagination}
        onChange={handleTableChange}
        onView={handleViewBlog}
        onEdit={openEditModal}
        onPublish={handlePublish}
        onHide={handleHide}
        onDelete={handleDelete}
        publishLoadingId={publishLoadingId}
        hideLoadingId={hideLoadingId}
        deleteLoadingId={deleteLoadingId}
        getStatusMeta={getStatusMeta}
      />

      <BlogEditorModal
        visible={createModalVisible}
        confirmLoading={createSubmitting}
        onSubmit={handleCreateSubmit}
        onCancel={closeCreateModal}
        form={createForm}
        quillRef={quillRef}
        contentError={contentError}
        thumbnailPreview={thumbnailPreview}
        thumbnailList={thumbnailList}
        onThumbnailChange={({ fileList }) => setThumbnailList(fileList.slice(-1))}
        onThumbnailClear={() => setThumbnailList([])}
        isEditing={isEditing}
      />

      <BlogDetailModal
        visible={detailModalVisible}
        loading={detailLoading}
        blog={selectedBlog}
        onClose={closeDetailModal}
        getStatusMeta={getStatusMeta}
      />
    </div>
  );
};

export default BlogManagement;