
import { useMemo, useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

import { Fragment } from './shaders/fragment'
import { Vertex } from './shaders/vertex'

export const ShaderMesh = () => {
    
      const meshRef = useRef<THREE.Mesh>(null)
      const uniforms = useMemo(
          () => ({
              u_color: {
                  value: new THREE.Color("hsl(0, 0.00%, 100.00%)"),
              },
              u_intensity: {
                  value: 0.8,
              },
              u_time: {
                  value: 0.0,
              },
          }), []
      );

  useFrame(({clock}) => {
    if (!meshRef.current) return;
    (meshRef.current.material as THREE.ShaderMaterial).uniforms.u_time.value = 0.5 * clock.getElapsedTime(); // Type ShaderMaterial needed to get the unforms... to register
  })

    return (
        <mesh
        ref={meshRef}
        >
        <boxGeometry args={[2,1,1]}/>
        <shaderMaterial
            fragmentShader={Fragment}
            vertexShader={Vertex}
            uniforms={uniforms}
            wireframe={false}
        />
        </mesh>
    )
}