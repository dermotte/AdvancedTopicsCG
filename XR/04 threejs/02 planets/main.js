import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setAnimationLoop(animate);
document.body.appendChild(renderer.domElement);

// Show axes: The X axis is red. The Y axis is green. The Z axis is blue.
// const axesHelper = new THREE.AxesHelper(5);
// scene.add(axesHelper);

// Add the planets
const sun = newPlanet(0.9, 32, 16, 0xffff00);

const mercury = newPlanet(0.1, 32, 16, 0x00ffbb);
mercury.position.set(1.5, 0, 0);

const venus = newPlanet(0.2, 32, 16, 0xbbff00);
venus.position.set(2, 0, 0);

const earth = newPlanet(0.2, 32, 16, 0x22ff22);
earth.position.set(2.7, 0, 0);

scene.add(sun);
scene.add(mercury);
scene.add(venus);
scene.add(earth);

const pos_earth = new THREE.Vector3( 1, 0, 0 ); 
let f = 0;


// White directional light
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.9);
directionalLight.position.set(1, 1, 1).normalize();
scene.add(directionalLight);

// Soft-white ambient light
const amlight = new THREE.AmbientLight(0x606060);
scene.add(amlight);

camera.position.z = 12;

// add controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.update()

function newPlanet(size, h, w, planet_color) {
    const sun_geometry = new THREE.SphereGeometry(size, h, w);
    const sun_material = new THREE.MeshStandardMaterial({ color: planet_color, roughness: 0.4 });
    const sun = new THREE.Mesh(sun_geometry, sun_material);
    return sun;
}

function animate() {
	// cube.rotation.x += 0.01;
	// cube.rotation.y += 0.01;

	controls.update();

    earth.position.set(2.7 * Math.sin(f), 0, 2.7 * Math.cos(f))
    mercury.position.set(1.5 * Math.sin(f*1.67), 0, 1.5 * Math.cos(f*1.67))
    venus.position.set(2 * Math.sin(f*1.169), 0, 2 * Math.cos(f*1.169))

    f += 0.01;

	renderer.render(scene, camera);
}