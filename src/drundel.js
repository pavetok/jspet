function drundel(spec) {
  const that = Object.create({});
  Object.assign(that, spec);
  return that;
}

module.exports = drundel;
