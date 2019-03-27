// createValidator takes in a validation map and returns the validate() function
// that can be used by redux-form to generate any errors
export default function createValidator(validationMap, customOverrides = {}) {
  const schema = {
    ...validationMap,
    ...customOverrides,
  };

  return values => {
    const errors = {};
    for (let field in schema) {
      let value = values[field];
      errors[field] = schema[field]
        .map(validateField => {
          return validateField(value, values);
        })
        .find(x => x);
    }
    return errors;
  };
}
