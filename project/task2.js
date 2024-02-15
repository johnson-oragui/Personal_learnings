//Create a function called sumNumbersAsync that takes an array of numbers as a parameter 
//and returns a promise. The promise should resolve with the sum of the numbers in the array. If 
//the array is empty, the promise should reject with an error message.

function sumNumbersAsync(numArray) {
  return new Promise((resolve, reject) => {
    if (numArray && numArray.length > 0) {
      const data = numArray.reduce((acc, num) => acc + num, 0);
      resolve(data);
    } else {
      reject(new Error('Error: Array is empty.'));
    }
  });
}

sumNumbersAsync([1, 2, 3, 4, 5])
  .then(sum => {
    console.log('Sum: ', sum);
  })
  .catch(error => {
    console.error(error);
  });
