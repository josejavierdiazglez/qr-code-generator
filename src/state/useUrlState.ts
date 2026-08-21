import type { StateOf, StateSchema } from '@/state/url-state'
import { onMounted, reactive, watch } from 'vue'
import { decodePresentState, defaultState, encodeState } from '@/state/url-state'

/**
 * Shareable state synced with the URL query (debounced replaceState).
 * Fields marked `secret` in the schema are never serialized.
 */
export function useUrlState<S extends StateSchema>(schema: S) {
  const state = reactive(defaultState(schema)) as StateOf<S>

  onMounted(() => {
    const params = new URLSearchParams(window.location.search)
    Object.assign(state, decodePresentState(schema, params))
  })

  let timer: ReturnType<typeof setTimeout> | undefined
  watch(state, () => {
    clearTimeout(timer)
    timer = setTimeout(() => {
      const qs = encodeState(schema, state)
      const url = qs ? `${window.location.pathname}?${qs}` : window.location.pathname
      window.history.replaceState(window.history.state, '', url)
    }, 300)
  }, { deep: true })

  return state
}
