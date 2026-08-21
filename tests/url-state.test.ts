import { describe, expect, it } from 'vitest'
import {
  decodePresentState,
  decodeState,
  defaultState,
  encodeState,
  type StateSchema,
} from '@/state/url-state'

const schema = {
  tab: { type: 'string', default: 'url' },
  url: { type: 'string', default: '' },
  password: { type: 'string', default: '', secret: true },
  margin: { type: 'number', default: 4 },
  grad: { type: 'boolean', default: false },
} satisfies StateSchema

describe('estado URL', () => {
  it('defaultState devuelve los valores por defecto del esquema', () => {
    expect(defaultState(schema)).toEqual({
      tab: 'url',
      url: '',
      password: '',
      margin: 4,
      grad: false,
    })
  })

  it('encodeState omite valores por defecto y secretos', () => {
    const qs = encodeState(schema, {
      tab: 'wifi',
      url: 'https://x.com',
      password: 'secreto',
      margin: 4,
      grad: true,
    })
    const params = new URLSearchParams(qs)
    expect(params.get('tab')).toBe('wifi')
    expect(params.get('url')).toBe('https://x.com')
    expect(params.get('grad')).toBe('true')
    expect(params.has('password')).toBe(false)
    expect(params.has('margin')).toBe(false)
  })

  it('decodePresentState ignora secretos y claves ausentes', () => {
    const params = new URLSearchParams('tab=text&password=leak&margin=8')
    const partial = decodePresentState(schema, params)
    expect(partial).toEqual({ tab: 'text', margin: 8 })
    expect('password' in partial).toBe(false)
  })

  it('decodeState mezcla la query sobre los defaults y resetea secretos', () => {
    const state = decodeState(schema, { tab: 'email', password: 'ignored', grad: 'true' })
    expect(state.tab).toBe('email')
    expect(state.password).toBe('')
    expect(state.grad).toBe(true)
    expect(state.margin).toBe(4)
  })
})
