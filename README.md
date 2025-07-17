# 🎭 Cloak - Privacy-First Data Masking Tool

> Transform sensitive data into safe, shareable formats while preserving structure and context.

Cloak is a modern web application that intelligently detects and masks personally identifiable information (PII) from your data. Perfect for developers, data analysts, and privacy-conscious individuals who need to share data samples without exposing sensitive information.

## ✨ Features

### 🔍 Smart PII Detection
- **15+ Data Types**: Emails, phone numbers, names, addresses, credit cards, SSNs, API keys, JWT tokens, IP addresses, and more
- **Context-Aware**: Recognizes field names and patterns to improve detection accuracy
- **Real-Time Processing**: Instant masking as you type with visual feedback

### 📊 Multiple Input Formats
- **JSON**: Smart field recognition and structure preservation
- **CSV**: Column-aware processing with header detection
- **XML/YAML**: Format-specific parsing and masking
- **Plain Text**: Natural language processing for unstructured data

### 🎯 Flexible Output Options
- **Type Schemas**: Clean data definitions (e.g., `"firstName": "string"`)
- **Placeholders**: Generic replacements (e.g., `[EMAIL]`, `[PHONE]`)
- **Anonymized Data**: Realistic fake data that maintains format
- **Redacted Text**: Partial masking with `***` for context
- **Hashed Values**: Cryptographic hashing for consistent anonymization

### 🎨 Modern Interface
- **Glass Morphism UI**: Beautiful, modern design with smooth animations
- **Dark/Light Themes**: Comfortable viewing in any environment
- **Responsive Design**: Works perfectly on desktop and mobile
- **Real-Time Feedback**: Live pattern detection and error handling

## 🚀 Quick Start

### 🎬 Interactive Demo
Try Cloak instantly with our interactive demo:

![Cloak Demo](2025-07-17,%2008_40_21%20p.m.-Clock_Text.gif)

*Watch how Cloak intelligently detects and masks sensitive data in real-time*

### Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/nikhilkharade/cloak-text.git
   cd cloak-text
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open in browser**
   Navigate to `http://localhost:3001` (or the port shown in terminal)

## 📝 Usage Examples

### JSON Data Masking
**Input:**
```json
{
  "user": {
    "name": "John Doe",
    "email": "john.doe@company.com",
    "phone": "+1-555-123-4567",
    "ssn": "123-45-6789"
  }
}
```

**Output (Type Schema):**
```json
{
  "user": {
    "name": "string",
    "email": "string", 
    "phone": "string",
    "ssn": "string"
  }
}
```

### CSV Data Processing
**Input:**
```csv
name,email,phone,salary
Alice Johnson,alice@email.com,555-0123,75000
Bob Smith,bob@company.org,555-0456,82000
```

**Output:**
```csv
name,email,phone,salary
[NAME],[EMAIL],[PHONE],75000
[NAME],[EMAIL],[PHONE],82000
```

### Plain Text Masking
**Input:**
```
Hi, my name is Sarah Connor and you can reach me at sarah.connor@resistance.com 
or call me at (555) 123-4567. My address is 123 Tech Street, San Francisco, CA 94105.
```

**Output:**
```
Hi, my name is [NAME] and you can reach me at [EMAIL] 
or call me at [PHONE]. My address is [ADDRESS].
```

## 🛠 Technical Stack

- **Frontend**: Vue 3 with Composition API + TypeScript
- **Build Tool**: Vite for fast development and optimized builds
- **Styling**: TailwindCSS for modern, responsive design
- **Type Safety**: Comprehensive TypeScript interfaces and strict type checking
- **Architecture**: Modular composables for clean separation of concerns
- **Privacy**: 100% client-side processing - no data leaves your device

## 🏗 Project Structure

```
src/
├── App.vue                          # Main application component
├── main.ts                          # Application entry point (TypeScript)
├── style.css                        # Global styles and TailwindCSS
├── types/
│   └── index.ts                     # TypeScript type definitions
├── composables/
│   ├── useDataMasking.ts            # Core masking logic (TypeScript)
│   ├── usePIIDetector.ts            # Pattern detection engine (TypeScript)
│   ├── useInputDetection.ts         # Format detection and validation (TypeScript)
│   └── useMessageStyling.ts         # Dynamic UI feedback (TypeScript)
├── utils/
│   └── replacements.ts              # Masking strategies and patterns (TypeScript)
└── vite-env.d.ts                    # Vue component type declarations
```

## 🔒 Privacy & Security

- **Client-Side Only**: All processing happens in your browser
- **No Data Transmission**: Your sensitive data never leaves your device
- **No Storage**: No data is saved or cached
- **Open Source**: Full transparency - review the code yourself

## 🎯 Supported Data Types

| Category | Types |
|----------|-------|
| **Personal** | Names, Email addresses, Phone numbers |
| **Location** | Addresses, Coordinates (lat/lng) |
| **Financial** | Credit cards, Bank accounts, IBAN |
| **Government** | SSN, PAN numbers, License plates |
| **Technical** | IP addresses, MAC addresses, API keys, JWT tokens |
| **Documents** | URLs, File paths |

## 🔧 Development Commands

```bash
# Start development server with hot reload
npm run dev

# Type check without emitting files
npm run type-check

# Build for production with type checking
npm run build

# Preview production build
npm run preview
```

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🌟 Use Cases

- **API Documentation**: Share example requests/responses safely
- **Database Samples**: Provide realistic test data without PII
- **Bug Reports**: Include logs and data without privacy concerns
- **Data Analysis**: Share datasets for analysis while protecting individuals
- **AI Training**: Prepare clean datasets for machine learning
- **Compliance**: Meet GDPR, HIPAA, and other privacy requirements

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Deploy to Static Hosting
The built files in `dist/` can be deployed to any static hosting service:
- Netlify
- Vercel
- GitHub Pages
- AWS S3
- Firebase Hosting



---

**Made with ❤️ for privacy-conscious developers**

*Transform your sensitive data safely - because privacy matters.* 