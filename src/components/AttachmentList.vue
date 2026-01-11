<script setup lang="ts">
import type { AttachmentFile } from '@/composables/useAttachment'
import { getFileIcon, handleAttachmentClick } from '@/composables/useAttachment'

defineOptions({
  name: 'AttachmentList',
})
withDefaults(defineProps<Props>(), {
  emptyText: '暂无附件',
})
interface Props {
  attachmentList: AttachmentFile[]
  emptyText?: string
}
</script>

<template>
  <div v-if="attachmentList.length > 0" class="mt-4">
    <div class="text-sm text-[#666] mb-3 text-center">
      共计 {{ attachmentList.length }} 个附件
    </div>
    <van-cell-group>
      <van-cell
        v-for="(file, index) in attachmentList"
        :key="index"
        :title="file.fileName || '-'"
        is-link
        @click="handleAttachmentClick(file)"
      >
        <template #icon>
          <div :class="getFileIcon(file.fileName || '')" class="text-xl mr-2" />
        </template>
      </van-cell>
    </van-cell-group>
  </div>
  <van-empty v-else class="mt-4" :description="emptyText" />
</template>
