import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { VRButton } from 'three/addons/webxr/VRButton.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer({
    antialias: true,              // Enable anti-aliasing
    powerPreference: "high-performance",
    precision: "highp",           // High precision rendering
    logarithmicDepthBuffer: true, // Better depth precision
    stencil: false               // Disable unused stencil buffer
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setAnimationLoop(animate);
document.body.appendChild(renderer.domElement);
// adding the button
document.body.appendChild( VRButton.createButton( renderer ) );
// enabling rendering with XR:
renderer.xr.enabled = true;

// Load model
const loader = new GLTFLoader();

loader.load( 'sample.glb', function ( gltf ) {
	scene.add( gltf.scene );
}, undefined, function ( error ) {
	console.error( error );
} );

// White directional light
const directionalLight = new THREE.DirectionalLight(0xffffff, 3);
directionalLight.position.set(1, 1, -2).normalize();
scene.add(directionalLight);

// Soft-white ambient light
const amlight = new THREE.AmbientLight(0x606060);
scene.add(amlight);

camera.position.set(3, 1, -3);
camera.lookAt(new THREE.Vector3(0, 0, 0))

function animate() {
    renderer.render(scene, camera);
}