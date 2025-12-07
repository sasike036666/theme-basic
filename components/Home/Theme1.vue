<script setup>
const { locale } = useI18n()
const translate = useNuxtApp().$i18n.t

const selectedCate = ref({ name: translate('All'), code: 'all' })
const cates = ref([])
const skus = ref([])
const keyword = ref('')
const selectedSKU = useState('SelectedSKU', () => { return {} })

<<<<<<< HEAD
// 暗色模式状态管理（默认暗色）
const isDark = ref(true)

// 初始化主题（从 localStorage 读取或默认使用暗色模式）
onMounted(() => {
  if (process.client) {
    const savedTheme = localStorage.getItem('theme')
    
    if (savedTheme) {
      isDark.value = savedTheme === 'dark'
    } else {
      // 默认使用暗色模式
      isDark.value = true
    }
    
    updateTheme()
  }
})

// 切换主题
const toggleTheme = () => {
  isDark.value = !isDark.value
  updateTheme()
  if (process.client) {
    localStorage.setItem('theme', isDark.value ? 'dark' : 'light')
  }
}

// 更新主题类
const updateTheme = () => {
  if (process.client) {
    const html = document.documentElement
    if (isDark.value) {
      html.classList.add('dark')
    } else {
      html.classList.remove('dark')
    }
  }
}

// 监听系统主题变化（已禁用，因为默认使用暗色模式）
// onMounted(() => {
//   if (process.client) {
//     const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
//     const handleChange = (e) => {
//       if (!localStorage.getItem('theme')) {
//         isDark.value = e.matches
//         updateTheme()
//       }
//     }
//     mediaQuery.addEventListener('change', handleChange)
//     
//     return () => {
//       mediaQuery.removeEventListener('change', handleChange)
//     }
//   }
// })

=======
>>>>>>> 28c057707b7e6a909b440e39f2dbd21fbe900ebd
const filterSkus = (projects, keyword = '') => {
  const allCates = [{ name: translate('All'), code: 'all' }]
  const showSkus = []

  projects.forEach((project) => {
    if (!['DIGITAL', 'MANUAL', 'LICENSE', 'GROUP', 'VPN'].includes(project.type)) {
      return
    }

    allCates.push({
      'name': nameI18n(locale, project),
      'code': project.slug,
    })

    const curSkus = project.skus || []
    curSkus.forEach((sku) => {
      if (selectedCate.value.code != 'all' && selectedCate.value.code != project.slug) { return }

      const searchContent = `${nameI18n(locale, project)} ${nameI18n(locale, sku)}`.toLowerCase()
      if (keyword && !searchContent.includes(keyword.toLowerCase())) { return }

      sku.projectSlug = project.slug
      sku.cover = project.cover
      sku.project = {
        id: project.id,
        type: project.type,
        name: project.name,
        nameI18n: project.nameI18n,
        desc: project.desc,
        descI18n: project.descI18n,
        hasCoupons: project.hasCoupons,
      }
      sku.order.affCode = project.aff
      showSkus.push(sku)
    })
  })

  cates.value = allCates
  skus.value = showSkus
}

const props = defineProps(['merchant'])
const merchant = useDataMerchantInfo()
merchant.value = props.merchant
const siteSettings = merchant.value.website ? merchant.value.website.settings : {}

filterSkus(merchant.value.projects)

watch(merchant, () => {
  const merchantInfo = merchant.value
  if (!isNotEmptyObj(merchantInfo)) { return }
  filterSkus(merchantInfo.projects)
})

watch(keyword, () => {
  filterSkus(merchant.value.projects, keyword.value)
})

const changeCate = (code) => {
  cates.value.forEach((cate) => {
    if (cate.code == code) {
      selectedCate.value = cate
    }
  })
  filterSkus(merchant.value.projects)
}

const selectSKU = (sku) => {
  selectedSKU.value = sku
}

onMounted(() => {
  stateMerchant.info(false);
});
</script>

