// Smart PII Detection System
export const usePIIDetector = () => {
  // Sensitive field names (case insensitive)
  const sensitiveFields = [
    'name', 'firstname', 'lastname', 'fullname', 'displayname', 'username', 'messagingname',
    'email', 'mail', 'emailaddress',
    'phone', 'phonenumber', 'mobile', 'tel', 'telephone',
    'address', 'street', 'city', 'suburb', 'postcode', 'zipcode', 'zip', 'location',
    'ssn', 'socialsecurity', 'taxid', 'nationalid', 'pan', 'pannumber',
    'dob', 'dateofbirth', 'birthdate',
    'profilepicurl', 'avatar', 'photo', 'image',
    'id', 'userid', 'accountid', 'clientid', 'profile',
    'coordinates', 'latitude', 'longitude', 'loc',
    'password', 'passwd', 'pwd', 'secret', 'token', 'key', 'apikey',
    'bankaccount', 'account', 'iban', 'routingnumber', 'swift',
    'license', 'passport', 'driving', 'medical', 'insurance'
  ]

  // Patterns for different data types
  const patterns = {
    email: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/gi,
    phone: /(?:\+\d{1,3}[-.\s]?)?\(?([0-9]{3})\)?[-.\s]?([0-9]{3})[-.\s]?([0-9]{4})\b/g,
    uuid: /\b[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\b/gi,
    objectId: /\b[0-9a-f]{24}\b/gi,
    shortId: /\b[0-9a-f]{12,20}\b/gi,
    creditCard: /\b(?:\d{4}[-\s]?){3}\d{4}\b/g,
    ssn: /\b\d{3}-?\d{2}-?\d{4}\b/g,
    coordinate: /^-?\d+\.?\d*$/g,
    url: /https?:\/\/[^\s"]+/gi,
    date: /\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/gi,
    name: /\b[A-Z][a-z]+\s+[A-Z][a-z]+\b/g,
    postcode: /\b\d{4,6}\b/g,
    apiKey: /\b(?:sk|pk)_[a-zA-Z0-9]{20,}\b/gi,
    jwt: /\beyJ[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*\b/gi,
    iban: /\b[A-Z]{2}\d{2}[A-Z0-9]{4}\d{7}([A-Z0-9]?){0,16}\b/gi,
    ipAddress: /\b(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\b/g,
    macAddress: /\b([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})\b/g,
    licensePlate: /\b[A-Z]{2,3}[-\s]?[0-9]{3,4}\b/gi,
    panNumber: /\b[A-Z]{5}[0-9]{4}[A-Z]{1}\b/gi,
    address: /\b\d+\s+[A-Z][a-z]+\s+(?:Street|St|Road|Rd|Avenue|Ave|Lane|Ln|Drive|Dr|Place|Pl)\b/gi
  }

  // Check if a field name suggests sensitive data
  const isSensitiveFieldName = (fieldName) => {
    const lowerField = fieldName.toLowerCase()
    return sensitiveFields.some(sensitive => 
      lowerField.includes(sensitive) || sensitive.includes(lowerField)
    )
  }

  // Detect what type of data this looks like
  const detectDataType = (value, fieldName = '') => {
    if (typeof value !== 'string') return null
    
    const lowerField = fieldName.toLowerCase()
    
    // Check field name first for context
    if (lowerField.includes('email') && patterns.email.test(value)) return 'email'
    if (lowerField.includes('phone') && patterns.phone.test(value)) return 'phone'
    if (lowerField.includes('name') && patterns.name.test(value)) return 'name'
    if (lowerField.includes('id') && patterns.objectId.test(value)) return 'id'
    if (lowerField.includes('url') && patterns.url.test(value)) return 'url'
    if (lowerField.includes('date') && patterns.date.test(value)) return 'date'
    if ((lowerField.includes('lat') || lowerField.includes('lon') || lowerField.includes('coord')) && patterns.coordinate.test(value)) return 'coordinate'
    if (lowerField.includes('postcode') && patterns.postcode.test(value)) return 'postcode'
    if ((lowerField.includes('key') || lowerField.includes('token')) && patterns.apiKey.test(value)) return 'apiKey'
    if (lowerField.includes('jwt') && patterns.jwt.test(value)) return 'jwt'
    if (lowerField.includes('iban') && patterns.iban.test(value)) return 'iban'
    if (lowerField.includes('ip') && patterns.ipAddress.test(value)) return 'ipAddress'
    if (lowerField.includes('mac') && patterns.macAddress.test(value)) return 'macAddress'
    if (lowerField.includes('license') && patterns.licensePlate.test(value)) return 'licensePlate'
    if (lowerField.includes('pan') && patterns.panNumber.test(value)) return 'panNumber'
    if (lowerField.includes('address') && patterns.address.test(value)) return 'address'
    
    // Pattern-based detection (order matters - more specific first, avoid conflicts)
    if (patterns.email.test(value)) return 'email'
    if (patterns.phone.test(value)) return 'phone'
    if (patterns.panNumber.test(value)) return 'panNumber'
    if (patterns.jwt.test(value)) return 'jwt'
    if (patterns.apiKey.test(value)) return 'apiKey'
    if (patterns.uuid.test(value)) return 'uuid'
    if (patterns.creditCard.test(value)) return 'creditCard'
    if (patterns.ssn.test(value)) return 'ssn'
    if (patterns.iban.test(value)) return 'iban'
    if (patterns.ipAddress.test(value)) return 'ipAddress'
    if (patterns.macAddress.test(value)) return 'macAddress'
    if (patterns.url.test(value)) return 'url'
    if (patterns.date.test(value)) return 'date'
    if (patterns.address.test(value)) return 'address'
    if (patterns.name.test(value) && !patterns.licensePlate.test(value)) return 'name' // Avoid name/license plate conflict
    if (patterns.licensePlate.test(value) && !patterns.name.test(value)) return 'licensePlate' // Only if not a name
    if (patterns.objectId.test(value)) return 'objectId'
    if (patterns.shortId.test(value) && value.length >= 12) return 'id'
    if (patterns.coordinate.test(value) && (Math.abs(parseFloat(value)) <= 180)) return 'coordinate'
    if (patterns.postcode.test(value) && value.length >= 4 && value.length <= 6) return 'postcode'
    
    return null
  }

  return {
    sensitiveFields,
    patterns,
    isSensitiveFieldName,
    detectDataType
  }
} 