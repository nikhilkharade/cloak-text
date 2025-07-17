import { usePIIDetector } from './usePIIDetector'
import { generateReplacement } from '@/utils/replacements'

interface DetectedItem {
  type: string;
  field?: string;
  value: string;
  masked: string;
}

interface MaskingResult {
  maskedData: any;
  detected: DetectedItem[];
  replacementCount: number;
}

interface ReplacedRange {
  start: number;
  end: number;
}

interface DataMaskingReturn {
  smartMaskData: (data: any, strategy?: string) => MaskingResult;
  processAsText: (input: string, outputFormat: string) => MaskingResult;
  processAsCSV: (input: string, outputFormat: string) => MaskingResult;
}

export const useDataMasking = (): DataMaskingReturn => {
  const { isSensitiveFieldName, detectDataType, patterns } = usePIIDetector()

  // Smart JSON masking function
  const smartMaskData = (data: any, strategy: string = 'types'): MaskingResult => {
    const detected: DetectedItem[] = []
    let replacementCount = 0

    const processValue = (obj: any, key: string, path: string = ''): void => {
      const value = obj[key]
      const fullPath = path ? `${path}.${key}` : key
      
      if (typeof value === 'string' && value.trim()) {
        // Check if field name suggests sensitive data or if value matches patterns
        const isSensitiveField = isSensitiveFieldName(key)
        const dataType = detectDataType(value, key)
        
        if (isSensitiveField || dataType) {
          const type = dataType || 'sensitive'
          const replacement = generateReplacement(value, type, strategy)
          
          detected.push({
            type: type.toUpperCase(),
            field: fullPath,
            value: value.length > 30 ? value.slice(0, 30) + '...' : value,
            masked: replacement
          })
          
          obj[key] = replacement
          replacementCount++
        }
      } else if (typeof value === 'number') {
        // Check if it's a coordinate or suspicious ID
        if (key.toLowerCase().includes('coord') || key.toLowerCase().includes('lat') || key.toLowerCase().includes('lon')) {
          const replacement = generateReplacement(value.toString(), 'coordinate', strategy)
          detected.push({
            type: 'COORDINATE',
            field: fullPath,
            value: value.toString(),
            masked: replacement
          })
          obj[key] = strategy === 'types' ? 'number' : (strategy === 'placeholders' ? '[COORD]' : parseFloat(replacement))
          replacementCount++
        }
      } else if (Array.isArray(value)) {
        value.forEach((item: any, index: number) => {
          if (typeof item === 'object' && item !== null) {
            Object.keys(item).forEach(subKey => {
              processValue(item, subKey, `${fullPath}[${index}]`)
            })
          } else if (typeof item === 'string') {
            const dataType = detectDataType(item, key)
            if (dataType) {
              const replacement = generateReplacement(item, dataType, strategy)
              detected.push({
                type: dataType.toUpperCase(),
                field: `${fullPath}[${index}]`,
                value: item.length > 30 ? item.slice(0, 30) + '...' : item,
                masked: replacement
              })
              value[index] = replacement
              replacementCount++
            }
          }
        })
      } else if (typeof value === 'object' && value !== null) {
        Object.keys(value).forEach(subKey => {
          processValue(value, subKey, fullPath)
        })
      }
    }

    // Create a deep copy to avoid modifying original
    const dataCopy = JSON.parse(JSON.stringify(data))
    
    if (typeof dataCopy === 'object' && dataCopy !== null) {
      Object.keys(dataCopy).forEach(key => {
        processValue(dataCopy, key)
      })
    }

    return {
      maskedData: dataCopy,
      detected,
      replacementCount
    }
  }

  // Helper function for text processing
  const processAsText = (input: string, outputFormat: string): MaskingResult => {
    const detected: DetectedItem[] = []
    let replacementCount = 0

    // Split into lines and process each
    const lines = input.split('\n')
    const processedLines = lines.map(line => {
      let processedLine = line
      
      // Check for key-value pairs (e.g., "Name: John Doe")
      const keyValueMatch = line.match(/^([^:]+):\s*(.+)$/)
      if (keyValueMatch) {
        const [, key, value] = keyValueMatch
        const dataType = detectDataType(value.trim(), key.trim())
        const isSensitiveField = isSensitiveFieldName(key.trim())
        
        if (dataType || isSensitiveField) {
          const type = dataType || 'sensitive'
          const replacement = generateReplacement(value.trim(), type, outputFormat)
          
          detected.push({
            type: type.toUpperCase(),
            value: value.trim().length > 20 ? value.trim().slice(0, 20) + '...' : value.trim(),
            masked: replacement
          })
          
          processedLine = `${key}: ${replacement}`
          replacementCount++
        }
      } else {
        // Track what's been replaced to avoid double replacement
        let replacedRanges: ReplacedRange[] = []
        
        // Check for standalone patterns in priority order
        const patternOrder = [
          'email', 'phone', 'panNumber', 'jwt', 'apiKey', 'uuid', 
          'creditCard', 'ssn', 'iban', 'ipAddress', 'macAddress', 
          'url', 'date', 'address', 'name', 'licensePlate', 'objectId'
        ]
        
        patternOrder.forEach(type => {
          const pattern = patterns[type]
          if (pattern) {
            const matches = [...processedLine.matchAll(pattern)]
            matches.forEach(match => {
              const original = match[0]
              const startIndex = match.index || 0
              const endIndex = startIndex + original.length
              
              // Check if this range overlaps with already replaced text
              const overlaps = replacedRanges.some(range => 
                (startIndex < range.end && endIndex > range.start)
              )
              
              if (!overlaps && original.trim()) {
                const replacement = generateReplacement(original, type, outputFormat)
                
                detected.push({
                  type: type.toUpperCase(),
                  value: original.length > 20 ? original.slice(0, 20) + '...' : original,
                  masked: replacement
                })
                
                processedLine = processedLine.replace(original, replacement)
                replacedRanges.push({ start: startIndex, end: endIndex })
                replacementCount++
              }
            })
          }
        })
      }
      
      return processedLine
    })

    return {
      maskedData: processedLines.join('\n'),
      detected,
      replacementCount
    }
  }

  // Helper function for CSV processing
  const processAsCSV = (input: string, outputFormat: string): MaskingResult => {
    const lines = input.split('\n').filter(line => line.trim())
    if (lines.length === 0) return processAsText(input, outputFormat)
    
    const detected: DetectedItem[] = []
    let replacementCount = 0
    
    // Process header row
    const headers = lines[0].split(',').map(h => h.trim().replace(/['"]/g, ''))
    
    // Process data rows
    const processedLines = lines.map((line, lineIndex) => {
      if (lineIndex === 0) return line // Keep header as-is for now
      
      const values = line.split(',').map(v => v.trim().replace(/['"]/g, ''))
      const processedValues = values.map((value, colIndex) => {
        const header = headers[colIndex] || `col${colIndex}`
        const dataType = detectDataType(value, header)
        const isSensitiveField = isSensitiveFieldName(header)
        
        if (dataType || isSensitiveField) {
          const type = dataType || 'sensitive'
          const replacement = generateReplacement(value, type, outputFormat)
          
          detected.push({
            type: type.toUpperCase(),
            value: value.length > 20 ? value.slice(0, 20) + '...' : value,
            masked: replacement,
            field: `${header} (row ${lineIndex})`
          })
          
          replacementCount++
          return replacement
        }
        return value
      })
      
      return processedValues.join(', ')
    })
    
    return {
      maskedData: processedLines.join('\n'),
      detected,
      replacementCount
    }
  }

  return {
    smartMaskData,
    processAsText,
    processAsCSV
  }
} 