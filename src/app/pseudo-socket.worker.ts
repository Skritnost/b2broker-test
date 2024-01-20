import { v4 as uuidv4 } from 'uuid';
import { ChildElement, DataElement } from './models';
import { getRandomArbitrary, getRandomColor, getRandomInt } from './utilities';

let intervalId: NodeJS.Timeout;

onmessage = (event) => {
  const { timerInterval, dataSize } = event.data;

  if (intervalId) {
    clearInterval(intervalId);
  }

  if (dataSize) {
    intervalId = setInterval(() => {
      const data = generateData(dataSize);

      postMessage(data);
    }, timerInterval);
  }
};

function generateData(size: number): DataElement[] {
  if (size <= 0) {
    return [];
  }

  return Array.from({ length: size }, () => {
    const child = new ChildElement(uuidv4(), getRandomColor())

    return new DataElement(uuidv4(), getRandomInt(0, 1000000), getRandomArbitrary(0, 1000000), getRandomColor(), child);
  });
}

