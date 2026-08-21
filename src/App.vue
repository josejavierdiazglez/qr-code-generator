<script setup lang="ts">
import { RotateCcw } from 'lucide-vue-next'
import { ref } from 'vue'
import QrTool from '@/components/QrTool.vue'
import Button from '@/components/ui/Button.vue'

const qrTool = ref<{ reset: () => void } | null>(null)

function onReset() {
  qrTool.value?.reset()
}
</script>

<template>
  <div class="min-h-svh bg-background text-foreground">
    <main class="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <header class="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div class="max-w-2xl space-y-2">
          <h1 class="font-heading text-3xl tracking-tight sm:text-4xl">
            Generador de códigos QR Gratis
          </h1>
          <p class="text-sm leading-relaxed text-muted-foreground sm:text-base">
            Sin registro, sin marca de agua, sin caducidad.
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          class="shrink-0 self-start"
          type="button"
          @click="onReset"
        >
          <RotateCcw class="size-3.5" />
          Restablecer
        </Button>
      </header>

      <QrTool ref="qrTool" />
    </main>
  </div>
</template>
