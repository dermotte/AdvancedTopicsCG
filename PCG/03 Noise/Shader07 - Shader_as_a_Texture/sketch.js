/*
 * @name Applying Shaders as Textures
 * @description Shaders can be applied to 2D/3D shapes as textures. 
 * To learn more about shaders and p5.js: https://itp-xstory.github.io/p5js-shaders/
 */

let theShader;
let shaderTexture;

let theta = 0;


function preload(){
  // load the shader
  theShader = loadShader('shader.vert','shader.frag');
}

function setup() {
  createCanvas(640, 480, WEBGL);
  noStroke();

  // initialize the createGraphics layers
  shaderTexture = createGraphics(640, 480, WEBGL);

  // turn off the createGraphics layers stroke
  shaderTexture.noStroke();
}

function draw() {

  // instead of just setting the active shader we are passing it to the createGraphics layer
  shaderTexture.shader(theShader);

  // here we're using setUniform() to send our uniform values to the shader
  theShader.setUniform("u_resolution", [width*2, height*2]);
  theShader.setUniform("u_time", millis() / 1000.0);

  // passing the shaderTexture layer geometry to render on
  shaderTexture.rect(0,0,width,height);

  background(255);
  
  //pass the shader as a texture
  texture(shaderTexture);
  
  // translate(-150, 0, 0);
  rotateY(theta)
  theta += 0.01;
  box(250);
  
}

/*let theShader;

function preload(){
  theShader = loadShader('shader.vert', 'shader.frag');
}

function setup() {
  createCanvas(640,480,WEBGL);
  noStroke();
}

function draw() {
  theShader.setUniform("u_resolution", [width, height]);
  theShader.setUniform("u_time", millis() / 1000.0);
  theShader.setUniform('u_mouse', [mouseX, height-mouseY]);
  theShader.setUniform('numPoints', 5);
  shader(theShader);
  rect(0,0,width,height);
}*/