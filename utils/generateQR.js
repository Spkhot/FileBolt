const QRCode = require('qrcode');

module.exports = function generateQR(code) {
  const url = `https://filebolt.onrender.com/receive.html?code=${code}`;
  return QRCode.toDataURL(url);
};
