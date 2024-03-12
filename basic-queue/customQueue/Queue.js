class Queue {
  constructor() {
    this.items = [];
  }
  // adds a new item to the queue
  enqueue(item) {
    this.items.push(item);
  }
  // checkes if queue is empty, if empty, returns queue is empty,
  // if queue is not empty, processes the item in the queue
  dequeue() {
    if (this.isEmpty()) {
      return 'Queue is empty';
    }
    return this.items.shift();
  }
  queueSize() {
    return this.items.length;
  }
  // returns true is all items in the queue are processed
  isEmpty() {
    return this.queueSize() === 0;
  }
  queuePeek() {
    return this.items[0];
  }
}

module.exports = Queue;
