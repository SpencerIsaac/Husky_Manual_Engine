import { type ToyFeatureTag, ManualEngine } from '../types';

const AVAILABLE_FEATURES: ToyFeatureTag[] = ["Light", "Sound", "Motion", "Vibration", "Bluetooth", "Touch-Sensitive"];

interface Props {
  selectedFeatures: Set<ToyFeatureTag>;
  onToggle: (tag: ToyFeatureTag) => void;
}

export const FeaturePicker = ({ selectedFeatures, onToggle }: Props) => {
  return (
    <div className="flex flex-wrap gap-2 p-4 border rounded-xl bg-gray-50">
      <p className="w-full text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Electronic Features</p>
      {AVAILABLE_FEATURES.map((feature) => (
        <button
          key={feature}
          type="button"
          onClick={() => onToggle(feature)}
          className={`px-4 py-2 rounded-full border-2 transition-all duration-200 text-sm font-medium ${
            selectedFeatures.has(feature)
              ? "bg-blue-600 border-blue-600 text-white shadow-md scale-105"
              : "bg-white border-gray-200 text-gray-600 hover:border-blue-300"
          }`}
        >
          {feature}
        </button>
      ))}
    </div>
  );
};