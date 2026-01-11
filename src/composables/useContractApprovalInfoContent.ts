import { computed, ref, watch } from 'vue'
import type { ContractExternalResp } from '@/types/Contract'
import { formatAmount, formatDate, formatPercent, formatValue } from '@/utils/formatData'
import {
  brokerCommissionTypeDictOptions,
  BUSINESS_MODE_OPTIONS,
  CONTRACT_TYPE_OPTIONS,
  customerCommissionTypeOptions,
  EXTERNAL_CONTRACT_CARGO_RANGE_TYPE_DICT,
  EXTERNAL_CONTRACT_RENTAL_TYPE_DICT,
  EXTERNAL_CONTRACT_TIME_TYPE_DICT,
  externalContractNature,
  freightRateModelDictOptions,
  fuelSpecificationOptions,
  getLabelByOptions,
  LEASE_TYPE_OPTIONS,
  PAYMENT_CYCLE_TYPE_OPTIONS,
  paymentCycleDictOptions,
  paymentTypeOptions,
  repaymentPeriodOptions,
  shippingTermsDictOptions,
  splitRuleTypeDictOptions,
  unitDictOptions,
} from '@/utils/localDict'
import { getExpenseSubjectName } from '@/utils/treeUtils'
import type { TableColumn } from '@/components/DataTable.vue'

export interface ContractApprovalInfoOptions {
  guestBusinessOptions?: any[]
  shipOptions?: any[]
  portOptions?: any[]
  isoOptions?: any[]
  operatorDictOptions?: any[]
  goodTypesOptions?: any[]
  categoryWithSubjectTree?: any[]
}

/**
 * 格式化时间范围显示
 */
function formatTimeRange(info: any): string {
  if (!info.timeType)
    return '-'

  if (info.timeType === '0') {
    if (info.timeRangeDay) {
      const days = info.timeRangeDay.split(',')
      if (days.length >= 2) {
        return `第${days[0]}天 - 第${days[1]}天`
      }
      if (days.length === 1) {
        return `第${days[0]}天`
      }
    }
    return '-'
  }
  else if (info.timeType === '1') {
    const start = formatDate(info.timeRangeStart)
    const end = formatDate(info.timeRangeEnd)
    if (start && end) {
      return `${start} - ${end}`
    }
    if (start) {
      return start
    }
    return '-'
  }

  return '-'
}

/**
 * TC/TCT 合同审批信息内容 composable
 */