<<<<<<< HEAD
<template>
  <section class="flex justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
    <div v-if="isNotEmptyObj(merchant)" class="w-full max-w-screen-xl space-y-6 px-4 py-6">

      <!-- Header Section -->
      <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-lg dark:shadow-gray-900/50 p-6 transition-colors duration-300">
        <div class="flex flex-col md:flex-row items-center justify-between gap-4">
          <div class="flex items-center gap-4">
            <BtnMerchantIntro :intro="descI18n(locale, merchant)" :siteSettings="siteSettings" />
          </div>

          <div class="flex items-center gap-3 flex-1 justify-end">
            <!-- 主题切换按钮 -->
            <button @click="toggleTheme" 
              class="p-2.5 rounded-xl bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200"
              :title="isDark ? $t('Switch to light mode') || '切换到亮色模式' : $t('Switch to dark mode') || '切换到暗色模式'">
              <!-- 太阳图标 (亮色模式) -->
              <svg v-if="isDark" class="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clip-rule="evenodd" />
              </svg>
              <!-- 月亮图标 (暗色模式) -->
              <svg v-else class="w-5 h-5 text-gray-700 dark:text-gray-300" fill="currentColor" viewBox="0 0 20 20">
                <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
              </svg>
            </button>

            <div v-if="!isNotEmptyObj(selectedSKU)" class="max-w-md w-full">
              <div class="relative">
                <div class="absolute inset-y-0 start-0 flex items-center ps-4 pointer-events-none">
                  <svg class="w-5 h-5 text-gray-400 dark:text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
                  </svg>
                </div>
                <input type="search" v-model="keyword"
                  class="block w-full p-3 ps-12 text-sm text-gray-900 dark:text-gray-100 border-2 border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 transition-all placeholder-gray-400 dark:placeholder-gray-500"
                  :placeholder="$t('Search')" />
              </div>
            </div>
            <BtnMerchantContact :contacts="merchant.contacts" :vertical="true" />
          </div>
        </div>
      </div>

      <!-- Carousel Section -->
      <ClientOnly v-if="!isNotEmptyObj(selectedSKU)">
        <div class="rounded-2xl overflow-hidden shadow-xl">
          <Carousel :siteSettings="siteSettings" />
        </div>
      </ClientOnly>

      <!-- Products Section -->
      <div v-if="!isNotEmptyObj(selectedSKU)" id="skus" class="space-y-6">
        <!-- Category Filter -->
        <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-lg dark:shadow-gray-900/50 p-6 transition-colors duration-300">
          <div class="flex flex-wrap gap-3">
            <button v-for="cate in cates" @click="changeCate(cate.code)"
              class="px-6 py-2.5 text-sm font-medium rounded-xl transition-all duration-200"
              :class="selectedCate.code == cate.code 
                ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-md shadow-blue-500/50 dark:shadow-blue-500/30' 
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 hover:shadow-md'">
              {{ cate.name }}
            </button>
          </div>
        </div>

        <!-- Category Title -->
        <div v-if="selectedCate.code != 'all'" class="px-2">
          <h2 class="text-2xl font-bold text-gray-800 dark:text-gray-100 flex items-center gap-2 transition-colors duration-300">
            <span class="w-1 h-6 bg-gradient-to-b from-blue-600 to-blue-400 rounded-full"></span>
            {{ selectedCate.name }}
          </h2>
        </div>

        <!-- Products Grid -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <div v-for="sku in skus" @click="selectSKU(sku)"
            class="group relative bg-white dark:bg-gray-800 rounded-2xl shadow-lg dark:shadow-gray-900/50 hover:shadow-2xl dark:hover:shadow-gray-900/70 transition-all duration-300 cursor-pointer overflow-hidden transform hover:-translate-y-2">
            
            <!-- Sold Out Badge -->
            <span v-if="sku.stock == 0"
              class="absolute top-4 right-4 z-20 bg-gray-800 dark:bg-gray-700 text-white px-4 py-1.5 rounded-full text-xs font-semibold shadow-lg">
              {{ $t('Sold_out') }}
            </span>

            <!-- Product Image -->
            <div class="relative overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800">
              <div class="aspect-square flex items-center justify-center p-6">
                <NuxtImg loading="lazy" format="webp" :src="sku.cover" :alt="nameI18n(locale, sku)"
                  class="w-full h-full object-contain group-hover:scale-110 transition-transform duration-300" />
              </div>
              <div class="absolute inset-0 bg-gradient-to-t from-black/10 dark:from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>

            <!-- Product Info -->
            <div class="p-5 space-y-3">
              <!-- Project Name -->
              <div class="text-xs font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wide">
                {{ nameI18n(locale, sku.project) }}
              </div>

              <!-- SKU Name -->
              <div class="sku-name min-h-[3.5rem]">
                <h3 class="text-lg font-bold text-gray-800 dark:text-gray-100 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {{ nameI18n(locale, sku) }}
                </h3>
              </div>

              <!-- Price -->
              <div class="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-gray-700">
                <PriceTag :key="'price-tag-' + sku.id" :price-desc="sku.priceDesc" 
                  price-class="text-2xl font-bold text-blue-600 dark:text-blue-400" 
                  class="flex items-center gap-x-1" />
                <div class="flex items-center text-gray-400 dark:text-gray-500 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </div>

            <!-- Hover Effect Overlay -->
            <div class="absolute inset-0 bg-gradient-to-br from-blue-600/0 to-blue-600/0 group-hover:from-blue-600/5 dark:group-hover:from-blue-600/10 group-hover:to-blue-600/10 dark:group-hover:to-blue-600/20 transition-all duration-300 pointer-events-none"></div>
          </div>
        </div>

        <!-- Empty State -->
        <EmptyContent v-if="skus.length === 0" class="pt-40">{{ $t('No_Skus') }}</EmptyContent>
      </div>

      <!-- Place Order Section -->
=======

