
import { Canvas, useFrame } from '@react-three/fiber'
import './App.css'

import { ShaderMesh } from './shaderMesh'
import { ShaderCard } from './shaderCard'

function App() {

  return (
    <div id='main_page'>
      <ShaderCard/>
      <div id='panel'>
        <textarea
        >
        </textarea>
      </div>
    </div>
  )
}

export default App
