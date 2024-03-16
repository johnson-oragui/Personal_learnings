const usernameConstraints = (username) => {
  const usernameRegex = /^[a-zA-Z0-9_-]+$/;
  // returns true if valid
  return usernameRegex.test(username.trim());
};

module.exports = usernameConstraints;
