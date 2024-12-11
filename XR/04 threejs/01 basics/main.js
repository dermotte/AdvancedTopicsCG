import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setAnimationLoop(animate);
document.body.appendChild(renderer.domElement);

// Show axes: The X axis is red. The Y axis is green. The Z axis is blue.
const axesHelper = new THREE.AxesHelper(5);
scene.add(axesHelper);

// Add a simple cube
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshStandardMaterial({ color: 0x00ff00, roughness: 0.6 });
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

// White directional light
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.9);
directionalLight.position.set(1, 0, 1).normalize();
scene.add(directionalLight);

// Yellow-ish front light
const front_light = new THREE.PointLight(0xddffff, 10, 100);
front_light.position.set(0, 0, 5);
scene.add(front_light);

// Soft-white ambient light
const amlight = new THREE.AmbientLight(0x404040);
scene.add(amlight);

// camera position
camera.position.z = 5;

// add controls
const controls = new OrbitControls(camera, 
			renderer.domElement);
controls.update()

// render loop
function animate() {
	// cube animation
	cube.rotation.x += 0.01;
	cube.rotation.y += 0.01;
	// updating the view based on controls
	controls.update();
	// rendering the scenes
	renderer.render(scene, camera);
}