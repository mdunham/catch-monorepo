/**
 * filterPlans takes a bunch of filters and a list of plans and return
 * filtered plans as well as some metadata about the results
 */

const planFilters = {
  hmo: plan => plan.type === 'HMO',
  epo: plan => plan.type === 'EPO',
  ppo: plan => plan.type === 'PPO',
  premium: (plan, amount) => plan.premium <= amount,
  catastrophic: plan => plan.metalLevel === 'Catastrophic',
  bronze: plan => plan.metalLevel === 'Bronze',
  silver: plan => plan.metalLevel === 'Silver',
  gold: plan => plan.metalLevel === 'Gold',
  platinum: plan => plan.metalLevel === 'Platinum',
};

export function createFilters(filters) {
  const activeFilters = [];
  const tiers = [];
  const network = [];
  const premium = [];
  for (let key in filters) {
    if (filters[key]) {
      if (/hmo|ppo|epo/.test(key)) {
        network.push(key);
      }
      if (/catastrophic|bronze|silver|gold|platinum/.test(key)) {
        tiers.push(key);
      }
      if (/premium/.test(key)) {
        premium.push(key);
      }
    }
  }
  return [
    !!network.length && network,
    !!tiers.length && tiers,
    !!premium.length && premium,
  ];
}

export function filterPlans(plans, activeFilters, filterValues) {
  let minPremium = plans.length ? plans[0].premium : 0;
  let maxPremium = 0;

  const outputPlans = plans.reduce((output, item) => {
    if (item.premium > maxPremium) maxPremium = item.premium;
    if (item.premium < minPremium) minPremium = item.premium;
    if (activeFilters.length) {
      if (
        activeFilters.every(
          filters =>
            !Array.isArray(filters) ||
            filters.some(key => planFilters[key](item, filterValues[key])),
        )
      ) {
        return output.concat([item]);
      }
      return output;
    } else {
      return output.concat([item]);
    }
  }, []);

  return {
    filteredPlans: outputPlans,
    filteredLength: activeFilters.length ? outputPlans.length : 0,
    maxPremium,
    minPremium,
  };
}
