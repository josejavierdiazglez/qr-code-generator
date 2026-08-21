import { describe, expect, it } from 'vitest'
import { qrStateSchema } from '@/composables/useQr'
import { defaultState } from '@/state/url-state'

describe('valores por defecto / restablecer', () => {
  it('los defaults de qrStateSchema coinciden con la línea base del reset', () => {
    const defaults = defaultState(qrStateSchema)
    expect(defaults).toMatchObject({
      tab: 'url',
      url: '',
      text: '',
      ssid: '',
      password: '',
      security: 'WPA',
      hidden: false,
      ec: 'M',
      fg: '#111111',
      bg: '#ffffff',
      transparent: false,
      margin: 4,
      dots: 'square',
      eyeF: 'auto',
      eyeB: 'auto',
      eyeColor: '',
      ballColor: '',
      grad: false,
      fg2: '#7c3aed',
      gradType: 'linear',
      gradAngle: 45,
      logoSize: 22,
      px: 1024,
    })
  })

  it('Object.assign con defaultState restaura todas las claves del esquema', () => {
    const dirty = defaultState(qrStateSchema)
    dirty.tab = 'wifi'
    dirty.ssid = 'Casa'
    dirty.password = 'secreto'
    dirty.fg = '#ff0000'
    dirty.grad = true
    dirty.margin = 10

    Object.assign(dirty, defaultState(qrStateSchema))

    expect(dirty).toEqual(defaultState(qrStateSchema))
  })
})
