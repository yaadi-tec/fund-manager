<template>
    <div class="container mx-auto max-w-4xl">
        <div class="font-bold" :class="[color]">
            {{ title }}
        </div>
        <div class="text-2xl font-extrabold text-black dark:text-white mb-2">
            <USkeleton class="h-8 w-full" v-if="loading" />
            <div v-else class="text-bold">{{ currency }}</div>            
        </div>
        <div>
            <USkeleton class="h-6 w-full" v-if="loading" />
            <div v-else class="flex items-center space-x-1 text-sm">
                <UIcon class="w-6 h-6" :class="{'green': trendingUp, 'red': !trendingUp}" :name="icon"/>
                <div class="text-gray-500 dark:text-gray-400">
                    {{trendPercentage}} vs previous
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">

    interface trend {
        title: String | '',
        amount: Number | 0,
        lastAmount: Number | 0,
        color: String | 'red',
        loading: Boolean | true
    }
    const props = defineProps<trend>();

    const { currency } = useCurrency(props.amount);

    const trendingUp = computed(() => props.amount >= props.lastAmount);
    const icon = computed(() => trendingUp.value ? 'i-heroicons-arrow-trending-up' : 'i-heroicons-arrow-trending-down');

    const trendPercentage = computed(() => calculateTrendPercent());

    const calculateTrendPercent = () => {
        if(props.amount == 0 || props.lastAmount == 0) return `0%`;

        const low = Math.min(props.amount as number, props.lastAmount as number);
        const high = Math.max(props.amount as number, props.lastAmount as number);
        
        const percent = ((high - low) / low ) * 100;

        return `${Math.ceil(percent)}%`;
    }
</script>

<style scoped>

.green {
    @apply text-green-600 dark:text-green-400
}

.red {
    @apply text-red-600 dark:text-red-400
}

</style>