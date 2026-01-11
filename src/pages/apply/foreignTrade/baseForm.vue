<script setup lang="ts">
import { nextTick, onMounted, onUnmounted, watch } from 'vue'
import { showDialog, showToast } from 'vant'
import { throttle } from 'lodash-es'
import { getStatusInfo, getVerificationStatusInfo } from '@/utils/localDict'

defineOptions({
  name: 'BaseForm',
})

const props = withDefaults(defineProps<Props>(), {
  statusType: 'contract',
  attachments: () => [],
  relatedDocs: () => [],
  approvalProcess: () => [],
})

interface Attachment {
  name: string
  url: string
  type?: string
}

interface RelatedDoc {
  id: string
  title: string
  content?: string
  [key: string]: any
}

interface ApprovalStep {
  title: string
  status: 'completed' | 'active' | 'pending'
  user?: string
  time?: string
  [key: string]: any
}

interface Props {
  // 头部基础信息
  initiator: string // 发起人
  documentType: string // 单据类型
  initiationDate: string // 发起审批单日期时间
  department: string // 部门
  applicationNo: string // 申请单号
  status: number | string // 审批状态（支持数字或字符串）
  statusType?: 'contract' | 'verification' // 状态类型：contract-合同状态，verification-核销/付款单状态
  // 附件列表
  attachments?: Attachment[]
  // 关联单据列表
  relatedDocs?: RelatedDoc[]
  // 审批流程
  approvalProcess?: ApprovalStep[]
}

const { t } = useI18n()

// Tab相关
const activeTab = ref(0)
const approvalInfoRef = ref<HTMLElement | null>(null)
const approvalProcessRef = ref<HTMLElement | null>(null)
const relatedDocsRef = ref<HTMLElement | null>(null)

// 锚点映射
const anchorMap = {
  0: 'approval-info',
  1: 'related-docs',
  2: 'approval-process',
}

// 标记是否是滚动触发的 tab 更新（用于区分点击和滚动）
const isScrollTriggered = ref(false)

// 监听 tab 切换，跳转到对应锚点
watch(activeTab, (newTab) => {
  // 如果是滚动触发的更新，不执行跳转
  if (isScrollTriggered.value) {
    isScrollTriggered.value = false
    return
  }

  // 用户点击 tab，执行跳转
  nextTick(() => {
    const anchorId = anchorMap[newTab as keyof typeof anchorMap]
    if (anchorId) {
      const element = document.getElementById(anchorId)
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    }
  })
})

// 获取状态信息：使用 value 判断颜色，label 显示文本
const statusInfo = computed(() => {
  if (props.statusType === 'verification') {
    return getVerificationStatusInfo(props.status)
  }
  return getStatusInfo(props.status)
})

// 计算星星位置（用于 SVG）
function getStarX(index: number): number {
  const angle = ((index - 1) * 45 - 90) * (Math.PI / 180)
  return 50 + 45 * Math.cos(angle)
}

function getStarY(index: number): number {
  const angle = ((index - 1) * 45 - 90) * (Math.PI / 180)
  return 50 + 45 * Math.sin(angle)
}

