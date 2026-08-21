<script setup lang="ts">
import { cn } from '@/utils/cn'
import { Check } from 'lucide-vue-next'
import { CheckboxIndicator, CheckboxRoot } from 'reka-ui'
import type { HTMLAttributes } from 'vue'

const props = defineProps<{ class?: HTMLAttributes['class'], id?: string, disabled?: boolean }>()
const checked = defineModel<boolean>({ default: false })

function onCheckedChange(value: boolean | 'indeterminate') {
  checked.value = value === true
}
</script>

<template>
  <CheckboxRoot
    :id="props.id"
    :checked="checked"
    :disabled="props.disabled"
    :class="cn(
      'peer size-5 shrink-0 rounded-md border border-border bg-input transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:border-primary data-[state=checked]:bg-primary dark:data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground',
      props.class,
    )"
    @update:checked="onCheckedChange"
  >
    <CheckboxIndicator class="flex size-full items-center justify-center text-current">
      <Check class="size-3.5" stroke-width="3" />
    </CheckboxIndicator>
  </CheckboxRoot>
</template>
