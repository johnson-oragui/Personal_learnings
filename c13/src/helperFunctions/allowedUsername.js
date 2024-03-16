const allowedUsername = (username) => {
  const notAllowedUsernames = ['niggar', 'chinchon', 'bitch', 'fuck', 'fucking', 'cum', 'scum'];
  const valiid = !(notAllowedUsernames.includes(username.toLowerCase()));
  return valiid;
};

module.exports = allowedUsername;
