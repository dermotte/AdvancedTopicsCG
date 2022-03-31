let theShader;

function preload(){
  theShader = loadShader('shader.vert', 'shader.frag');
}

function setup() {
  createCanvas(640,480,WEBGL);
  noStroke();
  print(width, height);
}

function draw() {
  theShader.setUniform("u_resolution", [width*2, height*2]);
  theShader.setUniform("u_time", millis() / 1000.0);
  theShader.setUniform('u_mouse', [mouseX*2, (height-mouseY)*2]);
  shader(theShader);
  rect(0,0,width,height);
}