// 滚动监听，检测当前应该激活的 tab
function updateActiveTabOnScroll() {
  const tabsHeight = 100 // tabs 吸顶高度
  const viewportHeight = window.innerHeight

  const sections = [
    { id: 'approval-info', index: 0 },
    { id: 'related-docs', index: 1 },
    { id: 'approval-process', index: 2 },
  ]

  // 小区域（关联单据和审批流程）的索引
  const smallSections = [1, 2]

  // 检查小区域是否在可视区域内
  let hasSmallSectionInView = false
  for (const smallIndex of smallSections) {
    const section = sections[smallIndex]
    const element = document.getElementById(section.id)
    if (element) {
      const rect = element.getBoundingClientRect()
      // 判断元素是否在可视区域内（至少有一部分可见）
      if (rect.top < viewportHeight && rect.bottom > tabsHeight) {
        hasSmallSectionInView = true
        break
      }
    }
  }

  // 如果小区域在可视区域内，保持当前 tab 不变
  if (hasSmallSectionInView) {
    // 检查当前 tab 是否对应小区域
    if (smallSections.includes(activeTab.value)) {
      return // 保持当前 tab
    }
    // 如果当前 tab 不是小区域，检查是否应该切换到小区域
    for (const smallIndex of smallSections) {
      const section = sections[smallIndex]
      const element = document.getElementById(section.id)
      if (element) {
        const rect = element.getBoundingClientRect()
        // 如果小区域在可视区域内，切换到它
        if (rect.top < viewportHeight && rect.bottom > tabsHeight) {
          // 选择最接近 tabs 下方的小区域
          const distance = Math.abs(rect.top - tabsHeight)
          const currentElement = document.getElementById(anchorMap[activeTab.value])
          if (currentElement) {
            const currentRect = currentElement.getBoundingClientRect()
            const currentDistance = Math.abs(currentRect.top - tabsHeight)
            // 如果小区域更接近，切换到它
            if (distance < currentDistance) {
              isScrollTriggered.value = true
              activeTab.value = smallIndex
              return
            }
          }
        }
      }
    }
    return // 小区域在可视区域内，不切换
  }

  // 小区域不在可视区域内，正常检测应该激活的 tab
  let activeIndex = 0
  let minDistance = Infinity

  sections.forEach((section) => {
    const element = document.getElementById(section.id)
    if (element) {
      const rect = element.getBoundingClientRect()
      const distance = rect.top - tabsHeight

      // 如果区域顶部已经滚动到 tabs 下方或接近，选择距离最小的
      if (distance <= 50 && distance >= -50) {
        if (Math.abs(distance) < Math.abs(minDistance)) {
          minDistance = distance
          activeIndex = section.index
        }
      }
      // 如果区域在视口中，且还没有找到合适的，选择它
      else if (minDistance === Infinity && rect.top <= viewportHeight && rect.bottom >= 0) {
        activeIndex = section.index
        minDistance = distance
      }
    }
  })

  // 只有当计算出的索引与当前不同时才更新
  if (minDistance !== Infinity && activeIndex !== activeTab.value) {
    isScrollTriggered.value = true
    activeTab.value = activeIndex
  }
}

// 节流滚动处理
const throttledScrollHandler = throttle(updateActiveTabOnScroll, 150)

onMounted(() => {
  window.addEventListener('scroll', throttledScrollHandler, { passive: true })
  // 初始化时也更新一次
  nextTick(() => {
    updateActiveTabOnScroll()
  })
})

onUnmounted(() => {
  window.removeEventListener('scroll', throttledScrollHandler)
})

// 复制申请单号
function copyApplicationNo() {
  navigator.clipboard.writeText(props.applicationNo)
  showToast(t('baseForm.copySuccess'))
}

// 打印功能
function handlePrint() {
  window.print()
}

// 处理关联单据点击 - 弹出详情弹框
function _handleRelatedDocClick(doc: RelatedDoc) {
  showDialog({
    title: doc.title,
    message: doc.content || '详情内容仅做样式参考！',
    showCancelButton: false,
    confirmButtonText: t('baseForm.close'),
    className: 'related-doc-dialog',
  })
}
</script>

