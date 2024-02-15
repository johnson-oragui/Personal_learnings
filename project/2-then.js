function handleResponseFromAPI(promise) {
  promise
    .then((data) => {
      return {
        status: 200,
        body: 'success',
      };
    })
    .catch((error) => {
      return error;
    })
    .finally(console.log('Got a response from the API'));
}

if (require.main === module) {
  const promise = Promise.resolve();
  handleResponseFromAPI(promise);
}
