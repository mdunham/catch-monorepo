const currentYear = `${new Date().getFullYear()}`;

const ANNUAL_CONTRIBUTION_LIMIT = {
  '2019': 6000,
  '2020': 6000, // these values may change
  '2021': 6000,
};

export const getAnnualContributionLimit = () => {
  return ANNUAL_CONTRIBUTION_LIMIT[currentYear];
};
