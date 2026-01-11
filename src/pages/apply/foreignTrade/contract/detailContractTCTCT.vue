<script setup lang="ts">
import { getSelfOperatedContract } from '@/api/contract'
import type { ContractExternalResp } from '@/types/Contract'
import { initOptions } from '@/utils/localDict'
import { useVoyageInfo } from '@/composables/useVoyageInfo'
import { useContractApprovalInfo } from '@/composables/useContractApprovalInfo'
import BaseForm from '@/pages/apply/foreignTrade/baseForm.vue'
import RelatedDocCard from '@/components/RelatedDocCard.vue'
import ContractApprovalInfoTCTCT from '@/components/ContractApprovalInfoTCTCT.vue'

defineOptions({
  name: 'ContractDetailTCTCT',
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
const subjectListOptions = ref<any[]>([])
const categoryWithSubjectTree = ref<any[]>([])

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
    console.log('%c [ contractData ]-49', 'font-size:13px; background:pink; color:#bf2c9f;', contractData.value)
    // 获取关联单据信息
    if (res.code) {
      await fetchVoyageInfo(res.code, true) // 传入 true 表示是 TC/TCT 页面
    }

    const options = await initOptions()
    guestBusinessOptions.value = options.businessCodeDictOptions || []
    shipOptions.value = options.shipOptions || []
    portOptions.value = options.portOptions || []
    isoOptions.value = options.isoOPtions || []
    operatorDictOptions.value = options.operatorDictOptions || []
    subjectListOptions.value = options.subjectListOptions || []
    categoryWithSubjectTree.value = options.categoryWithSubjectTree || []
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

// 处理附件列表（用于 BaseForm 的 attachments prop）
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
  categoryWithSubjectTree: categoryWithSubjectTree.value,
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
      <ContractApprovalInfoTCTCT
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
              type="1"
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

<style scoped>
/* 航向标签页样式优化 */
.route-tabs :deep(.van-tabs__nav) {
  background-color: #fff;
}

.route-tabs :deep(.van-tab) {
  padding: 0;
  font-size: 16px;
}

.route-tabs :deep(.van-tab--active) {
  color: #1989fa;
}

.route-tabs :deep(.van-tabs__line) {
  background-color: #1989fa;
  height: 2px;
}

/* 航向标签页标题样式 */
.route-tab-title {
  padding: 0 50px;
  position: relative;
}

/* 已核标记样式 */
.route-checked-badge {
  position: absolute;
  top: 0;
  right: 0;
  padding: 2px 10px;
  border-radius: 20px;
  font-size: 12px;
  color: #fff;
  background-color: rgba(31, 194, 28, 1);
  white-space: nowrap;
}
</style>

<route lang="json5">
{
  name: 'ContractDetailTCTCT',
  meta: {
    keepAlive: true
  },
}
</route>
