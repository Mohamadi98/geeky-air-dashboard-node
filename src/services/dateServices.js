const { addYears } = require('date-fns')
const moment = require('moment-timezone')

const parseDate = (dateString) => {
    const parts = dateString.split('-');
    const year = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1;
    const day = parseInt(parts[2], 10);

    newDate = new Date(year, month, day);
    newFormattedDate = newDate.toISOString().split('T')[0];
    return newDate.toISOString().split('T')[0];
}

const add_to_date = (value) => {
    const date = new Date();
    const newDate = addYears(date, 1);
    const formattedDate = `${newDate.getFullYear()}-${(newDate.getMonth() + 1).toString().padStart(2, '0')}-${newDate.getDate().toString().padStart(2, '0')}`;
    return parseDate(formattedDate);
}

const create_est_with_date_and_time = (date, time) => {
    const date_EST = moment().tz('America/New_York');
    const formattedDate = date_EST.format(`${date}T${time}:00Z`);
    return formattedDate;
}

const create_est_with_time = (time) => {
    const date_EST = moment().tz('America/New_York');
    const formattedDate = date_EST.format(`YYYY-MM-DDT${time}:ssZ`);
    return formattedDate;
}

const get_time_difference = (timestamp) => {
    const currentDate = moment().tz('UTC');
    const timestampObject = moment(timestamp).tz('UTC');

    const timeDifferenceMilliseconds = currentDate - timestampObject;

    const timeDifferenceSeconds = Math.floor(timeDifferenceMilliseconds / 1000);
    const timeDifferenceMinutes = Math.floor(timeDifferenceSeconds / 60);
    const timeDifferenceHours = Math.floor(timeDifferenceMinutes / 60);
    const timeDifferenceDays = Math.floor(timeDifferenceHours / 24);

    if (timeDifferenceSeconds < 60) {
        return `${timeDifferenceSeconds} seconds ago`
    }
    if (timeDifferenceMinutes < 60) {
        return `${timeDifferenceMinutes} minutes ago.`
    }
    if (timeDifferenceHours < 24) {
        return `${timeDifferenceHours} hours ago.`
    }
    if (timeDifferenceDays <= 3) {
        return `${timeDifferenceDays} days ago.`
    }
    const date = new Date(timestamp)
    return `${date.getMonth() + 1}-${date.getDate()}-${date.getFullYear()}`
}

function isOverAYearFromDate(inputDate) {
    const dateToCheck = moment(inputDate, 'YYYY-MM-DD').tz('America/New_York');

    const currentDate = moment().tz('America/New_York');

    const yearsDiff = dateToCheck.diff(currentDate, 'years');

    if (yearsDiff >= 1) {
        return true;
    }
    else {
        return false;
    }
}

const convert_days_arr_to_num_arr = (daysArray) => {
    const numArray = [];
    const map = {
        'Su': 0,
        'Mo': 1,
        'Tu': 2,
        'We': 3,
        'Th': 4,
        'Fr': 5,
        'Sa': 6
    }
    for (const day of daysArray) {
        numArray.push(map[day]);
    }
    return numArray;
}

const modifyDateFormat = (date) => {
    const newDate = moment(date).tz('America/New_York')
    const year = newDate.year()
    const month = newDate.month()
    const day = newDate.date()
    const hour = newDate.hour()
    const minute = newDate.minute()
    const formattedDate = `${month + 1}-${day}-${year} at ${hour}:${minute}`
    return formattedDate
}

const convertTime = (time) => {
    const hours = parseInt(time.split(":")[0]);
    const minutes = parseInt(time.split(":")[1]);
    const ampm = hours >= 12 ? "PM" : "AM";
    const convertedHours = (hours % 12 || 12).toString().padStart(2, "0");
    const convertedMinutes = minutes.toString().padStart(2, "0");
    return `${convertedHours}:${convertedMinutes} ${ampm}`;
};

const days_until_expiration = (date) => {

  const currentDate = moment().tz('America/New_york');
  date = moment(date).tz('America/New_york');

  const daysDifference = date.diff(currentDate, 'days');

  return daysDifference;
}

module.exports = {
    add_to_date: add_to_date,
    get_time_difference: get_time_difference,
    convert_days_arr_to_num_arr: convert_days_arr_to_num_arr,
    create_est_with_date_and_time: create_est_with_date_and_time,
    create_est_with_time: create_est_with_time,
    isOverAYearFromDate: isOverAYearFromDate,
    modifyDateFormat: modifyDateFormat,
    convertTime: convertTime,
    days_until_expiration: days_until_expiration
}