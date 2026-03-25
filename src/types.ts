import type { LanguageCode } from './constants/languages';

type BatteryType = 'AA' | 'AAA' | 'C' | 'D' | '9V' | 'Button Cell' | 'other/none';
type ToyFeature = 'Light-Up' | 'Sound' | 'Motion'| 'Vibration' | 'Remote-Controlled';
type LocalizedText = Record<LanguageCode, string>;

export interface ToyMetadata {
  id?: string; 
  name: LocalizedText; 
  brand: string;
  upc: string;
  purchase_link: string; 
  // Changed to Record for localized screw descriptions (e.g., "Phillips" vs "十字")
  screw_type: LocalizedText; 
  battery_type: BatteryType;
  battery_count: number;
  toy_feature: ToyFeature[];
  contributor: string; 
}

export interface InstructionStep {
  id?: string;
  toy_id: string;
  step_number: number;
  description: LocalizedText;
  pictures: InstructionStepPicture[];
}

export interface PictureMetadata {
  picture_id: string;
  toy_id: string;
  picture_url: string;             
  alt_text: LocalizedText;
  caption: LocalizedText; 
}

export interface InstructionStepPicture {
  id?: string;
  step_id: string;
  picture_id: string;
  display_order: number;
  is_primary: boolean;
  picture?: PictureMetadata;
}

export const createPictureEntry = (
  toyId: string, 
  alt: string | LocalizedText, 
  caption: string | LocalizedText = ""
): PictureMetadata => {
  
  // Cast as the final type so the compiler stays happy
  const localizedAlt = typeof alt === 'string' 
    ? { en: alt } as LocalizedText
    : alt;
    
  const localizedCaption = typeof caption === 'string' 
    ? { en: caption } as LocalizedText
    : caption;

  return {
    picture_id: crypto.randomUUID(),
    toy_id: toyId,
    picture_url: '', 
    alt_text: localizedAlt,
    caption: localizedCaption,
  };
};