<template>
  <div class="bg-[var(--van-background-color)] min-h-screen">
    <!-- 顶部信息 -->
    <div class="p-4 border-b border-[var(--van-border-color)] bg-white relative">
      <div class="flex gap-4 items-start justify-between">
        <div class="flex-1">
          <h1 class="text-lg text-[var(--van-text-color)] leading-tight font-bold mb-2">
            {{ initiator }}提交的{{ documentType }}
          </h1>
          <p class="text-sm text-[var(--van-text-color-2)] mb-2">
            {{ department }}
          </p>
          <div class="text-sm text-[var(--van-text-color-2)] flex gap-2 items-center overflow-hidden">
            <span class="flex flex-1 gap-1 min-w-0 items-center">
              <span class="whitespace-nowrap">{{ t('baseForm.applicationNo') }}: </span>
              <span class="max-w-[150px] inline-block whitespace-nowrap truncate">{{ applicationNo }}</span>
            </span>
            <div
              class="i-carbon:copy text-base text-[var(--van-primary-color)] flex-shrink-0 cursor-pointer"
              @click="copyApplicationNo"
            />
            <div
              class="i-carbon:printer text-base text-[var(--van-primary-color)] flex-shrink-0 cursor-pointer"
              @click="handlePrint"
            />
          </div>
        </div>
        <div class="flex-shrink-0">
          <div class="text-sm text-[var(--van-text-color-2)] whitespace-nowrap">
            {{ initiationDate }}
          </div>
        </div>
      </div>
      <!-- 状态标识 - 印章样式 -->
      <div class="status-stamp-container">
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
    </div>

    <!-- Tab导航栏 - 使用CSS实现吸顶，只作为导航按钮 -->
    <div class="sticky-tabs-wrapper">
      <van-tabs
        v-model:active="activeTab"
      >
        <van-tab :title="t('baseForm.approvalInfo')" />
        <van-tab :title="t('baseForm.relatedDocs')" />
        <van-tab :title="t('baseForm.approvalProcess')" />
      </van-tabs>
    </div>

    <!-- 所有内容在一个页面中连续展示 -->
    <div class="content-container">
      <!-- 审批信息 -->
      <div
        id="approval-info"
        ref="approvalInfoRef"
        class="content-section"
      >
        <div class="p-2">
          <!-- 审批信息内容由外部传入 -->
          <slot name="approvalInfo">
            <div class="text-sm text-[var(--van-text-color-2)] py-8 text-center">
              审批信息
            </div>
          </slot>
        </div>
      </div>
      <!-- 关联单据 -->
      <div
        id="related-docs"
        ref="relatedDocsRef"
        class="content-section"
      >
        <div class="p-2">
          <slot name="relatedDocs">
            <div class="text-sm text-[var(--van-text-color-2)] py-8 text-center">
              关联单据
            </div>
          </slot>
        </div>
      </div>
      <!-- 审批流程 -->
      <div
        id="approval-process"
        ref="approvalProcessRef"
        class="content-section"
      >
        <slot name="approvalProcess" />
      </div>
    </div>
  </div>
</template>

<style scoped>
/* 只保留必要的深度选择器样式 */
:deep(.van-steps) {
  padding: 16px 0;
}

/* 折叠面板标题样式 */
:deep(.van-collapse-item__title) {
  position: relative;
  padding-left: 12px;
  color: #333;
  font-size: 14px;
  background-color: #fff;
  border-radius: 8px 8px 0 0;
}

:deep(.van-collapse-item__title)::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 4px;
  background-color: #1989fa;
  border-radius: 2px 0 0 2px;
}

:deep(.van-collapse-item__title)::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 1px;
  background-color: #e8f4ff;
}

/* Tab导航栏吸顶样式 - 使用CSS实现 */
.sticky-tabs-wrapper {
  position: sticky;
  top: 46px; /* NavBar高度，可以根据实际调整 */
  z-index: 99;
  background-color: var(--van-background-color);
  border-bottom: 1px solid var(--van-border-color);
}

/* 内容区域样式 */
.content-container {
  width: 100%;
}

.content-section {
  scroll-margin-top: 100px; /* 用于定位时的偏移 */
  min-height: 200px; /* 确保每个区域有足够的高度 */
}

/* 状态印章样式 - 精致版本 */
.status-stamp-container {
  position: absolute;
  right: 20px;
  bottom: 20px;
  z-index: 999;
}

.status-stamp {
  position: relative;
  width: 50px;
  height: 50px;
  filter: drop-shadow(0 3px 10px rgba(0, 0, 0, 0.15));
}

.status-stamp-svg {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  background: rgba(255, 255, 255, 0.98);
  border-radius: 50%;
  box-shadow:
    inset 0 0 0 1px rgba(255, 255, 255, 0.9),
    0 2px 10px rgba(0, 0, 0, 0.1);
}

.status-stamp-banner {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) rotate(-45deg);
  background: var(--status-color);
  color: white;
  font-size: 9px;
  font-weight: 500;
  padding: 2px 6px;
  white-space: nowrap;
  border-radius: 2px;
  box-shadow:
    0 3px 8px rgba(0, 0, 0, 0.35),
    inset 0 1px 1px rgba(255, 255, 255, 0.3),
    inset 0 -1px 1px rgba(0, 0, 0, 0.1);
  z-index: 2;
  letter-spacing: 1px;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
  line-height: 1.4;
  min-width: 58px;
  text-align: center;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

/* 打印样式 */
@media print {
  .sticky-tabs-wrapper {
    display: none;
  }

  .status-stamp-container {
    position: absolute;
    right: 20px;
    top: 20px;
  }

  /* 确保打印时内容完整显示 */
  .content-section {
    page-break-inside: avoid;
  }
}
</style>
