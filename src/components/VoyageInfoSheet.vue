<script setup lang="ts">
import { formatDate, formatDateTime, formatValue } from '@/utils/formatData'
import {
  customerCommissionTypeOptions,
  getLabelByOptions,
  LEASE_TYPE_OPTIONS,
  PAYMENT_CYCLE_TYPE_OPTIONS,
  VESSEL_TYPE_OPTIONS,
  VOYAGE_TYPE_OPTIONS,
} from '@/utils/localDict'

interface Props {
  show: boolean
  voyageData?: any
  voyageContent?: string
  voyageTitle?: string
  // 页面类型：'1' 表示 TC/TCT 页面，'2' 表示 VC 页面
  type?: string
  // 字典选项（可选，用于显示标签，如果未传入则使用默认字典）
  vesselOptions?: any[]
  portOptions?: any[]
}

const props = withDefaults(defineProps<Props>(), {
  voyageData: null,
  voyageContent: '',
  voyageTitle: '航次',
  type: '',
  vesselOptions: () => [],
  portOptions: () => [],
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
  if (props.voyageTitle)
    return props.voyageTitle

  if (props.voyageData) {
    const vesselName = props.voyageData?.vesselName || '-'
    const voyageNo = props.voyageData?.externalVoyageNo || '-'
    return `执行航次：${vesselName} - ${voyageNo}`
  }

  return '执行航次'
})

// 获取字典标签
function getLabel(options: any[], value: any): string {
  if (!options || !value)
    return '-'
  const option = options.find((opt: any) => opt.value === value || opt.code === value)
  return option?.label || option?.cnName || option?.portCnName || value || '-'
}

// 使用默认字典或传入的字典
const leaseTypeOptions = computed(() => LEASE_TYPE_OPTIONS)
const voyageTypeOptions = computed(() => VOYAGE_TYPE_OPTIONS)
const vesselTypeOptions = computed(() => VESSEL_TYPE_OPTIONS)
const customerCommissionTypeOptionsComputed = computed(() => customerCommissionTypeOptions)
const paymentCycleTypeOptions = computed(() => PAYMENT_CYCLE_TYPE_OPTIONS)

// 判断是否为VC页面
const isVCPage = computed(() => props.type === '2')

// 判断是否为TC/TCT页面
const isTCWithTCTPage = computed(() => props.type === '1')
</script>

<template>
  <van-action-sheet
    v-model:show="showSheet"
    :title="title"
    :style="{ height: '65%' }"
  >
    <div class="overflow-y-auto" style="max-height: calc(65vh - 60px);">
      <van-cell-group>
        <!-- 执行航次编号 -->
        <van-cell
          title="执行航次编号"
          :value="formatValue(voyageData?.executeVoyageNo)"
        />

        <!-- 合同号 (TC/TCT) -->
        <van-cell
          v-if="isTCWithTCTPage"
          title="合同号"
          :value="formatValue(voyageData?.contractNo)"
        />

        <!-- 船名 -->
        <van-cell
          title="船名"
          :value="getLabel(vesselOptions, voyageData?.vesselCode) || formatValue(voyageData?.vesselName)"
        />

        <!-- 航次号 -->
        <van-cell
          title="航次号"
          :value="formatValue(voyageData?.externalVoyageNo)"
        />

        <!-- 承运方式 (VC) -->
        <van-cell
          v-if="isVCPage"
          title="承运方式"
          :value="getLabelByOptions(voyageTypeOptions, voyageData?.contractMode) || getLabel(voyageTypeOptions, voyageData?.contractMode)"
        />

        <!-- 船型 (TC/TCT) -->
        <van-cell
          v-if="isTCWithTCTPage"
          title="船型"
          :value="getLabelByOptions(vesselTypeOptions, voyageData?.vesselType) || getLabel(vesselTypeOptions, voyageData?.vesselType)"
        />

        <!-- 租赁方向 -->
        <van-cell
          title="租赁方向"
          :value="getLabelByOptions(leaseTypeOptions, voyageData?.leaseType) || getLabel(leaseTypeOptions, voyageData?.leaseType)"
        />

        <!-- 合同总货量 (VC) -->
        <van-cell
          v-if="isVCPage"
          title="合同总货量"
          :value="formatValue(voyageData?.totalCargoVolume)"
        />

        <!-- 航次开始时间 (VC) -->
        <van-cell
          v-if="isVCPage"
          title="航次开始时间"
          :value="formatDateTime(voyageData?.voyageStartTime)"
        />

        <!-- 航次结束时间 (VC) -->
        <van-cell
          v-if="isVCPage"
          title="航次结束时间"
          :value="formatDateTime(voyageData?.voyageEndTime)"
        />

        <!-- 航行天数 (VC) -->
        <van-cell
          v-if="isVCPage"
          title="航行天数"
          :value="voyageData?.sailingDays !== undefined && voyageData?.sailingDays !== null ? voyageData.sailingDays.toFixed(3) : '-'"
        />

        <!-- 租家佣金(%) (TC/TCT) -->
        <van-cell
          v-if="isTCWithTCTPage"
          title="租家佣金(%)"
          :value="`${getLabelByOptions(customerCommissionTypeOptionsComputed, voyageData?.customerCommissionType) || getLabel(customerCommissionTypeOptionsComputed, voyageData?.customerCommissionType)}${voyageData?.customerCommissionAmt ? ` / ${voyageData.customerCommissionAmt}%` : ''}`"
        />

        <!-- 租金类型 (TC/TCT) -->
        <van-cell
          v-if="isTCWithTCTPage"
          title="租金类型"
          :value="formatValue(voyageData?.rentalType)"
        />

        <!-- 结算周期 (TC/TCT) -->
        <van-cell
          v-if="isTCWithTCTPage"
          title="结算周期"
          :value="`${voyageData?.paymentCycleNumber || '-'} ${getLabelByOptions(paymentCycleTypeOptions, voyageData?.paymentCycleType) || getLabel(paymentCycleTypeOptions, voyageData?.paymentCycleType)}`"
        />

        <!-- 交船时间 (TC/TCT) -->
        <van-cell
          v-if="isTCWithTCTPage"
          title="交船时间"
          :value="formatValue(voyageData?.deliveryTime)"
        />

        <!-- 还船时间 (TC/TCT) -->
        <van-cell
          v-if="isTCWithTCTPage"
          title="还船时间"
          :value="formatValue(voyageData?.returnTime)"
        />

        <!-- 交船地点 (TC/TCT) -->
        <van-cell
          v-if="isTCWithTCTPage"
          title="交船地点"
          :value="getLabel(portOptions, voyageData?.deliveryLocation)"
        />

        <!-- 还船地点 (TC/TCT) -->
        <van-cell
          v-if="isTCWithTCTPage"
          title="还船地点"
          :value="getLabel(portOptions, voyageData?.returnLocation)"
        />

        <!-- 签订日期 (TC/TCT) -->
        <van-cell
          v-if="isTCWithTCTPage"
          title="签订日期"
          :value="formatDate(voyageData?.signDate)"
        />

        <!-- 经办人 (TC/TCT) -->
        <van-cell
          v-if="isTCWithTCTPage"
          title="经办人"
          :value="formatValue(voyageData?.operator)"
        />

        <!-- 备注 (TC/TCT) -->
        <van-cell
          v-if="isTCWithTCTPage"
          title="备注"
          :value="formatValue(voyageData?.contractRemark)"
        />
      </van-cell-group>
    </div>
  </van-action-sheet>
</template>
