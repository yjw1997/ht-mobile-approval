<script setup lang="ts">
import { getVerificationDetail } from '@/api/contract'
import { formatAmount, formatDate, formatDateTime, formatValue } from '@/utils/formatData'
import { bizItemTypeOptions, getLabelByOptions, initOptions, verificationTypeOptions } from '@/utils/localDict'
import { getDeptName, getExpenseSubjectName } from '@/utils/treeUtils'
import { useVoyageInfo } from '@/composables/useVoyageInfo'
import BaseForm from '@/pages/apply/foreignTrade/baseForm.vue'
import DataTable from '@/components/DataTable.vue'
import type { TableColumn } from '@/components/DataTable.vue'
import AttachmentList from '@/components/AttachmentList.vue'
import RelatedDocCard from '@/components/RelatedDocCard.vue'
import ReceiptDetailTable from '@/components/ReceiptDetailTable.vue'
import type { ContractExternalResp } from '@/types/Contract'

defineOptions({
  name: 'VerificationDetail',
})

// 获取请求头url上的核销id
const route = useRoute()
const { id: verificationId } = route.query

// 核销数据
const verificationData = ref<any>(null)
const loading = ref(false)

// 下拉选项
const guestBusinessOptions = ref<any[]>([])
const isoOptions = ref<any[]>([])
const operatorDictOptions = ref<any[]>([])
const categoryWithSubjectTree = ref<any[]>([])
const deptTree = ref<any[]>([])
const shipOptions = ref<any[]>([])
const portOptions = ref<any[]>([])
const goodTypesOptions = ref<any[]>([])
const voyageNoConfigListOptions = ref<any[]>([])
const countryInfoListOptions = ref<any[]>([])

// 使用航次信息 composable
const {
  fetchVoyageInfo,
} = useVoyageInfo()

// 合同信息列表（去重后）
const contractList = ref<ContractExternalResp[]>([])

// 获取核销详情
onMounted(async () => {
  if (!verificationId)
    return

  try {
    loading.value = true
    const res = await getVerificationDetail(String(verificationId)) as any
    verificationData.value = res

    // 从 verificationData 中获取合同信息（contractExternalList）并进行 id 去重
    if (verificationData.value?.contractExternalList && verificationData.value.contractExternalList.length > 0) {
      const contractMap = new Map<number, ContractExternalResp>()
      verificationData.value.contractExternalList.forEach((contract: ContractExternalResp) => {
        if (contract.id) {
          contractMap.set(contract.id, contract)
        }
      })
      contractList.value = Array.from(contractMap.values())
    }

    // 获取关联单据信息（如果有合同号）
    if (res?.contractCode) {
      await fetchVoyageInfo(res.contractCode)
    }

    const options = await initOptions()
    guestBusinessOptions.value = options.businessCodeDictOptions || []
    isoOptions.value = options.isoOPtions || []
    operatorDictOptions.value = options.operatorDictOptions || []
    categoryWithSubjectTree.value = options.categoryWithSubjectTree || []
    shipOptions.value = options.shipOptions || []
    portOptions.value = options.portOptions || []
    goodTypesOptions.value = options.goodTypesOptions || []
    voyageNoConfigListOptions.value = options.voyageNoConfigListOptions || []
    countryInfoListOptions.value = options.countryInfoListOptions || []
    // TODO: 获取部门树数据
    // deptTree.value = await getDeptTree()
  }
  catch (error) {
    console.error('获取核销详情失败:', error)
  }
  finally {
    loading.value = false
  }
})

// 处理表单数据
const formData = computed(() => {
  if (!verificationData.value) {
    return {
      initiator: '-',
      documentType: '核销申请单',
      initiationDate: '-',
      department: '-',
      applicationNo: '-',
      status: 0,
    }
  }

  return {
    initiator: verificationData.value.operator || '-',
    documentType: '核销申请单',
    initiationDate: formatDateTime(verificationData.value.createTime),
    department: verificationData.value.deptName || '-',
    applicationNo: verificationData.value.applyNo || '-',
    status: verificationData.value.approvalStatus ?? 0,
  }
})

