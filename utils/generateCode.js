module.exports = function generateCode() {
  return Math.random().toString().slice(2, 7).padEnd(5, '0'); // 5-digit code
};
