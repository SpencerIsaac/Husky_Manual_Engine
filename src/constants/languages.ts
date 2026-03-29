// This list defines which languages the current system officially supports.
// It is used both for display labels and for type-safe language codes.
export const SUPPORTED_LANGUAGES = [
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Español' },
  { code: 'de', name: 'Deutsch' },
  { code: 'ja', name: '日本語' },    // Japanese
  { code: 'zh', name: '中文' },      // Mandarin (Simplified)
] as const;

// This turns the array above into a reusable TypeScript type:
// 'en' | 'es' | 'de' | 'ja' | 'zh'
export type LanguageCode = typeof SUPPORTED_LANGUAGES[number]['code'];
