import { useEffect, useRef } from 'react'
import * as THREE from 'three'

export const ShaderCard = () => {
    const shaderRef = useRef<HTMLCanvasElement>(null)
    const shaderWrapperRef = useRef<HTMLDivElement>(null)
    const materialRef = useRef<THREE.ShaderMaterial>(null)
    
    const uniforms = {
    iTime: { value: 0 },
    // iResolution:  { value: new THREE.Vector3() }, 
    iResolution:  { value: new THREE.Vector3(1, 1, 1) }, //iResolution can be initialized as it won't change (uVu)
    };

    // const fragmentShader = 
    // `
    //     #include <common>
    //     uniform vec3 iResolution;
    //     uniform float iTime;
    //     varying vec2 vUv;
    //     // By iq: https://www.shadertoy.com/user/iq
    //     // license: Creative Commons Attribution-NonCommercial-ShareAlike 3.0 Unported License.
    //     void mainImage( out vec4 fragColor, in vec2 fragCoord )
    //     {
    //     // Normalized pixel coordinates (from 0 to 1)
    //     vec2 uv = fragCoord/iResolution.xy;
    //     // Time varying pixel color
    //     vec3 col = 0.5 + 0.5*cos(iTime+uv.xyx+vec3(0,2,4));
    //     // Output to screen
    //     fragColor = vec4(col,1.0);
    //     }
    //     void main() {
    //     // mainImage(gl_FragColor, gl_FragCoord.xy);
    //         mainImage(gl_FragColor, vUv * iResolution.xy);
    //     }
    // `;

    //Fragment Shader copied from my shaderToy code, except for uniform/varying variables, and void main()
    const fragmentShader = 
    `
        #include <common>
        uniform vec3 iResolution;
        uniform float iTime;
        varying vec2 vUv;

        
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

            fragColor = vec4(finalColor, 1.0);
        }

        void main() {
        // mainImage(gl_FragColor, gl_FragCoord.xy);
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
        const material = new THREE.ShaderMaterial({
            fragmentShader,
            vertexShader,
            uniforms,
        });
        scene.add(new THREE.Mesh(plane, material));
        const render = (time : number) => {
            // if (!shaderRef.current) return
            time *= 0.001;

            // const canvas = shaderRef.current;
            // uniforms.iResolution.value.set(canvas.width, canvas.height, 1); //No longer needed b/c of vUv
            uniforms.iTime.value = time;

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
    
    return (
        <div id='shader' ref={shaderWrapperRef}>
            <canvas ref={shaderRef}></canvas>
        </div>
    )
}