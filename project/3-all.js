import { uploadPhoto, createUser } from './utils';

function handleProfileSignup() {
  const response = Promise.all([uploadPhoto(), createUser()]);
  response
    .then((data) => {
      const res1 = data[0];
      const res2 = data[1];
      console.log(res1.body, res2.firstName, res2.lastName);
    })
    .catch(error => console.error('Signup system offline'));
}

handleProfileSignup();
