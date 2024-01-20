export function getRandomArbitrary(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}
export function getRandomInt(min: number, max: number) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Number(Math.floor(Math.random() * (max - min + 1)).toFixed(18)) + min;
}

export function getRandomColor() {
  let letters = '0123456789ABCDEF';
  var color = '#';
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}
