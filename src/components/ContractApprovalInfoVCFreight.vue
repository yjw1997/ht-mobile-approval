<script setup lang="ts">
import type { ContractExternalResp } from '@/types/Contract'
import { formatAmount } from '@/utils/formatData'
import type { ContractApprovalInfoOptions } from '@/composables/useContractApprovalInfoContent'
import { useContractApprovalInfoVCFreight } from '@/composables/useContractApprovalInfoContent'
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
  fields,
  freightFields,
  freightInfoList,
  brokerInfoList,
  attachmentList,
  freightInfoColumns,
  brokerInfoColumns,
} = useContractApprovalInfoVCFreight(contractDataRef, props.options)
</script>

<template>
  <div class="mb-4">
    <van-collapse v-model="activeCollapse" :border="false">
      <van-collapse-item name="1" title="基础信息">
        <van-cell-group>
          <van-cell
            v-for="(field, index) in fields"
            :key="index"
            :title="field.label"
            :value="field.value"
          />
        </van-cell-group>
      </van-collapse-item>
      <van-collapse-item name="2" title="运价费用条款">
        <van-cell-group>
          <van-cell
            v-for="(field, index) in freightFields"
            :key="index"
            :title="field.label"
            :value="field.value"
          />
        </van-cell-group>
        <!-- 合同总金额和总货量 -->
        <div class="mt-4 flex gap-3">
          <div class="p-4 rounded-lg bg-[#E8F4FF] flex-1">
            <div class="text-sm text-[#666] mb-2">
              合同总金额
            </div>
            <div class="text-xl text-[#1989FA] font-semibold">
              {{ contractData?.totalAmount ? formatAmount(contractData.totalAmount) : '-' }}
            </div>
          </div>
          <div class="p-4 rounded-lg bg-[#E8F4FF] flex-1">
            <div class="text-sm text-[#666] mb-2">
              合同总货量
            </div>
            <div class="text-xl text-[#1989FA] font-semibold">
              {{ contractData?.totalCargoNumber ? formatAmount(contractData.totalCargoNumber) : '-' }}
            </div>
          </div>
        </div>
        <!-- 运价表格 -->
        <div class="mt-4">
          <DataTable
            :columns="freightInfoColumns"
            :data="freightInfoList"
            empty-text="暂无运价信息"
          />
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
      <van-collapse-item name="4" title="附件">
        <AttachmentList :attachment-list="attachmentList" />
      </van-collapse-item>
    </van-collapse>
  </div>
</template>
