#ifdef GL_ES
precision mediump float;
#endif

// Passed in information from the sketch.js
uniform vec2 u_resolution;

void main() {
  vec2 uv = gl_FragCoord.xy/u_resolution.xy;
  // using time to vary the input for the PRNG
  float random = fract(sin(dot(uv.xy, vec2(12.9898,78.233)))* 43758.5453123);

  // Output to screen
  gl_FragColor = vec4(vec3(random),1.0);
}