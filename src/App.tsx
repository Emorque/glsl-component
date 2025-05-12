
import { Canvas, useFrame } from '@react-three/fiber'
import './App.css'

import { ShaderMesh } from './shaderMesh'

function App() {

  return (
    <div id='main_page'>
      <div id='shader'>
        <Canvas>
          <ambientLight intensity={0.1} />
          <ShaderMesh/>
        </Canvas>
      </div>
      <div id='panel'>
        <textarea
        >
        </textarea>
      </div>
    </div>
  )
}

export default App
