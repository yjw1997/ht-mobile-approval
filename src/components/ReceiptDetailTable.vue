<script setup lang="ts">
import { formatAmount, formatDate, formatValue } from '@/utils/formatData'
import { EXTERNAL_CARRY_OUT_VOYAGE_FLAG_DICT, getLabelByOptions, LEASE_TYPE_OPTIONS, verificationTypeTableColumnsConfig } from '@/utils/localDict'
import { getExpenseSubjectName } from '@/utils/treeUtils'
import DataTable from '@/components/DataTable.vue'
import type { TableColumn } from '@/components/DataTable.vue'

defineOptions({
  name: 'ReceiptDetailTable',
})

const props = withDefaults(defineProps<Props>(), {
  shipOptions: () => [],
  portOptions: () => [],
  voyageNoConfigListOptions: () => [],
  goodTypesOptions: () => [],
  isoOptions: () => [],
  guestBusinessOptions: () => [],
  categoryWithSubjectTree: () => [],
  totalLabel: '',
  emptyText: '',
})

interface Props {
  /** 数据列表 */
  data: any[]
  /** 类型：financial-财务应收明细，business-业务应收明细 */
  type: 'financial' | 'business'
  /** 核销类型 */
  offsetType?: number | string
  /** 核销数据（用于获取默认值） */
  verificationData?: any
  /** 字典选项 */
  shipOptions?: any[]
  portOptions?: any[]
  voyageNoConfigListOptions?: any[]
  goodTypesOptions?: any[]
  isoOptions?: any[]
  guestBusinessOptions?: any[]
  categoryWithSubjectTree?: any[]
  /** 合计标签 */
  totalLabel?: string
  /** 空数据提示 */
  emptyText?: string
}

// 根据核销类型获取列配置
const columnConfig = computed(() => {
  if (!props.offsetType)
    return {}
  const typeNumber = typeof props.offsetType === 'string' ? Number(props.offsetType) : props.offsetType
  return verificationTypeTableColumnsConfig[typeNumber] || {}
})

// 判断列是否显示
function isColumnVisible(field: keyof typeof columnConfig.value): boolean {
  return columnConfig.value[field] === true
}

// 获取多个标签（用于港口目的等字段）
function getLabelsByCodes(options: any[], codes: string | string[]): string {
  if (!codes)
    return '-'
  const codeArray = Array.isArray(codes) ? codes : codes.split(',')
  const labels = codeArray
    .map(code => getLabelByOptions(options, code))
    .filter(Boolean)
  return labels.length > 0 ? labels.join(', ') : '-'
}

