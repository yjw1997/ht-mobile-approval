<script setup lang="ts">
import type { ContractExternalResp } from '@/types/Contract'
import type { ContractApprovalInfoOptions } from '@/composables/useContractApprovalInfoContent'
import { useContractApprovalInfoTCTCT } from '@/composables/useContractApprovalInfoContent'
import DataTable from '@/components/DataTable.vue'
import AttachmentList from '@/components/AttachmentList.vue'

interface Props {
  contractData: ContractExternalResp
  options?: ContractApprovalInfoOptions
}

const props = withDefaults(defineProps<Props>(), {
  options: () => ({}),
})

const contractDataRef = computed(() => props.contractData)
const {
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
} = useContractApprovalInfoTCTCT(contractDataRef, props.options)
</script>

<template>
  <div class="mb-4">
    <van-collapse v-model="activeCollapse" :border="false">
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
      <van-collapse-item name="2" title="租金方案">
        <van-cell-group v-if="rentalSchemeFields.length > 0">
          <van-cell
            v-for="(field, index) in rentalSchemeFields"
            :key="index"
            :title="field.label"
            :value="field.value"
          />
        </van-cell-group>
        <van-empty v-else description="暂无数据" />
        <!-- 航向信息 -->
        <div v-if="routeInfoList.length > 0" class="mt-4">
          <van-tabs v-model:active="activeRouteTab" class="route-tabs">
            <van-tab
              v-for="(routeItem, routeIndex) in routeInfoList"
              :key="routeIndex"
              :name="routeIndex"
            >
              <template #title>
                <div class="route-tab-title">
                  <span class="text-lg font-bold">航向{{ routeIndex + 1 }}</span>
                  <span
                    v-if="isRouteChecked(routeIndex)"
                    class="route-checked-badge"
                  >
                    已核
                  </span>
                </div>
              </template>
              <div class="mt-4">
                <div class="flex items-center justify-between">
                  <div class="text-base text-[#1989FA] font-semibold mb-2">
                    航向名：{{ routeItem.vesselRouteName }}
                  </div>
                  <div v-if="routeItem.remark" class="text-sm text-[#666] mb-2">
                    备注：{{ routeItem.remark }}
                  </div>
                </div>
                <DataTable
                  v-if="routeItem.contractExternalRouteInfoDTOS && routeItem.contractExternalRouteInfoDTOS.length > 0"
                  :columns="routeInfoColumns"
                  :data="routeItem.contractExternalRouteInfoDTOS"
                  empty-text="该航向暂无详细信息"
                />
                <van-empty v-else class="mt-2" description="该航向暂无详细信息" />
              </div>
            </van-tab>
          </van-tabs>
        </div>
      </van-collapse-item>
      <van-collapse-item name="3" title="合同经纪信息">
        <div class="mt-4">
          <DataTable
            :columns="brokerInfoColumns"
            :data="brokerInfoList"
            empty-text="暂无合同经纪信息"
          />
        </div>
      </van-collapse-item>
      <van-collapse-item name="4" title="租家支付费用">
        <div class="mt-4">
          <DataTable
            :columns="paymentInfoColumns"
            :data="paymentInfoList"
            empty-text="暂无租家支付费用信息"
          />
        </div>
      </van-collapse-item>
      <van-collapse-item name="5" title="附件">
        <AttachmentList :attachment-list="attachmentList" />
      </van-collapse-item>
    </van-collapse>
  </div>
</template>

<style scoped>
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

.route-tab-title {
  padding: 0 50px;
  position: relative;
}

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
