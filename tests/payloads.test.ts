import { describe, expect, it } from 'vitest'
import {
  buildPayload,
  emailPayload,
  smsPayload,
  telPayload,
  urlPayload,
  vcardPayload,
  wifiPayload,
} from '@/qr'

describe('payloads', () => {
  it('urlPayload añade https si falta el esquema', () => {
    expect(urlPayload('ejemplo.com')).toBe('https://ejemplo.com')
    expect(urlPayload('https://ejemplo.com')).toBe('https://ejemplo.com')
  })

  it('wifiPayload construye la cadena WIFI: y escapa caracteres especiales', () => {
    expect(wifiPayload({ ssid: 'Casa', password: 'a;b', security: 'WPA' }))
      .toBe('WIFI:T:WPA;S:Casa;P:a\\;b;;')
    expect(wifiPayload({ ssid: 'Open', security: 'nopass' }))
      .toBe('WIFI:T:nopass;S:Open;;')
    expect(wifiPayload({ ssid: 'Hidden', password: 'x', security: 'WPA', hidden: true }))
      .toBe('WIFI:T:WPA;S:Hidden;P:x;H:true;;')
  })

  it('emailPayload construye mailto con query opcional', () => {
    expect(emailPayload({ to: 'a@b.com' })).toBe('mailto:a@b.com')
    expect(emailPayload({ to: 'a@b.com', subject: 'Hola', body: 'Mundo' }))
      .toBe('mailto:a@b.com?subject=Hola&body=Mundo')
  })

  it('telPayload elimina lo que no sea dígito excepto +', () => {
    expect(telPayload('+34 600 123 456')).toBe('tel:+34600123456')
  })

  it('smsPayload construye el payload SMSTO', () => {
    expect(smsPayload({ phone: '+34 600', message: 'Hola' })).toBe('SMSTO:+34600:Hola')
  })

  it('vcardPayload incluye FN y campos opcionales', () => {
    const card = vcardPayload({ firstName: 'Ada', lastName: 'Lovelace', email: 'ada@ejemplo.com' })
    expect(card).toContain('BEGIN:VCARD')
    expect(card).toContain('FN:Ada Lovelace')
    expect(card).toContain('EMAIL:ada@ejemplo.com')
    expect(card).toContain('END:VCARD')
  })

  it('buildPayload despacha según el tipo', () => {
    expect(buildPayload({ type: 'text', text: 'hola' })).toBe('hola')
    expect(buildPayload({ type: 'url', url: 'ejemplo.com' })).toBe('https://ejemplo.com')
    expect(buildPayload({ type: 'phone', phone: '600' })).toBe('tel:600')
  })
})
