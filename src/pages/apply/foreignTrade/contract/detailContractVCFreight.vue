<script setup lang="ts">
import { getSelfOperatedContract } from '@/api/contract'
import type { ContractExternalResp } from '@/types/Contract'
import { initOptions } from '@/utils/localDict'
import { useVoyageInfo } from '@/composables/useVoyageInfo'
import { useContractApprovalInfo } from '@/composables/useContractApprovalInfo'
import BaseForm from '@/pages/apply/foreignTrade/baseForm.vue'
import RelatedDocCard from '@/components/RelatedDocCard.vue'
import ContractApprovalInfoVCFreight from '@/components/ContractApprovalInfoVCFreight.vue'

defineOptions({
  name: 'ContractDetailVCFreight',
})

// 获取请求头url上的合同id
const route = useRoute()
const { id: contractId } = route.query

// 合同数据
const contractData = ref<ContractExternalResp | null>(null)
const loading = ref(false)
// 下拉选项
const guestBusinessOptions = ref<any[]>([])
const shipOptions = ref<any[]>([])
const portOptions = ref<any[]>([])
const isoOptions = ref<any[]>([])
const operatorDictOptions = ref<any[]>([])
const goodTypesOptions = ref<any[]>([])

// 使用航次信息 composable
const {
  voyageData,
  voyageTitle,
  fetchVoyageInfo,
} = useVoyageInfo()

// 获取合同详情
onMounted(async () => {
  if (!contractId)
    return

  try {
    loading.value = true
    const res = await getSelfOperatedContract(Number(contractId)) as ContractExternalResp
    contractData.value = res
    // 获取关联单据信息
    if (res.code) {
      await fetchVoyageInfo(res.code)
    }

    const options = await initOptions()
    guestBusinessOptions.value = options.businessCodeDictOptions || []
    shipOptions.value = options.shipOptions || []
    portOptions.value = options.portOptions || []
    isoOptions.value = options.isoOPtions || []
    operatorDictOptions.value = options.operatorDictOptions || []
    goodTypesOptions.value = options.goodTypesOptions || []
  }
  catch (error) {
    console.error('获取合同详情失败:', error)
  }
  finally {
    loading.value = false
  }
})

// 使用 composable 获取审批信息
const { approvalInfo } = useContractApprovalInfo(contractData)

// 处理表单数据（兼容 BaseForm 的 props）
const formData = computed(() => approvalInfo.value)

// 处理附件列表
const attachments = computed(() => {
  if (!contractData.value?.fileAttachmentDTOS)
    return []

  return contractData.value.fileAttachmentDTOS.map(file => ({
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

// 使用 composable 获取审批信息内容
const approvalInfoOptions = computed(() => ({
  guestBusinessOptions: guestBusinessOptions.value,
  shipOptions: shipOptions.value,
  portOptions: portOptions.value,
  isoOptions: isoOptions.value,
  operatorDictOptions: operatorDictOptions.value,
  goodTypesOptions: goodTypesOptions.value,
}))

// 关联单据折叠面板状态
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
    :attachments="attachments"
    :related-docs="relatedDocs"
    :approval-process="approvalProcess"
  >
    <!-- 审批信息内容 -->
    <template #approvalInfo>
      <van-loading v-if="loading" vertical>
        加载中...
      </van-loading>
      <ContractApprovalInfoVCFreight
        v-else-if="contractData"
        :contract-data="contractData"
        :options="approvalInfoOptions"
      />
    </template>
    <!-- 关联单据 -->
    <template #relatedDocs>
      <div class="mb-4">
        <van-collapse v-model="activeCollapseRelated" :border="false">
          <van-collapse-item name="1" title="关联单据">
            <RelatedDocCard
              :voyage-data="voyageData"
              :voyage-title="voyageTitle"
              type="2"
              :vessel-options="shipOptions"
              :port-options="portOptions"
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
  name: 'ContractDetailVCFreight',
  meta: {
    keepAlive: true
  },
}
</route>
