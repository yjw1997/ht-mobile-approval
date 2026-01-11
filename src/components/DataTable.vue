<script setup lang="ts">
defineOptions({
  name: 'DataTable',
})

withDefaults(defineProps<Props>(), {
  emptyText: '暂无数据',
  showEmpty: true,
})

/**
 * 表格列配置
 */
export interface TableColumn {
  /** 列的唯一标识 */
  key: string
  /** 列标题 */
  label: string
  /** 列对齐方式 */
  align?: 'left' | 'center' | 'right'
  /** 最小宽度 */
  minWidth?: string | number
  /** 自定义渲染函数，接收行数据和列配置，返回渲染内容 */
  render?: (row: any, column: TableColumn) => string | number
}

interface Props {
  /** 表格列配置 */
  columns: TableColumn[]
  /** 表格数据 */
  data: any[]
  /** 空数据提示文本 */
  emptyText?: string
  /** 是否显示空状态 */
  showEmpty?: boolean
}

/**
 * 获取单元格内容
 */
function getCellContent(row: any, column: TableColumn): string | number {
  if (column.render) {
    return column.render(row, column)
  }
  // 默认从 row 中获取对应 key 的值
  return row[column.key] ?? '-'
}

/**
 * 获取列的对齐样式类
 */
function getAlignClass(align?: string): string {
  if (align === 'right')
    return 'text-right'
  if (align === 'center')
    return 'text-center'
  return 'text-left'
}

/**
 * 获取列的最小宽度样式对象
 */
function getMinWidthStyle(minWidth?: string | number): Record<string, string> | undefined {
  if (!minWidth)
    return undefined
  if (typeof minWidth === 'number')
    return { minWidth: `${minWidth}px` }
  return { minWidth }
}
</script>

<template>
  <div v-if="data.length > 0" class="overflow-x-auto">
    <table class="text-sm w-full whitespace-nowrap border-collapse">
      <thead>
        <tr class="bg-[#F7F8FA]">
          <th
            v-for="column in columns"
            :key="column.key"
            class="p-2 border border-[#EBEDF0]" :class="[
              getAlignClass(column.align),
            ]"
            :style="getMinWidthStyle(column.minWidth)"
          >
            {{ column.label }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(row, rowIndex) in data" :key="rowIndex">
          <td
            v-for="column in columns"
            :key="column.key"
            class="p-2 border border-[#EBEDF0]" :class="[
              getAlignClass(column.align),
            ]"
          >
            {{ getCellContent(row, column) }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
  <van-empty v-else-if="showEmpty" class="mt-4" :description="emptyText" />
</template>