export function useContractApprovalInfoTCTCT(
  contractData: Ref<ContractExternalResp | null>,
  options: ContractApprovalInfoOptions = {},
) {
  const activeCollapse = ref<string[]>(['1', '2', '3', '4', '5'])
  const activeRouteTab = ref(0)
  const viewedRoutes = ref<Set<number>>(new Set())

  // 监听标签页切换
  watch(activeRouteTab, (newTab) => {
    if (newTab !== undefined && newTab !== null) {
      viewedRoutes.value.add(newTab)
    }
  }, { immediate: true })

  function isRouteChecked(routeIndex: number): boolean {
    return viewedRoutes.value.has(routeIndex)
  }

  // 基础信息字段
  const fields = computed(() => {
    if (!contractData.value)
      return []

    const data = contractData.value

    return [
      { label: '合同号', value: formatValue(data.contractNo) },
      { label: '经营模式', value: getLabelByOptions(BUSINESS_MODE_OPTIONS, data.businessMode) || '-' },
      { label: '合同类型', value: getLabelByOptions(CONTRACT_TYPE_OPTIONS, data.contractType) || '-' },
      { label: '租赁方向', value: getLabelByOptions(LEASE_TYPE_OPTIONS, data.leaseType) || '-' },
      { label: '船名', value: getLabelByOptions(options.shipOptions || [], data.vesselCode) || formatValue(data.vesselCode) },
      { label: '航次号', value: formatValue(data.voyageNo) },
      { label: '船东', value: getLabelByOptions(options.guestBusinessOptions || [], data.guestBusinessCode) || formatValue(data.guestBusinessCode) },
      { label: '客户/租家', value: getLabelByOptions(options.guestBusinessOptions || [], data.oppositeSigningUnit) || formatValue(data.oppositeSigningUnit) },
      { label: '结算单位对方', value: getLabelByOptions(options.guestBusinessOptions || [], data.oppositeSettlementUnit) || formatValue(data.oppositeSettlementUnit) },
      { label: '签约主体', value: getLabelByOptions(options.guestBusinessOptions || [], data.ourSigningUnit) },
      { label: '结算单位我方', value: getLabelByOptions(options.guestBusinessOptions || [], data.ourSettlementUnit) || formatValue(data.ourSettlementUnit) },
      { label: '经办人', value: formatValue(data.operator) },
      { label: '所属部门', value: formatValue(data.deptName) },
      { label: '商务经理', value: getLabelByOptions(options.operatorDictOptions || [], data.businessManager) },
      { label: '签订日期', value: formatDate(data.signDate) },
      { label: '币种', value: getLabelByOptions(options.isoOptions || [], data.currencyCode) || formatValue(data.currencyCode) },
      { label: '受载期', value: `${formatDate(data.startLaycan)} - ${formatDate(data.endLaycan)}` },
      { label: '合同性质', value: getLabelByOptions(externalContractNature, data.contractNature) || formatValue(data.contractNature) },
      { label: '油耗范围', value: formatValue(data.fuelConsumptionRange) },
      { label: '交船地点', value: getLabelByOptions(options.portOptions || [], data.deliveryVesselPort) || formatValue(data.deliveryVesselPort) },
      { label: '还船地点', value: getLabelByOptions(options.portOptions || [], data.repayVesselPort) || formatValue(data.repayVesselPort) },
      { label: '航行区域', value: formatValue(data.sailingRegion) },
      { label: '租期时长', value: formatValue(data.charterPeriodDuration) },
      { label: '航次类型/航线', value: formatValue(data.voyageType) },
      { label: '油款收/支方式', value: formatValue(data.fuelMethod) },
      { label: '租金收/支方式', value: formatValue(data.leaseAmountMethod) },
      { label: '额外费用收取', value: formatValue(data.extraChargesCollection) },
      { label: '其他注意事项', value: formatValue(data.otherPrecautions) },
    ]
  })

  // 租金方案字段
  const rentalSchemeFields = computed(() => {
    if (!contractData.value)
      return []

    const data = contractData.value
    return [
      { label: '多航向', value: data.isMultipleRoutes === 0 ? '否' : data.isMultipleRoutes === 1 ? '是' : '-' },
      {
        label: '客户/租家佣金(%)',
        value: (() => {
          const type = getLabelByOptions(customerCommissionTypeOptions, data.customerCommissionType)
          const amt = data.customerCommissionAmt !== undefined && data.customerCommissionAmt !== null ? data.customerCommissionAmt.toFixed(5) : ''
          if (!type && !amt)
            return '-'
          return type ? `${type}${amt ? `/${amt}%` : ''}` : amt ? `${amt}%` : '-'
        })(),
      },
      {
        label: '结算周期',
        value: data.paymentCycleNumber !== undefined && data.paymentCycleNumber !== null
          ? `${data.paymentCycleNumber.toFixed(2)} ${getLabelByOptions(PAYMENT_CYCLE_TYPE_OPTIONS, data.paymentCycleType) || ''}`
          : '-',
      },
      {
        label: '重油油价',
        value: `${getLabelByOptions(fuelSpecificationOptions, data.heavyFuelType) || ''}${data.heavyFuelValue !== undefined && data.heavyFuelValue !== null ? `(${data.heavyFuelValue.toFixed(4)})` : ''}` || '-',
      },
      {
        label: '轻油油价',
        value: `${getLabelByOptions(fuelSpecificationOptions, data.lightFuelType) || ''}${data.lightFuelValue !== undefined && data.lightFuelValue !== null ? `(${data.lightFuelValue.toFixed(4)})` : ''}` || '-',
      },
      { label: '累计租金计算', value: data.isTotalHireAmount === 0 ? '否' : data.isTotalHireAmount === 1 ? '是' : '-' },
      { label: '支付方式', value: getLabelByOptions(paymentTypeOptions, data.paymentType) || '-' },
      {
        label: '回款账期',
        value: `${getLabelByOptions(repaymentPeriodOptions, data.paymentPeriod) || ''}${data.paymentPeriodDay !== undefined && data.paymentPeriodDay !== null ? `(${data.paymentPeriodDay.toFixed(4)}天)` : ''}` || '-',
      },
      { label: '备注', value: formatValue(data.contractRemark) },
    ]
  })

  // 航向信息列表
  const routeInfoList = computed(() => {
    return contractData.value?.contractExternalRouteDTOS || []
  })

  // 租家支付费用列表
  const paymentInfoList = computed(() => {
    return contractData.value?.contractExternalPaymentInfoDTOS || []
  })

  // 合同经纪信息列表
  const brokerInfoList = computed(() => {
    return contractData.value?.contractExternalBrokerInfoDTOS || []
  })

  // 附件列表
  const attachmentList = computed(() => {
    return contractData.value?.fileAttachmentDTOS || []
  })

  // 航向信息表格列配置
  const routeInfoColumns = computed<TableColumn[]>(() => [
    {
      key: 'rentalType',
      label: '租金类型',
      align: 'left',
      minWidth: 100,
      render: row => getLabelByOptions(EXTERNAL_CONTRACT_RENTAL_TYPE_DICT, row.rentalType) || '-',
    },
    {
      key: 'rentalNumber',
      label: '日租金',
      align: 'right',
      minWidth: 100,
      render: row => row.rentalType === '0' && row.rentalNumber !== undefined && row.rentalNumber !== null ? formatAmount(row.rentalNumber) : '-',
    },
    {
      key: 'timeType',
      label: '时间类型',
      align: 'left',
      minWidth: 100,
      render: row => getLabelByOptions(EXTERNAL_CONTRACT_TIME_TYPE_DICT, row.timeType) || '-',
    },
    {
      key: 'timeRange',
      label: '时间范围',
      align: 'left',
      minWidth: 200,
      render: row => formatTimeRange(row),
    },
    {
      key: 'indexType',
      label: '指数类型',
      align: 'left',
      minWidth: 100,
      render: row => row.rentalType === '1' ? (formatValue(row.indexType) || '-') : '-',
    },
    {
      key: 'proportion',
      label: '百分比（%）',
      align: 'right',
      minWidth: 100,
      render: row => row.rentalType === '1' && row.proportion !== undefined && row.proportion !== null ? `${row.proportion.toFixed(5)}` : '-',
    },
    {
      key: 'unloadRange',
      label: '卸货范围',
      align: 'left',
      minWidth: 100,
      render: row => formatValue(row.unloadRange),
    },
  ])

  // 合同经纪信息表格列配置
  const brokerInfoColumns = computed<TableColumn[]>(() => [
    {
      key: 'guestBusinessCode',
      label: '经纪公司',
      align: 'left',
      minWidth: 120,
      render: row => getLabelByOptions(options.guestBusinessOptions || [], row.guestBusinessCode) || row.guestBusinessCode || '-',
    },
    {
      key: 'brokerCommissionType',
      label: '经纪佣金类型',
      align: 'left',
      minWidth: 100,
      render: row => getLabelByOptions(brokerCommissionTypeDictOptions, row.brokerCommissionType) || '-',
    },
    {
      key: 'brokerCommissionValue',
      label: '经纪佣金(%)',
      align: 'right',
      minWidth: 100,
      render: row => row.brokerCommissionValue !== undefined && row.brokerCommissionValue !== null ? row.brokerCommissionValue.toFixed(4) : '-',
    },
    {
      key: 'isClientSettlement',
      label: '是否客户/租家代付',
      align: 'left',
      minWidth: 120,
      render: row => row.isClientSettlement === 0 ? '否' : row.isClientSettlement === 1 ? '是' : '-',
    },
  ])

  // 租家支付费用表格列配置
  const paymentInfoColumns = computed<TableColumn[]>(() => [
    {
      key: 'expenseSubjectCode',
      label: '费用科目',
      align: 'left',
      minWidth: 120,
      render: row => getExpenseSubjectName(row.expenseSubjectCode || '', options.categoryWithSubjectTree || []),
    },
    {
      key: 'amount',
      label: '金额',
      align: 'right',
      minWidth: 100,
      render: row => row.amount !== undefined && row.amount !== null ? formatAmount(row.amount) : '-',
    },
    {
      key: 'paymentCycle',
      label: '支付周期',
      align: 'left',
      minWidth: 100,
      render: row => getLabelByOptions(paymentCycleDictOptions, row.paymentCycle) || row.paymentCycle || '-',
    },
    {
      key: 'splitRule',
      label: '（按月）拆分规则',
      align: 'left',
      minWidth: 120,
      render: row => row.paymentCycle !== '3' ? (getLabelByOptions(splitRuleTypeDictOptions, row.splitRule) || row.splitRule || '-') : '-',
    },
  ])

  return {
    activeCollapse,
    activeRouteTab,
    fields,
    rentalSchemeFields,
    routeInfoList,
    paymentInfoList,
    brokerInfoList,
    attachmentList,
    routeInfoColumns,
    brokerInfoColumns,
    paymentInfoColumns,
    isRouteChecked,
  }
}

