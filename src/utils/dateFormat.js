export const formatDate = date =>
  `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;

// Miliseconds to Minutes
export const msToMinutes = ms => Math.floor(ms / 1000 / 60);
