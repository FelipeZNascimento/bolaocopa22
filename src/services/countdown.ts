export type TCountdownObject = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
};

export const returnCountdownObject = (futureDate: number, baseDate: number) => {
  const distance = futureDate - baseDate;

  return <TCountdownObject>{
    days: Math.floor(distance / (60 * 60 * 24)),
    hours: Math.floor((distance % (60 * 60 * 24)) / (60 * 60)),
    minutes: Math.floor((distance % (60 * 60)) / 60),
    seconds: Math.floor(distance % 60)
  };
};
