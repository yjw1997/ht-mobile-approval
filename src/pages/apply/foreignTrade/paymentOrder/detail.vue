<script setup lang="ts">
import { getPaymentDetail } from '@/api/contract'
import { formatAmount, formatDate, formatDateTime, formatValue } from '@/utils/formatData'
import { bankFeeTypeOptions, EXTERNAL_CARRY_OUT_VOYAGE_FLAG_DICT, getLabelByOptions, initOptions, LEASE_TYPE_OPTIONS, settlementMethodOptions } from '@/utils/localDict'
import { getDeptName, getExpenseSubjectName } from '@/utils/treeUtils'
// import { useVoyageInfo } from '@/composables/useVoyageInfo'
import BaseForm from '@/pages/apply/foreignTrade/baseForm.vue'
import DataTable from '@/components/DataTable.vue'
import type { TableColumn } from '@/components/DataTable.vue'
import AttachmentList from '@/components/AttachmentList.vue'
import RelatedDocCard from '@/components/RelatedDocCard.vue'
import type { FeeDetailDTO, PaymentOrderDTO } from '@/types/paymentOrder'
import type { ContractExternalResp } from '@/types/Contract'

defineOptions({
  name: 'PaymentOrderDetail',
})

// 获取请求头url上的付款单id
const route = useRoute()
const { id: paymentId } = route.query

// 付款单数据
const paymentData = ref<PaymentOrderDTO | null>(null)
const loading = ref(false)

// 下拉选项
const guestBusinessOptions = ref<any[]>([])
const isoOptions = ref<any[]>([])
const operatorDictOptions = ref<any[]>([])
const categoryWithSubjectTree = ref<any[]>([])
const deptTree = ref<any[]>([])
const shipOptions = ref<any[]>([])
const portOptions = ref<any[]>([])
const voyageNoConfigListOptions = ref<any[]>([])
const goodTypesOptions = ref<any[]>([])
const countryInfoListOptions = ref<any[]>([])
const expenseCategoryOptions = ref<any[]>([])

// // 使用航次信息 composable
// const {
//   voyageData,
//   voyageTitle,
//   fetchVoyageInfo,
// } = useVoyageInfo()

// 合同信息列表（去重后）
const contractList = ref<ContractExternalResp[]>([])

// 获取付款单详情
onMounted(async () => {
  if (!paymentId)
    return

  try {
    loading.value = true
    const res = await getPaymentDetail(String(paymentId)) as any
    paymentData.value = res?.data || res

    // // 获取关联单据信息（如果有合同号）
    // if (paymentData.value?.contractCode) {
    //   await fetchVoyageInfo(paymentData.value.contractCode)
    // }

    // 从 paymentData 中获取合同信息（contractExternalList）并进行 id 去重
    if (paymentData.value?.contractExternalList && paymentData.value.contractExternalList.length > 0) {
      const contractMap = new Map<number, ContractExternalResp>()
      paymentData.value.contractExternalList.forEach((contract: ContractExternalResp) => {
        if (contract.id) {
          contractMap.set(contract.id, contract)
        }
      })
      contractList.value = Array.from(contractMap.values())
    }

    const options = await initOptions()
    guestBusinessOptions.value = options.businessCodeDictOptions || []
    isoOptions.value = options.isoOPtions || []
    operatorDictOptions.value = options.operatorDictOptions || []
    categoryWithSubjectTree.value = options.categoryWithSubjectTree || []
    shipOptions.value = options.shipOptions || []
    portOptions.value = options.portOptions || []
    voyageNoConfigListOptions.value = options.voyageNoConfigListOptions || []
    goodTypesOptions.value = options.goodTypesOptions || []
    countryInfoListOptions.value = options.countryInfoListOptions || []
    expenseCategoryOptions.value = options.expenseCategoryOptions || []
    // TODO: 获取部门树数据
    // deptTree.value = await getDeptTree()
  }
  catch (error) {
    console.error('获取付款单详情失败:', error)
  }
  finally {
    loading.value = false
  }
})

