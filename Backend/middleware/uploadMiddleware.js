const multer = require('multer');
const os = require('os');

// Save to temp folder
const upload = multer({ dest: os.tmpdir() });

module.exports = upload;