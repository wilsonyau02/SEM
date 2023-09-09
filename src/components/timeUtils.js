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