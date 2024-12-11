/**
 * VR Forest Scene with Dynamic Sun Cycle
 * 
 * This script creates a VR-compatible Three.js scene featuring:
 * - A forest of randomly placed trees
 * - Dynamic sun movement with day/night cycle
 * - Real-time shadow casting
 * - VR compatibility
 * 
 * Requirements:
 * - Three.js library
 * - GLTFLoader for loading 3D models
 * - VRButton for VR functionality
 * - tree_oak.glb model file
 * 
 * Made by M. Lux with the help of AI.
 */

import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { VRButton } from 'three/addons/webxr/VRButton.js';

// Configuration object for scene parameters
const CONFIG = {
    groundSize: 40,      // Size of the ground plane in units
    spawnAreaSize: 20,   // Area where trees can spawn (must be less than groundSize)
    numObjects: 100,     // Number of trees to generate
    minDistance: 0.5,    // Minimum distance between trees
    modelScale: {        
        min: 0.75,      // Minimum tree scale
        max: 1.25       // Maximum tree scale
    },
    sunCycle: {
        radius: 40,      // Orbit radius of the sun
        speed: 0.0001,   // Angular velocity of sun rotation
        heightRange: {   
            min: 5,     // Minimum sun height
            max: 30     // Maximum sun height
        },
        intensity: {    
            min: 0.2,   // Minimum light intensity (night)
            max: 3.0    // Maximum light intensity (day)
        }
    }
};

/**
 * Calculates Euclidean distance between two points in the XZ plane
 * @param {Object} p1 - First point with x and z coordinates
 * @param {Object} p2 - Second point with x and z coordinates
 * @returns {number} Distance between the points
 */
function distance(p1, p2) {
    return Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.z - p2.z, 2));
}

/**
 * Generates an array of valid positions for tree placement
 * Ensures minimum distance between trees using rejection sampling
 * 
 * @param {number} numPositions - Number of positions to generate
 * @param {number} spawnSize - Size of the spawn area
 * @param {number} minDistance - Minimum distance between positions
 * @returns {Array} Array of position objects with x, y, z coordinates
 */
function generatePositions(numPositions, spawnSize, minDistance) {
    const positions = [];
    const maxAttempts = 100;  // Prevent infinite loops

    while (positions.length < numPositions) {
        let attempts = 0;
        let validPosition = false;
        let newPos;

        while (!validPosition && attempts < maxAttempts) {
            // Generate random position within spawn area
            newPos = {
                x: (Math.random() - 0.5) * spawnSize,
                y: 0,
                z: (Math.random() - 0.5) * spawnSize
            };

            // Check distance from all existing positions
            validPosition = true;
            for (const pos of positions) {
                if (distance(newPos, pos) < minDistance) {
                    validPosition = false;
                    break;
                }
            }
            attempts++;
        }

        if (validPosition) {
            positions.push(newPos);
        } else {
            console.warn(`Couldn't find valid position after ${maxAttempts} attempts. Stopping at ${positions.length} objects.`);
            break;
        }
    }
    return positions;
}

// Scene setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

