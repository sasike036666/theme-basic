// 检测是否是 URL
export const isUrl = (str: string): boolean => {
  if (!str || typeof str !== 'string') return false
  const urlPattern = /^(https?:\/\/|www\.)/i
  return urlPattern.test(str.trim())
}

// 格式化 URL（确保有协议）
export const formatUrl = (str: string): string => {
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

// 解析文本中的 URL 并返回分段数组
export const parseTextWithLinks = (text: string): Array<{ type: 'text' | 'link', content: string, url?: string }> => {
  if (!text) return []
  
  // 匹配 http://, https://, 或 www. 开头的 URL
  const urlRegex = /(https?:\/\/[^\s]+|www\.[^\s]+)/gi
  const parts: Array<{ type: 'text' | 'link', content: string, url?: string }> = []
  let lastIndex = 0
  let match

  while ((match = urlRegex.exec(text)) !== null) {
    // 添加 URL 之前的文本
    if (match.index > lastIndex) {
      parts.push({
        type: 'text',
        content: text.substring(lastIndex, match.index)
      })
    }
    
    // 添加 URL
    const url = match[0]
    parts.push({
      type: 'link',
      content: url,
      url: formatUrl(url)
    })
    
    lastIndex = match.index + url.length
  }
  
  // 添加剩余的文本
  if (lastIndex < text.length) {
    parts.push({
      type: 'text',
      content: text.substring(lastIndex)
    })
  }
  
  // 如果没有找到 URL，返回整个文本
  if (parts.length === 0) {
    parts.push({
      type: 'text',
      content: text
    })
  }
  
  return parts
}