<template>
  <section class="flex justify-center">
    <div v-if="isNotEmptyObj(merchant)" class="w-full max-w-screen-xl space-y-4 px-4 my-2">

      <div class="mt-4 flex items-center">
        <div>
          <BtnMerchantIntro :intro="descI18n(locale, merchant)" :siteSettings="siteSettings" />
        </div>

        <div class="flex-grow" />

        <div class="flex items-center gap-x-2">
          <div v-if="!isNotEmptyObj(selectedSKU)" class="max-w-md mx-auto">
            <div class="relative">
              <div class="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                <svg class="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                  <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
                </svg>
              </div>
              <input type="search" v-model="keyword"
                class="block w-full p-1 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-0 focus:border-gray-800"
                :placeholder="$t('Search')" />
            </div>
          </div>
          <BtnMerchantContact :contacts="merchant.contacts" :vertical="true" />
        </div>
      </div>

      <ClientOnly v-if="!isNotEmptyObj(selectedSKU)">
        <Carousel :siteSettings="siteSettings" />
      </ClientOnly>

      <div v-if="!isNotEmptyObj(selectedSKU)" id="skus" class="space-y-4">
        <div class="space-y-2">
          <button v-for="cate in cates" @click="changeCate(cate.code)" class="mr-2 btn btn-xs btn-outline rounded-md"
            :class="{ 'btn-active': selectedCate.code == cate.code }">
            {{ cate.name }}
          </button>
        </div>

        <div v-if="selectedCate.code != 'all'" class="sku-name text-md text-gray-600 font-medium">
          {{ selectedCate.name }}
        </div>

        <!--skus-->
        <div
          class="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-x-3 gap-y-4">
          <div v-for=" sku in skus" @click="selectSKU(sku)"
            class="relative w-full card bg-base-100 shadow-xl rounded-md card-compact cursor-pointer">
            <span v-if="sku.stock == 0"
              class="z-10 absolute -right-px -top-px rounded-bl-2xl rounded-tr-md bg-gray-600 px-3 py-1 text-xs font-medium uppercase tracking-widest text-white">
              {{ $t('Sold_out') }}
            </span>

            <figure>
              <NuxtImg loading="lazy" format="webp" :src="sku.cover" :alt="nameI18n(locale, sku)"
                class="p-2 h-[120px] w-[120px] object-cover" />
            </figure>

            <div class="card-body">

              <div class="project-name text-xs text-gray-400 text-center">
                {{ nameI18n(locale, sku.project) }}
              </div>

              <div class="sku-name h-14 text-center">
                <span class="text-lg font-medium">
                  {{ nameI18n(locale, sku) }}
                </span>
              </div>

              <div class="flex items-center justify-center">
                <PriceTag :key="'price-tag-' + sku.id" :price-desc="sku.priceDesc" class="flex items-center gap-x-1" />
              </div>
            </div>
          </div>
        </div>
        <EmptyContent v-if="skus.length === 0" class="pt-40">{{ $t('No_Skus') }}</EmptyContent>
      </div>
>>>>>>> 28c057707b7e6a909b440e39f2dbd21fbe900ebd
      <div v-else>
        <PlaceOrder />
      </div>

    </div>
<<<<<<< HEAD
    <div v-else class="flex items-center justify-center pt-40 w-full">
      <div class="flex flex-col items-center gap-4">
        <span class="loading loading-infinity loading-lg text-blue-600 dark:text-blue-400"></span>
        <p class="text-gray-500 dark:text-gray-400">{{ $t('Loading') || 'Loading...' }}</p>
      </div>
=======
    <div v-else class="flex items-center justify-center pt-40">
      <span class="loading loading-infinity loading-lg mt-40"></span>
>>>>>>> 28c057707b7e6a909b440e39f2dbd21fbe900ebd
    </div>
  </section>
</template>

<<<<<<< HEAD
<style scoped>
.sku-name {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}

.project-name {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* 卡片悬停效果增强 */
.group:hover {
  z-index: 10;
}

/* 平滑过渡动画 */
.transition-all {
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
}
</style>

=======


<style>
.project-name {
  display: -webkit-box;
  /* 将元素作为弹性伸缩盒子展示 */
  -webkit-line-clamp: 1;
  /* 限制文本行数为 1 行 */
  -webkit-box-orient: vertical;
  /* 设置伸缩盒子为垂直方向 */
  overflow: hidden;
  /* 隐藏溢出文本 */
  text-overflow: ellipsis;
  /* 使用省略号截断溢出文本 */
}

.sku-name {
  display: -webkit-box;
  /* 将元素作为弹性伸缩盒子展示 */
  -webkit-line-clamp: 2;
  /* 限制文本行数为 2 行 */
  -webkit-box-orient: vertical;
  /* 设置伸缩盒子为垂直方向 */
  overflow: hidden;
  /* 隐藏溢出文本 */
  text-overflow: ellipsis;
  /* 使用省略号截断溢出文本 */
}
</style>
>>>>>>> 28c057707b7e6a909b440e39f2dbd21fbe900ebd
