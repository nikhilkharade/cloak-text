<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-slate-800 dark:to-gray-900 transition-all duration-500">
    <!-- Header -->
    <header class="sticky top-0 z-50 backdrop-blur-lg bg-white/90 dark:bg-gray-900/90 border-b border-gray-200 dark:border-gray-700">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">
          <div class="flex items-center space-x-3">
            <div class="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
              <Shield class="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 class="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Cloak
              </h1>
              <p class="text-xs text-gray-600 dark:text-gray-400">Privacy-First Data Masker</p>
            </div>
          </div>
          
          <div class="flex items-center space-x-4">
            <button
              @click="toggleTheme"
              class="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              <Sun v-if="isDark" class="w-4 h-4 text-gray-700 dark:text-gray-300" />
              <Moon v-else class="w-4 h-4 text-gray-700 dark:text-gray-300" />
            </button>
          </div>
        </div>
      </div>
    </header>

    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Hero Section -->
      <div class="text-center mb-12">
        <h2 class="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          Convert Data to Clean Type Schemas
        </h2>
        <p class="text-xl text-gray-700 dark:text-gray-300 max-w-3xl mx-auto">
          Transform sensitive data into clean type definitions or choose from multiple output formats
        </p>
      </div>

      <!-- Main Content -->
      <div class="grid grid-cols-1 xl:grid-cols-2 gap-8">
        <!-- Input Section -->
        <div class="space-y-6">
          <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                <FileText class="w-5 h-5 mr-2 text-blue-500" />
                Original Data
              </h3>
              <div class="flex space-x-2">
                <button
                  @click="loadSampleData"
                  class="px-3 py-1 text-sm bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors"
                >
                  Load Sample
                </button>
                <button
                  @click="clearInput"
                  class="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  Clear
                </button>
              </div>
            </div>
            <textarea
              v-model="inputData"
              @input="maskData"
              placeholder="Paste your sensitive data here... (emails, phone numbers, names, addresses, etc.)"
              class="w-full h-64 p-4 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none font-mono text-sm text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
            ></textarea>
            
            <div class="mt-4 flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
              <span>{{ inputData.length }} characters</span>
              <div class="flex items-center space-x-4">
                <span v-if="inputType" class="flex items-center">
                  <div class="w-2 h-2 bg-blue-500 rounded-full mr-1"></div>
                  {{ inputType.toUpperCase() }}
                </span>
                <span v-if="detectedPatterns.length > 0" class="flex items-center">
                  <AlertTriangle class="w-4 h-4 mr-1 text-orange-500" />
                  {{ detectedPatterns.length }} sensitive pattern(s) detected
                </span>
              </div>
            </div>
            
            <!-- Error/Info Message -->
            <div v-if="errorMessage" class="mt-3 p-3 rounded-lg" :class="messageStyle">
              <div class="flex items-start">
                <component :is="messageIcon" class="w-4 h-4 mt-0.5 mr-2 flex-shrink-0" :class="iconColor" />
                <div>
                  <p class="text-sm font-medium" :class="titleColor">{{ messageTitle }}</p>
                  <p class="text-sm mt-1" :class="messageColor">{{ errorMessage }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Masking Options -->
          <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <Settings class="w-5 h-5 mr-2 text-indigo-500" />
              Masking Options
            </h3>
            
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-800 dark:text-gray-200 mb-2">
                  Output Format
                </label>
                <select
                  v-model="outputFormat"
                  @change="maskData"
                  class="w-full p-2 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 dark:text-gray-100"
                >
                  <option value="types">Data Types</option>
                  <option value="placeholders">Placeholders</option>
                  <option value="anonymize">Anonymized Data</option>
                  <option value="redact">Redacted</option>
                </select>
              </div>

              <div>
                <label class="flex items-center">
                  <input
                    type="checkbox"
                    v-model="preserveStructure"
                    @change="maskData"
                    class="rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500 dark:bg-gray-700"
                  >
                  <span class="ml-2 text-sm text-gray-800 dark:text-gray-200">Preserve original structure</span>
                </label>
              </div>

              <div>
                <label class="flex items-center">
                  <input
                    type="checkbox"
                    v-model="showComments"
                    @change="maskData"
                    class="rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500 dark:bg-gray-700"
                  >
                  <span class="ml-2 text-sm text-gray-800 dark:text-gray-200">Add type comments</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        <!-- Output Section -->
        <div class="space-y-6">
          <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                <Shield class="w-5 h-5 mr-2 text-green-500" />
                Masked Data
              </h3>
              <button
                @click="copyToClipboard"
                class="flex items-center px-3 py-2 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-lg hover:bg-green-200 dark:hover:bg-green-800 transition-colors"
              >
                <Copy class="w-4 h-4 mr-1" />
                {{ copyText }}
              </button>
            </div>
            
            <div class="relative">
              <pre class="w-full h-64 p-4 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-xl overflow-auto font-mono text-sm whitespace-pre-wrap text-gray-900 dark:text-gray-100">{{ maskedData || 'Masked data will appear here...' }}</pre>
              
              <div v-if="maskedData" class="absolute top-2 right-2">
                <div class="flex items-center px-2 py-1 bg-green-100 dark:bg-green-800 text-green-800 dark:text-green-200 rounded-lg text-xs">
                  <CheckCircle class="w-3 h-3 mr-1" />
                  Protected
                </div>
              </div>
            </div>
            
            <div class="mt-4 flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
              <span>{{ maskedData.length }} characters</span>
              <span v-if="maskingStats.replacements > 0" class="flex items-center">
                <ShieldCheck class="w-4 h-4 mr-1 text-green-500" />
                {{ maskingStats.replacements }} items masked
              </span>
            </div>
          </div>

          <!-- Detection Results -->
          <div v-if="detectedPatterns.length > 0" class="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <Eye class="w-5 h-5 mr-2 text-orange-500" />
              Detected Patterns
            </h3>
            
            <div class="space-y-2">
              <div
                v-for="(pattern, index) in detectedPatterns"
                :key="index"
                class="flex items-center justify-between p-3 bg-orange-50 dark:bg-orange-900/30 border border-orange-200 dark:border-orange-700 rounded-lg"
              >
                <div class="flex items-center">
                  <span class="px-2 py-1 bg-orange-200 dark:bg-orange-800 text-orange-900 dark:text-orange-100 rounded text-xs font-medium">
                    {{ pattern.type }}
                  </span>
                  <div class="ml-3">
                    <span class="text-sm text-gray-800 dark:text-gray-200 font-mono">
                      {{ pattern.value }}
                    </span>
                    <div v-if="pattern.field" class="text-xs text-gray-500 dark:text-gray-400">
                      Field: {{ pattern.field }}
                    </div>
                  </div>
                </div>
                <span class="text-xs text-orange-700 dark:text-orange-300">
                  {{ pattern.masked }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Info Cards -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
        <div class="bg-white dark:bg-gray-800 rounded-xl p-6 text-center border border-gray-200 dark:border-gray-700 shadow-lg">
          <Lock class="w-8 h-8 text-blue-500 mx-auto mb-3" />
          <h4 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">Privacy First</h4>
          <p class="text-sm text-gray-700 dark:text-gray-300">All processing happens locally in your browser. No data leaves your device.</p>
        </div>
        
        <div class="bg-white dark:bg-gray-800 rounded-xl p-6 text-center border border-gray-200 dark:border-gray-700 shadow-lg">
          <Zap class="w-8 h-8 text-indigo-500 mx-auto mb-3" />
          <h4 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">Instant Masking</h4>
          <p class="text-sm text-gray-700 dark:text-gray-300">Real-time detection and masking of sensitive patterns as you type.</p>
        </div>
        
        <div class="bg-white dark:bg-gray-800 rounded-xl p-6 text-center border border-gray-200 dark:border-gray-700 shadow-lg">
          <RefreshCw class="w-8 h-8 text-green-500 mx-auto mb-3" />
          <h4 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">Structure Preserved</h4>
          <p class="text-sm text-gray-700 dark:text-gray-300">Maintains data format and context while protecting sensitive information.</p>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, watch } from 'vue'
import { 
  Shield, FileText, Settings, Copy, CheckCircle, ShieldCheck, 
  Eye, Lock, Zap, RefreshCw, AlertTriangle, Sun, Moon 
} from 'lucide-vue-next'

// Import composables
import { useDataMasking } from './composables/useDataMasking'
import { useInputDetection } from './composables/useInputDetection'
import { useMessageStyling } from './composables/useMessageStyling'

// Reactive state
const inputData = ref('')
const maskedData = ref('')
const copyText = ref('Copy')
const isDark = ref(false)
const outputFormat = ref('types')
const preserveStructure = ref(true)
const showComments = ref(false)
const errorMessage = ref('')
const inputType = ref('')

const detectedPatterns = ref([])
const maskingStats = reactive({
  replacements: 0
})

// Initialize composables
const { smartMaskData, processAsText, processAsCSV } = useDataMasking()
const { detectInputType, generateErrorMessage, handleProcessingError } = useInputDetection()
const {
  messageStyle,
  messageIcon,
  iconColor,
  titleColor,
  messageColor,
  messageTitle
} = useMessageStyling(errorMessage)

// Sample data
const sampleData = `{
  "user": {
    "id": "5918fef01f4317db",
    "firstName": "John",
    "lastName": "Smith", 
    "email": "john.smith@company.com",
    "phone": "(555) 123-4567",
    "profilePicUrl": "https://example.com/profiles/john.jpg",
    "address": {
      "street": "1234 Main Street",
      "city": "Anytown",
      "postcode": "4305"
    },
    "coordinates": [153.0234567, -27.5895315],
    "dob": "1990-05-15T00:00:00.000Z",
    "creditCard": "4532 1234 5678 9012",
    "ssn": "123-45-6789"
  }
}`

// Methods
const loadSampleData = () => {
  inputData.value = sampleData
  maskData()
}

const clearInput = () => {
  inputData.value = ''
  maskedData.value = ''
  detectedPatterns.value = []
  maskingStats.replacements = 0
  errorMessage.value = ''
  inputType.value = ''
}

const maskData = () => {
  if (!inputData.value.trim()) {
    clearInput()
    return
  }

  const trimmedInput = inputData.value.trim()
  const detectedType = detectInputType(trimmedInput)
  inputType.value = detectedType

  try {
    if (detectedType === 'json') {
      // Valid JSON processing
      const parsedData = JSON.parse(trimmedInput)
      const result = smartMaskData(parsedData, outputFormat.value)
      
      maskedData.value = JSON.stringify(result.maskedData, null, 2)
      detectedPatterns.value = result.detected.map(item => ({
        type: item.type,
        value: item.value,
        masked: item.masked,
        field: item.field
      }))
      maskingStats.replacements = result.replacementCount
      errorMessage.value = ''
      
    } else if (detectedType === 'malformed-json') {
      // Handle malformed JSON
      errorMessage.value = generateErrorMessage(detectedType)
      maskedData.value = ''
      detectedPatterns.value = []
      maskingStats.replacements = 0
      return
      
    } else if (['xml', 'yaml'].includes(detectedType)) {
      // Basic XML/YAML processing
      errorMessage.value = generateErrorMessage(detectedType)
      const result = processAsText(trimmedInput, outputFormat.value)
      maskedData.value = result.maskedData
      detectedPatterns.value = result.detected
      maskingStats.replacements = result.replacementCount
      
    } else if (detectedType === 'csv') {
      // CSV processing
      errorMessage.value = generateErrorMessage(detectedType)
      const result = processAsCSV(trimmedInput, outputFormat.value)
      maskedData.value = result.maskedData
      detectedPatterns.value = result.detected
      maskingStats.replacements = result.replacementCount
      
    } else {
      // Plain text and key-value processing
      const result = processAsText(trimmedInput, outputFormat.value)
      maskedData.value = result.maskedData
      detectedPatterns.value = result.detected
      maskingStats.replacements = result.replacementCount
      errorMessage.value = ''
    }
    
  } catch (e) {
    errorMessage.value = handleProcessingError(e)
    maskedData.value = ''
    detectedPatterns.value = []
    maskingStats.replacements = 0
  }
}

const copyToClipboard = async () => {
  try {
    await navigator.clipboard.writeText(maskedData.value)
    copyText.value = 'Copied!'
    setTimeout(() => {
      copyText.value = 'Copy'
    }, 2000)
  } catch (err) {
    console.error('Failed to copy text: ', err)
  }
}

const toggleTheme = () => {
  isDark.value = !isDark.value
  document.documentElement.classList.toggle('dark', isDark.value)
  localStorage.setItem('theme', isDark.value ? 'dark' : 'light')
}

// Initialize theme
onMounted(() => {
  const savedTheme = localStorage.getItem('theme')
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
  
  // Default to light theme unless explicitly set to dark
  isDark.value = savedTheme === 'dark' || (savedTheme === null && prefersDark)
  document.documentElement.classList.toggle('dark', isDark.value)
})

// Watch for input changes
watch(inputData, maskData)
</script> 