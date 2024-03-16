const regDataFieldCheck = (firstN, lastN, email, userN, pwd) => {
  const fields = [firstN, lastN, email, userN, pwd].every(Boolean);
  // return false if not
  // return true if all fields are provided
  return fields;
};

module.exports = regDataFieldCheck;
