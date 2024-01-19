import moment from 'moment-timezone';

export const formatCurrency = (amount, currency = '₦') => {
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    currencyDisplay: 'symbol',
  });

  const formatted = formatter.format(amount);

  return formatted.replace('$', currency);
};

export const formatMessageTime = updatedAt => {
  const now = moment();
  const messageTime = moment(updatedAt);

  if (now.diff(messageTime, 'days') === 0) {
    // If the message is from today, show only the time
    return messageTime.format('LT');
  } else if (now.diff(messageTime, 'days') === 1) {
    // If the message is from yesterday, show 'Yesterday' and the time
    return 'Yesterday';
  } else if (now.diff(messageTime, 'days') <= 7) {
    // If the message is from within the last week, show the day and time
    return messageTime.format('dddd');
  } else {
    // For messages older than a week, show the full date and time
    return messageTime.calendar();
  }
};
