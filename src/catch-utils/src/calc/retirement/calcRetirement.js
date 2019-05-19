// RECURRING DEPOSITS
// rate: interest rate per period
// nper: number of payment periods
// pmt: the payment made each period
// pv: present value of future payments
// type: when payments are due. 0=end of period, 1=beginning of period
function fvWithDeposits({ rate, nper, pmt, pv, type = 0 }) {
  var pow = Math.pow(1 + rate, nper),
    fv;
  if (rate) {
    fv = (pmt * (1 + rate * type) * (1 - pow)) / rate - pv * pow;
  } else {
    fv = -1 * (pv + pmt * nper);
  }
  return fv.toFixed(2);
}

// ONE TIME DEPOSIT
// rate: interest rate per period
// nper: number of payment periods
// pmt: the payment made initially
function fv({ rate, nper, pmt }) {
  var pow = Math.pow(1 + rate, nper);
  return pmt * pow;
}

// WITHDRAWALS
// rate: interest rate per period
// nper: number of payment periods
// pv: present value of the account
// fv: future value of the account
// type: when payments are due. 0=end of period, 1=beginning of period
function pmt({ rate, nper, pv, fv, type = 0 }) {
  if (rate != 0.0) {
    // Interest rate exists
    var q = Math.pow(1 + rate, nper);
    return -(rate * (fv + q * pv)) / ((-1 + q) * (1 + rate * type));
  } else if (nper != 0.0) {
    // No interest rate, but number of payments exists
    return -(fv + pv) / nper;
  }

  return 0;
}

export function calculateRetirementIncome({
  currentAge,
  monthlyPayment,
  initialAmount = 0,
  retirementAge = 65,
  deathAge = 90,
  interestRateRetirement = 0.05, // assuming users invest conservatively during retirement
  interestRate = 0.07, // moderate portfolio default
  inflation = 0.025, // projected rate of inflation
}) {
  // explicitly account for inflation rate in the assumed interest rate earned on a portfolio during a user's working years
  const nominalRateWorking = interestRate - inflation;

  // explicitly account for inflation rate during users retirement years
  const nominalRateRetired = interestRateRetirement - inflation;

  const depositsFV = -fvWithDeposits({
    rate: nominalRateWorking / 12,
    nper: 12 * (retirementAge - currentAge),
    pmt: monthlyPayment,
    pv: monthlyPayment,
  });

  const initialSavingsFV = fv({
    rate: nominalRateWorking / 12,
    nper: 12 * (retirementAge - currentAge),
    pmt: initialAmount,
  });

  const totalSaved = initialSavingsFV + depositsFV;

  // at this point, the user will (hopefully) be saving conservatively, meaning a lower rate of return on their retirement account
  const monthlyIncome =
    -1 *
    pmt({
      rate: nominalRateRetired / 12,
      nper: 12 * (deathAge - retirementAge),
      pv: totalSaved,
      fv: 0,
    });

  return {
    monthlyIncome,
    totalSaved,
    initialSavingsFV,
    depositsFV,
    inputs: {
      currentAge,
      monthlyPayment,
      retirementAge,
      deathAge,
      interestRate,
      initialAmount,
    },
  };
}
