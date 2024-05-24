<template>
    <section class="flex justify-between items-center mb-10">
        <h1 class="text-4xl font-extrabold">Summary</h1>
        <div>
            <USelectMenu v-model="selectedView" :options="transactionViewOptions" />
        </div>
    </section>
    <section class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 sm:gap-16 mb-10">
        <Trend title="Income" color="green" :amount="incomeTotal" :last-amount="5000" :loading="isLoading"/>
        <Trend title="Expenses" color="red" :amount="expenseTotal" :last-amount="5000" :loading="isLoading"/>
        <Trend title="Investments" color="green" :amount="4400" :last-amount="5000" :loading="isLoading"/>
        <Trend title="Savings" color="red" :amount="4500" :last-amount="5000" :loading="isLoading"/>
    </section>
    <section class="flex justify-between mb-10">
        <div>
            <h1 class="text-2xl font-semibold">Transactions</h1>
            <div class="text-gray-500 dark:text-gray-400">
                you have {{ incomeCount }} and {{ expenseCount }} expenses this period
            </div>
        </div>
        <div>
            <TransactionModal v-model="isTransactionModalOpen" @saved="refreshTransaction()"/>
            <UButton icon="i-heroicons-plus-circle" color="white" variant="solid" label="Add" @click="isTransactionModalOpen = true" />
        </div>      
    </section>
    <section v-if="!isLoading">
        <div v-for="(transactionDate, date) in trasactionGroupedByDate" :key="date" class="mb-10">          
            <DailyTrasanctionSummary :date="date" :transactions="transactionDate" />
            <Transaction v-for="transaction in transactionDate" :key="transaction.id" :transaction  @deleted="refreshTransaction()" />
        </div>        
    </section>
    <section v-else>
        <USkeleton v-for="i in 4" class="h-8 w-full mb-2" />
    </section>
</template>

<script setup lang="ts">

    import { transactionViewOptions } from '~/constants'

    const selectedView = ref(transactionViewOptions[2]);
    const supabase = useSupabaseClient();
    const transactions = ref();
    const isLoading = ref(false);
    const isTransactionModalOpen = ref(false);

    const income = computed(() => transactions.value.filter((t: { type: string; }) => t.type === 'Income'));
    const expense = computed(() => transactions.value.filter((t: { type: string; }) => t.type === 'Expense'));

    const incomeTotal = computed(() => income.value.reduce((sum: number, transaction: { amount: number; }) => sum + transaction.amount, 0));
    const expenseTotal = computed(() => expense.value.reduce((sum: number, transaction: { amount: number; }) => sum + transaction.amount, 0));

    const incomeCount = computed(() => income.value.length);
    const expenseCount = computed(() => expense.value.length);

    const fetchTransactions = async () => {

        isLoading.value = true;
        
        try {
            const { data } = await useAsyncData('transactions', async () => {
                const { data, error } = await supabase.from('transactions')
                .select()
                .order('created_at', {ascending: false});

                if(error) return [];
                return data;
            });

            return data.value;
        } finally {

            isLoading.value = false;
        }
    }
    const refreshTransaction = async () => transactions.value = await fetchTransactions();

    await refreshTransaction();

    const trasactionGroupedByDate = computed(() => {

        type Transaction = {
            [key: string]: any
        };

        let grouped: Transaction = {};

        for (let transaction of transactions.value) {
            const date = new Date(transaction.created_at).toISOString().split('T')[0];
            if(!grouped[date]){
                grouped[date] = [];
            }

            grouped[date].push(transaction);
        }

        return grouped;
    });

</script>