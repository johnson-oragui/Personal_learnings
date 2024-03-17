const sharp = require('sharp');

const validateImageDimensions = async (imagePath) => {
  const imageMetadata = await sharp(imagePath).metadata();
  const { width, height } = imageMetadata;

  // Define desired maximum dimensions
  const maxWidth = 2000;
  const maxHeight = 2000;

  if (width > maxWidth || height > maxHeight) {
    throw new Error('Image exceeds maximum dimensions');
  }
};

module.exports = validateImageDimensions;
