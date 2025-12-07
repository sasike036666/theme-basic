<script setup>
const props = defineProps(['intro', 'siteSettings'])
const intro = props.intro
const siteSettings = props.siteSettings

onMounted(() => {
  const inform = siteSettings.inform || {}
  if (intro && inform.popup != 'never') {
    merchantNotice.showModal()
  }
});
</script>

<template>
  <button onclick="merchantNotice.showModal()" 
    class="btn bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 dark:from-blue-700 dark:to-blue-800 dark:hover:from-blue-600 dark:hover:to-blue-700 btn-sm rounded-md shadow-md hover:shadow-xl transition-all duration-200 border-0 text-white font-bold px-4 py-2">
    <span class="text-white font-bold drop-shadow-sm">{{ $t('Notice') }}</span>
  </button>
  <dialog ref="merchantNotice" id="merchantNotice" class="modal">
    <div class="modal-box bg-white dark:bg-gray-800 shadow-2xl border-2 border-gray-200 dark:border-gray-700 max-w-2xl">
      <h3 class="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4 pb-2 border-b border-gray-200 dark:border-gray-700">{{ $t('Notice') }}</h3>
      <div class="py-4 whitespace-pre-wrap leading-relaxed text-gray-800 dark:text-gray-300 text-base">
        <TextWithLinks :text="intro" />
      </div>
      <div class="modal-action">
        <form method="dialog">
          <button class="btn btn-primary bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 text-white border-0">关闭</button>
        </form>
      </div>
    </div>
    <form method="dialog" class="modal-backdrop bg-black/50 dark:bg-black/70">
      <button>close</button>
    </form>
  </dialog>
</template>