<script setup>
const { locale } = useI18n()
const localePath = useLocalePath()
const order = useDataOrder()

const payStatus = ref('')
const orderErrorMsg = ref('')  // server_order_stock_not_enough server_order_project_or_sku_offline
const expiredInterval = order.value.expiredInterval

if (order.value.status === 'DONE') {
  payStatus.value = 'DONE'
}
else if (order.value.status === 'EXPIRED') {
  payStatus.value = 'EXPIRED'
}
else if (order.value.status === 'PAID') {
  payStatus.value = 'PAID'
} else if (order.value.status === 'REFUND') {
  payStatus.value = 'REFUND'
} else {
  // judge order could pay
  // project/sku not online
  if (order.value.project.status != 'ONLINE' || order.value.sku.status != 'ONLINE') {
    payStatus.value = 'ERROR'
    orderErrorMsg.value = 'server_order_project_or_sku_offline'
  } else if (order.value.quantity > order.value.stock) {
    payStatus.value = 'ERROR'
    orderErrorMsg.value = 'server_order_stock_not_enough'
  } else {
    payStatus.value = 'WAIT'
  }
}

const counterMinutes = ref(0)
const counterSeconds = ref(0)
if (payStatus.value === 'WAIT') {
  setInterval(() => {
    const orderCreatedInterval = parseInt((Date.now() - order.value.createdTS * 1000) / 1000)
    const orderRemainInterval = expiredInterval - orderCreatedInterval
    if (orderRemainInterval > 0) {
      counterMinutes.value = parseInt(orderRemainInterval / 60)
      counterSeconds.value = parseInt(orderRemainInterval % 60)
    } else {  // expired
      payStatus.value = 'EXPIRED'
    }
  }, 1000)
}
</script>

