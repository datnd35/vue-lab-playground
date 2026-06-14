import { describe, it, expect } from 'vitest'
import { calculate } from '../utils/calculator'

describe('calculate util', () => {
    it('adds two numbers', () => {
        expect(calculate(1, 2, '+')).toBe(3)
    })

    it('subtracts two numbers', () => {
        expect(calculate(5, 3, '-')).toBe(2)
    })

    it('multiplies two numbers', () => {
        expect(calculate(4, 3, '*')).toBe(12)
    })

    it('divides two numbers', () => {
        expect(calculate(10, 2, '/')).toBe(5)
    })

    it('handles divide by zero', () => {
        expect(calculate(1, 0, '/')).toBe(Infinity)
    })
})
