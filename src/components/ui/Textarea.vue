<script setup lang="ts">
import { cn } from '@/utils/cn'
import type { HTMLAttributes } from 'vue'

const props = defineProps<{ class?: HTMLAttributes['class'] }>()
const modelValue = defineModel<string>()
</script>

<template>
  <textarea
    v-model="modelValue"
    :class="cn(
      'flex min-h-20 w-full rounded-lg border border-border bg-input px-3 py-2 text-sm transition-colors placeholder:text-muted-foreground focus-visible:border-ring focus-visible:outline-none disabled:bg-input/50 disabled:cursor-not-allowed disabled:opacity-50',
      props.class,
    )"
  />
</template>
