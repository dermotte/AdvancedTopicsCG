import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

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

// add controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.update()

function animate() {
	// cube.rotation.x += 0.01;
	// cube.rotation.y += 0.01;

	renderer.render(scene, camera);
}