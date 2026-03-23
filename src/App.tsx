import { useState } from 'react'
import './App.css'

// 1. Import your "Logic" and your "UI"
import { ManualEngine } from './types' 
import type { ToyFeatureTag } from './types'
import { FeaturePicker } from './components/FeaturePicker'

function App() {
  // 2. Initialize the Engine (The "Memory" of the toy)
  const [toy] = useState(new ManualEngine("New Toy", "00000", "http://..."));
  
  // 3. A small trick to tell React to refresh when the Engine changes
  const [, setTick] = useState(0);
  const forceUpdate = () => setTick(t => t + 1);

  const handleToggle = (tag: ToyFeatureTag) => {
    toy.toggleFeature(tag); // Runs the logic in your class
    forceUpdate();          // Refreshes the screen
  };

  return (
    <div className="App">
      <h1>Husky Manual Engine</h1>
      
      {/* 4. This is the line that makes it appear! */}
      <div className="card">
        <FeaturePicker 
          selectedFeatures={toy.features} 
          onToggle={handleToggle} 
        />
      </div>

      {/* 5. The "Data Monitor" - shows the Engine working in real-time */}
      <div style={{ marginTop: '20px', textAlign: 'left', background: '#f4f4f4', padding: '10px', borderRadius: '8px' }}>
        <p><strong>Logic Engine Status:</strong></p>
        <code style={{ fontSize: '12px' }}>
          Features Active: {Array.from(toy.features).join(', ') || 'None'}
        </code>
      </div>
    </div>
  )
}

export default App