export const formatDate = date =>
  `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;

export const parseDate = date => {
  const parts = date.split('/');
  return new Date(
    parseInt(parts[2], 10),
    parseInt(parts[1], 10) - 1,
    parseInt(parts[0], 10)
  );
};

// Miliseconds to Minutes
export const msToMinutes = ms => Math.floor(ms / 1000 / 60);

export const anonymizeDate = date => {
  // Moves the date to the previous Monday.
  date.setDate(date.getDate() - ((date.getDay() + 6) % 7));
  return date;
};
