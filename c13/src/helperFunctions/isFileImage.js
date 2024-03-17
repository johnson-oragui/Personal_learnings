// const mime = import('mime');
// Function to check if a file is an image
const isFileImage = async (filePath) => {
  const mime = await require('mime');
  // an array of allowed content types
  const imageTypesAllowed = ['image/png', 'image/jpeg', 'image/gif'];
  // retreieve the type of the file
  const contentType = mime.getType(filePath);
  // check if the file is valid
  return (imageTypesAllowed.includes(contentType), contentType);
};

export default isFileImage;
