const Queue = require('./customQueue/Queue');

const stream = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
const windowSize = 3;

const movingAverage = (stream, windowSize) => {
  const queue = new Queue();
  const movingA = [];
  let sum = 0;
  
  for (let i = 0; i < stream.length; i++) {
    queue.enqueue(stream[i]);
    sum += stream[i];
    console.log('sum: ', sum);
    console.log('queue: ', queue);
    if (queue.queueSize() > windowSize) {
      console.log('queueSize: ', queue.queueSize());
      sum -= queue.dequeue(); // Remove the oldest element from the sum
      console.log('sum minus: ', sum);
    }
    if (queue.queueSize() === windowSize) {
      movingA.push(sum / windowSize); // Calculate and push the moving average
    }
    }
  return movingA;
};


const result = movingAverage(stream, windowSize); // Output: [1, 1.5, 2, 3, 4, 5, 6, 7, 8, 9]

console.log(result);
