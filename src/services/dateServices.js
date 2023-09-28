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

const convert_date_timezone = (date) => {
    const targetTimezone = 'Africa/Cairo';
    const formattedDatetime = moment(tempDate).tz(targetTimezone).format('YYYY-MM-DD HH:mm:ss');
    return formattedDatetime;
}

const convert_from_est_to_utc = (date, time) => {
    const concatDateTime = `${date} ${time}`
    
    const date_EST = moment(concatDateTime).tz('America/New_York');
    const formattedDate = date_EST.format(`YYYY-MM-DDT${time}Z`);

    const utcDate = moment(formattedDate).tz('UTC');

    console.log('we are in date services function');
    console.log(utcDate);
    return utcDate;
}

module.exports = {
    add_to_date: add_to_date,
    convert_date_timezone: convert_date_timezone,
    convert_from_est_to_utc: convert_from_est_to_utc
}