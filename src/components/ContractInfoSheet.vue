<script setup lang="ts">
import { computed, ref } from 'vue'
import type { ContractExternalResp } from '@/types/Contract'
import { isTCOrTCTContract, isVCOrFreightContract } from '@/utils/formatData'
import { initOptions } from '@/utils/localDict'
import ContractApprovalInfoTCTCT from '@/components/ContractApprovalInfoTCTCT.vue'
import ContractApprovalInfoVCFreight from '@/components/ContractApprovalInfoVCFreight.vue'

interface Props {
  show: boolean
  contractData?: ContractExternalResp | null
  contractTitle?: string
}

const props = withDefaults(defineProps<Props>(), {
  contractData: null,
  contractTitle: '关联合同',
})

const emit = defineEmits<{
  'update:show': [value: boolean]
}>()

const showSheet = computed({
  get: () => props.show,
  set: value => emit('update:show', value),
})

// 计算标题
const title = computed(() => {
  if (props.contractTitle)
    return props.contractTitle

  if (props.contractData?.contractNo) {
    return `关联合同：${props.contractData.contractNo}`
  }

  return '关联合同'
})

// 字典选项
const options = ref<any>({})

// 初始化选项
onMounted(async () => {
  if (props.contractData) {
    const opts = await initOptions()
    options.value = {
      guestBusinessOptions: opts.businessCodeDictOptions || [],
      shipOptions: opts.shipOptions || [],
      portOptions: opts.portOptions || [],
      isoOptions: opts.isoOPtions || [],
      operatorDictOptions: opts.operatorDictOptions || [],
      goodTypesOptions: opts.goodTypesOptions || [],
      categoryWithSubjectTree: opts.categoryWithSubjectTree || [],
    }
  }
})

// 判断合同类型
const isTCWithTCT = computed(() => isTCOrTCTContract(props.contractData?.contractType))
const isVCWithFreight = computed(() => isVCOrFreightContract(props.contractData?.contractType))
</script>

<template>
  <van-action-sheet
    v-model:show="showSheet"
    :title="title"
    :style="{ height: '80%' }"
  >
    <div class="overflow-y-auto" style="max-height: calc(80vh - 60px);">
      <!-- 审批信息内容 -->
      <ContractApprovalInfoTCTCT
        v-if="isTCWithTCT && contractData"
        :contract-data="contractData"
        :options="options"
      />
      <ContractApprovalInfoVCFreight
        v-else-if="isVCWithFreight && contractData"
        :contract-data="contractData"
        :options="options"
      />
    </div>
  </van-action-sheet>
</template>
