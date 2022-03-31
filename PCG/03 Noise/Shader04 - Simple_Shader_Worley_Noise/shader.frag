#ifdef GL_ES
precision mediump float;
#endif

// These are our passed in information from the sketch.js
uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;



float rand(vec2 n) {
  return 0.5 + 0.5 * 
     fract(sin(dot(n.xy, vec2(12.9898, 78.233)))* 43758.5453);
}

float map(float value, float min1, float max1, float min2, float max2) {
  return min2 + (value - min1) * (max2 - min2) / (max1 - min1);
}

void main() {
  vec2 st = gl_FragCoord.xy/u_resolution.xy;
  vec3 color = vec3(.0);
  
  // five points pre-defined
  vec2 point[5];
  point[0] = vec2(0.83,0.75);
  point[1] = vec2(0.60,0.07);
  point[2] = vec2(0.28,0.64);
  point[3] = vec2(0.31,0.26);
  point[4] = u_mouse/u_resolution;

  float m_dist = 1.;  // minimum distance

  // Iterate through the points for minimum
  for (int i = 0; i < 5; i++) {
      float dist = distance(st, point[i]);
      // Keep the closer distance
      m_dist = min(m_dist, dist);
  }

  // Draw the minimum distance
  color += m_dist;
  color += 1.0-map(m_dist, 0.01, 0.4, 0.0, 1.0);
  gl_FragColor = vec4(color,1.0);
}