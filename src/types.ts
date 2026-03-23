// 1. Core Definitions
export type BatteryType = "AA" | "AAA" | "C" | "D" | "9V" | "Coin Cell" | "None";

// Define allowed tags as a "Union Type" for strict checking
export const Toy_FEATURES = [ "Light", "Sound", "Motion", "Vibration"] as const;

export interface ManualStep {
  stepId: number;
  instruction: string;
  imageSource: string; 
  altText: string; 
}

// 2. The Main Contract (Single Source of Truth)
export interface ToyManual {
  toyName: string;
  brand: string;
  upc: string;
  link: string;
  difficultyLevel: string;
  batteryType: BatteryType;
  batteryCount: number;
  features: Set<ToyFeatureTag>; // Using a Set for easy toggling on the front end
  steps: ManualStep[];
}

// 3. The Logic Engine (ETL Class)
export class ManualEngine implements ToyManual {
  public toyName: string;
  public brand: string;
  public upc: string;
  public link: string;
  public difficultyLevel: string;
  public batteryType: BatteryType;
  public batteryCount: number;
  public features: Set<ToyFeatureTag>; // Changed from fixed object to Set
  public steps: ManualStep[] = [];

  constructor(
    toyName: string,
    upc: string,
    toyLink: string,
    brand: string = "Unknown Brand",
    difficulty: string = "Beginner"
  ) {
    this.toyName = toyName;
    this.upc = upc;
    this.link = toyLink;
    this.brand = brand;
    this.difficultyLevel = difficulty;
    
    // Initialize defaults
    this.batteryType = "None";
    this.batteryCount = 0;
    this.features = new Set<ToyFeatureTag>(); 
  }

  /**
   * Toggle a feature tag (useful for the front-end buttons)
   */
  public toggleFeature(tag: ToyFeatureTag): void {
    if (this.features.has(tag)) {
      this.features.delete(tag);
    } else {
      this.features.add(tag);
    }
  }

  public addStep(text: string, imgUrl: string, alt: string): void {
    const newStep: ManualStep = {
      stepId: this.steps.length + 1,
      instruction: text,
      imageSource: imgUrl,
      altText: alt, 
    };
    this.steps.push(newStep);
  }
}