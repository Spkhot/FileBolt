module.exports = function generateQR(code) {
  return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${code}`;
};
