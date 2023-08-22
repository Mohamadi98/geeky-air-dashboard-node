
const transformArray = (inputArray, id) => {
    const daysOfWeek = ['MON', 'TUE', 'WED', 'THR', 'FRI', 'SAT', 'SUN'];
    const dataArray = [];
  
    for (const item of inputArray) {
      const dayName = Object.keys(item)[0];
      const dayData = item[dayName];
      
      if (daysOfWeek.includes(dayName)) {
        dataArray.push({
          business_id: id,
          day: dayName,
          start_time: dayData.start || '',
          end_time: dayData.end || '',
          open: dayData.open || false,
          open_24h: dayData.open_24h || false,
        });
      }
    }
  
    return dataArray;
  }

  module.exports = transformArray;