const Queue = require('./customQueue/Queue');

const tasks = [3, 2, 5, 4];
const breakTime = 2;


const totalTime = (tasks, breakTime) => {
  const tTime = [];
  let sum = 0;
  const queue = new Queue();
  // iterate through the tasks
  for (const task of tasks) {
    queue.enqueue(task);
    queue.enqueue(breakTime);
    if (queue.queueSize() > 2) {
      sum += (queue.dequeue());
      sum += (queue.dequeue());
    }
    
  }
  return sum += tasks[(tasks.length - 1)];
};

console.log(totalTime(tasks, breakTime))
