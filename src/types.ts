import type { LanguageCode } from './constants/languages';

// These type aliases describe the controlled vocabularies the project uses.
// Keeping the allowed values narrow helps keep data consistent across the app
// and the database.
type BatteryType = 'AA' | 'AAA' | 'C' | 'D' | '9V' | 'Button Cell' | 'other/none';
type ToyFeature = 'Light-Up' | 'Sound' | 'Motion'| 'Vibration' | 'Remote-Controlled';

// Any field stored as LocalizedText can hold the same content in multiple
// languages, using language codes such as "en" or "es" as the keys.
type LocalizedText = Record<LanguageCode, string>;

// A toy record stores the core metadata that describes one adapted product.
// Think of this as the "cover page" or summary record for a manual.
export interface ToyMetadata {
  // Optional in the app before insert; Supabase/Postgres generates it on save.
  id?: string; 
  // Localized so the same toy can be displayed in multiple languages.
  name: LocalizedText; 
  // Human-readable manufacturer or brand name.
  brand: string;
  // UPC is used as a durable identifier when the same toy appears more than once.
  upc: string;
  // Useful for traceability and future repurchase or sourcing workflows.
  purchase_link: string; 
  // Changed to Record for localized screw descriptions (e.g., "Phillips" vs "十字")
  screw_type: LocalizedText; 
  // Battery details matter for adaptation, troubleshooting, and safety.
  battery_type: BatteryType;
  battery_count: number;
  // A toy can expose multiple features that an adaptation may target.
  toy_feature: ToyFeature[];
  // Tracks who documented or contributed this record.
  contributor: string; 
}

// Each instruction step represents one ordered action in the manual.
export interface InstructionStep {
  // Optional in the app before insert; Supabase/Postgres generates it on save.
  id?: string;
  // Links the step back to its parent toy.
  toy_id: string;
  // Stores the sequence order that the user should follow.
  step_number: number;
  // Step text is localized so the same instruction can be reused per language.
  description: LocalizedText;
  // This lets the UI show the pictures associated with a step in context.
  pictures: InstructionStepPicture[];
}

// PictureMetadata stores reusable media information.
// A picture is separate from a step so the same image can appear more than once.
export interface PictureMetadata {
  // Generated client-side in createPictureEntry so pictures can be referenced before save.
  picture_id: string;
  toy_id: string;
  // This will usually point to Supabase Storage or another hosted image location.
  picture_url: string;             
  // Alt text is first-class because accessibility is a core goal of the project.
  alt_text: LocalizedText;
  // Captions give editors a place to add explanatory context around an image.
  caption: LocalizedText; 
}

// This join object connects one step to one picture.
// It also stores display-specific information such as order and primary image.
export interface InstructionStepPicture {
  // Optional in the app before insert; Supabase/Postgres generates it on save.
  id?: string;
  step_id: string;
  picture_id: string;
  // Lets a step show several pictures in a predictable order.
  display_order: number;
  // A step may have one main image that the UI highlights first.
  is_primary: boolean;
  // Optional nested object for convenience when the UI loads related data.
  picture?: PictureMetadata;
}

// This helper creates a new picture object in the format the rest of the app
// expects. It accepts either raw English text or already-localized text.
export const createPictureEntry = (
  toyId: string, 
  alt: string | LocalizedText, 
  caption: string | LocalizedText = ""
): PictureMetadata => {
  
  // If the caller passes a plain string, we treat it as English for now.
  // Later the same record can be enriched with more languages.
  const localizedAlt = typeof alt === 'string' 
    ? { en: alt } as LocalizedText
    : alt;
    
  const localizedCaption = typeof caption === 'string' 
    ? { en: caption } as LocalizedText
    : caption;

  return {
    // A client-side UUID lets a picture be referenced before it is saved.
    picture_id: crypto.randomUUID(),
    toy_id: toyId,
    // The upload step would fill this in after the actual image file is stored.
    picture_url: '', 
    alt_text: localizedAlt,
    caption: localizedCaption,
  };
};
