export interface PIIPattern {
  regex: RegExp;
  replacement: string | ((match: string) => string);
  priority: number;
  category: string;
}

export interface FieldPattern {
  keywords: string[];
  patterns: PIIPattern[];
}

export interface DetectionResult {
  found: boolean;
  patterns: string[];
  fieldPaths?: string[];
}

export interface MaskingOptions {
  outputFormat: 'placeholders' | 'anonymized' | 'redacted' | 'hashed' | 'types';
  enabledTypes: Set<string>;
}

export interface ProcessingResult {
  result: string;
  detectedTypes: string[];
  message?: string;
  messageType?: 'info' | 'warning' | 'error';
}

export interface MessageStyle {
  color: string;
  bgColor: string;
  borderColor: string;
  icon: string;
}

export type InputFormat = 'json' | 'csv' | 'xml' | 'yaml' | 'text' | 'unknown';

export interface InputDetectionResult {
  format: InputFormat;
  isValid: boolean;
  error?: string;
}

export interface ReplacementStrategy {
  [key: string]: string | ((match: string) => string);
}

export interface CSVRow {
  [key: string]: string;
}

export interface ParsedData {
  headers?: string[];
  rows?: CSVRow[];
  data?: any;
} 