<script setup lang="ts">
import { Image, Link2, Share2 } from 'lucide-vue-next'
import { onMounted, ref } from 'vue'
import Button from '@/components/ui/Button.vue'

const props = defineProps<{
  shareCopy?: string
  getImageBlob?: () => Promise<Blob | null>
}>()

const copied = ref<'link' | 'image' | null>(null)
const canShare = ref(false)
onMounted(() => { canShare.value = typeof navigator.share === 'function' })

async function copyLink() {
  await navigator.clipboard.writeText(window.location.href)
  copied.value = 'link'
  setTimeout(() => { copied.value = null }, 1600)
}

function shareOnX() {
  const text = props.shareCopy ?? 'Generador de códigos QR Gratis - sin registro, sin marca de agua.'
  const url = `https://x.com/intent/post?text=${encodeURIComponent(text)}&url=${encodeURIComponent(window.location.href)}`
  window.open(url, '_blank', 'noopener,width=600,height=500')
}

async function copyImage() {
  const blob = await props.getImageBlob?.()
  if (!blob)
    return
  await navigator.clipboard.write([new ClipboardItem({ [blob.type]: blob })])
  copied.value = 'image'
  setTimeout(() => { copied.value = null }, 1600)
}

async function webShare() {
  const blob = await props.getImageBlob?.()
  const data: ShareData = { title: 'Generador de códigos QR', url: window.location.href }
  if (blob) {
    const file = new File([blob], 'codigo-qr.png', { type: 'image/png' })
    if (navigator.canShare?.({ files: [file] }))
      data.files = [file]
  }
  try {
    await navigator.share(data)
  }
  catch { /* usuario canceló */ }
}
</script>

<template>
  <div class="flex flex-wrap items-center gap-2" role="group" aria-label="Compartir">
    <Button variant="outline" size="sm" @click="copyLink">
      <Link2 class="size-3.5" />
      {{ copied === 'link' ? '¡Copiado!' : 'Copiar enlace' }}
    </Button>
    <Button v-if="getImageBlob" variant="outline" size="sm" @click="copyImage">
      <Image class="size-3.5" />
      {{ copied === 'image' ? '¡Copiado!' : 'Copiar imagen' }}
    </Button>
    <Button variant="outline" size="sm" @click="shareOnX">
      <svg class="size-3" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M18.9 1.2h3.7l-8.1 9.3L24 22.8h-7.5l-5.9-7.7-6.7 7.7H.2l8.7-9.9L0 1.2h7.7l5.3 7 6-7Zm-1.3 19.4h2L6.6 3.3H4.4l13.2 17.3Z" /></svg>
      Publicar en X
    </Button>
    <Button v-if="canShare" variant="outline" size="sm" class="w-full sm:w-auto" @click="webShare">
      <Share2 class="size-3.5" />
      Compartir
    </Button>
  </div>
</template>
