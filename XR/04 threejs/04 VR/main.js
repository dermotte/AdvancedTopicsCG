import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { VRButton } from 'three/addons/webxr/VRButton.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setAnimationLoop(animate);
document.body.appendChild(renderer.domElement);
// adding the button
document.body.appendChild( VRButton.createButton( renderer ) );
// enabling rendering with XR:
renderer.xr.enabled = true;

// Show axes: The X axis is red. The Y axis is green. The Z axis is blue.
// const axesHelper = new THREE.AxesHelper(5);
// scene.add(axesHelper);

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


function newPlanet(size, h, w, planet_color) {
    const sun_geometry = new THREE.SphereGeometry(size, h, w);
    const sun_material = new THREE.MeshStandardMaterial({ color: planet_color, roughness: 0.4 });
    const sun = new THREE.Mesh(sun_geometry, sun_material);
    return sun;
}

function animate() {
    renderer.render(scene, camera);
}