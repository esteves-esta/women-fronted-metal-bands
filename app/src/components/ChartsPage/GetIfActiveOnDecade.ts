export function getIfActiveOnDecade(band, decade) {
  const { yearStarted, yearEnded } = band;
  if (yearEnded) {
    return yearEnded <= decade ? 0 : 1;
  }

  return yearStarted < decade + 10 ? 1 : 0;
}
