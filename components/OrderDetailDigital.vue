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
  <section class="mt-2 bg-white dark:bg-gray-800 py-8 shadow-xl dark:shadow-gray-900/50 space-y-4 px-4 rounded-2xl transition-colors duration-300">
    <div class="grid grid-cols-1 md:grid-cols-5">
      <div class="col-span-2">
        <NuxtImg loading="lazy" format="webp" :src="order.project.cover" alt=""
          class="h-[300px] w-[300px] object-cover mb-4 rounded-xl" />
      </div>
      <div class="col-span-3">
        <div class="text-sm text-gray-500 dark:text-gray-400">{{ nameI18n(locale, order.project) }}</div>
        <div class="text-xl font-bold text-gray-800 dark:text-gray-100">{{ nameI18n(locale, order.sku) }}</div>

        <div class="mb-2 sm:space-x-2 space-y-2">
          <span class="badge badge-sm font-medium badge-outline rounded-md dark:border-gray-600 dark:text-gray-300">{{ $t(order.projectType) }}</span>
          <span v-if="order.sku.itemType === 'reuse'" class="badge badge-sm font-medium badge-outline rounded-md dark:border-gray-600 dark:text-gray-300">
            {{ $t('at_most_buy_one') }}
          </span>
          <span v-if="order.projectType === 'DIGITAL'" class="badge badge-sm font-medium badge-outline rounded-md dark:border-gray-600 dark:text-gray-300">
            {{ $t('automatic_delivery') }}</span>
        </div>

        <div class="grid grid-cols-4 sm:grid-cols-5 mt-1 text-md">
          <div class="col-span-2 font-medium text-gray-800 dark:text-gray-200">{{ $t('order_id') }}</div>
          <div class="col-span-2 flex justify-end text-gray-500 dark:text-gray-400"> {{ order.id }}</div>
        </div>
        <div class="grid grid-cols-4 sm:grid-cols-5 mt-1 text-md font-medium">
          <div class="col-span-2 font-medium text-gray-800 dark:text-gray-200">{{ $t('creation_date') }}</div>
          <div class="col-span-2 flex justify-end text-gray-500 dark:text-gray-400">
            {{ formatLocaleDate(order.createdAt, 'yyyy-MM-dd hh:mm:ss') }}
          </div>
        </div>
        <div class="w-full">
          <div class="grid grid-cols-4 sm:grid-cols-5 mt-1 text-md font-medium">
            <div class="col-span-2 font-medium text-gray-800 dark:text-gray-200">{{ $t('Quantity') }}</div>
            <div class="col-span-2 flex justify-end font-bold text-gray-900 dark:text-gray-100">{{ order.quantity }}</div>
          </div>
          <div class="grid grid-cols-4 sm:grid-cols-5 mt-1 text-md font-medium">
            <div class="col-span-2 font-medium text-gray-800 dark:text-gray-200">{{ $t('order_ori_price') }}</div>
            <div class="col-span-2 flex justify-end font-bold text-gray-900 dark:text-gray-100"> {{ order.oriPrice }} {{ $t('USD') }}</div>
          </div>
          <div v-if="order.coupon !== ''" class="grid grid-cols-4 sm:grid-cols-5 mt-1 text-md font-medium">
            <div class="col-span-2 font-medium text-gray-800 dark:text-gray-200">{{ $t('order_coupon') }}</div>
            <div class="col-span-2 flex justify-end font-bold text-gray-900 dark:text-gray-100">
              {{ Math.round((order.price - order.oriPrice) * 100000) / 100000 }} {{ $t('USD') }}
            </div>
          </div>
          <div class="grid grid-cols-4 sm:grid-cols-5 mt-1 text-md font-medium">
            <div class="col-span-2 font-medium text-gray-800 dark:text-gray-200">{{ $t('order_pay_price') }}</div>
            <div class="col-span-2 flex justify-end font-bold text-gray-900 dark:text-gray-100"> {{ order.price }} {{ $t('USD') }}</div>
          </div>
        </div>

        <div v-if="payStatus === 'WAIT'">
          <div>
            <div class="mt-2">
              <span class="text-xs text-gray-500 dark:text-gray-400">{{ $t('order_countdown') }}</span>
              <span class="ml-2">
                <span class="countdown font-mono text-xl text-gray-800 dark:text-gray-200">
                  <span :style="{ '--value': counterMinutes }"></span>
                </span>
                <span class="text-xs font-medium text-gray-600 dark:text-gray-400">{{ $t('minutes') }}</span>
              </span>
              <span class="ml-2">
                <span class="countdown font-mono text-xl text-gray-800 dark:text-gray-200">
                  <span :style="{ '--value': counterSeconds }"></span>
                </span>
                <span class="text-xs font-medium text-gray-600 dark:text-gray-400">{{ $t('seconds') }}</span>
              </span>
            </div>
            <div class="mt-3">
              <OrderPayments :order="order" />
            </div>
          </div>

          <div class="mt-2 space-y-1">
            <p class="text-sm font-medium text-red-600 dark:text-red-400">* {{ $t('order_tip1') }}</p>
            <p v-if="order.anonymous" class="text-sm font-medium text-red-600 dark:text-red-400">
              * {{ $t('order_anonymous_tip') }}
              <NuxtLink target="_blank" :to="localePath('/order/search')" class="text-blue-500 dark:text-blue-400 font-bold hover:text-blue-600 dark:hover:text-blue-300">
                👉 [link]
              </NuxtLink>
            </p>
          </div>
        </div>
        <div v-else-if="payStatus === 'PAID'">
          <div class="mt-5 text-sm font-bold text-blue-500 dark:text-blue-400">
            {{ $t('order_paid') }}
          </div>
        </div>
        <div v-else-if="payStatus === 'DONE'">
          <div class="mt-5 text-sm font-bold text-green-500 dark:text-green-400">
            {{ $t('order_done') }}
          </div>
        </div>
        <div v-else-if="payStatus === 'EXPIRED'">
          <div class="mt-5 text-sm font-bold text-red-500 dark:text-red-400">
            {{ $t('order_expired') }}
          </div>
        </div>
        <div v-else-if="payStatus === 'REFUND'">
          <div class="mt-5 text-sm font-bold text-red-500 dark:text-red-400">
            {{ $t('txn_order_status_REFUND') }}
          </div>
        </div>
        <div v-else-if="payStatus === 'ERROR'">
          <div class="mt-5 text-sm font-bold text-red-500 dark:text-red-400">
            {{ $t(orderErrorMsg) }}
          </div>
        </div>
      </div>
    </div>

    <div v-if="isNotEmptyObj(order) && order.digitalItemsStr" class="space-y-4">
      <div class="border-t border-gray-200 dark:border-gray-700"></div>

      <div id="digitalItems" class="grid grid-cols-1 space-y-2">
        <div class="flex items-center">
          <div class="pr-2 text-lg font-medium text-gray-500 dark:text-gray-400">{{ $t('order_digital_items') }}</div>
          <BtnCopy :text="order.digitalItemsStr" btn-size="small" />
        </div>
        <div>
          <textarea :value="order.digitalItemsStr" type="text" rows="5" maxlength="1000000"
            class="w-full px-3 py-2 border rounded-md border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 focus:bg-white dark:focus:bg-gray-600 text-gray-800 dark:text-gray-100 focus:ring-gray-900 dark:focus:ring-gray-400 focus:border-gray-900 dark:focus:border-gray-500"
            required>
        </textarea>
        </div>
      </div>
    </div>

    <div class="space-y-4">

      <div class="border-t border-gray-200 dark:border-gray-700"></div>

      <div class="space-y-2">
        <div class="text-md font-bold text-gray-500 dark:text-gray-400">{{ $t('sku_desc') }}</div>
        <div class="text-sm text-gray-600 dark:text-gray-300 whitespace-pre-wrap leading-relaxed">
          <TextWithLinks :text="descI18n(locale, order.sku)" />
        </div>

        <div v-if="order.sku.docLink" class="text-xs">
          <span class="text-xs text-gray-800 dark:text-gray-200 font-medium">{{ $t('more_see_doc') }}</span>
          👉 <a target="_blank" :href="order.sku.docLink" class="font-medium underline text-blue-500 dark:text-blue-400 hover:text-blue-600 dark:hover:text-blue-300">[link]</a>
        </div>
      </div>

      <div class="space-y-2">
        <div class="text-md font-bold text-gray-500 dark:text-gray-400">{{ $t('project_desc') }}</div>
        <div class="text-sm text-gray-600 dark:text-gray-300 whitespace-pre-wrap leading-relaxed">
          <TextWithLinks :text="descI18n(locale, order.project)" />
        </div>
      </div>
    </div>
  </section>

</template>