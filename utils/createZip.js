const archiver = require('archiver');
const axios = require('axios');

/**
 * Creates a zip from remote URLs and pipes to response.
 * @param {Array} files - [{ url, originalname }]
 * @param {Object} res - Express res
 */
module.exports = async function createZip(files, res) {
  const archive = archiver('zip', { zlib: { level: 9 } });

  res.attachment('files.zip');
  archive.pipe(res);

  for (const file of files) {
    const response = await axios({
      method: 'get',
      url: file.url,
      responseType: 'stream',
    });

    archive.append(response.data, { name: file.originalname });
  }

  await archive.finalize();
};
