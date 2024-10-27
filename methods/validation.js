const validateId = (id) => {
  return isNaN(id);
};

const validateName = (name) => {
  return name.length < 1 || name.length > 30;
};

const validateAge = (age) => {
  return isNaN(age) || age < 18 || age > 60;
};

module.exports = { validateId, validateAge, validateName };
