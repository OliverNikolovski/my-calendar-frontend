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
