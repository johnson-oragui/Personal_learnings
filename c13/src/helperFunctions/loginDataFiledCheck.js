const loginDataFieldCheck = (emailOrUsername, password) => {
  if (!emailOrUsername || !password) {
    return false;
  }
  const fields = [emailOrUsername.trim(), password.trim()].every(Boolean);
  console.log('login data: ', emailOrUsername, password);
  // return false if not
  // return true if all fields are provided
  return fields;
};

module.exports = loginDataFieldCheck;
