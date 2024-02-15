
 // Create a function called delayedGreeting that takes a name and a delay in
// milliseconds as parameters. The function should return a promise that resolves
// with a greeting message after the specified delay. If the delay is less
// than 1000 milliseconds, the promise should reject with an error message.
function delayedGreeting(name, delay) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (delay > 1) {
        const data = { message: `Hello, ${name}!` };
	resolve(data);
      } else {
        reject(new Error('Error: Delay should be at least 1000 milliseconds.'));
      }
    }, delay);
  });
}

delayedGreeting('Alice', 1500)
  .then(data => console.log(data.message))
  .catch(error => console.error(error));
