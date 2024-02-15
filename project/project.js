function letter() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const success = Math.random() < 0.8;
      if (success) {
        const data = { message: 'Data successfully fetch' };
	resolve(data);
      } else {
        reject(new Error('Failed to fetch data'));
      }
    }, 2000);
  });
}

letter()
  .then(data => console.log(data.message))
  .catch(error => console.error(error.message));

if (require.main === module) {
  const jet = letter();
  console.log(jet instanceof Promise);
}
