class RNG {
  x1 = 1;
  x2 = 1;

  a1 = 16807;
  a2 = 742938285;
  m1 = 2147483648-1; // 2^31-1
  m2 = 2147483399; // something smaller than m1
  b1 = 0;
  b2 = 0;

  constructor(seed1, seed2) {
    this.x1 = seed1;
    this.x2 = seed2;
  }

  getNextInt() {
    this.x1 = (this.a1*this.x1 + this.b1) % this.m1;
    this.x2 = (this.a2*this.x2 + this.b2) % this.m2;
    let rnd = (this.x1-this.x2)%(this.m1-1);
    if (rnd < 0) rnd = rnd + (this.m1 - 1); // fix negative modulos
    return rnd;
  }

}

// rng = new RNG(12345, 54321);
// for (let i=0; i<100; i++)
//   console.log(rng.getNextInt());
