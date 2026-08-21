import { describe, expect, it } from 'vitest'
import { encodeQr, generateQr, renderSvg } from '@/qr'

describe('encoder', () => {
  it('encodeQr devuelve una matriz válida', () => {
    const matrix = encodeQr('https://ejemplo.com', { ecLevel: 'M' })
    expect(matrix.version).toBeGreaterThanOrEqual(1)
    expect(matrix.size).toBe(17 + 4 * matrix.version)
    expect(matrix.modules.length).toBe(matrix.size * matrix.size)
    expect(matrix.ecLevel).toMatch(/^[LMQH]$/)
    expect(Array.from(matrix.modules).some(v => v === 1)).toBe(true)
  })

  it('generateQr devuelve svg y metadatos de la matriz', () => {
    const result = generateQr({ type: 'url', url: 'ejemplo.com' }, { fg: '#111111', bg: '#ffffff' })
    expect(result.payload).toBe('https://ejemplo.com')
    expect(result.svg).toContain('<svg')
    expect(result.size).toBe(result.matrix.size)
    expect(result.version).toBe(result.matrix.version)
  })

  it('renderSvg incluye atributos de tamaño', () => {
    const matrix = encodeQr('test', { ecLevel: 'L' })
    const svg = renderSvg(matrix, { size: 256 })
    expect(svg).toContain('width="256"')
    expect(svg).toContain('height="256"')
  })
})
