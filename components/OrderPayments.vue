<script setup>
const props = defineProps(['order'])
const order = props.order
const { locale } = useI18n()

const composeOrderUrl = (method, id) => {
  const path = '/api/order/pay'
  const redirectUrl = encodeURIComponent(`${getBaseUrl()}${useRoute().fullPath}`)
  const url = `${path}?method=${method}&id=${id}&redirectUrl=${redirectUrl}&locale=${locale.value}`
  return `${url}&_sign=${encryptReq(path)}`
}
</script>

<template>
  <div class="space-y-3">
    <div v-if="order.isConsumer" class="grid grid-cols-1 sm:grid-cols-2 gap-3">
      <template v-for="payment in order.mPayments">
        <div v-if="payment.enabled && payment.method !== 'credits'">
          <a target="_blank" :href="composeOrderUrl(payment.method, order.id)"
            class="group relative flex flex-col p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-[1.02]"
            :class="payment.isPlatform 
              ? 'bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30 border-blue-300 dark:border-blue-700 hover:border-blue-400 dark:hover:border-blue-600'
              : 'bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/30 dark:to-emerald-800/30 border-green-300 dark:border-green-700 hover:border-green-400 dark:hover:border-green-600'">
            <div class="flex items-start justify-between mb-2">
              <div class="flex-1">
                <div class="flex items-center gap-2 mb-1">
                  <svg v-if="payment.isPlatform" class="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
                  <svg v-else class="w-5 h-5 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span class="font-bold text-base"
                    :class="[payment.isPlatform ? 'text-blue-700 dark:text-blue-300' : 'text-green-700 dark:text-green-300']">
                    {{ paymentName(payment.name) }}
                  </span>
                </div>
                <p v-if="payment.desc" class="text-xs text-gray-600 dark:text-gray-400 mb-2">
                  {{ payment.desc }}
                </p>
              </div>
              <svg class="w-5 h-5 text-gray-400 dark:text-gray-500 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>
            </div>
            <div class="pt-2 border-t border-gray-200 dark:border-gray-600">
              <p class="text-xs font-medium"
                :class="[payment.isPlatform ? 'text-blue-600 dark:text-blue-400' : 'text-green-600 dark:text-green-400']">
                <span v-if="payment.isPlatform">
                  <span v-if="payment.paymentFeeCovered">
                    + {{ $t('Payment_fee') }}: <span class="font-bold">0%</span>
                  </span>
                  <span v-else>
                    + {{ $t('Payment_fee') }}: <span class="font-bold">{{ payment.ratioRange }}</span>
                    <span v-if="payment.fixedFeeRange">+{{ payment.fixedFeeRange }}</span>
                  </span>
                </span>
                <span v-else>
                  + {{ $t('Payment_fee') }}: <span class="font-bold">0%</span>
                </span>
              </p>
            </div>
          </a>
        </div>
      </template>
    </div>
    <div v-else class="p-4 bg-gray-100 dark:bg-gray-700 rounded-lg border border-gray-300 dark:border-gray-600">
      <button type="submit" disabled
        class="w-full px-4 py-3 text-sm font-medium rounded-lg bg-gray-300 dark:bg-gray-600 text-white dark:text-gray-400 cursor-not-allowed flex items-center justify-center gap-2">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
        {{ $t('charge_btn') }}
      </button>
    </div>
  </div>
</template>