// TODO copy
const WORK_TYPES = {
  WORK_TYPE_1099: 'Freelancer/Independent contractor',
  WORK_TYPE_W2: 'Full-time employee',
  WORK_TYPE_DIVERSIFIED: 'Multiple employment types',
};

export const WORK_TYPES_DESCRIPTIONS = {
  WORK_TYPE_1099: {
    title: 'I’m an independent contractor',
    subtitle: 'I receive a 1099 for taxes',
  },
  WORK_TYPE_W2: {
    title: 'I’m a full-time employee',
    subtitle: 'I receive a W2 for taxes',
  },
  WORK_TYPE_DIVERSIFIED: {
    title: 'I’m an employee with a side gig',
    subtitle: 'I receive both a 1099 and a W2 for taxes',
  },
};
export default WORK_TYPES;
