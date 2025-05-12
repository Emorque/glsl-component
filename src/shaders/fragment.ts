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