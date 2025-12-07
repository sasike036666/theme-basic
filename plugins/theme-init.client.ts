export default defineNuxtPlugin(() => {
  if (process.client) {
    // 在页面加载前立即设置主题，避免闪烁
    const savedTheme = localStorage.getItem('theme')
    if (savedTheme === 'light') {
      document.documentElement.classList.remove('dark')
    } else {
      // 默认使用暗色模式
      document.documentElement.classList.add('dark')
    }
  }
})