// 附件列表（用于 AttachmentList 组件）
const attachmentList = computed(() => {
  return verificationData.value?.fileAttachmentDTOS || []
})

// 处理附件列表（用于 BaseForm 的 attachments prop）
const attachments = computed(() => {
  if (!verificationData.value?.fileAttachmentDTOS)
    return []

  return verificationData.value.fileAttachmentDTOS.map(file => ({
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
const fields = computed(() => {
  if (!verificationData.value)
    return []

  const data = verificationData.value

  return [
    { label: '核销类型', value: getLabelByOptions(verificationTypeOptions, data.offsetType) || '-' },
    { label: '费用科目', value: getExpenseSubjectName(data.expenseSubjectCode || '', categoryWithSubjectTree.value) },
    { label: '付款单位', value: getLabelByOptions(guestBusinessOptions.value, data.payUnit) || formatValue(data.payUnit) },
    { label: '币种', value: getLabelByOptions(isoOptions.value, data.currencyCode) || formatValue(data.currencyCode) },
    { label: '收款单位', value: getLabelByOptions(guestBusinessOptions.value, data.receiptUnit) || formatValue(data.receiptUnit) },
    { label: '是否航次结算', value: data.isVoyageSettlement === 1 ? '是' : data.isVoyageSettlement === 0 ? '否' : '-' },
    { label: '流程所属部门', value: getDeptName(data.processDeptId || '', deptTree.value) },
    { label: '申请备注', value: formatValue(data.applyRemark) },
  ]
})

// 收款金额列表
const receiptAmountList = computed(() => {
  return verificationData.value?.receiptOffsetDetailDTOS || []
})

// 本次核销收款金额总计
const totalReceiptAmount = computed(() => {
  if (!receiptAmountList.value.length)
    return 0
  return receiptAmountList.value.reduce((sum: number, item: any) => {
    return sum + (item.offsetAmt || 0)
  }, 0)
})

// 收款金额表格列配置
const receiptAmountColumns = computed<TableColumn[]>(() => [
  {
    key: 'index',
    label: '序号',
    align: 'center',
    minWidth: 60,
    render: (row, _column) => {
      const index = receiptAmountList.value.findIndex(item => item === row)
      return index !== -1 ? index + 1 : '-'
    },
  },
  {
    key: 'bankFlowNo',
    label: '银行流水号',
    align: 'left',
    minWidth: 150,
    render: row => formatValue(row.bankFlowNo),
  },
  {
    key: 'bizItemType',
    label: '款项性质',
    align: 'left',
    minWidth: 120,
    render: row => getLabelByOptions(bizItemTypeOptions, row.bizItemType) || '-',
  },
  {
    key: 'customerName',
    label: '客户/租家',
    align: 'left',
    minWidth: 150,
    render: row => formatValue(row.customerName),
  },
  {
    key: 'arriveTime',
    label: '到账时间',
    align: 'left',
    minWidth: 160,
    render: row => formatDate(row.arriveTime) || '-',
  },
  {
    key: 'settleCurrency',
    label: '平账币种',
    align: 'left',
    minWidth: 100,
    render: row => formatValue(row.settleCurrency),
  },
  {
    key: 'settleAmt',
    label: '平账金额',
    align: 'right',
    minWidth: 120,
    render: row => formatAmount(row.settleAmt),
  },
  {
    key: 'offsetAmt',
    label: '本次核销收款金额',
    align: 'right',
    minWidth: 180,
    render: row => formatAmount(row.offsetAmt),
  },
  {
    key: 'claimRemark',
    label: '认领备注',
    align: 'left',
    minWidth: 150,
    render: row => formatValue(row.claimRemark),
  },
  {
    key: 'claimUserId',
    label: '认领人',
    align: 'left',
    minWidth: 100,
    render: row => getLabelByOptions(operatorDictOptions.value, row.claimUserId) || '-',
  },
  {
    key: 'claimTime',
    label: '认领时间',
    align: 'left',
    minWidth: 160,
    render: row => formatDate(row.claimTime) || '-',
  },
  {
    key: 'claimNo',
    label: '认领单号',
    align: 'left',
    minWidth: 150,
    render: row => formatValue(row.claimNo),
  },
  {
    key: 'exchangeRate',
    label: '汇率',
    align: 'left',
    minWidth: 100,
    render: row => formatValue(row.exchangeRate),
  },
  {
    key: 'feeAmt',
    label: '手续费',
    align: 'right',
    minWidth: 100,
    render: row => row.feeAmt ? formatAmount(row.feeAmt) : '-',
  },
])

// 作废说明字段
const invalidationFields = computed(() => {
  if (!verificationData.value)
    return []

  const data = verificationData.value

  return [
    { label: '作废原因', value: formatValue(data.cancelledReason) },
    // { label: '作废说明', value: formatValue(data.invalidationRemark) },
  ]
})

// 判断是否显示作废说明（状态为已作废或作废审批中时显示）
const showInvalidation = computed(() => {
  const status = verificationData.value?.approvalStatus
  // 10-作废审批中, 11-已作废
  return status === 10 || status === 11
})

// 财务应收明细列表
const financialReceiptList = computed(() => {
  return verificationData.value?.financialReceiptDetailDTOS || []
})

// 业务应收明细列表
const businessReceiptList = computed(() => {
  return verificationData.value?.businessReceiptDetailDTOS || []
})

// 基础信息 tabs 相关
const activeCollapse = ref<string[]>(['0', '1', '2', '3', '4', '5'])
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
            <van-cell-group v-if="fields.length > 0">
              <van-cell
                v-for="(field, index) in fields"
                :key="index"
                :title="field.label"
                :value="field.value"
              />
            </van-cell-group>
            <van-empty v-else description="暂无数据" />
          </van-collapse-item>

          <!-- 收款金额 -->
          <van-collapse-item name="2" title="收款金额">
            <!-- 本次核销收款金额总计 -->
            <div class="mb-4 mt-4">
              <div class="p-4 rounded-lg bg-[#E8F4FF]">
                <div class="text-sm text-[#666] mb-2">
                  本次核销收款金额
                </div>
                <div class="text-xl text-[#1989FA] font-semibold">
                  {{ formatAmount(totalReceiptAmount) }}
                </div>
              </div>
            </div>

            <!-- 收款金额表格 -->
            <div class="mt-4">
              <DataTable
                :columns="receiptAmountColumns"
                :data="receiptAmountList"
                empty-text="暂无收款金额信息"
              />
            </div>
          </van-collapse-item>

          <!-- 财务应收明细 -->
          <van-collapse-item name="4" title="财务应收明细">
            <ReceiptDetailTable
              :data="financialReceiptList"
              type="financial"
              :offset-type="verificationData?.offsetType"
              :verification-data="verificationData"
              :ship-options="shipOptions"
              :port-options="portOptions"
              :voyage-no-config-list-options="voyageNoConfigListOptions"
              :good-types-options="goodTypesOptions"
              :iso-options="isoOptions"
              :guest-business-options="guestBusinessOptions"
              :category-with-subject-tree="categoryWithSubjectTree"
            />
          </van-collapse-item>

          <!-- 业务应收明细 -->
          <van-collapse-item name="5" title="业务应收明细">
            <ReceiptDetailTable
              :data="businessReceiptList"
              type="business"
              :offset-type="verificationData?.offsetType"
              :verification-data="verificationData"
              :ship-options="shipOptions"
              :port-options="portOptions"
              :voyage-no-config-list-options="voyageNoConfigListOptions"
              :good-types-options="goodTypesOptions"
              :iso-options="isoOptions"
              :guest-business-options="guestBusinessOptions"
              :category-with-subject-tree="categoryWithSubjectTree"
            />
          </van-collapse-item>

          <!-- 附件 -->
          <van-collapse-item name="3" title="附件">
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
              :vessel-options="shipOptions"
              :port-options="portOptions"
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
  name: 'VerificationDetail',
  meta: {
    keepAlive: true
  },
}
</route>
