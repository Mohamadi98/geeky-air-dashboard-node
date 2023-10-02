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

const convert_from_utc_to_est = () => {
    const currentDateTime = new Date();

    const date_UTC = moment.utc(currentDateTime);

    const estDate = moment(date_UTC).tz('America/New_York');

    const formattedEstDate = estDate.format('YYYY-MM-DDTHH:mm:ssZ');

    return formattedEstDate;
}

const convert_from_utc_to_est_with_time = (time) => {
    const currentDateTime = new Date();

    const date_UTC = moment(currentDateTime).tz('UTC');
    const formattedDate = date_UTC.format(`YYYY-MM-DDT${time}:00Z`);

    const estDate = moment(formattedDate).tz('America/New_York');

    const formattedEstDate = estDate.format('YYYY-MM-DDTHH:mm:ssZ');

    return formattedEstDate;
}

const convert_from_utc_to_est_with_time_and_date = (date, time) => {
    const currentDateTime = new Date();

    const date_UTC = moment(currentDateTime).tz('UTC');
    const formattedDate = date_UTC.format(`${date}T${time}:00Z`);

    const estDate = moment(formattedDate).tz('America/New_York');

    const formattedEstDate = estDate.format('YYYY-MM-DDTHH:mm:ssZ');

    return formattedEstDate;
}

const get_time_difference = (timestamp) => {
    const currentDate = new Date();

    const timeDifferenceMilliseconds = currentDate - timestamp;

    const timeDifferenceSeconds = Math.floor(timeDifferenceMilliseconds / 1000);
    const timeDifferenceMinutes = Math.floor(timeDifferenceSeconds / 60);
    const timeDifferenceHours = Math.floor(timeDifferenceMinutes / 60);
    const timeDifferenceDays = Math.floor(timeDifferenceHours / 24);

    if(timeDifferenceSeconds < 60) {
        return `Posted ${timeDifferenceSeconds} ago.`
    }
    if(timeDifferenceMinutes < 60) {
        return `Posted ${timeDifferenceMinutes} ago.`
    }
    if(timeDifferenceHours < 24) {
        return `Posted ${timeDifferenceHours} ago.`
    }
    if(timeDifferenceDays <= 3) {
        return `Posted ${timeDifferenceDays} ago.`
    }
    const date = new Date(timestamp)
    return `${date.getMonth() + 1}-${date.getDate()}-${date.getFullYear()}`
}

const convert_days_arr_to_num_arr = (daysArray) => {
    const numArray = [];
    const map = {
        'su': 0,
        'mo': 1,
        'tu': 2,
        'we': 3,
        'th': 4,
        'fr': 5,
        'sa': 6
    }
    for (const day of daysArray) {
        numArray.push(map[day]);
    }
    return numArray;
}

module.exports = {
    add_to_date: add_to_date,
    get_time_difference: get_time_difference,
    convert_days_arr_to_num_arr: convert_days_arr_to_num_arr,
    convert_from_utc_to_est: convert_from_utc_to_est,
    convert_from_utc_to_est_with_time: convert_from_utc_to_est_with_time,
    convert_from_utc_to_est_with_time_and_date: convert_from_utc_to_est_with_time_and_date
}