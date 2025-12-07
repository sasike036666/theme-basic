<script setup>
import { parseTextWithLinks } from '~/utils/linkParser'

const props = defineProps({
  text: {
    type: String,
    required: true
  },
  textClass: {
    type: String,
    default: ''
  }
})

// 处理多行文本，每行单独解析
const processedParts = computed(() => {
  if (!props.text) return []
  
  const lines = props.text.split('\n')
  const result = []
  
  lines.forEach((line) => {
    const lineParts = parseTextWithLinks(line)
    result.push(lineParts)
  })
  
  return result
})
</script>

<template>
  <span :class="textClass">
    <template v-for="(lineParts, lineIndex) in processedParts" :key="lineIndex">
      <template v-for="(part, partIndex) in lineParts" :key="`${lineIndex}-${partIndex}`">
        <template v-if="part.type === 'link'">
          <a 
            :href="part.url" 
            target="_blank" 
            rel="noopener noreferrer"
            class="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 underline hover:underline-offset-2 transition-colors duration-200"
          >
            {{ part.content }}
          </a>
        </template>
        <template v-else>
          {{ part.content }}
        </template>
      </template>
      <br v-if="lineIndex < processedParts.length - 1" />
    </template>
  </span>
</template>

