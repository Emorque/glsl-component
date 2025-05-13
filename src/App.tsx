import { useState } from 'react';
import './App.css'
import { ShaderCard } from './shaderCard'

function App() {
  const [scale, setScale] = useState<number>(1.5)
  const [speed, setSpeed] = useState<number>(0.4)
  const [iterations, setIterations] = useState<number>(3)

  return (
    <div id='main_page'>
      <ShaderCard scale={scale} speed={speed} iterations={iterations}/>
      <div id='panel'>
        <div className='input_div'>
          <label>Scale: {scale}</label>
          <input
          type='range'
          className='slider'
          min={1}
          max={5}
          step={0.1}
          value={scale}
          onChange={(e) => setScale(parseFloat(e.target.value))}
          >
          </input>
        </div>

        <div className='input_div'>
          <label>Speed: {speed}</label>
          <input
          type='range'
          className='slider'
          min={0.1}
          max={2.0}
          step={0.1}
          value={speed}
          onChange={(e) => setSpeed(parseFloat(e.target.value))}
          >
          </input>
        </div>

        <div className='input_div'>
          <label>Iterations: {iterations}</label>
          <input
          type='range'
          className='slider'
          min={1.0}
          max={5.0}
          step={1.0}
          value={iterations}
          onChange={(e) => setIterations(parseFloat(e.target.value))}
          >
          </input>
        </div>

      </div>
    </div>
  )
}

export default App
