/**
 * 外贸合同模块类型定义
 */

/**
 * 字段数据类型
 */
export interface FieldItem {
  label: string
  value: string
}

/**
 * 表单数据类型
 */
export interface FormData {
  initiator: string
  documentType: string
  initiationDate: string
  department: string
  applicationNo: string
  status: number
}

/**
 * 附件数据类型
 */
export interface Attachment {
  name: string
  url: string
  type: string
}
