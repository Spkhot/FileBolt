module.exports = function generateCode() {
  // 5-digit numeric code
  return Math.floor(10000 + Math.random() * 90000).toString();
};
