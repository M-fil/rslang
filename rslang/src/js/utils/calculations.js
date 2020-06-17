const checkIsManyMistakes = (correctNumber, mistakesNumber) => {
  const differenceNumber = correctNumber - mistakesNumber;

  if (correctNumber === 0) return true;
  return mistakesNumber >= differenceNumber;
};

export {
  checkIsManyMistakes,
};
