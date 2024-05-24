export const useCurrency = (amount) => {
    const currency = computed(() => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR'
        }).format(isRef(amount) ? amount : amount)
    })
    return {
        currency
    }
}