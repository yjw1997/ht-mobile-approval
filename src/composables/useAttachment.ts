/**
 * 附件相关的 composable
 * 封装文件图标获取和点击处理等公共逻辑
 */

export interface AttachmentFile {
  fileName?: string
  filePath?: string
  fileType?: string
  [key: string]: any
}

/**
 * 获取文件图标
 * @param fileName 文件名
 * @returns 图标类名
 */
export function getFileIcon(fileName: string): string {
  const ext = fileName?.split('.').pop()?.toLowerCase() || ''
  if (['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'].includes(ext))
    return 'i-carbon:image'
  if (ext === 'pdf')
    return 'i-carbon:document-pdf'
  if (['doc', 'docx'].includes(ext))
    return 'i-carbon:document-word-processor'
  if (['xls', 'xlsx'].includes(ext))
    return 'i-carbon:document-excel'
  return 'i-carbon:document'
}

/**
 * 处理附件点击事件
 * @param file 附件文件对象
 */
export function handleAttachmentClick(file: AttachmentFile) {
  if (file.filePath) {
    window.open(file.filePath, '_blank')
  }
}

/**
 * 附件相关的 composable
 * @param attachmentList 附件列表
 */
export function useAttachment(attachmentList: MaybeRef<AttachmentFile[]>) {
  const attachments = computed(() => {
    const list = unref(attachmentList)
    if (!list || list.length === 0)
      return []

    return list.map(file => ({
      name: file.fileName || '-',
      url: file.filePath || '',
      type: file.fileType || '',
    }))
  })

  return {
    attachments,
    getFileIcon,
    handleAttachmentClick,
  }
}
