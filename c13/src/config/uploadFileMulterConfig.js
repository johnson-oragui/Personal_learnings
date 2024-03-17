const multer = require('multer');
const fs = require('fs');

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    // dir name
    const uploadDir = 'uploads/';
    // try to access dir
    fs.access(uploadDir, (error) => {
      if (error) {
        // dir does not exist, attempt to create it
        fs.mkdirSync(uploadDir, { recursive: true }, (error) => {
          if (error) {
            // error occured while creating dir
            console.error('error creating upload dir: ', error);
            callback(error, false);
          } else {
            // directory successfully created
            callback(null, uploadDir);
          }
        });
      } else {
        // dir already exists
        callback(null, uploadDir);
      }
    });
  },
  filename: (req, file, callback) => {
    callback(null, file.originalname);
  },
});

const upload = multer({ storage, limits: { fileSize: 2048576 } }); // 2MB

module.exports = upload;
