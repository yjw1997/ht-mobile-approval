/**
 * 合同相关工具函数
 */

/**
 * 判断是否为VC/揽货合同类型
 * @param contractType 合同类型 0 揽货合同 1 TC期租合同 2 TCT航次期租合同 3 VC航次租船 4 COA包运合同
 * @returns true表示是VC或揽货合同（0或3）
 */
export function isVCOrFreightContract(contractType?: number): boolean {
  return contractType === 0 || contractType === 3 // 揽货合同或VC航次租船
}

/**
 * 判断是否为TC/TCT合同类型
 * @param contractType 合同类型 0 揽货合同 1 TC期租合同 2 TCT航次期租合同 3 VC航次租船 4 COA包运合同
 * @returns true表示是TC或TCT合同（1或2）
 */
export function isTCOrTCTContract(contractType?: number): boolean {
  return contractType === 1 || contractType === 2 // TC期租合同或TCT航次期租合同
}

/**
 * 格式化字段值
 * @param value 要格式化的值
 * @param defaultValue 默认值，默认为 '-'
 * @returns 格式化后的字符串
 */
export function formatValue(value: any, defaultValue = '-'): string {
  if (value === null || value === undefined || value === '')
    return defaultValue
  return String(value)
}

/**
 * 格式化百分比
 * @param value 百分比数值
 * @returns 格式化后的百分比字符串，如 "10%"，如果值为空则返回 '-'
 */
export function formatPercent(value?: number): string {
  if (value === null || value === undefined)
    return '-'
  return `${value}%`
}

/**
 * 格式化日期
 * @param dateStr 日期字符串
 * @returns 格式化后的日期字符串，如果为空则返回 '-'
 */
export function formatDate(dateStr?: string): string {
  if (!dateStr)
    return '-'
  return dateStr
}

/**
 * 格式化日期时间为 MM-DD HH:mm 格式
 * @param dateStr 日期时间字符串（支持多种格式）
 * @returns 格式化后的日期时间字符串，如 "09-20 14:00"，如果为空则返回 '-'
 */
export function formatDateTime(dateStr?: string): string {
  if (!dateStr)
    return '-'

  try {
    const date = new Date(dateStr)
    if (Number.isNaN(date.getTime()))
      return dateStr

    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    const hours = String(date.getHours()).padStart(2, '0')
    const minutes = String(date.getMinutes()).padStart(2, '0')

    return `${month}-${day} ${hours}:${minutes}`
  }
  catch {
    return dateStr
  }
}

/**
 * 格式化金额/数量（带千分位分隔符和两位小数）
 * @param value 数值
 * @returns 格式化后的字符串，如 "9,999,999.99"，如果为空则返回 '-'
 */
export function formatAmount(value?: number | null): string {
  if (value === null || value === undefined)
    return '-'
  return value.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
}
