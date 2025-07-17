import { computed } from 'vue'
import { AlertTriangle, CheckCircle } from 'lucide-vue-next'

export const useMessageStyling = (errorMessage) => {
  // Determine message type based on content
  const getMessageType = () => {
    if (!errorMessage.value) return 'info'
    
    const message = errorMessage.value.toLowerCase()
    if (message.includes('issue') || message.includes('wrong') || message.includes('error') || message.includes('couldn\'t')) {
      return 'error'
    } else if (message.includes('detected') || message.includes('coming soon') || message.includes('processing')) {
      return 'info'
    } else {
      return 'warning'
    }
  }

  // Computed properties for dynamic styling
  const messageStyle = computed(() => {
    const type = getMessageType()
    switch (type) {
      case 'error':
        return 'bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800'
      case 'warning':
        return 'bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-800'
      case 'info':
        return 'bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800'
      default:
        return 'bg-gray-50 dark:bg-gray-900/30 border border-gray-200 dark:border-gray-800'
    }
  })

  const messageIcon = computed(() => {
    const type = getMessageType()
    switch (type) {
      case 'error':
        return AlertTriangle
      case 'warning':
        return AlertTriangle
      case 'info':
        return CheckCircle
      default:
        return AlertTriangle
    }
  })

  const iconColor = computed(() => {
    const type = getMessageType()
    switch (type) {
      case 'error':
        return 'text-red-500'
      case 'warning':
        return 'text-yellow-500'
      case 'info':
        return 'text-blue-500'
      default:
        return 'text-gray-500'
    }
  })

  const titleColor = computed(() => {
    const type = getMessageType()
    switch (type) {
      case 'error':
        return 'text-red-800 dark:text-red-200'
      case 'warning':
        return 'text-yellow-800 dark:text-yellow-200'
      case 'info':
        return 'text-blue-800 dark:text-blue-200'
      default:
        return 'text-gray-800 dark:text-gray-200'
    }
  })

  const messageColor = computed(() => {
    const type = getMessageType()
    switch (type) {
      case 'error':
        return 'text-red-700 dark:text-red-300'
      case 'warning':
        return 'text-yellow-700 dark:text-yellow-300'
      case 'info':
        return 'text-blue-700 dark:text-blue-300'
      default:
        return 'text-gray-700 dark:text-gray-300'
    }
  })

  const messageTitle = computed(() => {
    const type = getMessageType()
    switch (type) {
      case 'error':
        return 'Format Issue'
      case 'warning':
        return 'Heads Up'
      case 'info':
        return 'Info'
      default:
        return 'Notice'
    }
  })

  return {
    messageStyle,
    messageIcon,
    iconColor,
    titleColor,
    messageColor,
    messageTitle
  }
} 