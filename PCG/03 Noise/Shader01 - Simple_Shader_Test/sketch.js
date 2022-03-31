let theShader;

function preload(){
  theShader = loadShader('shader.vert', 'shader.frag');
}

function setup() {
  createCanvas(640,480,WEBGL);
  noStroke();
}

function draw() {
  theShader.setUniform("u_resolution", [width*2, height*2]); // no idea why, but the *2 is specific to p5js
  theShader.setUniform("u_time", millis() / 1000.0);
  shader(theShader);
  rect(0,0,width,height);
}