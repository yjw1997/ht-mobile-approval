<script setup lang="ts">
import VoyageInfoSheet from '@/components/VoyageInfoSheet.vue'
import ContractInfoSheet from '@/components/ContractInfoSheet.vue'
import type { ContractExternalResp } from '@/types/Contract'

defineOptions({
  name: 'RelatedDocCard',
})

const props = withDefaults(defineProps<Props>(), {
  title: '执行航次',
  emptyText: '暂无关联单据信息',
  voyageTitle: '',
  type: '',
  vesselOptions: () => [],
  portOptions: () => [],
  showSheet: true,
})

interface Props {
  /** 航次数据 */
  voyageData?: any
  /** 合同数据 */
  contractData?: ContractExternalResp | null
  /** 标题文本，默认为"执行航次" */
  title?: string
  /** 显示文本，如果不提供则使用 voyageData 中的 vesselName 和 externalVoyageNo，或 contractData 中的 contractNo */
  displayText?: string
  /** 空数据提示文本 */
  emptyText?: string
  /** 航次信息弹窗标题 */
  voyageTitle?: string
  /** 合同信息弹窗标题 */
  contractTitle?: string
  /** 页面类型：'1' 表示 TC/TCT 页面，'2' 表示 VC 页面 */
  type?: string
  /** 船舶选项（用于显示标签） */
  vesselOptions?: any[]
  /** 港口选项（用于显示标签） */
  portOptions?: any[]
  /** 是否显示弹窗，默认显示 */
  showSheet?: boolean
}

// 显示弹窗状态
const showVoyageSheet = ref(false)
const showContractSheet = ref(false)

// 计算显示文本
const displayContent = computed(() => {
  if (props.displayText)
    return props.displayText

  if (props.voyageData) {
    const vesselName = props.voyageData?.vesselName || '-'
    const voyageNo = props.voyageData?.externalVoyageNo || '-'
    return `${vesselName} - ${voyageNo}`
  }

  if (props.contractData) {
    return props.contractData.contractNo || '-'
  }

  return '-'
})

// 打开弹窗
function handleClick() {
  if (props.showSheet) {
    if (props.voyageData) {
      showVoyageSheet.value = true
    }
    else if (props.contractData) {
      showContractSheet.value = true
    }
  }
}
</script>

<template>
  <div v-if="voyageData || contractData" class="mt-4">
    <div
      class="p-4 rounded-lg bg-[#E8F4FF] cursor-pointer transition-opacity active:opacity-80"
      @click="handleClick"
    >
      <div class="text-sm text-[#666] mb-2">
        {{ title }}
      </div>
      <div class="text-base text-[#1989FA] font-medium">
        {{ displayContent }}
      </div>
    </div>
  </div>
  <van-empty v-else class="mt-4" :description="emptyText" />

  <!-- 航次信息弹窗 -->
  <VoyageInfoSheet
    v-if="showSheet && voyageData"
    v-model:show="showVoyageSheet"
    :voyage-data="voyageData"
    :voyage-title="voyageTitle"
    :type="type"
    :vessel-options="vesselOptions"
    :port-options="portOptions"
  />

  <!-- 合同信息弹窗 -->
  <ContractInfoSheet
    v-if="showSheet && contractData"
    v-model:show="showContractSheet"
    :contract-data="contractData"
    :contract-title="contractTitle"
  />
</template>
