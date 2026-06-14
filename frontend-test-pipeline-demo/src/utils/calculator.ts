export function calculate(a: number, b: number, op: string): number {
    switch (op) {
        case '+':
            return a + b
        case '-':
            return a - b
        case '*':
            return a * b
        case '/':
            return b === 0 ? Infinity : a / b
        default:
            throw new Error('Unknown operator')
    }
}