// 处理表单数据
const formData = computed(() => {
  if (!paymentData.value) {
    return {
      initiator: '-',
      documentType: '付款申请单',
      initiationDate: '-',
      department: '-',
      applicationNo: '-',
      status: 0,
    }
  }

  return {
    initiator: getLabelByOptions(operatorDictOptions.value, paymentData.value.applicantId) || '-',
    documentType: '付款申请单',
    initiationDate: formatDateTime(paymentData.value.createTime),
    department: getDeptName(paymentData.value.deptId || '', deptTree.value) || '-',
    applicationNo: paymentData.value.paymentNo || '-',
    status: paymentData.value.status ?? 0,
  }
})

// 附件列表（用于 AttachmentList 组件）
const attachmentList = computed(() => {
  return paymentData.value?.fileAttachmentDTOS || []
})

// 处理附件列表（用于 BaseForm 的 attachments prop）
const attachments = computed(() => {
  if (!paymentData.value?.fileAttachmentDTOS)
    return []

  return paymentData.value.fileAttachmentDTOS.map(file => ({
    name: file.fileName || '-',
    url: file.filePath || '',
    type: file.fileType || '',
  }))
})

// 关联单据列表
const relatedDocs = computed(() => {
  return []
})

// 审批流程
const approvalProcess = computed(() => {
  return []
})

// 基础信息字段
const basicInfoFields = computed(() => {
  if (!paymentData.value)
    return []

  const data = paymentData.value

  // 付款类型字典：0-运费付款 1-租金付款 2-第三方费用付款 3-港使费预付款 4-港使费结算付款 5-运费收入退款 6-租金收入退款 7-第三方收入退款
  const payTypeMap: Record<string, string> = {
    0: '运费付款',
    1: '租金付款',
    2: '第三方费用付款',
    3: '港使费预付款',
    4: '港使费结算付款',
    5: '运费收入退款',
    6: '租金收入退款',
    7: '第三方收入退款',
  }

  // 账户类型字典（需要根据实际字典补充）
  const accountTypeMap: Record<string, string> = {
    // TODO: 补充账户类型字典
  }

  return [
    { label: '付款类型', value: payTypeMap[data.payType || ''] || formatValue(data.payType) || '-' },
    { label: '费用类别', value: getLabelByOptions(expenseCategoryOptions.value, data.feeCategory) || formatValue(data.feeCategory) || '-' },
    { label: '是否急付', value: data.urgentFlag === 1 ? '是' : data.urgentFlag === 0 ? '否' : '-' },
    { label: '申请付款人', value: getLabelByOptions(operatorDictOptions.value, data.applicantId) || '-' },
    { label: '申请付款金额', value: formatAmount(data.applyAmt) },
    { label: '币种', value: getLabelByOptions(isoOptions.value, data.currency) || formatValue(data.currency) || '-' },
    { label: '账户类型', value: accountTypeMap[data.accountType || ''] || formatValue(data.accountType) || '-' },
    { label: '付款单位', value: getLabelByOptions(guestBusinessOptions.value, data.payer) || formatValue(data.payer) || '-' },
    { label: '是否预付', value: data.prepaymentFlag === 1 ? '是' : data.prepaymentFlag === 0 ? '否' : '-' },
    { label: '是否结算', value: data.voyageSettleFlag === 1 ? '是' : data.voyageSettleFlag === 0 ? '否' : '-' },
    { label: '结算方式', value: getLabelByOptions(settlementMethodOptions, data.settleMethod) || formatValue(data.settleMethod) || '-' },
    { label: '流程所属部门', value: getDeptName(data.deptId || '', deptTree.value) },
  ]
})

