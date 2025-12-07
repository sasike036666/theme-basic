<script setup>
const props = defineProps(['content', 'btnSize'])
const btnSize = props.btnSize || 'large'
const postLoading = usePostLoading()

const isClicked = ref(false)
const setIsClicked = () => {
  isClicked.value = true
}

watchEffect(() => {
  if (postLoading.value === false) {
    isClicked.value = false;
  }
})
</script>

<template>
  <button v-if="postLoading && isClicked" type="submit" disabled
<<<<<<< HEAD
    class="w-full font-bold rounded-md bg-gray-300 dark:bg-gray-600 text-white dark:text-gray-400 cursor-not-allowed transition-colors"
=======
    class="w-full font-bold rounded-md bg-gray-300 text-white cursor-not-allowed"
>>>>>>> 28c057707b7e6a909b440e39f2dbd21fbe900ebd
    :class="{ 'px-8 py-3 text-md': btnSize == 'large', 'px-5 py-2.5 text-sm': btnSize == 'medium', 'px-2 py-1 text-xs': btnSize == 'small' }">
    {{ content }}...
  </button>
  <button v-else type="submit" @click="setIsClicked()"
<<<<<<< HEAD
    class="w-full font-bold rounded-md bg-gray-900 dark:bg-blue-600 text-white hover:bg-gray-800 dark:hover:bg-blue-700 transition-colors"
=======
    class="w-full font-bold rounded-md bg-gray-900 text-white hover:bg-gray-800"
>>>>>>> 28c057707b7e6a909b440e39f2dbd21fbe900ebd
    :class="{ 'px-8 py-3 text-md': btnSize == 'large', 'px-5 py-2.5 text-sm': btnSize == 'medium', 'px-2 py-1 text-xs': btnSize == 'small' }">
    {{ content }}
  </button>
</template>