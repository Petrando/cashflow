export const getCurrentMonthName = () => {
	const today = new Date();
  const currentMonthName = today.toLocaleString('default', { month: 'long' });

  return currentMonthName;
}

const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

export const getLastDayOfMonth = (monthName) => {	
	const monthIdx = months.indexOf(monthName);	

	const currentYear = new Date().getFullYear();

	const lastDate =  new Date(currentYear, monthIdx + 1, 0).getDate();
	
	return new Date(`${lastDate} ${monthName} ${currentYear} 23:59 UTC`);
}


export const getFirstDayOfMonth = (monthName) => {	
	const monthIdx = months.indexOf(monthName);
	const currentYear = new Date().getFullYear();	
		
	return new Date(`${currentYear}-${monthIdx + 1}-1`);
}

export const createMaxIsoString = (dateString) => {
  const year = dateString.slice(0, dateString.indexOf('-'));
  const monthIdx = dateString.slice(dateString.indexOf('-') + 1, dateString.lastIndexOf('-'));
  const date = dateString.slice(dateString.lastIndexOf('-') + 1);

  const monthName = months[parseInt(monthIdx) - 1];

  return new Date(`${date} ${monthName} ${year} 23:59 UTC`);
}