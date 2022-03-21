function gaussianRandom() {
  let sum = 0;
  for (let i=0; i<3; i++)
    sum += Math.random()*2-1;
  return sum;
}

a = "";
for (let i=0; i<120; i++)
  if (Math.random()<0.5) a +="0";
  else a += "1";
console.log(a);
