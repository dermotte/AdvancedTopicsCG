#ifdef GL_ES
precision mediump float;
#endif

// These are our passed in information from the sketch.js
uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

const int numberOfPoints = 150;

// PRNG function making a new vec2 from an input vec2
vec2 rand(vec2 p) {
    p = vec2( dot(p,vec2(127.1,311.7)), dot(p,vec2(269.5,183.3)) );
    return fract(sin(p)*43758.5453);
}

float map(float value, float min1, float max1, float min2, float max2) {
    return min2 + (value - min1) * (max2 - min2) / (max1 - min1);
}

void main() {
    vec2 st = gl_FragCoord.xy/u_resolution.xy;
    vec3 color = vec3(.0);

    // seed for the PRNG
    vec2 seed = vec2(0.1, 0.42);

    float m_dist = 1.;  // minimum distance

    // Make as many points as one wants from a PRNG
    for (int i = 0; i < numberOfPoints; i++) {
        float dist = distance(st, seed);

        // Keep the closer distance
        m_dist = min(m_dist, dist);
        seed = rand(seed);
    }

    // Draw the min distance (distance field)
    color += m_dist;
    color += map(m_dist, 0., 0.15, 0.0, 1.0);

    gl_FragColor = vec4(0.0, 0.0, color.z,1.0);
}