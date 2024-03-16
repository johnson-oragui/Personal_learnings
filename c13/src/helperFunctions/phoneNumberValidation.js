// Function to validate phone number format
const phoneNumberValidation = (phoneNumber) => {
  // Regular expression for basic phone number format validation
  const phoneRegex = /^\d{10,11}$/; // Assumes a 10 to 11 digit phone number format
  return phoneRegex.test(phoneNumber);
};

module.exports = phoneNumberValidation;
