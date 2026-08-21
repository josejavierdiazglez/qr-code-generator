<script setup lang="ts">
import {
  Circle,
  CircleDot,
  Diamond,
  GripHorizontal,
  GripVertical,
  Leaf,
  Sparkles,
  Square,
  SquareRoundCorner,
  Upload,
  Waves,
  X,
} from 'lucide-vue-next'
import { computed, ref, type Component } from 'vue'
import { useQr } from '@/composables/useQr'
import ShareBar from '@/components/ShareBar.vue'
import Button from '@/components/ui/Button.vue'
import Checkbox from '@/components/ui/Checkbox.vue'
import ColorPicker from '@/components/ui/ColorPicker.vue'
import Input from '@/components/ui/Input.vue'
import Label from '@/components/ui/Label.vue'
import Select from '@/components/ui/Select.vue'
import SelectContent from '@/components/ui/SelectContent.vue'
import SelectItem from '@/components/ui/SelectItem.vue'
import SelectTrigger from '@/components/ui/SelectTrigger.vue'
import Slider from '@/components/ui/Slider.vue'
import Tabs from '@/components/ui/Tabs.vue'
import TabsContent from '@/components/ui/TabsContent.vue'
import TabsList from '@/components/ui/TabsList.vue'
import TabsTrigger from '@/components/ui/TabsTrigger.vue'
import Textarea from '@/components/ui/Textarea.vue'

const { state, logoHref, matrix, svg, error, toPngBlob, reset } = useQr()

defineExpose({ reset })

const tabs = [
  { id: 'url', label: 'URL' },
  { id: 'text', label: 'Texto' },
  { id: 'wifi', label: 'WiFi' },
  { id: 'email', label: 'Email' },
  { id: 'phone', label: 'Teléfono' },
  { id: 'sms', label: 'SMS' },
  { id: 'vcard', label: 'vCard' },
]

const sizes = ['512', '1024', '2048', '4096']
const ecLevels = [
  { id: 'L', label: 'L · 7% de recuperación' },
  { id: 'M', label: 'M · 15% de recuperación' },
  { id: 'Q', label: 'Q · 25% de recuperación' },
  { id: 'H', label: 'H · 30% de recuperación' },
]
const dotStyles: { id: string, label: string, icon: Component }[] = [
  { id: 'square', label: 'Cuadrado', icon: Square },
  { id: 'rounded', label: 'Redondeado', icon: SquareRoundCorner },
  { id: 'dots', label: 'Puntos', icon: CircleDot },
  { id: 'fluid', label: 'Fluido', icon: Waves },
  { id: 'classy', label: 'Elegante', icon: Sparkles },
  { id: 'diamond', label: 'Diamante', icon: Diamond },
  { id: 'vertical', label: 'Barras verticales', icon: GripVertical },
  { id: 'horizontal', label: 'Barras horizontales', icon: GripHorizontal },
]
const eyeFrameStyles: { id: string, label: string, icon?: Component }[] = [
  { id: 'auto', label: 'Igual al patrón' },
  { id: 'square', label: 'Cuadrado', icon: Square },
  { id: 'rounded', label: 'Redondeado', icon: SquareRoundCorner },
  { id: 'circle', label: 'Círculo', icon: Circle },
  { id: 'leaf', label: 'Hoja', icon: Leaf },
]
const eyeBallStyles: { id: string, label: string, icon?: Component }[] = [
  { id: 'auto', label: 'Igual al patrón' },
  { id: 'square', label: 'Cuadrado', icon: Square },
  { id: 'rounded', label: 'Redondeado', icon: SquareRoundCorner },
  { id: 'circle', label: 'Círculo', icon: Circle },
  { id: 'leaf', label: 'Hoja', icon: Leaf },
  { id: 'diamond', label: 'Diamante', icon: Diamond },
]
const securityOptions = [
  { id: 'WPA', label: 'WPA / WPA2 / WPA3' },
  { id: 'WEP', label: 'WEP' },
  { id: 'nopass', label: 'Abierta (sin contraseña)' },
]
const gradientTypes = [
  { id: 'linear', label: 'Lineal' },
  { id: 'radial', label: 'Radial' },
]

const pxModel = computed({
  get: () => String(state.px),
  set: (value: string) => { state.px = Number(value) },
})

