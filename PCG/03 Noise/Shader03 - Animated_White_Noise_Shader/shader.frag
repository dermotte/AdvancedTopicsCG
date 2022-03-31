#ifdef GL_ES
precision mediump float;
#endif

// Passed in information from the sketch.js
uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

// PRNG function making a new vec2 from an input vec2
vec2 rand(vec2 p) {
  p = vec2( dot(p,vec2(127.1,311.7)), dot(p,vec2(269.5,183.3)) ); 
  return fract(sin(p)*43758.5453);
}

void main() {
  vec2 st = gl_FragCoord.xy/u_resolution.xy;
  // using time to vary the input for the PRNG
  vec3 color = vec3(rand(st*fract(u_time)).x);
  gl_FragColor = vec4(color,1.0);
}