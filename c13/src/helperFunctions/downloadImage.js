const axios = require('axios');

const downloadImage = async (imageUrl) => {
  try {
    const res = await axios.get(imageUrl, { responseType: 'arraybuffer' }); // Download as arraybuffer for image data
    return res.data;
  } catch (error) {
    console.error('Error in axios downloading image:', error.message);
    throw new Error('Failed to download image'); // Re-throw for handling in putAvatar
  }
};

module.exports = downloadImage;
