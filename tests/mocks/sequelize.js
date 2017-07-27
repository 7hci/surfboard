module.exports = {
  define: name => class myNewClass extends Object {
    constructor(data) {
      super();
      Object.assign(this, data);
    }

    static get name() { return name; }
    }
};
