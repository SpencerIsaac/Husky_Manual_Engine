import type { LanguageCode } from './constants/languages';

type BatteryType = 'AA' | 'AAA' | 'C' | 'D' | '9V' | 'Button Cell' | 'other/none';
type ToyFeature = 'Light-Up' | 'Sound' | 'Motion'| 'Vibration' | 'Remote-Controlled';

export interface ToyMetadata {
  id?: string; 
  name: Record<LanguageCode, string>; 
  brand: string;
  upc: string;
  purchase_link: string; 
  // Changed to Record for localized screw descriptions (e.g., "Phillips" vs "十字")
  screw_type: Record<LanguageCode, string>; 
  battery_type: BatteryType;
  battery_count: number;
  toy_feature: ToyFeature[];
  contributor: string; 
}

export interface InstructionStep {
  picture: PictureMetadata;
  step_number: number;
  description: Record<LanguageCode, string>;
}

export interface PictureMetadata {
  picture_id: string;
  toy_id: string;
  picture_url: string;             
  alt_text: Record<LanguageCode, string>;
  caption: Record<LanguageCode, string>; 
}

export const createPictureEntry = (
  toyId: string, 
  alt: string | Record<LanguageCode, string>, 
  caption: string | Record<LanguageCode, string> = ""
): PictureMetadata => {
  
  // Cast as the final type so the compiler stays happy
  const localizedAlt = typeof alt === 'string' 
    ? { en: alt } as Record<LanguageCode, string>
    : alt;
    
  const localizedCaption = typeof caption === 'string' 
    ? { en: caption } as Record<LanguageCode, string>
    : caption;

  return {
    picture_id: crypto.randomUUID(),
    toy_id: toyId,
    picture_url: '', 
    alt_text: localizedAlt,
    caption: localizedCaption,
  };
};