// 收款信息字段
const receiptInfoFields = computed(() => {
  if (!paymentData.value)
    return []

  const data = paymentData.value

  return [
    { label: '收款单位', value: getLabelByOptions(guestBusinessOptions.value, data.payee) || formatValue(data.payee) || '-' },
    { label: 'SWIFT CODE', value: formatValue(data.swiftCode) || '-' },
    { label: '银行账号', value: formatValue(data.bankAccount) || '-' },
    { label: '银行账号名称', value: formatValue(data.bankAccountName) || '-' },
    { label: '收款单位国别', value: formatValue(data.payeeCountry) || '-' },
    { label: '手续费承担', value: getLabelByOptions(bankFeeTypeOptions, data.feeBearType) || formatValue(data.feeBearType) || '-' },
    { label: '银行名称', value: formatValue(data.bankName) || '-' },
    { label: '银行地址', value: formatValue(data.bankAddress) || '-' },
    { label: '指定中间行', value: data.intermediateBankFlag === 1 ? '是' : data.intermediateBankFlag === 0 ? '否' : '-' },
    { label: '中间行名称', value: formatValue(data.intermediateBankName) || '-' },
    { label: 'SWIFT中间行', value: formatValue(data.intermediateSwiftCode) || '-' },
    { label: '其他代码', value: formatValue(data.otherCode) || '-' },
    { label: '付款事项', value: formatValue(data.payItem) || '-' },
    { label: '银行汇款附言', value: formatValue(data.bankMessage) || '-' },
    { label: '财务支付说明', value: formatValue(data.financeDesc) || '-' },
  ]
})

// 作废说明字段
const invalidationFields = computed(() => {
  if (!paymentData.value)
    return []

  const data = paymentData.value

  return [
    { label: '作废原因', value: formatValue(data.cancelledReason) },
  ]
})

// 判断是否显示作废说明（状态为已作废或作废审批中时显示）
const showInvalidation = computed(() => {
  const status = paymentData.value?.status
  // 10-作废审批中, 11-已作废
  return status === 10 || status === 11
})

// 费用明细列表
const feeDetailList = computed(() => {
  return paymentData.value?.feeDetailList || []
})

// 当前币种
const currentCurrency = computed(() => {
  return getLabelByOptions(isoOptions.value, paymentData.value?.currency) || paymentData.value?.currency || ''
})

// 总金额（费用明细的含税金额合计）
const totalReceiptAmt = computed(() => {
  if (!feeDetailList.value.length)
    return 0
  return feeDetailList.value.reduce((sum: number, item: FeeDetailDTO) => {
    return sum + (Number(item.taxIncludeAmount) || 0)
  }, 0)
})

// 已付款金额（payType为3或4时显示）
const totalPaidAmt = computed(() => {
  if (!feeDetailList.value.length)
    return 0
  return feeDetailList.value.reduce((sum: number, item: FeeDetailDTO) => {
    return sum + (Number(item.paidAmt) || 0)
  }, 0)
})

// 本次付款金额合计
const totalCurrentPayAmt = computed(() => {
  if (!feeDetailList.value.length)
    return 0
  return feeDetailList.value.reduce((sum: number, item: FeeDetailDTO) => {
    return sum + (Number(item.currentPayAmt) || 0)
  }, 0)
})

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

