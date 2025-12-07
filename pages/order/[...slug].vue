<script setup>
const order = useDataOrder()

onMounted(() => {
  order.value = {}
  const orderId = useRoute().path.split('/').pop()
  stateOrder.refresh(orderId)
});
</script>

<template>
  <NuxtLayout name="simplified">
    <section class="flex justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300 py-6">
      <div v-if="isNotEmptyObj(order)" class="w-full max-w-screen-lg px-4">
        <OrderDetailDigital />
      </div>
      <div v-else class="flex items-center justify-center pt-40 w-full">
        <div class="flex flex-col items-center gap-4">
          <span class="loading loading-infinity loading-lg text-blue-600 dark:text-blue-400"></span>
          <p class="text-gray-500 dark:text-gray-400">{{ $t('Loading') || 'Loading...' }}</p>
        </div>
      </div>
    </section>
  </NuxtLayout>
</template>