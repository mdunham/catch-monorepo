function getAccount(bankLinks, accountID) {
  return bankLinks.reduce((acc, bl) => {
    const match = bl.accounts.find(a => a.id === accountID);
    if (match) {
      acc.bankName = bl.bank.name;
      acc.number = match.accountNumber;
    }
    return acc;
  }, {});
}

export default getAccount;
