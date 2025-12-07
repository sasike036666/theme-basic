<script setup>
const { locale } = useI18n()
const sku = useState('SelectedSKU')

const clear = () => {
  sku.value = {}
}
</script>

<template>
  <div v-if="isNotEmptyObj(sku)" id="placeorder" class="space-y-6 w-full">
    <!-- 返回按钮 -->
    <button @click="clear()" 
      class="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200">
      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
      </svg>
      {{ $t('back_to_home') }}
    </button>

    <!-- 页面标题 -->
    <div class="flex items-center gap-3">
      <div class="h-1 w-12 bg-gradient-to-r from-blue-600 to-blue-400 rounded-full"></div>
      <h1 class="text-2xl font-bold text-gray-900 dark:text-gray-100">{{ $t('place_order') }}</h1>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- 商品信息卡片 -->
      <div class="lg:col-span-2 space-y-6">
        <div class="bg-white dark:bg-gray-800 shadow-xl dark:shadow-gray-900/50 rounded-2xl p-6 transition-colors duration-300">
          <!-- 商品头部信息 -->
          <div class="flex flex-col sm:flex-row gap-4 mb-6">
            <div class="flex-shrink-0">
              <div class="w-full sm:w-40 sm:h-40 aspect-square rounded-xl overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 flex items-center justify-center max-w-[160px] sm:max-w-none">
                <NuxtImg loading="lazy" format="webp" :src="sku.cover" :alt="nameI18n(locale, sku)"
                  class="w-full h-full object-contain p-2" />
              </div>
            </div>
            <div class="flex-1">
              <div class="text-sm text-gray-500 dark:text-gray-400 mb-1">{{ nameI18n(locale, sku.project) }}</div>
              <h2 class="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-3">{{ nameI18n(locale, sku) }}</h2>
              
              <!-- 价格显示 -->
              <div class="flex items-baseline gap-2 mb-4">
                <PriceTag :key="'price-tag-' + sku.id" :price-desc="sku.priceDesc" 
                  price-class="text-3xl font-bold text-blue-600 dark:text-blue-400" 
                  class="flex items-center gap-x-1" />
              </div>

              <!-- 商品标签 -->
              <div class="flex flex-wrap gap-2">
                <span class="badge badge-sm font-medium badge-outline rounded-md dark:border-gray-600 dark:text-gray-300">
                  {{ $t('stock') }} {{ displayStock(sku.stock, sku.hiddenStock) }}
                </span>
                <span class="badge badge-sm font-medium badge-outline rounded-md dark:border-gray-600 dark:text-gray-300">
                  {{ $t(sku.project.type) }}
                </span>
                <span v-if="sku.project.type === 'DIGITAL' && sku.itemType === 'reuse'"
                  class="badge badge-sm font-medium badge-outline rounded-md dark:border-gray-600 dark:text-gray-300">
                  {{ $t('at_most_buy_one') }}
                </span>
                <span v-if="sku.project.type === 'DIGITAL'" 
                  class="badge badge-sm font-medium badge-outline rounded-md dark:border-gray-600 dark:text-gray-300">
                  {{ $t('automatic_delivery') }}
                </span>
              </div>
            </div>
          </div>

          <div class="border-t border-gray-200 dark:border-gray-700 pt-6 space-y-6">
            <!-- 商品介绍 -->
            <div class="space-y-3">
              <div class="flex items-center gap-2">
                <div class="w-1 h-5 bg-blue-600 rounded-full"></div>
                <h3 class="text-lg font-bold text-gray-900 dark:text-gray-100">{{ $t('sku_desc') }}</h3>
              </div>
              <div class="text-sm text-gray-600 dark:text-gray-300 whitespace-pre-wrap leading-relaxed pl-3">
                <TextWithLinks :text="descI18n(locale, sku)" />
              </div>
              <div v-if="sku.docLink" class="text-xs pl-3">
                <span class="text-xs text-gray-800 dark:text-gray-200 font-medium">{{ $t('more_see_doc') }}</span>
                👉 <a target="_blank" :href="sku.docLink" class="font-medium underline text-blue-500 dark:text-blue-400 hover:text-blue-600 dark:hover:text-blue-300">[link]</a>
              </div>
            </div>

            <!-- 项目介绍 -->
            <div class="space-y-3">
              <div class="flex items-center gap-2">
                <div class="w-1 h-5 bg-blue-600 rounded-full"></div>
                <h3 class="text-lg font-bold text-gray-900 dark:text-gray-100">{{ $t('project_desc') }}</h3>
              </div>
              <div class="text-sm text-gray-600 dark:text-gray-300 whitespace-pre-wrap leading-relaxed pl-3">
                <TextWithLinks :text="descI18n(locale, sku.project)" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 下单表单卡片 -->
      <div class="lg:col-span-1">
        <div class="bg-white dark:bg-gray-800 shadow-xl dark:shadow-gray-900/50 rounded-2xl p-6 transition-colors duration-300 sticky top-6">
          <form @submit.prevent="stateOrder.add(sku.project.id, sku.id, sku.order)" action="">
            <div class="space-y-6">
              <!-- 价格信息 -->
              <div class="space-y-3">
                <h3 class="text-lg font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                  <svg class="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {{ $t('sku_pricing') }}
                </h3>
                
                <div v-if="!sku.pricing" class="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                  <div class="text-sm font-medium text-red-700 dark:text-red-400">{{ $t('No_Pricing_Tip') }}</div>
                </div>
                <div v-else-if="sku.pricing.policy === 'fixed'" 
                  class="p-4 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30 rounded-xl border border-blue-200 dark:border-blue-700">
                  <div class="text-2xl font-bold text-blue-600 dark:text-blue-400">{{ sku.pricing.price }} USD</div>
                  <div class="text-xs text-gray-600 dark:text-gray-400 mt-1">{{ $t('per_item') }}</div>
                </div>
                <div v-else-if="sku.pricing.policy === 'stage_quantity'" class="space-y-3">
                  <div class="p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                    <div class="text-sm font-medium text-blue-700 dark:text-blue-400">{{ $t('Stage_Price') }}</div>
                  </div>
                  <div class="overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700">
                    <table class="w-full">
                      <thead class="bg-gray-50 dark:bg-gray-700/50">
                        <tr>
                          <th class="px-3 py-2 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 border-b border-gray-200 dark:border-gray-600">
                            {{ $t('Quantity') }}
                          </th>
                          <th class="px-3 py-2 text-right text-xs font-semibold text-gray-700 dark:text-gray-300 border-b border-gray-200 dark:border-gray-600">
                            {{ $t('Unit_Price') }}
                          </th>
                        </tr>
                      </thead>
                      <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
                        <tr v-for="(stage, stage_idx) in sku.pricing.stages" :key="sku.id + '-pricing-stage-' + stage.id" 
                          class="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                          <td class="px-3 py-2 text-xs text-gray-700 dark:text-gray-300">
                            {{ stage.threshold }} &lt;= {{ $t('Quantity') }}<span
                              v-if="stage_idx + 1 < sku.pricing.stages.length">
                              &lt; {{ sku.pricing.stages[stage_idx + 1].threshold }}</span>
                          </td>
                          <td class="px-3 py-2 text-xs font-bold text-gray-900 dark:text-gray-100 text-right">
                            {{ stage.price }} USD
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              <div class="border-t border-gray-200 dark:border-gray-700"></div>

              <!-- 表单输入 -->
              <div class="space-y-5">
                <div class="space-y-2">
                  <label :for="'quantity-input-' + sku.id" 
                    class="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                    {{ $t('Quantity') }}
                  </label>
                  <div class="relative">
                    <input v-model="sku.order.quantity" type="number" :id="'quantity-input-' + sku.id" 
                      data-input-counter :data-input-counter-min="1" :data-input-counter-max="sku.order.maxQuantity"
                      class="w-full px-4 py-3 text-sm border-2 rounded-lg border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-700 placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 transition-all"
                      required />
                  </div>
                </div>

                <div class="space-y-2">
                  <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                    {{ $t('Contact_Information') }}
                  </label>
                  <input v-model="sku.order.contactInfo" type="text" minlength="5"
                    :placeholder="$t('order_contact_info_placeholder')"
                    class="w-full px-4 py-3 text-sm border-2 rounded-lg border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-700 placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 transition-all"
                    required>
                </div>

                <div v-if="sku.project.hasCoupons" class="space-y-2">
                  <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                    {{ $t('Coupon') }}
                    <span class="text-xs font-normal text-gray-500 dark:text-gray-400">({{ $t('Optional') || '可选' }})</span>
                  </label>
                  <input v-model="sku.order.coupon" type="text" maxlength="50"
                    class="w-full px-4 py-3 text-sm border-2 rounded-lg border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-700 placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 transition-all">
                </div>
              </div>

              <!-- 提交按钮 -->
              <div class="pt-4 border-t border-gray-200 dark:border-gray-700">
                <button v-if="sku.stock === 0" type="submit" disabled
                  class="w-full px-6 py-3.5 text-base font-semibold rounded-lg bg-gray-300 dark:bg-gray-600 text-white dark:text-gray-400 cursor-not-allowed flex items-center justify-center gap-2">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  {{ $t('place_order') }}
                </button>
                <BtnSubmit v-else :content="$t('place_order')" :btnSize="'large'" />
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>