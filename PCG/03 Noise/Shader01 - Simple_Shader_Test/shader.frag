#ifdef GL_ES
precision mediump float;
#endif

// These are our passed in information from the sketch.js
uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

void main() {
  // vec2 q = vec2(1.5, .5);
  vec2 st = gl_FragCoord.xy/u_resolution;
  // float d = smoothstep(0.2, 0.21, length(q-st));
  // vec3 color = vec3(d, 0., 1.0);
  vec3 color = vec3(st.x, st.y, 1.0);
  gl_FragColor = vec4(color, 1.0);
}