// 创建付款明细表格列配置
function createFeeDetailColumns(): TableColumn[] {
  if (!paymentData.value)
    return []

  const payType = paymentData.value.payType || ''
  const columns: TableColumn[] = [
    {
      key: 'index',
      label: '序号',
      align: 'center',
      minWidth: 60,
      render: (row, _column) => {
        const index = feeDetailList.value.findIndex(item => item === row)
        return index !== -1 ? index + 1 : '-'
      },
    },
    {
      key: 'vesselCodeAndVoyageCode',
      label: '船名航次',
      align: 'left',
      minWidth: 150,
      render: (row) => {
        const vesselName = getLabelByOptions(shipOptions.value, row.vesselCode) || '-'
        const voyageName = getLabelByOptions(voyageNoConfigListOptions.value, row.voyageCode) || formatValue(row.voyageCode) || '-'
        return `${vesselName}-${voyageName}`
      },
    },
  ]

  // 租金付款/租金收入退款 (1, 6) - 显示租金期数
  if (payType === '1' || payType === '6') {
    columns.push({
      key: 'rentalPeriod',
      label: '租金期数',
      align: 'left',
      minWidth: 150,
      render: row => formatValue(row.rentalPeriod),
    })
  }

  // 港使费预付款/港使费结算付款 (3, 4) - 显示港口、国家地区、港口目的
  if (payType === '3' || payType === '4') {
    columns.push({
      key: 'portCode',
      label: '港口',
      align: 'left',
      minWidth: 150,
      render: row => getLabelByOptions(portOptions.value, row.portCode) || '-',
    })
    columns.push({
      key: 'countryCode',
      label: '国家地区',
      align: 'left',
      minWidth: 150,
      render: row => getLabelByOptions(countryInfoListOptions.value, row.countryCode) || '-',
    })
    columns.push({
      key: 'portGoal',
      label: '港口目的',
      align: 'left',
      minWidth: 150,
      render: row => getLabelsByCodes(EXTERNAL_CARRY_OUT_VOYAGE_FLAG_DICT, row.portGoal),
    })
  }

  // 费用科目
  columns.push({
    key: 'subjectCode',
    label: '费用科目',
    align: 'left',
    minWidth: 150,
    render: row => getExpenseSubjectName(row.subjectCode || '', categoryWithSubjectTree.value),
  })

  // 金额
  columns.push({
    key: 'taxIncludeAmount',
    label: '金额',
    align: 'right',
    minWidth: 150,
    render: row => formatAmount(row.taxIncludeAmount),
  })

  // 币种
  columns.push({
    key: 'currencyCode',
    label: '币种',
    align: 'left',
    minWidth: 100,
    render: row => getLabelByOptions(isoOptions.value, row.currencyCode) || formatValue(row.currencyCode) || '-',
  })

  // 本次付款金额
  columns.push({
    key: 'currentPayAmt',
    label: '本次付款金额',
    align: 'right',
    minWidth: 150,
    render: row => formatAmount(row.currentPayAmt),
  })

  // 计算说明
  columns.push({
    key: 'calculationNote',
    label: '计算说明',
    align: 'left',
    minWidth: 150,
    render: row => formatValue(row.calculationNote),
  })

  // 付款说明
  columns.push({
    key: 'paymentDesc',
    label: '付款说明',
    align: 'left',
    minWidth: 150,
    render: row => formatValue(row.paymentDesc),
  })

  // 备注
  columns.push({
    key: 'remark',
    label: '备注',
    align: 'left',
    minWidth: 150,
    render: row => formatValue(row.remark) || '-',
  })

  // 结算单位（我方）
  columns.push({
    key: 'settlementUnit',
    label: '结算单位（我方）',
    align: 'left',
    minWidth: 150,
    render: row => getLabelByOptions(guestBusinessOptions.value, row.settlementUnit) || '-',
  })

  // 结算单位（对方）
  columns.push({
    key: 'counterSettlementUnit',
    label: '结算单位（对方）',
    align: 'left',
    minWidth: 150,
    render: row => getLabelByOptions(guestBusinessOptions.value, row.counterSettlementUnit) || '-',
  })

  // 运费付款/运费收入退款 (0, 5) - 显示差异原因、航次开始时间、航次结束时间、装港、卸港、货物、结算货量
  if (payType === '0' || payType === '5') {
    columns.push({
      key: 'cargoDamageReason',
      label: '差异原因',
      align: 'left',
      minWidth: 150,
      render: row => formatValue(row.cargoDamageReason) || '-',
    })
    columns.push({
      key: 'voyageStartTime',
      label: '航次开始时间',
      align: 'left',
      minWidth: 160,
      render: row => formatDate(row.voyageStartTime) || '-',
    })
    columns.push({
      key: 'voyageEndTime',
      label: '航次结束时间',
      align: 'left',
      minWidth: 160,
      render: row => formatDate(row.voyageEndTime) || '-',
    })
    columns.push({
      key: 'loadPortCode',
      label: '装港',
      align: 'left',
      minWidth: 150,
      render: row => getLabelByOptions(portOptions.value, row.loadPortCode) || '-',
    })
    columns.push({
      key: 'dischargePortCode',
      label: '卸港',
      align: 'left',
      minWidth: 150,
      render: row => getLabelByOptions(portOptions.value, row.dischargePortCode) || '-',
    })
    columns.push({
      key: 'goodsCode',
      label: '货物',
      align: 'left',
      minWidth: 150,
      render: row => getLabelByOptions(goodTypesOptions.value, row.goodsCode) || '-',
    })
    columns.push({
      key: 'actualCargoVolume',
      label: '结算货量',
      align: 'right',
      minWidth: 150,
      render: row => row.actualCargoVolume !== undefined && row.actualCargoVolume !== null ? Number(row.actualCargoVolume).toFixed(3) : '-',
    })
  }

  // 租金付款/租金收入退款 (1, 6) - 显示租期开始时间、租期结束时间、计算天数、日租金、指数租金百分比、扣租事项、扣租天数、扣租日租金
  if (payType === '1' || payType === '6') {
    columns.push({
      key: 'rentalStartTime',
      label: '租期开始时间',
      align: 'left',
      minWidth: 160,
      render: row => formatDate(row.rentalStartTime) || '-',
    })
    columns.push({
      key: 'rentalEndTime',
      label: '租期结束时间',
      align: 'left',
      minWidth: 160,
      render: row => formatDate(row.rentalEndTime) || '-',
    })
    columns.push({
      key: 'count',
      label: '计算天数',
      align: 'right',
      minWidth: 120,
      render: row => row.count !== undefined && row.count !== null ? Number(row.count).toFixed(2) : '-',
    })
    columns.push({
      key: 'unitPrice',
      label: '日租金',
      align: 'right',
      minWidth: 120,
      render: row => formatAmount(row.unitPrice),
    })
    columns.push({
      key: 'indexedRentPercentage',
      label: '指数租金百分比（%）',
      align: 'right',
      minWidth: 180,
      render: row => row.indexedRentPercentage !== undefined && row.indexedRentPercentage !== null ? Number(row.indexedRentPercentage).toFixed(2) : '-',
    })
    columns.push({
      key: 'feeExplain',
      label: '扣租事项',
      align: 'left',
      minWidth: 150,
      render: row => formatValue(row.feeExplain) || '-',
    })
    // 注意：扣租天数和扣租日租金字段在原代码中也是 count 和 unitPrice，这里可能需要根据实际数据结构调整
  }

  // 第三方费用付款/第三方收入退款 (2, 7) - 显示附件、合同号
  if (payType === '2' || payType === '7') {
    columns.push({
      key: 'fileAttachmentDTOS',
      label: '附件',
      align: 'left',
      minWidth: 150,
      render: (row) => {
        if (row.fileAttachmentDTOS && row.fileAttachmentDTOS.length > 0) {
          return row.fileAttachmentDTOS.map((file: any) => file.fileName).join(', ')
        }
        return '-'
      },
    })
    columns.push({
      key: 'contractNo',
      label: '合同号',
      align: 'left',
      minWidth: 150,
      render: row => formatValue(row.contractNo),
    })
  }

  // 港使费预付款/港使费结算付款 (3, 4) - 显示港序、计划抵港日期、计划离港日期
  if (payType === '3' || payType === '4') {
    columns.push({
      key: 'executionSort',
      label: '港序',
      align: 'left',
      minWidth: 120,
      render: row => row.executionSort !== undefined && row.executionSort !== null ? String(row.executionSort) : '-',
    })
    columns.push({
      key: 'plannedArrivalDate',
      label: '计划抵港日期',
      align: 'left',
      minWidth: 160,
      render: row => formatDate(row.plannedArrivalDate) || '-',
    })
    columns.push({
      key: 'plannedDepartureDate',
      label: '计划离港日期',
      align: 'left',
      minWidth: 160,
      render: row => formatDate(row.plannedDepartureDate) || '-',
    })
  }

  // 租赁方向
  columns.push({
    key: 'charterDirectionCode',
    label: '租赁方向',
    align: 'left',
    minWidth: 120,
    render: row => getLabelByOptions(LEASE_TYPE_OPTIONS, row.charterDirectionCode) || '-',
  })

  return columns
}

