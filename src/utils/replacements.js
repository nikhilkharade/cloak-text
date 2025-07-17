// Replacement strategies for different data types
export const replacementStrategies = {
  email: {
    types: 'string',
    placeholders: '[EMAIL]',
    anonymize: () => `user${Math.floor(Math.random() * 1000)}@example.com`,
    redact: (value) => '*'.repeat(value.length)
  },
  phone: {
    types: 'string',
    placeholders: '[PHONE]',
    anonymize: () => `(555) ${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 9000) + 1000}`,
    redact: (value) => '*'.repeat(value.length)
  },
  name: {
    types: 'string',
    placeholders: '[NAME]',
    anonymize: () => {
      const names = ['John Doe', 'Jane Smith', 'Alex Johnson', 'Sam Wilson']
      return names[Math.floor(Math.random() * names.length)]
    },
    redact: (value) => '*'.repeat(value.length)
  },
  id: {
    types: 'string',
    placeholders: '[ID]',
    anonymize: (value) => Math.random().toString(36).substr(2, value.length),
    redact: (value) => '*'.repeat(value.length)
  },
  uuid: {
    types: 'string',
    placeholders: '[UUID]',
    anonymize: () => 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => 
      (c === 'x' ? Math.random() * 16 | 0 : (Math.random() * 16 | 0 & 0x3 | 0x8)).toString(16)
    ),
    redact: (value) => '*'.repeat(value.length)
  },
  objectId: {
    types: 'string',
    placeholders: '[OBJECT_ID]',
    anonymize: () => Math.random().toString(16).substr(2, 24),
    redact: (value) => '*'.repeat(value.length)
  },
  url: {
    types: 'string',
    placeholders: '[URL]',
    anonymize: () => 'https://example.com/path',
    redact: (value) => '*'.repeat(value.length)
  },
  date: {
    types: 'string',
    placeholders: '[DATE]',
    anonymize: () => new Date().toISOString(),
    redact: (value) => '*'.repeat(value.length)
  },
  coordinate: {
    types: 'number',
    placeholders: '[COORD]',
    anonymize: () => (Math.random() * 180 - 90).toFixed(7),
    redact: (value) => '*'.repeat(value.length)
  },
  postcode: {
    types: 'string',
    placeholders: '[POSTCODE]',
    anonymize: (value) => String(Math.floor(Math.random() * 90000) + 10000).substr(0, value.length),
    redact: (value) => '*'.repeat(value.length)
  },
  creditCard: {
    types: 'string',
    placeholders: '[CREDIT_CARD]',
    anonymize: () => '**** **** **** 1234',
    redact: (value) => '*'.repeat(value.length)
  },
  ssn: {
    types: 'string',
    placeholders: '[SSN]',
    anonymize: () => 'XXX-XX-1234',
    redact: (value) => '*'.repeat(value.length)
  },
  sensitive: {
    types: 'string',
    placeholders: '[SENSITIVE]',
    anonymize: () => 'REDACTED',
    redact: (value) => '*'.repeat(value.length)
  },
  apiKey: {
    types: 'string',
    placeholders: '[API_KEY]',
    anonymize: () => 'sk_' + Math.random().toString(36).substr(2, 20),
    redact: (value) => '*'.repeat(value.length)
  },
  jwt: {
    types: 'string',
    placeholders: '[JWT_TOKEN]',
    anonymize: () => 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c',
    redact: (value) => '*'.repeat(value.length)
  },
  iban: {
    types: 'string',
    placeholders: '[IBAN]',
    anonymize: () => 'GB29 NWBK 6016 1331 9268 19',
    redact: (value) => '*'.repeat(value.length)
  },
  ipAddress: {
    types: 'string',
    placeholders: '[IP_ADDRESS]',
    anonymize: () => `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
    redact: (value) => '*'.repeat(value.length)
  },
  macAddress: {
    types: 'string',
    placeholders: '[MAC_ADDRESS]',
    anonymize: () => 'AA:BB:CC:DD:EE:FF',
    redact: (value) => '*'.repeat(value.length)
  },
  licensePlate: {
    types: 'string',
    placeholders: '[LICENSE_PLATE]',
    anonymize: () => 'ABC-123',
    redact: (value) => '*'.repeat(value.length)
  },
  panNumber: {
    types: 'string',
    placeholders: '[PAN_NUMBER]',
    anonymize: () => 'ABCDE1234F',
    redact: (value) => '*'.repeat(value.length)
  },
  address: {
    types: 'string',
    placeholders: '[ADDRESS]',
    anonymize: () => {
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
    redact: (value) => '*'.repeat(value.length)
  }
}

// Generate appropriate replacement based on type and strategy
export const generateReplacement = (value, type, strategy, fieldName = '') => {
  const typeReplacements = replacementStrategies[type] || replacementStrategies.sensitive
  const generator = typeReplacements[strategy]
  
  return typeof generator === 'function' ? generator(value) : generator
} 