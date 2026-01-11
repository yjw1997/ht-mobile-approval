<script setup lang="ts">
import { getStatusInfo } from '@/utils/localDict'
import type { ApprovalInfo } from '@/composables/useContractApprovalInfo'

interface Props {
  /** 审批信息 */
  approvalInfo: ApprovalInfo
  /** 是否显示打印按钮，默认 false */
  showPrint?: boolean
  /** 状态展示样式：'stamp' 印章样式（完整版），'badge' 徽章样式（简化版） */
  statusStyle?: 'stamp' | 'badge'
  /** 是否显示状态，默认 true */
  showStatus?: boolean
  /** 申请单号标签文本，默认 '申请单号:' */
  applicationNoLabel?: string
}

const props = withDefaults(defineProps<Props>(), {
  showPrint: false,
  statusStyle: 'stamp',
  showStatus: true,
  applicationNoLabel: '申请单号:',
})

const emit = defineEmits<{
  copy: []
  print: []
}>()

// 获取状态信息
const statusInfo = computed(() => getStatusInfo(props.approvalInfo.status))

// 复制申请单号
function handleCopy() {
  navigator.clipboard.writeText(props.approvalInfo.applicationNo)
  emit('copy')
}

// 打印
function handlePrint() {
  emit('print')
}

// 计算星星位置（用于印章样式）
function getStarX(index: number): number {
  const angle = ((index - 1) * 45 - 90) * (Math.PI / 180)
  return 50 + 45 * Math.cos(angle)
}

function getStarY(index: number): number {
  const angle = ((index - 1) * 45 - 90) * (Math.PI / 180)
  return 50 + 45 * Math.sin(angle)
}
</script>

<template>
  <div class="p-4 border-b border-[var(--van-border-color)] bg-white relative">
    <div class="flex gap-4 items-start justify-between">
      <div class="flex-1">
        <h1 class="text-lg text-[var(--van-text-color)] leading-tight font-bold mb-2">
          {{ approvalInfo.initiator }}提交的{{ approvalInfo.documentType }}
        </h1>
        <p class="text-sm text-[var(--van-text-color-2)] mb-2">
          {{ approvalInfo.department }}
        </p>
        <div class="text-sm text-[var(--van-text-color-2)] flex gap-2 items-center overflow-hidden">
          <span class="flex flex-1 gap-1 min-w-0 items-center">
            <span class="whitespace-nowrap">{{ applicationNoLabel }}</span>
            <span class="max-w-[150px] inline-block whitespace-nowrap truncate">{{ approvalInfo.applicationNo }}</span>
          </span>
          <div
            class="i-carbon:copy text-base text-[var(--van-primary-color)] flex-shrink-0 cursor-pointer"
            @click="handleCopy"
          />
          <div
            v-if="showPrint"
            class="i-carbon:printer text-base text-[var(--van-primary-color)] flex-shrink-0 cursor-pointer"
            @click="handlePrint"
          />
        </div>
      </div>
      <div class="flex-shrink-0">
        <div class="text-sm text-[var(--van-text-color-2)] whitespace-nowrap">
          {{ approvalInfo.initiationDate }}
        </div>
      </div>
    </div>
    <!-- 状态标识 -->
    <div v-if="showStatus" class="mt-3">
      <!-- 印章样式（完整版） -->
      <div v-if="statusStyle === 'stamp'" class="status-stamp-container">
        <div class="status-stamp" :class="statusInfo.statusClass" :style="{ '--status-color': statusInfo.color }">
          <svg class="status-stamp-svg" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <!-- 虚线圆形边框 -->
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              :stroke="statusInfo.color"
              stroke-width="2.2"
              stroke-dasharray="5 4"
              stroke-linecap="round"
              opacity="0.95"
            />
            <!-- 星星装饰点 - 8个均匀分布 -->
            <circle
              v-for="i in 8"
              :key="i"
              :cx="getStarX(i)"
              :cy="getStarY(i)"
              r="2.3"
              :fill="statusInfo.color"
              opacity="0.95"
            />
          </svg>
          <div class="status-stamp-banner">
            {{ statusInfo.label }}
          </div>
        </div>
      </div>
      <!-- 徽章样式（简化版） -->
      <div v-else class="flex items-center justify-center">
        <div
          class="text-sm font-medium px-3 py-1 rounded-full"
          :style="{ backgroundColor: `${statusInfo.color}20`, color: statusInfo.color }"
        >
          {{ statusInfo.label }}
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* 状态印章样式（从 BaseForm 中复制） */
.status-stamp-container {
  position: absolute;
  top: 50%;
  right: 16px;
  transform: translateY(-50%);
  pointer-events: none;
  z-index: 1;
}

.status-stamp {
  position: relative;
  width: 100px;
  height: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.status-stamp-svg {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
}

.status-stamp-banner {
  position: relative;
  z-index: 2;
  font-size: 14px;
  font-weight: bold;
  color: var(--status-color);
  text-align: center;
  line-height: 1.2;
  padding: 0 8px;
}
</style>