// 创建财务应收明细表格列配置
function createFinancialReceiptColumns(): TableColumn[] {
  const columns: TableColumn[] = [
    {
      key: 'index',
      label: '序号',
      align: 'center',
      minWidth: 60,
      render: (row, _column) => {
        const index = props.data.findIndex(item => item === row)
        return index !== -1 ? index + 1 : '-'
      },
    },
  ]

  // 根据列配置动态添加列
  if (isColumnVisible('vesselCode')) {
    columns.push({
      key: 'vesselCode',
      label: '船名',
      align: 'left',
      minWidth: 150,
      render: row => getLabelByOptions(props.shipOptions, row.vesselCode) || '-',
    })
  }

  if (isColumnVisible('voyageCode')) {
    columns.push({
      key: 'voyageCode',
      label: '航次',
      align: 'left',
      minWidth: 150,
      render: row => getLabelByOptions(props.voyageNoConfigListOptions, row.voyageCode) || formatValue(row.voyageCode) || '-',
    })
  }

  if (isColumnVisible('leasePeriod')) {
    columns.push({
      key: 'leasePeriod',
      label: '租金期数',
      align: 'left',
      minWidth: 120,
      render: row => formatValue(row.leasePeriod),
    })
  }

  if (isColumnVisible('portCode')) {
    columns.push({
      key: 'portCode',
      label: '港口',
      align: 'left',
      minWidth: 150,
      render: row => getLabelByOptions(props.portOptions, row.portCode) || '-',
    })
  }

  if (isColumnVisible('countryRegion')) {
    columns.push({
      key: 'countryRegion',
      label: '国家地区',
      align: 'left',
      minWidth: 150,
      render: row => formatValue(row.countryRegion),
    })
  }

  if (isColumnVisible('portPurpose')) {
    columns.push({
      key: 'portPurpose',
      label: '港口目的',
      align: 'left',
      minWidth: 150,
      render: row => getLabelsByCodes(EXTERNAL_CARRY_OUT_VOYAGE_FLAG_DICT, row.portPurpose),
    })
  }

  if (isColumnVisible('subjectCode')) {
    columns.push({
      key: 'subjectCode',
      label: '费用科目',
      align: 'left',
      minWidth: 150,
      render: row => getExpenseSubjectName(row.subjectCode || '', props.categoryWithSubjectTree),
    })
  }

  // 剩余可核销金额（财务应收明细专用，不在列配置中，但需要显示）
  if (props.data.length > 0 && props.data.some(item => item.unInvoicedAmount !== undefined)) {
    columns.push({
      key: 'unInvoicedAmount',
      label: '剩余可核销金额',
      align: 'right',
      minWidth: 150,
      render: row => formatAmount(row.unInvoicedAmount),
    })
  }

  if (isColumnVisible('receiptAmt')) {
    columns.push({
      key: 'receiptAmt',
      label: '实收金额',
      align: 'right',
      minWidth: 150,
      render: row => row.receiptAmt !== undefined && row.receiptAmt !== null ? Number(row.receiptAmt).toFixed(2) : '-',
    })
  }

  if (isColumnVisible('currencyCode')) {
    columns.push({
      key: 'currencyCode',
      label: '币种',
      align: 'left',
      minWidth: 100,
      render: row => getLabelByOptions(props.isoOptions, row.currencyCode || props.verificationData?.currencyCode) || '-',
    })
  }

  if (isColumnVisible('feeStandard')) {
    columns.push({
      key: 'feeStandard',
      label: '费用标准',
      align: 'left',
      minWidth: 150,
      render: row => formatValue(row.feeStandard),
    })
  }

  if (isColumnVisible('calculationNote')) {
    columns.push({
      key: 'calculationNote',
      label: '计算说明',
      align: 'left',
      minWidth: 150,
      render: row => formatValue(row.calculationNote),
    })
  }

  if (isColumnVisible('remark')) {
    columns.push({
      key: 'remark',
      label: '备注',
      align: 'left',
      minWidth: 150,
      render: row => formatValue(row.remark),
    })
  }

  if (isColumnVisible('counterSettlementUnit')) {
    columns.push({
      key: 'counterSettlementUnit',
      label: '结算单位（对方）',
      align: 'left',
      minWidth: 150,
      render: row => getLabelByOptions(props.guestBusinessOptions, row.counterSettlementUnit || props.verificationData?.payUnit) || '-',
    })
  }

  if (isColumnVisible('settlementUnit')) {
    columns.push({
      key: 'settlementUnit',
      label: '结算单位（我方）',
      align: 'left',
      minWidth: 150,
      render: row => getLabelByOptions(props.guestBusinessOptions, row.settlementUnit || props.verificationData?.receiptUnit) || '-',
    })
  }

  if (isColumnVisible('portSequence')) {
    columns.push({
      key: 'portSequence',
      label: '港序',
      align: 'left',
      minWidth: 120,
      render: row => formatValue(row.portSequence),
    })
  }

  if (isColumnVisible('plannedArrivalDate')) {
    columns.push({
      key: 'plannedArrivalDate',
      label: '计划抵港日期',
      align: 'left',
      minWidth: 160,
      render: row => formatDate(row.plannedArrivalDate) || '-',
    })
  }

  if (isColumnVisible('plannedDepartureDate')) {
    columns.push({
      key: 'plannedDepartureDate',
      label: '计划离港日期',
      align: 'left',
      minWidth: 160,
      render: row => formatDate(row.plannedDepartureDate) || '-',
    })
  }

  if (isColumnVisible('attachment')) {
    columns.push({
      key: 'attachment',
      label: '附件',
      align: 'left',
      minWidth: 150,
      render: row => formatValue(row.attachment),
    })
  }

  if (isColumnVisible('contractNo')) {
    columns.push({
      key: 'contractNo',
      label: '合同号',
      align: 'left',
      minWidth: 150,
      render: row => formatValue(row.contractNo),
    })
  }

  if (isColumnVisible('leaseStartTime')) {
    columns.push({
      key: 'leaseStartTime',
      label: '租期开始时间',
      align: 'left',
      minWidth: 160,
      render: row => formatDate(row.leaseStartTime) || '-',
    })
  }

  if (isColumnVisible('leaseEndTime')) {
    columns.push({
      key: 'leaseEndTime',
      label: '租期结束时间',
      align: 'left',
      minWidth: 160,
      render: row => formatDate(row.leaseEndTime) || '-',
    })
  }

  if (isColumnVisible('deductionItem')) {
    columns.push({
      key: 'deductionItem',
      label: '扣租事项',
      align: 'left',
      minWidth: 150,
      render: row => formatValue(row.deductionItem),
    })
  }

  if (isColumnVisible('cargoDamageReason')) {
    columns.push({
      key: 'cargoDamageReason',
      label: '差异原因',
      align: 'left',
      minWidth: 150,
      render: row => formatValue(row.cargoDamageReason),
    })
  }

  if (isColumnVisible('voyageStartTime')) {
    columns.push({
      key: 'voyageStartTime',
      label: '航次开始时间',
      align: 'left',
      minWidth: 160,
      render: row => formatDate(row.voyageStartTime) || '-',
    })
  }

  if (isColumnVisible('voyageEndTime')) {
    columns.push({
      key: 'voyageEndTime',
      label: '航次结束时间',
      align: 'left',
      minWidth: 160,
      render: row => formatDate(row.voyageEndTime) || '-',
    })
  }

  if (isColumnVisible('loadPortCode')) {
    columns.push({
      key: 'loadPortCode',
      label: '装港',
      align: 'left',
      minWidth: 150,
      render: row => getLabelByOptions(props.portOptions, row.loadPortCode) || '-',
    })
  }

  if (isColumnVisible('dischargePortCode')) {
    columns.push({
      key: 'dischargePortCode',
      label: '卸港',
      align: 'left',
      minWidth: 150,
      render: row => getLabelByOptions(props.portOptions, row.dischargePortCode) || '-',
    })
  }

  if (isColumnVisible('goodsCode')) {
    columns.push({
      key: 'goodsCode',
      label: '货物',
      align: 'left',
      minWidth: 150,
      render: row => getLabelByOptions(props.goodTypesOptions, row.goodsCode) || '-',
    })
  }

  if (isColumnVisible('actualCargoVolume')) {
    columns.push({
      key: 'actualCargoVolume',
      label: '结算货量',
      align: 'right',
      minWidth: 150,
      render: row => row.actualCargoVolume !== undefined && row.actualCargoVolume !== null ? Number(row.actualCargoVolume).toFixed(3) : '-',
    })
  }

  if (isColumnVisible('charterDirection')) {
    columns.push({
      key: 'charterDirectionCode',
      label: '租赁方向',
      align: 'left',
      minWidth: 120,
      render: row => getLabelByOptions(LEASE_TYPE_OPTIONS, row.charterDirectionCode ?? props.verificationData?.leaseType) || '-',
    })
  }

  return columns
}

