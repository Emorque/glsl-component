import { useEffect, useRef } from 'react'
import * as THREE from 'three'

interface ShaderCardProps {
    scale: number,
    speed: number,
    iterations: number
}

export const ShaderCard = ({scale, speed, iterations} : ShaderCardProps) => {
    const shaderRef = useRef<HTMLCanvasElement>(null)
    const shaderWrapperRef = useRef<HTMLDivElement>(null)
    const materialRef = useRef<THREE.ShaderMaterial>(null)

    //Fragment Shader copied from my shaderToy code, except for uniform/varying variables, and void main()
    const fragmentShader = 
    `
        #include <common>
        uniform vec3 iResolution;
        uniform float iTime;
        varying vec2 vUv;

        uniform float scale;
        uniform float speed;
        uniform float iterations;

        
        vec3 palette(in float t)
        {

            vec3 a = vec3(0.5,0.5,0.5);
            vec3 b = vec3(0.5,0.75,0.5);
            vec3 c = vec3(1.0,0.7,0.4);
            vec3 d = vec3(0.0,0.15,0.20);
            return a + b*cos( 6.283185*(c*t+d) );
        }

        void mainImage( out vec4 fragColor, in vec2 fragCoord )
        {
            vec2 uv = (fragCoord * 2.0 - iResolution.xy) / iResolution.y;  
            
            vec2 uv0 = uv; // Get origin before manipulating uv
            
            vec3 finalColor = vec3(0.0);
            
            for (float i = 0.0; i <iterations; i++) { // For each iteration, it increases the number of additinal layers in finalColor, and finer details
                uv = fract(scale * uv) - 0.5;
                float d = length(uv) * exp(-length(uv0)); // d represents the local distance relative to the center of each repeition / fract
                vec3 col = palette(length(uv0) + (i * .2) + (iTime * speed)); // Multiplying iTime by a fraction reduces the speed of gradient

                d = sin(d * 16. + iTime)/8.;
                d = abs(d);
                d = pow(0.01/d, 1.5);

                finalColor += col* d;
            }

            fragColor = vec4(finalColor, 1.0);
        }

        void main() {
            mainImage(gl_FragColor, vUv * iResolution.xy);
        }
    `;

    const vertexShader =
    `
    varying vec2 vUv;
    void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
    }
    `;
        
    useEffect(() => {

        if (!shaderRef.current || !shaderWrapperRef.current) return;
        let animationFrameId: number;

        const renderer = new THREE.WebGLRenderer({
            antialias: true, 
            canvas: shaderRef.current,
            alpha: true
        });
        renderer.autoClearColor = false;
        renderer.setSize(shaderWrapperRef.current.clientWidth, shaderWrapperRef.current.clientHeight);

        const camera = new THREE.OrthographicCamera(
            -1, // left
            1, // right
            1, // top
            -1, // bottom
            -1, // near,
            1, // far
        );
        const scene = new THREE.Scene();
        const plane = new THREE.PlaneGeometry(2, 2);
        materialRef.current = new THREE.ShaderMaterial({
            fragmentShader,
            vertexShader,
            uniforms : {
                iTime: { value: 0 },
                iResolution:  { value: new THREE.Vector3(1, 1, 1) }, //iResolution can be initialized as it won't change (uVu)
                scale: { value: 1.5},
                speed: {value: 0.4},
                iterations: {value: 3.0}
            }
        }); 

        scene.add(new THREE.Mesh(plane, materialRef.current));
        const render = (time : number) => {
            if (!materialRef.current) return;
            time *= 0.001;
            materialRef.current.uniforms.iTime.value = time;
            renderer.render(scene, camera);
            animationFrameId = requestAnimationFrame(render);
        }

        animationFrameId = requestAnimationFrame(render);

        const callResize = () => {
            if (!shaderWrapperRef.current) return;
            renderer.setSize(shaderWrapperRef.current.clientWidth, shaderWrapperRef.current.clientHeight);
        }

        window.addEventListener('resize', callResize)

        return () => {
            cancelAnimationFrame(animationFrameId);
            window.removeEventListener('resize', callResize)
        }
    }, [])

    useEffect(() => {
        if (!materialRef.current) return;
        materialRef.current.uniforms.scale.value = scale
        materialRef.current.uniforms.speed.value = speed
        materialRef.current.uniforms.iterations.value = iterations
    }, [scale, speed, iterations])
    
    return (
        <div id='shader' ref={shaderWrapperRef}>
            <canvas ref={shaderRef}></canvas>
        </div>
    )
}