// 付款明细表格列配置
const feeDetailColumns = computed<TableColumn[]>(() => createFeeDetailColumns())

// 基础信息 tabs 相关
const activeCollapse = ref<string[]>(['0', '1', '2', '3', '4'])
const activeCollapseRelated = ref<string[]>(['1'])
</script>

<template>
  <BaseForm
    :initiator="formData.initiator"
    :document-type="formData.documentType"
    :initiation-date="formData.initiationDate"
    :department="formData.department"
    :application-no="formData.applicationNo"
    :status="formData.status"
    status-type="verification"
    :attachments="attachments"
    :related-docs="relatedDocs"
    :approval-process="approvalProcess"
  >
    <!-- 审批信息内容 -->
    <template #approvalInfo>
      <van-loading v-if="loading" vertical>
        加载中...
      </van-loading>
      <div v-else class="mb-4">
        <van-collapse v-model="activeCollapse" :border="false">
          <!-- 作废说明 -->
          <van-collapse-item v-if="showInvalidation" name="0" title="作废说明">
            <van-cell-group v-if="invalidationFields.length > 0">
              <van-cell
                v-for="(field, index) in invalidationFields"
                :key="index"
                :title="field.label"
                :value="field.value"
              />
            </van-cell-group>
            <van-empty v-else description="暂无作废说明" />
          </van-collapse-item>

          <!-- 基础信息 -->
          <van-collapse-item name="1" title="基础信息">
            <van-cell-group v-if="basicInfoFields.length > 0">
              <van-cell
                v-for="(field, index) in basicInfoFields"
                :key="index"
                :title="field.label"
                :value="field.value"
              />
            </van-cell-group>
            <van-empty v-else description="暂无基础信息" />
          </van-collapse-item>

          <!-- 收款信息 -->
          <van-collapse-item name="2" title="收款信息">
            <van-cell-group v-if="receiptInfoFields.length > 0">
              <van-cell
                v-for="(field, index) in receiptInfoFields"
                :key="index"
                :title="field.label"
                :value="field.value"
              />
            </van-cell-group>
            <van-empty v-else description="暂无收款信息" />
          </van-collapse-item>

          <!-- 付款明细 -->
          <van-collapse-item name="3" title="付款明细">
            <div v-if="feeDetailList.length > 0" class="mb-4">
              <!-- 金额汇总 -->
              <div class="mb-4 p-4 rounded-lg bg-[#E8F4FF]">
                <div class="text-sm text-[#666] mb-2">
                  总金额：<span class="text-[#1989FA] font-semibold">{{ formatAmount(totalReceiptAmt) }} {{ currentCurrency }}</span>
                  <span v-if="paymentData?.payType === '3' || paymentData?.payType === '4'">
                    ，已付款金额：<span class="text-[#1989FA] font-semibold">{{ formatAmount(totalPaidAmt) }} {{ currentCurrency }}</span>
                  </span>
                  ，本次付款金额：<span class="text-[#1989FA] font-semibold">{{ formatAmount(totalCurrentPayAmt) }} {{ currentCurrency }}</span>
                </div>
              </div>

              <!-- 费用明细表格 -->
              <div class="mt-4">
                <DataTable
                  :columns="feeDetailColumns"
                  :data="feeDetailList"
                  empty-text="暂无费用明细信息"
                />
              </div>
            </div>
            <van-empty v-else description="暂无付款明细信息" />
          </van-collapse-item>

          <!-- 附件 -->
          <van-collapse-item name="4" title="附件">
            <AttachmentList :attachment-list="attachmentList" />
          </van-collapse-item>
        </van-collapse>
      </div>
    </template>
    <!-- 关联单据 -->
    <template #relatedDocs>
      <div class="mb-4">
        <van-collapse v-model="activeCollapseRelated" :border="false">
          <van-collapse-item name="1" title="关联单据">
            <!-- 执行航次 -->
            <!-- <RelatedDocCard
              :voyage-data="voyageData"
              :voyage-title="voyageTitle"
              :vessel-options="[]"
              :port-options="[]"
            /> -->
            <!-- 关联合同列表 -->
            <RelatedDocCard
              v-for="(contract, index) in contractList"
              :key="contract.id || index"
              :contract-data="contract"
              title="关联合同"
              :contract-title="`关联合同：${contract.contractNo || '-'}`"
              :show-sheet="true"
            />
          </van-collapse-item>
        </van-collapse>
      </div>
    </template>
    <template #approvalProcess />
  </BaseForm>
</template>

<route lang="json5">
{
  name: 'PaymentOrderDetail',
  meta: {
    keepAlive: true
  },
}
</route>
