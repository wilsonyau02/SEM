//Get the current date time in format: yyyy-mm-dd hh:mm:ss
export function getCurrentDateTime() {
    const currentDate = new Date();

    const options = {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
    };

    const dateTime = currentDate.toLocaleString('en-US', options);

    return dateTime;
}

export function getDateTime(inputDate) {
    // Parse the input date string
    const date = new Date(inputDate);
  
    // Extract date components
    const day = date.getDate();
    const month = date.getMonth() + 1; // Month is 0-indexed, so we add 1
    const year = date.getFullYear() % 100; // Get last two digits of the year
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();
  
    // Pad single-digit values with leading zeros
    const formattedDay = day.toString().padStart(2, '0');
    const formattedMonth = month.toString().padStart(2, '0');
    const formattedYear = year.toString().padStart(2, '0');
    const formattedHours = hours.toString().padStart(2, '0');
    const formattedMinutes = minutes.toString().padStart(2, '0');
    const formattedSeconds = seconds.toString().padStart(2, '0');
  
    // Create the formatted date string
    const formattedDate = `${formattedDay}/${formattedMonth}/${formattedYear} ${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
  
    return formattedDate;
  }