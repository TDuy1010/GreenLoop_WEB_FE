export const EVENT_STATUS_OPTIONS = [
  { value: 'CREATED', label: 'Đã tạo' },
  { value: 'PUBLISHED', label: 'Đã công khai' },
  { value: 'UPCOMING', label: 'Sắp diễn ra' },
  { value: 'ONGOING', label: 'Đang diễn ra' },
  { value: 'CLOSED', label: 'Đã kết thúc' },
  { value: 'CANCELED', label: 'Đã hủy' }
]

export const EVENT_STATUS_CONFIG = EVENT_STATUS_OPTIONS.reduce(
  (acc, status) => {
    acc[status.value] = {
      color:
        status.value === 'CREATED'
          ? 'blue'
          : status.value === 'PUBLISHED'
            ? 'green'
            : status.value === 'UPCOMING'
              ? 'cyan'
              : status.value === 'ONGOING'
                ? 'gold'
                : status.value === 'CLOSED'
                  ? 'purple'
                  : 'red',
      text: status.label
    }
    return acc
  },
  {}
)

// Hỗ trợ các trạng thái legacy từ backend (COMPLETED, CANCELLED)
EVENT_STATUS_CONFIG.COMPLETED = { color: 'purple', text: 'Đã kết thúc' }
EVENT_STATUS_CONFIG.CANCELLED = EVENT_STATUS_CONFIG.CANCELED

export const EVENT_STATUS_EQUIVALENTS = {
  CREATED: ['CREATED'],
  PUBLISHED: ['PUBLISHED'],
  UPCOMING: ['UPCOMING'],
  ONGOING: ['ONGOING'],
  CLOSED: ['CLOSED', 'COMPLETED'],
  CANCELED: ['CANCELED', 'CANCELLED']
}


