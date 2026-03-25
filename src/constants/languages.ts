export const SUPPORTED_LANGUAGES = [
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Español' },
  { code: 'de', name: 'Deutsch' },
  { code: 'ja', name: '日本語' },    // Japanese
  { code: 'zh', name: '中文' },      // Mandarin (Simplified)
] as const;

// This creates a type: 'en' | 'es' | 'de' | 'ja' | 'zh'
export type LanguageCode = typeof SUPPORTED_LANGUAGES[number]['code'];