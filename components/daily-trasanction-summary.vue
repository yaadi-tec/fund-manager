<template>
    <div class="grid grid-cols-2 py-4 border-b border-gray-200 dark:border-gray-800 text-gray-500 dark:text-gray-400">
        <div class="flex justify-between items-center">
           {{ date }}
        </div>
        <div class="flex items-center justify-end space-x-2 text-bold mr-10">
           {{ currency }}
        </div>
    </div>
</template>

<script setup lang="ts">

    type Transaction = {
        type: string,
        description: string,
        id: string,
        category: string,
        created_at: string,
        amount: number
    }

    const props = defineProps({
        date: {
            type: String,
            default: 'null'
        },
        transactions: {
            type: Array<Transaction>,
            default: []
        }
    });
   
    const sum = computed(() => {

         let sum = 0;
        for(const transaction of props?.transactions) {
            if(transaction?.type === 'Income'){
                sum += transaction?.amount;
            }else{
                sum -= transaction?.amount;
            } 
        }
        return sum;
    });

    const { currency } = useCurrency(sum.value);

</script>