const customEyeColors = computed({
  get: () => state.eyeColor !== '' || state.ballColor !== '',
  set: (enabled: boolean) => {
    state.eyeColor = enabled ? state.fg : ''
    state.ballColor = enabled ? state.fg : ''
  },
})

const selectedDotStyle = computed(() =>
  dotStyles.find(style => style.id === state.dots) ?? dotStyles[0],
)

const selectedEyeFrameStyle = computed(() =>
  eyeFrameStyles.find(style => style.id === state.eyeF) ?? eyeFrameStyles[0],
)

const selectedEyeBallStyle = computed(() =>
  eyeBallStyles.find(style => style.id === state.eyeB) ?? eyeBallStyles[0],
)

const announcement = ref('')

function download(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

async function downloadPng() {
  const blob = await toPngBlob()
  if (!blob)
    return
  download(blob, 'codigo-qr.png')
  announcement.value = 'PNG descargado'
}

function downloadSvg() {
  if (!svg.value)
    return
  download(new Blob([svg.value], { type: 'image/svg+xml' }), 'codigo-qr.svg')
  announcement.value = 'SVG descargado'
}

const logoInput = ref<HTMLInputElement>()
function onLogoUpload(event: Event) {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (!file)
    return
  const reader = new FileReader()
  reader.onload = () => { logoHref.value = String(reader.result) }
  reader.readAsDataURL(file)
}

const sectionClass = 'space-y-4 rounded-2xl border border-border p-5'
const sectionTitleClass = 'text-sm font-semibold'
</script>

<template>
  <div class="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(320px,400px)]">
    <div class="space-y-5">
      <Tabs v-model="state.tab">
        <TabsList aria-label="Tipo de código QR">
          <TabsTrigger v-for="tab in tabs" :key="tab.id" :value="tab.id">
            {{ tab.label }}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="url" class="space-y-4">
          <div>
            <Label for="qr-url">URL del sitio web</Label>
            <Input id="qr-url" v-model="state.url" type="url" placeholder="https://ejemplo.com" autocomplete="off" />
          </div>
        </TabsContent>

        <TabsContent value="text">
          <Label for="qr-text">Texto</Label>
          <Textarea id="qr-text" v-model="state.text" class="h-28" placeholder="Cualquier texto…" />
        </TabsContent>

        <TabsContent value="wifi" class="space-y-4">
          <div>
            <Label for="qr-ssid">Nombre de la red (SSID)</Label>
            <Input id="qr-ssid" v-model="state.ssid" autocomplete="off" />
          </div>
          <div>
            <Label for="qr-password">Contraseña</Label>
            <Input id="qr-password" v-model="state.password" autocomplete="off" />
            <p class="mt-1 text-xs text-muted-foreground">
              Las contraseñas no salen de tu navegador y nunca se incluyen en los enlaces para compartir.
            </p>
          </div>
          <div class="flex items-end gap-4">
            <div class="flex-1">
              <Label for="qr-security">Seguridad</Label>
              <Select v-model="state.security">
                <SelectTrigger id="qr-security" />
                <SelectContent>
                  <SelectItem v-for="option in securityOptions" :key="option.id" :value="option.id">
                    {{ option.label }}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div class="flex h-10 items-center gap-2">
              <Checkbox id="qr-hidden" v-model="state.hidden" />
              <Label for="qr-hidden" class="mb-0 text-sm text-foreground">Red oculta</Label>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="email" class="space-y-4">
          <div>
            <Label for="qr-to">Dirección de email</Label>
            <Input id="qr-to" v-model="state.to" type="email" placeholder="hola@ejemplo.com" autocomplete="off" />
          </div>
          <div>
            <Label for="qr-subject">Asunto <span class="font-normal text-muted-foreground">(opcional)</span></Label>
            <Input id="qr-subject" v-model="state.subject" autocomplete="off" />
          </div>
          <div>
            <Label for="qr-body">Cuerpo <span class="font-normal text-muted-foreground">(opcional)</span></Label>
            <Textarea id="qr-body" v-model="state.body" class="h-20" />
          </div>
        </TabsContent>

        <TabsContent value="phone">
          <Label for="qr-phone">Número de teléfono</Label>
          <Input id="qr-phone" v-model="state.phone" type="tel" placeholder="+34 600 123 456" autocomplete="off" />
        </TabsContent>

        <TabsContent value="sms" class="space-y-4">
          <div>
            <Label for="qr-sms-phone">Número de teléfono</Label>
            <Input id="qr-sms-phone" v-model="state.phone" type="tel" placeholder="+34 600 123 456" autocomplete="off" />
          </div>
          <div>
            <Label for="qr-message">Mensaje <span class="font-normal text-muted-foreground">(opcional)</span></Label>
            <Textarea id="qr-message" v-model="state.message" class="h-20" />
          </div>
        </TabsContent>

        <TabsContent value="vcard" class="space-y-4">
          <div class="grid grid-cols-2 gap-4">
            <div>
              <Label for="qr-first">Nombre</Label>
              <Input id="qr-first" v-model="state.firstName" autocomplete="off" />
            </div>
            <div>
              <Label for="qr-last">Apellidos</Label>
              <Input id="qr-last" v-model="state.lastName" autocomplete="off" />
            </div>
            <div>
              <Label for="qr-org">Organización</Label>
              <Input id="qr-org" v-model="state.organization" autocomplete="off" />
            </div>
            <div>
              <Label for="qr-title">Cargo</Label>
              <Input id="qr-title" v-model="state.title" autocomplete="off" />
            </div>
            <div>
              <Label for="qr-vphone">Teléfono</Label>
              <Input id="qr-vphone" v-model="state.vPhone" type="tel" autocomplete="off" />
            </div>
            <div>
              <Label for="qr-vemail">Email</Label>
              <Input id="qr-vemail" v-model="state.vEmail" type="email" autocomplete="off" />
            </div>
          </div>
          <div>
            <Label for="qr-vurl">Sitio web</Label>
            <Input id="qr-vurl" v-model="state.vUrl" type="url" autocomplete="off" />
          </div>
        </TabsContent>
      </Tabs>

      <section :class="sectionClass" aria-label="Patrón y estilo de ojos">
        <h2 :class="sectionTitleClass">
          Patrón y ojos
        </h2>
        <div class="grid grid-cols-2 gap-4 sm:grid-cols-3">
          <div>
            <Label for="qr-dots">Patrón de módulo</Label>
            <Select v-model="state.dots">
              <SelectTrigger id="qr-dots">
                <span class="flex min-w-0 flex-1 items-center gap-2">
                  <component :is="selectedDotStyle.icon" class="size-4 shrink-0" aria-hidden="true" />
                  <span class="truncate">{{ selectedDotStyle.label }}</span>
                </span>
              </SelectTrigger>
              <SelectContent>
                <SelectItem v-for="style in dotStyles" :key="style.id" :value="style.id">
                  <span class="flex items-center gap-2">
                    <component :is="style.icon" class="size-4 shrink-0 opacity-80" aria-hidden="true" />
                    {{ style.label }}
                  </span>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label for="qr-eyef">Marco de ojo</Label>
            <Select v-model="state.eyeF">
              <SelectTrigger id="qr-eyef">
                <span class="flex min-w-0 flex-1 items-center gap-2">
                  <component
                    v-if="selectedEyeFrameStyle.icon"
                    :is="selectedEyeFrameStyle.icon"
                    class="size-4 shrink-0"
                    aria-hidden="true"
                  />
                  <span class="truncate">{{ selectedEyeFrameStyle.label }}</span>
                </span>
              </SelectTrigger>
              <SelectContent>
                <SelectItem v-for="style in eyeFrameStyles" :key="style.id" :value="style.id">
                  <span class="flex items-center gap-2">
                    <component
                      v-if="style.icon"
                      :is="style.icon"
                      class="size-4 shrink-0 opacity-80"
                      aria-hidden="true"
                    />
                    {{ style.label }}
                  </span>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label for="qr-eyeb">Pupila</Label>
            <Select v-model="state.eyeB">
              <SelectTrigger id="qr-eyeb">
                <span class="flex min-w-0 flex-1 items-center gap-2">
                  <component
                    v-if="selectedEyeBallStyle.icon"
                    :is="selectedEyeBallStyle.icon"
                    class="size-4 shrink-0"
                    aria-hidden="true"
                  />
                  <span class="truncate">{{ selectedEyeBallStyle.label }}</span>
                </span>
              </SelectTrigger>
              <SelectContent>
                <SelectItem v-for="style in eyeBallStyles" :key="style.id" :value="style.id">
                  <span class="flex items-center gap-2">
                    <component
                      v-if="style.icon"
                      :is="style.icon"
                      class="size-4 shrink-0 opacity-80"
                      aria-hidden="true"
                    />
                    {{ style.label }}
                  </span>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div class="flex items-center gap-2">
          <Checkbox id="qr-eyecolors" v-model="customEyeColors" />
          <Label for="qr-eyecolors" class="mb-0 text-sm text-foreground">Colores de ojos personalizados</Label>
        </div>
        <p class="text-xs text-muted-foreground">
          Las combinaciones de «Igual al patrón» están verificadas con un decodificador estricto. Otras mezclas de marco/pupila suelen escanearse en la mayoría de móviles - pero prueba siempre un código estilizado antes de imprimirlo.
        </p>
        <div v-if="customEyeColors" class="grid grid-cols-2 gap-4">
          <div>
            <Label>Color del marco</Label>
            <ColorPicker v-model="state.eyeColor" label="Color del marco de ojo" />
          </div>
          <div>
            <Label>Color de la pupila</Label>
            <ColorPicker v-model="state.ballColor" label="Color de la pupila" />
          </div>
        </div>
      </section>

      <section :class="sectionClass" aria-label="Colores">
        <h2 :class="sectionTitleClass">
          Colores
        </h2>
        <div class="grid grid-cols-2 gap-4">
          <div>
            <Label>{{ state.grad ? 'Inicio del degradado' : 'Primer plano' }}</Label>
            <ColorPicker v-model="state.fg" :label="state.grad ? 'Color de inicio del degradado' : 'Color de primer plano'" />
          </div>
          <div v-if="state.grad">
            <Label>Fin del degradado</Label>
            <ColorPicker v-model="state.fg2" label="Color de fin del degradado" />
          </div>
          <div v-if="!state.transparent">
            <Label>Fondo</Label>
            <ColorPicker v-model="state.bg" label="Color de fondo" />
          </div>
        </div>
        <div class="flex flex-wrap items-center gap-x-6 gap-y-2">
          <div class="flex items-center gap-2">
            <Checkbox id="qr-grad" v-model="state.grad" />
            <Label for="qr-grad" class="mb-0 text-sm text-foreground">Degradado de primer plano</Label>
          </div>
          <div class="flex items-center gap-2">
            <Checkbox id="qr-transparent" v-model="state.transparent" />
            <Label for="qr-transparent" class="mb-0 text-sm text-foreground">Fondo transparente</Label>
          </div>
        </div>
        <template v-if="state.grad">
          <div class="grid grid-cols-2 gap-4">
            <div>
              <Label for="qr-gradtype">Tipo de degradado</Label>
              <Select v-model="state.gradType">
                <SelectTrigger id="qr-gradtype" />
                <SelectContent>
                  <SelectItem v-for="type in gradientTypes" :key="type.id" :value="type.id">
                    {{ type.label }}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div v-if="state.gradType === 'linear'">
              <Label for="qr-gradangle">Ángulo: {{ state.gradAngle }}°</Label>
              <Slider
                id="qr-gradangle"
                :model-value="[state.gradAngle]"
                :min="0"
                :max="360"
                :step="5"
                aria-label="Ángulo del degradado en grados"
                @update:model-value="value => state.gradAngle = value?.[0] ?? 45"
              />
            </div>
          </div>
        </template>
        <p class="text-xs text-muted-foreground">
          Mantén un contraste fuerte entre primer plano y fondo - los códigos con poco contraste se escanean mal.
        </p>
      </section>

      <section :class="sectionClass" aria-label="Opciones de salida">
        <h2 :class="sectionTitleClass">
          Salida
        </h2>
        <div class="grid grid-cols-2 gap-4 sm:grid-cols-3">
          <div>
            <Label for="qr-ec">Corrección de errores (mínimo)</Label>
            <Select v-model="state.ec" :disabled="!!logoHref">
              <SelectTrigger id="qr-ec" />
              <SelectContent>
                <SelectItem v-for="level in ecLevels" :key="level.id" :value="level.id">
                  {{ level.label }}
                </SelectItem>
              </SelectContent>
            </Select>
            <p v-if="logoHref" class="mt-1 text-xs text-muted-foreground">
              Bloqueado en H mientras hay un logo incrustado.
            </p>
          </div>
          <div>
            <Label for="qr-margin">Margen: {{ state.margin }} módulos</Label>
            <Slider
              id="qr-margin"
              :model-value="[state.margin]"
              :min="0"
              :max="12"
              :step="1"
              aria-label="Margen de zona silenciosa en módulos"
              @update:model-value="value => state.margin = value?.[0] ?? 4"
            />
          </div>
          <div>
            <Label for="qr-px">Tamaño de descarga</Label>
            <Select v-model="pxModel">
              <SelectTrigger id="qr-px" />
              <SelectContent>
                <SelectItem v-for="size in sizes" :key="size" :value="size">
                  {{ size }} × {{ size }} px
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </section>

      <section :class="sectionClass" aria-label="Logo central">
        <h2 :class="sectionTitleClass">
          Logo <span class="font-normal text-xs text-muted-foreground">(aumenta la corrección de errores a H)</span>
        </h2>
        <div class="flex items-center gap-3">
          <input id="qr-logo" ref="logoInput" type="file" accept="image/*" class="sr-only" aria-label="Subir una imagen de logo central" @change="onLogoUpload">
          <Button variant="outline" size="sm" @click="logoInput?.click()">
            <Upload class="size-3.5" />
            {{ logoHref ? 'Reemplazar logo' : 'Subir logo' }}
          </Button>
          <Button v-if="logoHref" variant="ghost" size="sm" @click="logoHref = ''">
            <X class="size-3.5" />
            Quitar
          </Button>
        </div>
        <div v-if="logoHref" class="max-w-xs">
          <Label for="qr-logosize">Tamaño del logo: {{ state.logoSize }}%</Label>
          <Slider
            id="qr-logosize"
            :model-value="[state.logoSize]"
            :min="12"
            :max="30"
            :step="1"
            aria-label="Tamaño del logo como porcentaje del código"
            @update:model-value="value => state.logoSize = value?.[0] ?? 22"
          />
          <p class="mt-1 text-xs text-muted-foreground">
            Prueba siempre el escaneo tras añadir un logo - cuanto más grande, más datos cubre.
          </p>
        </div>
      </section>
    </div>

    <div class="lg:sticky lg:top-8 lg:self-start">
      <div class="rounded-2xl border border-border p-5 bg-muted">
        <div class="mx-auto aspect-square w-full max-w-xs overflow-hidden rounded-xl border border-border/50" :class="state.transparent ? 'bg-[repeating-conic-gradient(#80808022_0_25%,transparent_0_50%)] bg-[length:16px_16px]' : ''">
          <div v-if="svg" class="[&>svg]:h-full [&>svg]:w-full" role="img" aria-label="Vista previa del código QR generado" v-html="svg" />
          <div v-else class="grid h-full place-items-center p-6 text-center text-sm text-muted-foreground">
            {{ error ?? 'Empieza a escribir para generar un código QR' }}
          </div>
        </div>
        <p v-if="matrix" class="mt-3 text-center text-xs text-muted-foreground">
          Versión {{ matrix.version }} · {{ matrix.size }}×{{ matrix.size }} módulos · EC {{ matrix.ecLevel }}
        </p>
        <p v-if="error" class="mt-2 text-center text-xs text-destructive" role="alert">
          {{ error }}
        </p>

        <div class="mt-4 grid grid-cols-2 gap-2">
          <Button size="lg" class="rounded-xl" :disabled="!matrix" @click="downloadPng">
            Descargar PNG
          </Button>
          <Button size="lg" variant="outline" class="rounded-xl" :disabled="!matrix" @click="downloadSvg">
            Descargar SVG
          </Button>
        </div>

        <div class="mt-4 border-t border-border/60 pt-4">
          <ShareBar
            share-copy="Generador de códigos QR Gratis - sin registro, sin marca de agua, funciona sin conexión."
            :get-image-blob="() => toPngBlob(1024)"
          />
        </div>
        <div aria-live="polite" class="sr-only">
          {{ announcement }}
        </div>
      </div>
    </div>
  </div>
</template>
