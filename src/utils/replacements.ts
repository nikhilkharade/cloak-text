// Replacement strategies for different data types
interface TypeStrategy {
  types: string;
  placeholders: string;
  anonymize: (() => string) | ((value: string) => string);
  redact: (value: string) => string;
}

type ReplacementStrategies = {
  [key: string]: TypeStrategy;
}

export const replacementStrategies: ReplacementStrategies = {
  email: {
    types: 'string',
    placeholders: '[EMAIL]',
    anonymize: (): string => `user${Math.floor(Math.random() * 1000)}@example.com`,
    redact: (value: string): string => '*'.repeat(value.length)
  },
  phone: {
    types: 'string',
    placeholders: '[PHONE]',
    anonymize: (): string => `(555) ${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 9000) + 1000}`,
    redact: (value: string): string => '*'.repeat(value.length)
  },
  name: {
    types: 'string',
    placeholders: '[NAME]',
    anonymize: (): string => {
      const names = ['John Doe', 'Jane Smith', 'Alex Johnson', 'Sam Wilson']
      return names[Math.floor(Math.random() * names.length)]
    },
    redact: (value: string): string => '*'.repeat(value.length)
  },
  id: {
    types: 'string',
    placeholders: '[ID]',
    anonymize: (value: string): string => Math.random().toString(36).substr(2, value.length),
    redact: (value: string): string => '*'.repeat(value.length)
  },
  uuid: {
    types: 'string',
    placeholders: '[UUID]',
    anonymize: (): string => 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => 
      (c === 'x' ? Math.random() * 16 | 0 : (Math.random() * 16 | 0 & 0x3 | 0x8)).toString(16)
    ),
    redact: (value: string): string => '*'.repeat(value.length)
  },
  objectId: {
    types: 'string',
    placeholders: '[OBJECT_ID]',
    anonymize: (): string => Math.random().toString(16).substr(2, 24),
    redact: (value: string): string => '*'.repeat(value.length)
  },
  url: {
    types: 'string',
    placeholders: '[URL]',
    anonymize: (): string => 'https://example.com/path',
    redact: (value: string): string => '*'.repeat(value.length)
  },
  date: {
    types: 'string',
    placeholders: '[DATE]',
    anonymize: (): string => new Date().toISOString(),
    redact: (value: string): string => '*'.repeat(value.length)
  },
  coordinate: {
    types: 'string',
    placeholders: '[COORD]',
    anonymize: (): string => (Math.random() * 180 - 90).toFixed(7),
    redact: (value: string): string => '*'.repeat(value.length)
  },
  postcode: {
    types: 'string',
    placeholders: '[POSTCODE]',
    anonymize: (value: string): string => String(Math.floor(Math.random() * 90000) + 10000).substr(0, value.length),
    redact: (value: string): string => '*'.repeat(value.length)
  },
  creditCard: {
    types: 'string',
    placeholders: '[CREDIT_CARD]',
    anonymize: (): string => '**** **** **** 1234',
    redact: (value: string): string => '*'.repeat(value.length)
  },
  ssn: {
    types: 'string',
    placeholders: '[SSN]',
    anonymize: (): string => 'XXX-XX-1234',
    redact: (value: string): string => '*'.repeat(value.length)
  },
  sensitive: {
    types: 'string',
    placeholders: '[SENSITIVE]',
    anonymize: (): string => 'REDACTED',
    redact: (value: string): string => '*'.repeat(value.length)
  },
  apiKey: {
    types: 'string',
    placeholders: '[API_KEY]',
    anonymize: (): string => 'sk_' + Math.random().toString(36).substr(2, 20),
    redact: (value: string): string => '*'.repeat(value.length)
  },
  jwt: {
    types: 'string',
    placeholders: '[JWT_TOKEN]',
    anonymize: (): string => 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c',
    redact: (value: string): string => '*'.repeat(value.length)
  },
  iban: {
    types: 'string',
    placeholders: '[IBAN]',
    anonymize: (): string => 'GB29 NWBK 6016 1331 9268 19',
    redact: (value: string): string => '*'.repeat(value.length)
  },
  ipAddress: {
    types: 'string',
    placeholders: '[IP_ADDRESS]',
    anonymize: (): string => `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
    redact: (value: string): string => '*'.repeat(value.length)
  },
  macAddress: {
    types: 'string',
    placeholders: '[MAC_ADDRESS]',
    anonymize: (): string => 'AA:BB:CC:DD:EE:FF',
    redact: (value: string): string => '*'.repeat(value.length)
  },
  licensePlate: {
    types: 'string',
    placeholders: '[LICENSE_PLATE]',
    anonymize: (): string => 'ABC-123',
    redact: (value: string): string => '*'.repeat(value.length)
  },
  panNumber: {
    types: 'string',
    placeholders: '[PAN_NUMBER]',
    anonymize: (): string => 'ABCDE1234F',
    redact: (value: string): string => '*'.repeat(value.length)
  },
  address: {
    types: 'string',
    placeholders: '[ADDRESS]',
    anonymize: (): string => {
      const streets = ['123 Main St', '456 Oak Ave', '789 Pine Ln', '101 Cedar Dr']
      const cities = ['Anytown', 'Bigcity', 'Smallville', 'Metropolis']
      const states = ['CA', 'NY', 'TX', 'FL']
      const zipCodes = ['12345', '67890', '11223', '44556']
      const street = streets[Math.floor(Math.random() * streets.length)]
      const city = cities[Math.floor(Math.random() * cities.length)]
      const state = states[Math.floor(Math.random() * states.length)]
      const zip = zipCodes[Math.floor(Math.random() * zipCodes.length)]
      return `${street}, ${city}, ${state} ${zip}`
    },
    redact: (value: string): string => '*'.repeat(value.length)
  }
}

// Generate appropriate replacement based on type and strategy
export const generateReplacement = (
  value: string, 
  type: string, 
  strategy: string
): string => {
  const typeReplacements = replacementStrategies[type] || replacementStrategies.sensitive
  const generator = typeReplacements[strategy as keyof TypeStrategy]
  
  if (typeof generator === 'function') {
    // Try calling with value first, if it fails, call without parameters
    try {
      return (generator as (value: string) => string)(value)
    } catch {
      return (generator as () => string)()
    }
  }
  return generator as string
} 