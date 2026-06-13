import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import Calculator from '../components/Calculator.vue'

describe('Calculator component', () => {
    it('renders and computes', async () => {
        const wrapper = mount(Calculator)

        const inputs = wrapper.findAll('input')
        await inputs[0].setValue('2')
        await inputs[1].setValue('3')

        // default op is +
        expect(wrapper.text()).toContain('Result: 5')

        // click multiply
        await wrapper.find('button:nth-of-type(3)').trigger('click')
        expect(wrapper.text()).toContain('Result: 6')
    })
})
// ...component tests only
