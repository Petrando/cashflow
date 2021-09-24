export default function getCurrentMonthName(){
	const today = new Date();
    const currentMonthName = today.toLocaleString('default', { month: 'long' });

    return currentMonthName;
}