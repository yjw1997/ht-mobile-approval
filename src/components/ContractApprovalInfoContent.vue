<script setup lang="ts">
import type { ContractExternalResp } from '@/types/Contract'
import { isTCOrTCTContract, isVCOrFreightContract } from '@/utils/formatData'
import ContractApprovalInfoTCTCT from './ContractApprovalInfoTCTCT.vue'
import ContractApprovalInfoVCFreight from './ContractApprovalInfoVCFreight.vue'

interface Props {
  /** 合同数据 */
  contractData: ContractExternalResp | null
  /** 是否加载中 */
  loading?: boolean
  /** 字典选项 */
  options?: {
    guestBusinessOptions?: any[]
    shipOptions?: any[]
    portOptions?: any[]
    isoOptions?: any[]
    operatorDictOptions?: any[]
    goodTypesOptions?: any[]
    categoryWithSubjectTree?: any[]
  }
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
  options: () => ({}),
})

// 判断合同类型
const isTCWithTCT = computed(() => isTCOrTCTContract(props.contractData?.contractType))
const isVCWithFreight = computed(() => isVCOrFreightContract(props.contractData?.contractType))
</script>

<template>
  <van-loading v-if="loading" vertical>
    加载中...
  </van-loading>
  <div v-else class="mb-4">
    <!-- TC/TCT 合同审批信息 -->
    <ContractApprovalInfoTCTCT
      v-if="isTCWithTCT && contractData"
      :contract-data="contractData"
      :options="options"
    />
    <!-- VC/揽货合同审批信息 -->
    <ContractApprovalInfoVCFreight
      v-else-if="isVCWithFreight && contractData"
      :contract-data="contractData"
      :options="options"
    />
    <van-empty v-else description="暂无合同信息" />
  </div>
</template>