// 创建业务应收明细表格列配置
function createBusinessReceiptColumns(): TableColumn[] {
  const columns: TableColumn[] = [
    {
      key: 'index',
      label: '序号',
      align: 'center',
      minWidth: 60,
      render: (row, _column) => {
        const index = props.data.findIndex(item => item === row)
        return index !== -1 ? index + 1 : '-'
      },
    },
  ]

  // 根据列配置动态添加列（与财务应收明细相同的逻辑）
  if (isColumnVisible('vesselCode')) {
    columns.push({
      key: 'vesselCode',
      label: '船名',
      align: 'left',
      minWidth: 150,
      render: row => getLabelByOptions(props.shipOptions, row.vesselCode) || '-',
    })
  }

  if (isColumnVisible('voyageCode')) {
    columns.push({
      key: 'voyageCode',
      label: '航次',
      align: 'left',
      minWidth: 150,
      render: row => getLabelByOptions(props.voyageNoConfigListOptions, row.voyageCode) || formatValue(row.voyageCode) || '-',
    })
  }

  if (isColumnVisible('leasePeriod')) {
    columns.push({
      key: 'leasePeriod',
      label: '租金期数',
      align: 'left',
      minWidth: 120,
      render: row => formatValue(row.leasePeriod),
    })
  }

  if (isColumnVisible('portCode')) {
    columns.push({
      key: 'portCode',
      label: '港口',
      align: 'left',
      minWidth: 150,
      render: row => getLabelByOptions(props.portOptions, row.portCode) || '-',
    })
  }

  if (isColumnVisible('countryRegion')) {
    columns.push({
      key: 'countryRegion',
      label: '国家地区',
      align: 'left',
      minWidth: 150,
      render: row => formatValue(row.countryRegion),
    })
  }

  if (isColumnVisible('portPurpose')) {
    columns.push({
      key: 'portPurpose',
      label: '港口目的',
      align: 'left',
      minWidth: 150,
      render: row => getLabelsByCodes(EXTERNAL_CARRY_OUT_VOYAGE_FLAG_DICT, row.portPurpose),
    })
  }

  if (isColumnVisible('subjectCode')) {
    columns.push({
      key: 'subjectCode',
      label: '费用科目',
      align: 'left',
      minWidth: 150,
      render: row => getExpenseSubjectName(row.subjectCode || '', props.categoryWithSubjectTree),
    })
  }

  // 业务应收明细使用 taxIncludeAmount 字段
  if (isColumnVisible('receiptAmt')) {
    columns.push({
      key: 'taxIncludeAmount',
      label: '应收金额',
      align: 'right',
      minWidth: 150,
      render: row => row.taxIncludeAmount !== undefined && row.taxIncludeAmount !== null ? Number(row.taxIncludeAmount).toFixed(2) : '-',
    })
  }

  if (isColumnVisible('currencyCode')) {
    columns.push({
      key: 'currencyCode',
      label: '币种',
      align: 'left',
      minWidth: 100,
      render: row => getLabelByOptions(props.isoOptions, row.currencyCode || props.verificationData?.currencyCode) || '-',
    })
  }

  if (isColumnVisible('feeStandard')) {
    columns.push({
      key: 'feeStandard',
      label: '费用标准',
      align: 'left',
      minWidth: 150,
      render: row => formatValue(row.feeStandard),
    })
  }

  if (isColumnVisible('calculationNote')) {
    columns.push({
      key: 'calculationNote',
      label: '计算说明',
      align: 'left',
      minWidth: 150,
      render: row => formatValue(row.calculationNote),
    })
  }

  if (isColumnVisible('remark')) {
    columns.push({
      key: 'remark',
      label: '备注',
      align: 'left',
      minWidth: 150,
      render: row => formatValue(row.remark),
    })
  }

  if (isColumnVisible('counterSettlementUnit')) {
    columns.push({
      key: 'counterSettlementUnit',
      label: '结算单位（对方）',
      align: 'left',
      minWidth: 150,
      render: row => getLabelByOptions(props.guestBusinessOptions, row.counterSettlementUnit || props.verificationData?.payUnit) || '-',
    })
  }

  if (isColumnVisible('settlementUnit')) {
    columns.push({
      key: 'settlementUnit',
      label: '结算单位（我方）',
      align: 'left',
      minWidth: 150,
      render: row => getLabelByOptions(props.guestBusinessOptions, row.settlementUnit || props.verificationData?.receiptUnit) || '-',
    })
  }

  if (isColumnVisible('portSequence')) {
    columns.push({
      key: 'portSequence',
      label: '港序',
      align: 'left',
      minWidth: 120,
      render: row => formatValue(row.portSequence),
    })
  }

  if (isColumnVisible('plannedArrivalDate')) {
    columns.push({
      key: 'plannedArrivalDate',
      label: '计划抵港日期',
      align: 'left',
      minWidth: 160,
      render: row => formatDate(row.plannedArrivalDate) || '-',
    })
  }

  if (isColumnVisible('plannedDepartureDate')) {
    columns.push({
      key: 'plannedDepartureDate',
      label: '计划离港日期',
      align: 'left',
      minWidth: 160,
      render: row => formatDate(row.plannedDepartureDate) || '-',
    })
  }

  if (isColumnVisible('attachment')) {
    columns.push({
      key: 'attachment',
      label: '附件',
      align: 'left',
      minWidth: 150,
      render: row => formatValue(row.attachment),
    })
  }

  if (isColumnVisible('contractNo')) {
    columns.push({
      key: 'contractNo',
      label: '合同号',
      align: 'left',
      minWidth: 150,
      render: row => formatValue(row.contractNo),
    })
  }

  if (isColumnVisible('leaseStartTime')) {
    columns.push({
      key: 'leaseStartTime',
      label: '租期开始时间',
      align: 'left',
      minWidth: 160,
      render: row => formatDate(row.leaseStartTime) || '-',
    })
  }

  if (isColumnVisible('leaseEndTime')) {
    columns.push({
      key: 'leaseEndTime',
      label: '租期结束时间',
      align: 'left',
      minWidth: 160,
      render: row => formatDate(row.leaseEndTime) || '-',
    })
  }

  if (isColumnVisible('deductionItem')) {
    columns.push({
      key: 'deductionItem',
      label: '扣租事项',
      align: 'left',
      minWidth: 150,
      render: row => formatValue(row.deductionItem),
    })
  }

  if (isColumnVisible('cargoDamageReason')) {
    columns.push({
      key: 'cargoDamageReason',
      label: '差异原因',
      align: 'left',
      minWidth: 150,
      render: row => formatValue(row.cargoDamageReason),
    })
  }

  if (isColumnVisible('voyageStartTime')) {
    columns.push({
      key: 'voyageStartTime',
      label: '航次开始时间',
      align: 'left',
      minWidth: 160,
      render: row => formatDate(row.voyageStartTime) || '-',
    })
  }

  if (isColumnVisible('voyageEndTime')) {
    columns.push({
      key: 'voyageEndTime',
      label: '航次结束时间',
      align: 'left',
      minWidth: 160,
      render: row => formatDate(row.voyageEndTime) || '-',
    })
  }

  if (isColumnVisible('loadPortCode')) {
    columns.push({
      key: 'loadPortCode',
      label: '装港',
      align: 'left',
      minWidth: 150,
      render: row => getLabelByOptions(props.portOptions, row.loadPortCode) || '-',
    })
  }

  if (isColumnVisible('dischargePortCode')) {
    columns.push({
      key: 'dischargePortCode',
      label: '卸港',
      align: 'left',
      minWidth: 150,
      render: row => getLabelByOptions(props.portOptions, row.dischargePortCode) || '-',
    })
  }

  if (isColumnVisible('goodsCode')) {
    columns.push({
      key: 'goodsCode',
      label: '货物',
      align: 'left',
      minWidth: 150,
      render: row => getLabelByOptions(props.goodTypesOptions, row.goodsCode) || '-',
    })
  }

  if (isColumnVisible('actualCargoVolume')) {
    columns.push({
      key: 'actualCargoVolume',
      label: '结算货量',
      align: 'right',
      minWidth: 150,
      render: row => row.actualCargoVolume !== undefined && row.actualCargoVolume !== null ? Number(row.actualCargoVolume).toFixed(3) : '-',
    })
  }

  if (isColumnVisible('charterDirection')) {
    columns.push({
      key: 'charterDirectionCode',
      label: '租赁方向',
      align: 'left',
      minWidth: 120,
      render: row => getLabelByOptions(LEASE_TYPE_OPTIONS, row.charterDirectionCode ?? props.verificationData?.leaseType) || '-',
    })
  }

  return columns
}

