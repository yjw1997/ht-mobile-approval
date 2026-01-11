/**
 * 树形结构工具函数
 */

/**
 * 从树形结构中查找节点
 * @param nodes 树形节点数组
 * @param matchFn 匹配函数，返回 true 表示找到目标节点
 * @param getValueFn 获取值的函数，从节点中提取需要的值
 * @param defaultValue 默认值，找不到时返回
 * @returns 找到的值或默认值
 */
function findInTree<T = any>(
  nodes: any[],
  matchFn: (node: any) => boolean,
  getValueFn: (node: any) => T,
  defaultValue: T = '-' as T,
): T {
  if (!nodes || nodes.length === 0)
    return defaultValue

  for (const node of nodes) {
    if (matchFn(node))
      return getValueFn(node) || defaultValue

    if (node.children && node.children.length > 0) {
      const found = findInTree(node.children, matchFn, getValueFn, defaultValue)
      if (found !== defaultValue)
        return found
    }
  }

  return defaultValue
}

/**
 * 从费用科目树形结构中查找科目名称
 * @param code 科目代码
 * @param categoryWithSubjectTree 费用科目树形结构
 * @returns 科目名称，找不到返回 '-'
 */
export function getExpenseSubjectName(
  code: string,
  categoryWithSubjectTree: any[],
): string {
  if (!code || !categoryWithSubjectTree || categoryWithSubjectTree.length === 0)
    return '-'

  return findInTree(
    categoryWithSubjectTree,
    node => node.code === code,
    node => node.cnName,
    '-',
  )
}

/**
 * 从部门树形结构中查找部门名称
 * @param deptId 部门ID
 * @param deptTree 部门树形结构
 * @returns 部门名称，找不到返回 '-'
 */
export function getDeptName(
  deptId: string | number,
  deptTree: any[],
): string {
  if (!deptId || !deptTree || deptTree.length === 0)
    return '-'

  return findInTree(
    deptTree,
    node => node.id === deptId || node.deptId === deptId,
    node => node.deptName || node.orgName,
    '-',
  )
}

/**
 * 通用的树形结构查找函数
 * @param nodes 树形节点数组
 * @param matchFn 匹配函数
 * @param getValueFn 获取值的函数
 * @param defaultValue 默认值
 * @returns 找到的值或默认值
 */
export function findValueInTree<T = any>(
  nodes: any[],
  matchFn: (node: any) => boolean,
  getValueFn: (node: any) => T,
  defaultValue: T = '-' as T,
): T {
  return findInTree(nodes, matchFn, getValueFn, defaultValue)
}
