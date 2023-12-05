export const formatCurrency = (amount, currency = '₦') => {
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    currencyDisplay: 'symbol',
  });

  const formatted = formatter.format(amount);

  return formatted.replace('$', currency);
};
