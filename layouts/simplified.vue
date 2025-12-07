<script setup>
import { nameI18n } from '~/utils/i18n';

const { locale } = useI18n()
const localePath = useLocalePath()
const basicInfo = await stateMerchant.basic(true)
const themeId = basicInfo.website ? basicInfo.website.theme : '1'
const scripts = basicInfo.website ? basicInfo.website.script : ''
</script>

<template>
  <NuxtLayout v-if="!isNotEmptyObj(basicInfo)" name="default">
    <p class="mt-40 text-xl font-medium flex items-center justify-center">
      Missing NUXT_IDATARIVER_MERCHANT_SECRET 😉
    </p>
  </NuxtLayout>
  <NuxtLayout v-else name="default">
    <div class="fixed top-0 z-50 w-full flex items-center justify-center bg-white dark:bg-gray-800 transition-colors duration-300 shadow-sm dark:shadow-gray-900/50">
      <div class="w-full bg-white dark:bg-gray-800 px-4 transition-colors duration-300"
        :class="{ 'max-w-screen-xl': themeId == '1' ,  'max-w-screen-lg': themeId == '2' }">
        <div class="flex items-center h-16">
          <div class="flex items-center justify-center bg-white dark:bg-gray-800 gap-x-2 transition-colors duration-300">
            <div class="relative flex-shrink-0">
              <NuxtImg src="/logo.png" alt="Logo" 
                class="w-9 h-9 object-cover rounded-full ring-2 ring-blue-500/20 dark:ring-blue-400/30 shadow-md hover:shadow-lg transition-all duration-300 hover:scale-110" />
            </div>
            <NuxtLink :to="localePath('/')" class="merchant-name text-lg font-bold text-gray-900 dark:text-gray-100 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-200 ml-2 tracking-wide">
              {{ nameI18n(locale, basicInfo) }}
            </NuxtLink>
          </div>
          <div class="flex-grow" />
          <div class="flex items-center space-x-0.5">
            <NuxtLink :to="localePath('/order/search')" class="btn btn-sm btn-outline rounded-md dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700">
              {{ $t('header_search_order') }}
            </NuxtLink>
            <LangSwitcher />
          </div>
        </div>
      </div>
    </div>

    <div class="mt-16 w-full flex items-center justify-center bg-gray-50 dark:bg-gray-900 transition-colors duration-300 min-h-[calc(100vh-4rem)]">
      <div class="w-full">
        <slot />
      </div>
    </div>

    <Footer />

    <template v-if="scripts">
      <div v-html="scripts"></div>
    </template>
  </NuxtLayout>
</template>

<style>
.merchant-name {
  display: -webkit-box;
  /* 将元素作为弹性伸缩盒子展示 */
  -webkit-line-clamp: 1;
  line-clamp: 1;
  /* 限制文本行数为 1 行 */
  -webkit-box-orient: vertical;
  /* 设置伸缩盒子为垂直方向 */
  overflow: hidden;
  /* 隐藏溢出文本 */
  text-overflow: ellipsis;
  /* 使用省略号截断溢出文本 */
}
</style>