// Configure renderer with high-quality settings
const renderer = new THREE.WebGLRenderer({
    antialias: true,              // Enable anti-aliasing
    powerPreference: "high-performance",
    precision: "highp",           // High precision rendering
    logarithmicDepthBuffer: true, // Better depth precision
    stencil: false               // Disable unused stencil buffer
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;  // Soft shadows
document.body.appendChild(renderer.domElement);
document.body.appendChild(VRButton.createButton(renderer));
renderer.xr.enabled = true;  // Enable VR rendering

// Setup directional light (sun)
const dirLight = new THREE.DirectionalLight(0xffffff, CONFIG.sunCycle.intensity.max);
dirLight.castShadow = true;
// Configure shadow properties
dirLight.shadow.mapSize.width = 2048;   // Shadow map resolution
dirLight.shadow.mapSize.height = 2048;
dirLight.shadow.camera.near = 0.5;
dirLight.shadow.camera.far = 200;       // Far plane for shadows
dirLight.shadow.camera.left = -CONFIG.groundSize / 2;
dirLight.shadow.camera.right = CONFIG.groundSize / 2;
dirLight.shadow.camera.top = CONFIG.groundSize / 2;
dirLight.shadow.camera.bottom = -CONFIG.groundSize / 2;
scene.add(dirLight);

// Create visible sun sphere
const sunGeometry = new THREE.SphereGeometry(2, 16, 16);
const sunMaterial = new THREE.MeshBasicMaterial({ color: 0xffff00 });
const sunSphere = new THREE.Mesh(sunGeometry, sunMaterial);
scene.add(sunSphere);

// Add ambient light for base illumination
const amlight = new THREE.AmbientLight(0x808080, 0.5);
scene.add(amlight);

// Create ground plane
const groundGeometry = new THREE.PlaneGeometry(CONFIG.groundSize, CONFIG.groundSize, 32, 32);
const groundMaterial = new THREE.MeshStandardMaterial({
    color: 0x008000,     // Green color
    roughness: 0.8,      // More diffuse reflection
    metalness: 0.2,      // Slight metallic look
    envMapIntensity: 1.0 // Environment map influence
});
const ground = new THREE.Mesh(groundGeometry, groundMaterial);
ground.rotation.x = -Math.PI / 2;  // Rotate to horizontal
ground.position.y = 0;
ground.receiveShadow = true;
scene.add(ground);

// Generate tree positions
const positions = generatePositions(
    CONFIG.numObjects,
    CONFIG.spawnAreaSize,
    CONFIG.minDistance
);

// Load and place trees
const loader = new GLTFLoader();
loader.load('tree_oak.glb', function (gltf) {
    positions.forEach(position => {
        const modelClone = gltf.scene.clone();
        modelClone.position.set(position.x, position.y, position.z);
        modelClone.rotation.y = Math.random() * Math.PI * 2;  // Random rotation
        const scale = Math.random() * (CONFIG.modelScale.max - CONFIG.modelScale.min) + CONFIG.modelScale.min;
        modelClone.scale.setScalar(scale);

        // Configure tree materials and shadows
        modelClone.traverse(function (node) {
            if (node.isMesh) {
                node.castShadow = true;
                node.receiveShadow = true;
                if (node.material) {
                    node.material.envMapIntensity = 1.0;
                    node.material.needsUpdate = true;
                }
            }
        });

        scene.add(modelClone);
    });
}, undefined, function (error) {
    console.error(error);
});

// Set initial camera position
camera.position.set(3, 1, -3);
camera.lookAt(new THREE.Vector3(0, 0, 0));

/**
 * Updates sun position and lighting based on time
 * Calculates sun position along its orbital path and adjusts lighting intensity
 * 
 * @param {number} time - Current time in milliseconds
 */
function updateSun(time) {
    // Calculate sun position
    const angle = time * CONFIG.sunCycle.speed;
    const height = Math.sin(angle) *
        (CONFIG.sunCycle.heightRange.max - CONFIG.sunCycle.heightRange.min) +
        CONFIG.sunCycle.heightRange.min;

    const x = Math.cos(angle) * CONFIG.sunCycle.radius;
    const z = Math.sin(angle) * CONFIG.sunCycle.radius;

    // Update sun and light positions
    dirLight.position.set(x, height, z);
    sunSphere.position.copy(dirLight.position);

    // Update shadow camera
    dirLight.shadow.camera.far = 200;
    dirLight.shadow.camera.updateProjectionMatrix();

    // Calculate and update light intensities
    const normalizedHeight = (height - CONFIG.sunCycle.heightRange.min) /
        (CONFIG.sunCycle.heightRange.max - CONFIG.sunCycle.heightRange.min);
    const intensity = THREE.MathUtils.lerp(
        CONFIG.sunCycle.intensity.min,
        CONFIG.sunCycle.intensity.max,
        normalizedHeight
    );

    dirLight.intensity = intensity;
    amlight.intensity = intensity * 0.1 + 0.1;  // Base ambient light plus dynamic component
}

// Animation loop
function animate(time) {
    updateSun(time);
    renderer.render(scene, camera);
}

renderer.setAnimationLoop(animate);