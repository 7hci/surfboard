module.exports = function socket() {
  this.emitted = [];
  this.emit = (type, msg) => {
    this.emitted.push(msg);
  };
};
