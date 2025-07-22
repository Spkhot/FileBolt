const archiver = require('archiver');
const fs = require('fs');
const path = require('path');

/**
 * Creates a zip stream from files and pipes to the response.
 * @param {Array} files - Array of file objects with `path` and `originalname`
 * @param {Object} res - Express response to pipe to
 */
module.exports = function createZip(files, res) {
  const archive = archiver('zip', { zlib: { level: 9 } });

  // Tell browser to treat as attachment
  res.attachment('files.zip');

  archive.pipe(res);

  files.forEach(file => {
    archive.file(path.resolve(file.path), { name: file.originalname });
  });

  archive.finalize();
};
