
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
    (meshRef.current.material as THREE.ShaderMaterial).uniforms.iTime.value = clock.getElapsedTime(); // Type ShaderMaterial needed to get the unforms... to register
  })

  const uniformsT = useMemo(
    () => ({
        iTime: {
            type: "f",
            value: 1.0,
        },
        // iResolution: {
        //     type: "v2",
        //     value: new THREE.Vector2(3, 3),
        // }
    }), []
  )

	const fragmentShader = `
//   #include <common>

//   uniform vec3 iResolution;
uniform float iTime;
// uniform vec2 iResolution;
varying vec2 vUv;

vec3 palette(in float t)
{

    vec3 a = vec3(0.5,0.5,0.5);
    vec3 b = vec3(0.5,0.75,0.5);
    vec3 c = vec3(1.0,0.7,0.4);
    vec3 d = vec3(0.0,0.15,0.20);
    return a + b*cos( 6.283185*(c*t+d) );
    
    
    //    if( p.y>(4.0/7.0) ) col =,vec3(),vec3() );
}
void main()
{
    // Normalized pixel coordinates (from 0 to 1)
    // vec2 fragCoord = vUv * iResolution;
    // vec2 uv = (fragCoord * 2.0 - iResolution.xy) / iResolution.y;  
    vec2 uv = vUv;
    vec2 uv0 = uv; // Get origin before manipulating uv
    
    vec3 finalColor = vec3(0.0);
    
    for (float i = 0.0; i <3.0; i++) { // For each iteration, it increases the number of additinal layers in finalColor, and finer details
        //uv *= 2.0; // Scales each part to be 2x smaller
        //Spaital repetition
        //uv = fract(uv); //Fract returns the fractional part of its input, basically like cutting a part of the whole canvas into equal parts
        //uv -= 0.5; // centers each fract

        //Combining all above Fract related equations;
        uv = fract(1.5 * uv) - 0.5;
        
        // using exponent function below will help in adding difference
        // x * exp(-x) represents a smooth transition. The two lines on a graph intersect and stay relatively close, then get farther apart
        float d = length(uv) * exp(-length(uv0)); // d represents the local distance relative to the center of each repeition / fract

        vec3 col = palette(length(uv0) + (i * .2) + (iTime * 0.4)); // Multiplying iTime by a fraction reduces the speed of gradient
        // with length(uv0), now each the gradients are relative to the space of the entire canvas, not in the individual fracts
        // adding (i * 0.4) once again adds more variation with each layer

        d = sin(d * 16. + iTime)/8.;
        d = abs(d);

        //d = step(0.1, d);
        // using pow(x, y), effectively accentuates the darker colors closer to 0 and having a lesser effect on lighter shades
        d = pow(0.01/d, 1.5);

        //col *= d;
        finalColor += col* d;
    }

    gl_FragColor  = vec4(finalColor, 1.0);
}
  `;

    return (
        <mesh
        ref={meshRef}
        >
        <planeGeometry args={[5,5]}/>
        <shaderMaterial
            fragmentShader={fragmentShader}
            vertexShader={Vertex}
            uniforms={uniformsT}
            // wireframe={false}
        />
        </mesh>
    )
}