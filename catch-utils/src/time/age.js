export const convertUnixTimeToAge = datetime => {
  return Math.floor(
    (new Date().getTime() - new Date(datetime)) / (1000 * 60 * 60 * 24 * 365),
  );
};
