const checkIsManyMistakes = (correctNumber, mistakesNumber) => {
  const differenceNumber = correctNumber - mistakesNumber;

  if (correctNumber === 0) return true;
  return mistakesNumber >= differenceNumber;
};

const calculatePercentage = (
  completedItemsNumber, allItemsNumber,
) => parseInt((completedItemsNumber / allItemsNumber) * 100, 10);

const addDaysToTheDate = (
  daysToAdd, date = new Date(),
) => date.setDate(date.getDate() + parseInt(daysToAdd, 10));

export {
  checkIsManyMistakes,
  calculatePercentage,
  addDaysToTheDate,
};
