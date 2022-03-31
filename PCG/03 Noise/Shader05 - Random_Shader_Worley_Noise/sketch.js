let theShader;

function preload(){
  theShader = loadShader('shader.vert', 'shader.frag');
}

function setup() {
  createCanvas(640,480,WEBGL);
  noStroke();
}

function draw() {
  theShader.setUniform("u_resolution", [width*2, height*2]); // *2 fixes a peculiarity of p5js
  theShader.setUniform("u_time", millis() / 1000.0);
  theShader.setUniform('u_mouse', [mouseX, height-mouseY]);
  theShader.setUniform('numPoints', 5);
  shader(theShader);
  rect(0,0,width,height);
}