const formatYearsActive = (data) => {
  const { yearStarted, yearEnded } = data;

  const thisYear = new Date().getFullYear();

  let activeYears = 0;
  if (yearStarted !== null) {
    activeYears = thisYear - yearStarted;
    if (yearEnded) activeYears = yearEnded - yearStarted;
  }
  return activeYears;
};

export default formatYearsActive;