<template>
  <section class="mt-2 bg-white dark:bg-gray-800 py-8 shadow-xl dark:shadow-gray-900/50 space-y-6 px-6 rounded-2xl transition-colors duration-300">
    <!-- 订单头部信息 -->
    <div class="grid grid-cols-1 lg:grid-cols-5 gap-6">
      <div class="lg:col-span-2">
        <div class="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 rounded-xl p-4 sm:p-6 flex items-center justify-center aspect-square max-h-[400px] lg:max-h-none">
          <NuxtImg loading="lazy" format="webp" :src="order.project.cover" alt=""
            class="w-full h-full object-contain rounded-lg" />
        </div>
      </div>
      <div class="lg:col-span-3 space-y-4">
        <div>
          <div class="text-sm text-gray-500 dark:text-gray-400 mb-1">{{ nameI18n(locale, order.project) }}</div>
          <h1 class="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-3">{{ nameI18n(locale, order.sku) }}</h1>

          <div class="flex flex-wrap gap-2 mb-4">
            <span class="badge badge-sm font-medium badge-outline rounded-md dark:border-gray-600 dark:text-gray-300">
              {{ $t(order.projectType) }}
            </span>
            <span v-if="order.sku.itemType === 'reuse'" 
              class="badge badge-sm font-medium badge-outline rounded-md dark:border-gray-600 dark:text-gray-300">
              {{ $t('at_most_buy_one') }}
            </span>
            <span v-if="order.projectType === 'DIGITAL'" 
              class="badge badge-sm font-medium badge-outline rounded-md dark:border-gray-600 dark:text-gray-300">
              {{ $t('automatic_delivery') }}
            </span>
          </div>
        </div>

        <!-- 订单详情卡片 -->
        <div class="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-5 space-y-4">
          <div class="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-600">
            <span class="text-sm font-medium text-gray-600 dark:text-gray-400">{{ $t('order_id') }}</span>
            <span class="text-sm font-mono text-gray-900 dark:text-gray-100">{{ order.id }}</span>
          </div>
          <div class="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-600">
            <span class="text-sm font-medium text-gray-600 dark:text-gray-400">{{ $t('creation_date') }}</span>
            <span class="text-sm text-gray-900 dark:text-gray-100">
              {{ formatLocaleDate(order.createdAt, 'yyyy-MM-dd hh:mm:ss') }}
            </span>
          </div>
          <div class="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-600">
            <span class="text-sm font-medium text-gray-600 dark:text-gray-400">{{ $t('Quantity') }}</span>
            <span class="text-base font-bold text-gray-900 dark:text-gray-100">{{ order.quantity }}</span>
          </div>
          <div class="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-600">
            <span class="text-sm font-medium text-gray-600 dark:text-gray-400">{{ $t('order_ori_price') }}</span>
            <span class="text-base font-bold text-gray-900 dark:text-gray-100">{{ order.oriPrice }} {{ $t('USD') }}</span>
          </div>
          <div v-if="order.coupon !== ''" class="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-600">
            <span class="text-sm font-medium text-gray-600 dark:text-gray-400">{{ $t('order_coupon') }}</span>
            <span class="text-base font-bold text-green-600 dark:text-green-400">
              -{{ Math.round((order.price - order.oriPrice) * 100000) / 100000 }} {{ $t('USD') }}
            </span>
          </div>
          <div class="flex justify-between items-center py-2">
            <span class="text-base font-bold text-gray-900 dark:text-gray-100">{{ $t('order_pay_price') }}</span>
            <span class="text-2xl font-bold text-blue-600 dark:text-blue-400">{{ order.price }} {{ $t('USD') }}</span>
          </div>
        </div>

        <!-- 支付倒计时和支付方式 -->
        <div v-if="payStatus === 'WAIT'" class="space-y-4">
          <!-- 倒计时卡片 -->
          <div class="bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 border-2 border-orange-200 dark:border-orange-800 rounded-xl p-4">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <svg class="w-5 h-5 text-orange-600 dark:text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span class="text-sm font-semibold text-orange-700 dark:text-orange-300">{{ $t('order_countdown') }}</span>
              </div>
              <div class="flex items-baseline gap-2">
                <span class="countdown font-mono text-2xl font-bold text-orange-600 dark:text-orange-400">
                  <span :style="{ '--value': counterMinutes }"></span>
                </span>
                <span class="text-sm font-medium text-orange-600 dark:text-orange-400">{{ $t('minutes') }}</span>
                <span class="countdown font-mono text-2xl font-bold text-orange-600 dark:text-orange-400">
                  <span :style="{ '--value': counterSeconds }"></span>
                </span>
                <span class="text-sm font-medium text-orange-600 dark:text-orange-400">{{ $t('seconds') }}</span>
              </div>
            </div>
          </div>

          <!-- 支付方式 -->
          <div class="space-y-3">
            <h3 class="text-lg font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
              <svg class="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
              {{ $t('Payment_Methods') }}
            </h3>
            <OrderPayments :order="order" />
          </div>

          <!-- 提示信息 -->
          <div class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 space-y-2">
            <p class="text-sm font-medium text-red-700 dark:text-red-400 flex items-start gap-2">
              <svg class="w-5 h-5 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
              </svg>
              <span>{{ $t('order_tip1') }}</span>
            </p>
            <p v-if="order.anonymous" class="text-sm font-medium text-red-700 dark:text-red-400 flex items-start gap-2">
              <svg class="w-5 h-5 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
              </svg>
              <span>
                {{ $t('order_anonymous_tip') }}
                <NuxtLink target="_blank" :to="localePath('/order/search')" 
                  class="font-bold underline hover:text-red-800 dark:hover:text-red-300">
                  👉 [link]
                </NuxtLink>
              </span>
            </p>
          </div>
        </div>
        <!-- 订单状态显示 -->
        <div v-else-if="payStatus === 'PAID'" 
          class="bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-200 dark:border-blue-800 rounded-xl p-5">
          <div class="flex items-center gap-3">
            <svg class="w-6 h-6 text-blue-600 dark:text-blue-400" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
            </svg>
            <span class="text-lg font-bold text-blue-600 dark:text-blue-400">{{ $t('order_paid') }}</span>
          </div>
        </div>
        <div v-else-if="payStatus === 'DONE'" 
          class="bg-green-50 dark:bg-green-900/20 border-2 border-green-200 dark:border-green-800 rounded-xl p-5">
          <div class="flex items-center gap-3">
            <svg class="w-6 h-6 text-green-600 dark:text-green-400" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
            </svg>
            <span class="text-lg font-bold text-green-600 dark:text-green-400">{{ $t('order_done') }}</span>
          </div>
        </div>
        <div v-else-if="payStatus === 'EXPIRED'" 
          class="bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800 rounded-xl p-5">
          <div class="flex items-center gap-3">
            <svg class="w-6 h-6 text-red-600 dark:text-red-400" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
            </svg>
            <span class="text-lg font-bold text-red-600 dark:text-red-400">{{ $t('order_expired') }}</span>
          </div>
        </div>
        <div v-else-if="payStatus === 'REFUND'" 
          class="bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800 rounded-xl p-5">
          <div class="flex items-center gap-3">
            <svg class="w-6 h-6 text-red-600 dark:text-red-400" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
            </svg>
            <span class="text-lg font-bold text-red-600 dark:text-red-400">{{ $t('txn_order_status_REFUND') }}</span>
          </div>
        </div>
        <div v-else-if="payStatus === 'ERROR'" 
          class="bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800 rounded-xl p-5">
          <div class="flex items-center gap-3">
            <svg class="w-6 h-6 text-red-600 dark:text-red-400" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
            </svg>
            <span class="text-lg font-bold text-red-600 dark:text-red-400">{{ $t(orderErrorMsg) }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 数字商品内容 -->
    <div v-if="isNotEmptyObj(order) && order.digitalItemsStr" class="space-y-4">
      <div class="border-t border-gray-200 dark:border-gray-700 pt-6"></div>
      <div class="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-2 border-green-200 dark:border-green-800 rounded-xl p-6">
        <div class="flex items-center justify-between mb-4">
          <div class="flex items-center gap-2">
            <svg class="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 class="text-lg font-bold text-gray-900 dark:text-gray-100">{{ $t('order_digital_items') }}</h3>
          </div>
          <BtnCopy :text="order.digitalItemsStr" btn-size="small" />
        </div>
        <textarea :value="order.digitalItemsStr" type="text" rows="8" maxlength="1000000"
          class="w-full px-4 py-3 border-2 rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 font-mono text-sm focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400 focus:border-green-500 dark:focus:border-green-400 transition-all"
          readonly>
        </textarea>
      </div>
    </div>

    <!-- 商品和项目介绍 -->
    <div class="space-y-6 pt-6 border-t border-gray-200 dark:border-gray-700">
      <div class="space-y-4">
        <div class="flex items-center gap-2">
          <div class="w-1 h-6 bg-blue-600 rounded-full"></div>
          <h3 class="text-lg font-bold text-gray-900 dark:text-gray-100">{{ $t('sku_desc') }}</h3>
        </div>
        <div class="text-sm text-gray-600 dark:text-gray-300 whitespace-pre-wrap leading-relaxed pl-3">
          <TextWithLinks :text="descI18n(locale, order.sku)" />
        </div>
        <div v-if="order.sku.docLink" class="text-xs pl-3">
          <span class="text-xs text-gray-800 dark:text-gray-200 font-medium">{{ $t('more_see_doc') }}</span>
          👉 <a target="_blank" :href="order.sku.docLink" class="font-medium underline text-blue-500 dark:text-blue-400 hover:text-blue-600 dark:hover:text-blue-300">[link]</a>
        </div>
      </div>

      <div class="space-y-4">
        <div class="flex items-center gap-2">
          <div class="w-1 h-6 bg-blue-600 rounded-full"></div>
          <h3 class="text-lg font-bold text-gray-900 dark:text-gray-100">{{ $t('project_desc') }}</h3>
        </div>
        <div class="text-sm text-gray-600 dark:text-gray-300 whitespace-pre-wrap leading-relaxed pl-3">
          <TextWithLinks :text="descI18n(locale, order.project)" />
        </div>
      </div>
    </div>
  </section>

</template>