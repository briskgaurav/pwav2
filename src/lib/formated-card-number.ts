export default function formatCardNumber(value: string): string {
    const digits = value.replace(/\D/g, '')
    const groups = digits.match(/.{1,4}/g)
    return groups ? groups.join(' ') : ''
}
