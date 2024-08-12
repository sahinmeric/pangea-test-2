/**
 * Formats a date string into MM/DD/YY format.
 * @param dateString - The date string to format.
 * @returns The formatted date string.
 */
export function formatIdealDueDate(dateString: string): string {
  const date = new Date(dateString);
  if (isNaN(date.getTime())) {
    return "Invalid Date";
  } else {
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    const year = date.getFullYear().toString().substr(-2);
    return `${month}/${day}/${year}`;
  }
}

/**
 * Formats a Date object into YYYY-MM-DD format.
 * @param dateTime - The Date object to format.
 * @returns The formatted date string.
 */
export function formatDateToYYYYMMDD(dateTime: Date): string {
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  };
  const formattedDate = new Intl.DateTimeFormat("en-CA", options).format(
    dateTime
  );
  return formattedDate.replace(/\//g, "-");
}