// 表格列配置
const columns = computed<TableColumn[]>(() => {
  if (props.type === 'financial')
    return createFinancialReceiptColumns()
  return createBusinessReceiptColumns()
})

// 计算合计金额
const totalAmount = computed(() => {
  if (!props.data.length)
    return 0
  if (props.type === 'financial') {
    // 财务应收明细使用 receiptAmt 字段
    return props.data.reduce((sum: number, item: any) => {
      return sum + (Number(item.receiptAmt) || 0)
    }, 0)
  }
  else {
    // 业务应收明细使用 taxIncludeAmount 字段
    return props.data.reduce((sum: number, item: any) => {
      return sum + (Number(item.taxIncludeAmount) || 0)
    }, 0)
  }
})

// 根据类型获取默认的合计标签
const displayTotalLabel = computed(() => {
  if (props.totalLabel)
    return props.totalLabel
  return props.type === 'financial' ? '财务实收明细合计' : '业务应收合计'
})

// 根据类型获取默认的空数据提示
const displayEmptyText = computed(() => {
  if (props.emptyText)
    return props.emptyText
  return props.type === 'financial' ? '暂无财务应收明细信息' : '暂无业务应收明细信息'
})
</script>

<template>
  <div>
    <!-- 合计显示 -->
    <div v-if="totalAmount > 0 || props.data.length > 0" class="mb-4 mt-4">
      <div class="p-4 rounded-lg bg-[#E8F4FF]">
        <div class="text-sm text-[#666] mb-2">
          {{ displayTotalLabel }}
        </div>
        <div class="text-xl text-[#1989FA] font-semibold">
          {{ formatAmount(totalAmount) }}
        </div>
      </div>
    </div>

    <!-- 表格 -->
    <div class="mt-4">
      <DataTable
        :columns="columns"
        :data="data"
        :empty-text="displayEmptyText"
      />
    </div>
  </div>
</template>
