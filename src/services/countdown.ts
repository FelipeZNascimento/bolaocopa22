export type TCountdownObject = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
};

export const returnCountdownObject = (futureDate: number, baseDate: number) => {
  const distance = futureDate - baseDate;

  const countdownObject = <TCountdownObject>{
    days: Math.floor(distance / (60 * 60 * 24)),
    hours: Math.floor((distance % (60 * 60 * 24)) / (60 * 60)),
    minutes: Math.floor((distance % (60 * 60)) / 60),
    seconds: Math.floor(distance % 60)
  };

  if (
    countdownObject.days > 0 ||
    countdownObject.hours > 0 ||
    countdownObject.minutes > 0 ||
    countdownObject.seconds > 0
  ) {
    return countdownObject;
  }

  return null;
};
