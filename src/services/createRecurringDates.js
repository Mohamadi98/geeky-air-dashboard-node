const dateServices = require('../services/dateServices')
const moment = require('moment-timezone')

const createRecurringDatesByWeek = (daysOfTheWeek, everyWeek, startingDate, endingDate) => {
  const result = [];
  const eDate = moment(endingDate).tz('America/New_York');

  daysOfTheWeek.forEach(day => {
    let date = moment(startingDate).tz('America/New_York');

    while (date <= eDate) {
      if (date.day() === day) {
        const isoString = date.toISOString(); // Convert date to ISO string
        if (!result.includes(isoString)) {
          result.push(isoString);
        }
        date = moment(isoString).tz('America/New_York'); // Create a new moment object from the ISO string
        date.add(7 * everyWeek, 'days');
      } else {
        date.add(1, 'day');
      }
    }
  });
  return result;
};

const createRecurringDatesByMonth = (daysOfTheMonth, everyMonth, endingDate, time) => {
  const result = [];
  // const eDate = moment(endingDate).tz('America/New_York');
  const eDate = endingDate;
  const startingDate = dateServices.create_est_with_time(time);

  daysOfTheMonth.forEach(day => {
    let date = moment(startingDate).tz('America/New_York');

    while (date.isSameOrBefore(eDate, 'day')) {
      if (date.date() === day) {
        const isoString = date.toISOString(); // Convert date to ISO string
        result.push(isoString);
        date.add(28 * everyMonth, 'days');
      } else {
        date.add(1, 'day');
      }
    }
  });

  return result;
}

module.exports = {
  createRecurringDatesByWeek: createRecurringDatesByWeek,
  createRecurringDatesByMonth: createRecurringDatesByMonth
}






