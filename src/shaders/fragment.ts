export const Fragment = `
uniform float u_intensity;
uniform float u_time;
uniform vec3 u_color;

varying vec2 vUv;
varying float vDisplacement;

//vec3 color = vec3(u_color * (2.0 - distort));

void main() {
  float distort = vDisplacement * u_intensity;
  vec3 color = 0.5 * 4.5*cos(u_time + vUv.xyx + vec3(0,2,4));
  gl_FragColor = vec4(color , 1.0);
}
`


/*

vec3 palette(in float t)
{

    vec3 a = vec3(0.5,0.5,0.5);
    vec3 b = vec3(0.5,0.5,0.5);
    vec3 c = vec3(1.0,1.0,1.0);
    vec3 d = vec3(0.0,0.33,0.67);
    return a + b*cos( 6.283185*(c*t+d) );
    
    
    //vec3(0.5,0.5,0.5),vec3(0.5,0.5,0.5),vec3(2.0,1.0,0.0),vec3(0.5,0.20,0.25)
}

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    vec2 uv = (fragCoord * 2.0 - iResolution.xy) / iResolution.y;  
    
    vec2 uv0 = uv; // Get origin before manipulating uv
    
    vec3 finalColor = vec3(0.0);
    
    for (float i = 0.0; i <3.0; i++) { // For each iteration, it increases the number of additinal layers in finalColor, and finer details
        //uv *= 2.0; // Scales each part to be 2x smaller
        //Spaital repetition
        //uv = fract(uv); //Fract returns the fractional part of its input
        //uv -= 0.5; // centers each fract

        //Combining all above Fract related equations;
        uv = fract(1.5 * uv) - 0.5;
        
        // using exponent function below will help in adding difference
        // x * exp(-x) represents a smooth transition. The two lines on a graph intersect and stay relatively close, then get farther apart
        float d = length(uv) * exp(-length(uv0)); // d represents the local distance relative to the center of each repeition / fract

        vec3 col = palette(length(uv0) + (i * .4) + (iTime * 0.4)); // Multiplying iTime by a fraction reduces the speed of gradient
        // with length(uv0), now each the gradients are relative to the space of the entire canvas, not in the individual fracts
        // adding (i * 0.4) once again adds more variation with each layer

        d = sin(d * 8. + iTime)/8.;
        d = abs(d);

        //d = step(0.1, d);
        // using pow(x, y), effectively accentuates the darker colors closer to 0 and having a lesser effect on lighter shades
        d = pow(0.01/d, 1.5);

        //col *= d;
        finalColor += col* d;
    }

    fragColor = vec4(finalColor, 1.0);
}

*/