import {addMinutes, differenceInMinutes, format, parse} from "date-fns";

export function calculateDurationInMinutes(startTime: string, endTime: string): number {
  const format = 'h:mm a';
  const referenceDate = new Date(); // Reference date to provide a base date for parsing times

  const startDate = parse(startTime, format, referenceDate);
  const endDate = parse(endTime, format, referenceDate);

  return differenceInMinutes(endDate, startDate);
}

export function calculateNewTime(timeStr: string, durationInMinutes: number): string {
  const formatString = 'h:mm a';
  const referenceDate = new Date(); // Reference date to provide a base date for parsing times

  // Parse the input time string into a Date object
  const startTime = parse(timeStr, formatString, referenceDate);

  // Add the duration in minutes to the start time
  const newTime = addMinutes(startTime, durationInMinutes);

  // Format the new time back to the desired string format
  return format(newTime, formatString);
}

export function getHoursAndMinutesFromDateString(dateStr: string): { hours: number, minutes: number, period: 'am' | 'pm' } {
  const [hours, minutes] = dateStr.split('T')[1].split(':', 2).map(Number);
  const transformedHours = hours === 0 || hours === 12 ? 12 : hours % 12;
  const period = hours < 12 ? 'am' : 'pm';
  return {
    hours: transformedHours,
    minutes,
    period
  }
}
