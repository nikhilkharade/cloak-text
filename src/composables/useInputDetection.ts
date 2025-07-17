import type { InputFormat } from '@/types'

type DetectedType = InputFormat | 'malformed-json' | 'key-value'

interface InputDetectionReturn {
  detectInputType: (input: string) => DetectedType;
  generateErrorMessage: (detectedType: DetectedType) => string;
  handleProcessingError: (error: Error) => string;
}

// Input type detection and error handling
export const useInputDetection = (): InputDetectionReturn => {
  // Enhanced input type detection
  const detectInputType = (input: string): DetectedType => {
    // Check for JSON
    if ((input.startsWith('{') && input.endsWith('}')) || 
        (input.startsWith('[') && input.endsWith(']'))) {
      try {
        JSON.parse(input)
        return 'json'
      } catch (e) {
        return 'malformed-json'
      }
    }
    
    // Check for XML
    if (input.startsWith('<') && input.endsWith('>')) {
      return 'xml'
    }
    
    // Check for YAML (basic detection)
    if (input.includes(':\n') || input.includes(': ') || input.match(/^[a-zA-Z_][\w\s]*:/m)) {
      return 'yaml'
    }
    
    // Check for CSV (multiple commas, potential headers)
    if (input.includes(',') && input.split('\n').length > 1 && input.split(',').length > 2) {
      return 'csv'
    }
    
    // Check for key-value pairs
    if (input.includes(':') && input.split('\n').some(line => line.includes(':'))) {
      return 'key-value'
    }
    
    // Default to plain text
    return 'text'
  }

  // Generate user-friendly error messages
  const generateErrorMessage = (detectedType: DetectedType): string => {
    const messages: Record<DetectedType, string> = {
      'malformed-json': 'Your JSON has a formatting issue. Common fixes: add missing quotes around text, check for extra/missing commas, and ensure all brackets are closed properly.',
      'xml': 'XML format detected! We\'re processing it as plain text for now. Full XML support is coming soon.',
      'yaml': 'YAML format detected! We\'re processing it as plain text for now. Full YAML support is coming soon.',
      'csv': 'CSV format detected! Processing your data with smart header recognition.',
      'json': '',
      'text': '',
      'unknown': '',
      'key-value': ''
    }
    
    return messages[detectedType] || ''
  }

  // Handle processing errors with user-friendly messages
  const handleProcessingError = (error: Error): string => {
    let friendlyMessage = ''
    
    if (error.message.includes('JSON')) {
      friendlyMessage = 'There\'s an issue with your JSON format. Please check for missing quotes, commas, or brackets.'
    } else if (error.message.includes('matchAll')) {
      friendlyMessage = 'We encountered an issue while analyzing your data patterns. Please try refreshing the page and pasting your data again.'
    } else if (error.message.includes('parse') || error.message.includes('unexpected')) {
      friendlyMessage = 'Your data format couldn\'t be processed. Try using valid JSON, CSV, or plain text format.'
    } else if (error.message.includes('memory') || error.message.includes('size')) {
      friendlyMessage = 'Your data is too large to process. Please try with a smaller amount of data.'
    } else {
      friendlyMessage = 'Something went wrong while processing your data. Please try again or use a different data format.'
    }
    
    return friendlyMessage
  }

  return {
    detectInputType,
    generateErrorMessage,
    handleProcessingError
  }
} 