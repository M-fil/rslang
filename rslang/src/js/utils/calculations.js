const checkIsManyMistakes = (correctNumber, mistakesNumber) => {
  const differenceNumber = correctNumber - mistakesNumber;

  return mistakesNumber >= differenceNumber;
};

export {
  checkIsManyMistakes,
};
