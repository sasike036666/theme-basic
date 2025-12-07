<script setup>
const props = defineProps(['contacts', 'vertical'])
const contacts = props.contacts
const vertical = props.vertical || false
const contactTypes = useContactTypes()
<<<<<<< HEAD

// 检测是否是 URL 链接
const isUrl = (str) => {
  if (!str || typeof str !== 'string') return false
  const urlPattern = /^(https?:\/\/|www\.)/i
  return urlPattern.test(str.trim())
}

// 格式化 URL（确保有协议）
const formatUrl = (str) => {
  if (!str) return str
  const trimmed = str.trim()
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    return trimmed
  }
  if (trimmed.startsWith('www.')) {
    return 'https://' + trimmed
  }
  return trimmed
}
</script>

<template>
  <button onclick="merchantContacts.showModal()" 
    class="btn bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 dark:from-orange-600 dark:to-orange-700 dark:hover:from-orange-500 dark:hover:to-orange-600 btn-sm rounded-md shadow-md hover:shadow-xl transition-all duration-200 border-0 text-white font-bold px-4 py-2">
    <span class="text-white font-bold drop-shadow-sm">{{ $t('Contact_Merchant') }}</span>
  </button>
  <dialog id="merchantContacts" class="modal">
    <div class="modal-box bg-white dark:bg-gray-800 shadow-2xl border-2 border-gray-200 dark:border-gray-700 max-w-2xl">
      <h3 class="text-lg font-bold mb-4 text-gray-900 dark:text-gray-100 pb-2 border-b border-gray-200 dark:border-gray-700">{{ $t('Contact_Merchant') }}</h3>

      <div>
        <p v-if="!isNotEmptyObj(contacts)" class="text-xs text-gray-500 dark:text-gray-400">
=======
</script>

<template>
  <button onclick="merchantContacts.showModal()" class="btn bg-orange-500 hover:bg-orange-400 btn-sm rounded-md">
    <span class="text-white font-bold">{{ $t('Contact_Merchant') }}</span>
  </button>
  <dialog id="merchantContacts" class="modal">
    <div class="modal-box">
      <h3 class="text-lg font-bold mb-4">{{ $t('Contact_Merchant') }}</h3>

      <div>
        <p v-if="!isNotEmptyObj(contacts)" class="text-xs text-gray-500">
>>>>>>> 28c057707b7e6a909b440e39f2dbd21fbe900ebd
          {{ $t('no_provider_contact_info') }}
        </p>
        <div v-else class="flex flex-wrap gap-y-1 gap-x-4" :class="{ 'grid grid-col-1': vertical }">
          <template v-for="contactType in contactTypes">
<<<<<<< HEAD
            <p v-if="contacts[contactType.key]" class="text-sm my-1 text-gray-800 dark:text-gray-300">
              <span class="badge badge-ghost border-0 font-medium mr-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
                {{ contactType.value }}
              </span>
              <template v-if="isUrl(contacts[contactType.key])">
                <a :href="formatUrl(contacts[contactType.key])" 
                   target="_blank" 
                   rel="noopener noreferrer"
                   class="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 underline hover:underline-offset-2 transition-colors duration-200">
                  {{ contacts[contactType.key] }}
                </a>
              </template>
              <template v-else>
                {{ contacts[contactType.key] }}
              </template>
=======
            <p v-if="contacts[contactType.key]" class="text-sm my-1">
              <span class="badge badge-ghost border-0 font-medium mr-1">
                {{ contactType.value }}
              </span>
              {{ contacts[contactType.key] }}
>>>>>>> 28c057707b7e6a909b440e39f2dbd21fbe900ebd
            </p>
          </template>
        </div>
      </div>
<<<<<<< HEAD
      <div class="modal-action">
        <form method="dialog">
          <button class="btn btn-primary bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 text-white border-0">关闭</button>
        </form>
      </div>
    </div>
    <form method="dialog" class="modal-backdrop bg-black/50 dark:bg-black/70">
=======
    </div>
    <form method="dialog" class="modal-backdrop">
>>>>>>> 28c057707b7e6a909b440e39f2dbd21fbe900ebd
      <button>close</button>
    </form>
  </dialog>
</template>
