<template>
    <UModal v-model="isTransactionModalOpen">
        {{ isTransactionModalOpen }}
        <UCard :ui="{ ring: '', divide: 'divide-y divide-gray-100 dark:divide-gray-800' }">
            <template #header>
                Add Transactions
            </template>
            <UForm :state="transactionState" :schema ref="form" @submit="onSubmit">
                <UFormGroup name="type" :required="true" class="mb-4" label="Transaction Type">
                    <USelect v-model="transactionState.type" :options="TransactionTypes" placeholder="Select the transaction type"/>
                </UFormGroup>
                <UFormGroup name="amount" :required="true" class="mb-4" label="Amount">
                    <UInput v-model.number="transactionState.amount" type="number" placeholder="Amount" />
                </UFormGroup>
                <UFormGroup name="created_at" :required="true" class="mb-4" label="Transaction Date">
                    <UInput v-model="transactionState.created_at" type="date" icon="i-heroicons-calendar-days-20-solid" />
                </UFormGroup>
                <UFormGroup name="description" hint="Optional" class="mb-4" label="Description">
                    <UInput v-model="transactionState.description" placeholder="Description" />
                </UFormGroup>
                <UFormGroup name="category" :required="true" class="mb-4" label="Category" v-if="transactionState.type === 'Expense'">
                    <USelect v-model="transactionState.category" :options="Categories" placeholder="Category"/>
                </UFormGroup>
                <UButton :loading="isLoading" type="submit" color="black" variant="solid" label="Save"/>
            </UForm>
        </UCard>
    </UModal>
</template>

<script setup lang="ts">

    import { z } from 'zod';
    import type { FormSubmitEvent } from '#ui/types';
    import { Categories, TransactionTypes } from '~/constants';

    const form = ref();
    const isLoading = ref(false);
    const supabase = useSupabaseClient();
    const toast = useToast();

    const defaultSchema = z.object({
        created_at: z.string(),
        amount: z.number().positive('Amount needs to greater than zero'),
        description: z.string().optional()
    });

    const incomeSchema = z.object({
        type: z.literal('Income')
    })

    const expenseSchema = z.object({
        type: z.literal('Expense'),
        category: z.enum<string, any>(Categories)
    })
    
    const investmentSchema = z.object({
        type: z.literal('Investment')
    })
    
    const savingsSchema = z.object({
        type: z.literal('Savings')
    })

    const schema = z.intersection( 
        z.discriminatedUnion('type', [incomeSchema, investmentSchema, expenseSchema, savingsSchema]),
        defaultSchema
    )

    type Schema = z.output<typeof schema>;

    const props = defineProps({
        modalValue: Boolean
    });

    const emit = defineEmits(['update:modalValue']);

    const isTransactionModalOpen = computed({
        get: () => props.modalValue,
        set: (value) => {
           if(!value) resetForm();           
            emit('update:modalValue', value);
        }
    });

    const initialTransactionState = ref({
        type: undefined,
        amount: 0,
        created_at: undefined,
        description: undefined,
        category: undefined
    });

    const transactionState = ref({
        ...initialTransactionState.value
    });    

    const onSubmit = async (event: FormSubmitEvent<Schema>) => {

        if(form.value.errors.length) return; 

        isLoading.value = true;
        try {
            isTransactionModalOpen.value = false;
            console.log(isTransactionModalOpen.value)
            // emit('saved');
                

            // const {error} = await supabase.from('transactions').upsert({ ...transactionState.value as any });

            // if(!error){
            //     toast.add({
            //         title: 'Transaction saved',
            //         icon: 'i-heroicons-check-rounded',
            //         color: 'green',
            //     });
                
            //     emit('saved');
            //     isTransactionModalOpen.value = !isTransactionModalOpen.value;
            // }
            
        } catch (error) {
            toast.add({
                title: 'Transaction failed',
                icon: 'i-heroicons-exclamation-circle',
                color: 'red',
                description: error as string
            });
        } finally {
            isLoading.value = false;
        }
    }

    const resetForm = () => {
        Object.assign(transactionState.value, initialTransactionState.value);
        form.value.clear();
    };

</script>