/**
 * VC/揽货合同审批信息内容 composable
 */
export function useContractApprovalInfoVCFreight(
  contractData: Ref<ContractExternalResp | null>,
  options: ContractApprovalInfoOptions = {},
) {
  const activeCollapse = ref<string[]>(['1', '2', '3', '4'])

  // 基础信息字段
  const fields = computed(() => {
    if (!contractData.value)
      return []

    const data = contractData.value
    return [
      { label: '合同号', value: formatValue(data.contractNo) },
      { label: '经营模式', value: getLabelByOptions(BUSINESS_MODE_OPTIONS, data.businessMode) || '-' },
      { label: '合同类型', value: getLabelByOptions(CONTRACT_TYPE_OPTIONS, data.contractType) || '-' },
      { label: '租赁方向', value: getLabelByOptions(LEASE_TYPE_OPTIONS, data.leaseType) || '-' },
      { label: '签约主体', value: getLabelByOptions(options.guestBusinessOptions || [], data.ourSigningUnit) },
      { label: '结算单位我方', value: getLabelByOptions(options.guestBusinessOptions || [], data.ourSettlementUnit) },
      { label: '客户/租家', value: getLabelByOptions(options.guestBusinessOptions || [], data.oppositeSigningUnit) },
      { label: '结算单位对方', value: getLabelByOptions(options.guestBusinessOptions || [], data.oppositeSettlementUnit) },
      { label: '经办人', value: formatValue(data.operator) },
      { label: '所属部门', value: formatValue(data.deptName) },
      { label: '商务经理', value: getLabelByOptions(options.operatorDictOptions || [], data.businessManager) },
      { label: '船名', value: getLabelByOptions(options.shipOptions || [], data.vesselCode) },
      { label: '航次号', value: formatValue(data.voyageNo) },
      { label: '船东', value: getLabelByOptions(options.guestBusinessOptions || [], data.guestBusinessCode) },
      { label: '合同性质', value: getLabelByOptions(externalContractNature, data.contractNature) },
      { label: '币种', value: getLabelByOptions(options.isoOptions || [], data.currencyCode) },
      { label: '签订日期', value: formatDate(data.signDate) },
      { label: '预收付比例', value: formatPercent(data.advancePaymentRatio) },
      { label: '受载期', value: formatValue(data.laycan) },
      { label: '滞期速遣条款', value: formatValue(data.dispatchClause) },
      { label: '备注', value: formatValue(data.contractRemark) },
    ]
  })

  // 运价费用条款字段
  const freightFields = computed(() => {
    if (!contractData.value)
      return []

    const data = contractData.value
    return [
      { label: '租家佣金(%)', value: (getLabelByOptions(customerCommissionTypeOptions, data.customerCommissionType) || '') + (data.customerCommissionAmt ? `/${data.customerCommissionAmt}%` : '') },
      { label: '支付方式', value: getLabelByOptions(paymentTypeOptions, data.paymentType) || '-' },
      { label: '货量范围', value: (getLabelByOptions(EXTERNAL_CONTRACT_CARGO_RANGE_TYPE_DICT, data.cargoRangeType) || '') + (data.cargoRangeValue ? `(${formatValue(data.cargoRangeValue)})` : '') },
      { label: '重油油价', value: (getLabelByOptions(fuelSpecificationOptions, data.heavyFuelType) || '') + (data.heavyFuelValue ? `(${formatValue(data.heavyFuelValue)})` : '') },
      { label: '轻油油价', value: (getLabelByOptions(fuelSpecificationOptions, data.lightFuelType) || '') + (data.lightFuelValue ? `(${formatValue(data.lightFuelValue)})` : '') },
      { label: '油耗范围', value: formatValue(data.fuelConsumptionRange) },
      { label: '回款账期', value: `${getLabelByOptions(repaymentPeriodOptions, data.paymentPeriod) || ''} ${data.paymentPeriodDay ? `(${data.paymentPeriodDay}天)` : ''}` },
    ]
  })

  // 运价信息列表
  const freightInfoList = computed(() => {
    return contractData.value?.contractExternalFreightInfoDTOS || []
  })

  // 合同经纪信息列表
  const brokerInfoList = computed(() => {
    return contractData.value?.contractExternalBrokerInfoDTOS || []
  })

  // 附件列表
  const attachmentList = computed(() => {
    return contractData.value?.fileAttachmentDTOS || []
  })

  // 运价信息表格列配置
  const freightInfoColumns = computed<TableColumn[]>(() => [
    {
      key: 'freightCategory',
      label: '运价类别',
      align: 'left',
      minWidth: 80,
      render: row => getLabelByOptions(freightRateModelDictOptions, row.freightCategory) || '-',
    },
    {
      key: 'goodsCode',
      label: '货物',
      align: 'left',
      minWidth: 100,
      render: row => getLabelByOptions(options.goodTypesOptions || [], row.goodsCode) || row.goodsCode || '-',
    },
    {
      key: 'goodsNumber',
      label: '数量',
      align: 'right',
      minWidth: 80,
      render: row => row.goodsNumber !== undefined && row.goodsNumber !== null ? row.goodsNumber.toFixed(3) : '-',
    },
    {
      key: 'unit',
      label: '单位',
      align: 'left',
      minWidth: 60,
      render: row => getLabelByOptions(unitDictOptions, row.unit) || '-',
    },
    {
      key: 'loadingPort',
      label: '装港',
      align: 'left',
      minWidth: 100,
      render: row => getLabelByOptions(options.portOptions || [], row.loadingPort) || row.loadingPortName || '-',
    },
    {
      key: 'unloadingPort',
      label: '卸港',
      align: 'left',
      minWidth: 100,
      render: row => getLabelByOptions(options.portOptions || [], row.unloadingPort) || row.unloadingPortName || '-',
    },
    {
      key: 'freightNumber',
      label: '运价',
      align: 'right',
      minWidth: 80,
      render: row => row.freightNumber !== undefined && row.freightNumber !== null ? row.freightNumber.toFixed(2) : '-',
    },
    {
      key: 'shippingTerms',
      label: '装运条款',
      align: 'left',
      minWidth: 80,
      render: row => getLabelByOptions(shippingTermsDictOptions, row.shippingTerms) || '-',
    },
    {
      key: 'advancePaymentRatio',
      label: '运费预收付比例(%)',
      align: 'right',
      minWidth: 120,
      render: row => row.advancePaymentRatio !== undefined && row.advancePaymentRatio !== null ? row.advancePaymentRatio.toFixed(5) : '-',
    },
    {
      key: 'freightTotalNumber',
      label: '运价小计',
      align: 'right',
      minWidth: 100,
      render: row => row.freightTotalNumber !== undefined && row.freightTotalNumber !== null ? row.freightTotalNumber.toFixed(2) : '-',
    },
  ])

  // 合同经纪信息表格列配置
  const brokerInfoColumns = computed<TableColumn[]>(() => [
    {
      key: 'guestBusinessCode',
      label: '经纪公司',
      align: 'left',
      minWidth: 120,
      render: row => getLabelByOptions(options.guestBusinessOptions || [], row.guestBusinessCode) || row.guestBusinessCode || '-',
    },
    {
      key: 'brokerCommissionType',
      label: '经纪佣金类型',
      align: 'left',
      minWidth: 100,
      render: row => getLabelByOptions(brokerCommissionTypeDictOptions, row.brokerCommissionType) || '-',
    },
    {
      key: 'brokerCommissionValue',
      label: '经纪佣金(%)',
      align: 'right',
      minWidth: 100,
      render: row => row.brokerCommissionValue !== undefined && row.brokerCommissionValue !== null ? row.brokerCommissionValue.toFixed(4) : '-',
    },
    {
      key: 'isClientSettlement',
      label: '是否客户/租家代付',
      align: 'left',
      minWidth: 120,
      render: row => row.isClientSettlement === 0 ? '否' : row.isClientSettlement === 1 ? '是' : '-',
    },
  ])

  return {
    activeCollapse,
    fields,
    freightFields,
    freightInfoList,
    brokerInfoList,
    attachmentList,
    freightInfoColumns,
    brokerInfoColumns,
  }
}
