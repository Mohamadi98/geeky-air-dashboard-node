const createRecurringDatesByWeek = (daysOfTheWeek, everyWeek, startingDate, endingDate) => {
  const result = [];
  const eDate = new Date(endingDate);

  daysOfTheWeek.forEach(day => {
    let date = new Date(startingDate);

    while (date <= eDate) {
      if (date.getDay() === day) {
        const isoString = date.toISOString(); // Convert date to ISO string
        if (!result.includes(isoString)) {
          result.push(isoString);
        }
        date = new Date(isoString); // Create a new date object from the ISO string
        date.setDate(date.getDate() + 7 * everyWeek);
      } else {
        date.setDate(date.getDate() + 1);
      }
    }
  });

  return result;
};

const createRecurringDatesByMonth = (daysOfTheMonth, everyMonth, endingDate) => {
  const result = [];
  const eDate = new Date(endingDate);

  daysOfTheMonth.forEach(day => {
    let date = new Date();

    while (date <= eDate) {
      if (date.getDate() === day) {
        const isoString = date.toISOString(); // Convert date to ISO string
        date = new Date(isoString); // Create a new date object from the ISO string
        result.push(isoString);
        date.setDate(date.getDate() + 28 * everyMonth);
      } else {
        date.setDate(date.getDate() + 1);
      }
    }
  });

  return result;
}






