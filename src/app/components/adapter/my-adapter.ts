import {DateAdapter} from "@angular/material/core";
import {eachDayOfInterval, endOfMonth, format, getDay, startOfMonth, startOfWeek} from "date-fns";

export class MyAdapter extends DateAdapter<Date> {
    override getYear(date: Date): number {
        return date.getFullYear();
    }
    override getMonth(date: Date): number {
        return date.getMonth();
    }
    override getDate(date: Date): number {
        return date.getDate();
    }
    override getDayOfWeek(date: Date): number {
        return getDay(date);
    }
    override getMonthNames(style: "long" | "short" | "narrow"): string[] {
        return ['Januari', 'Fevruari', 'Mart', 'April', 'Maj', 'Juni', 'Juli', 'Avgust', 'Septemvri', 'Oktomvri', 'Noemvri', 'Dekemvri'];
    }
    override getDateNames(): string[] {
      let dateNames: string[] = [];
      const dateFormat = 'd'; // 'd' for day of the month, change format for other needs

      // Example: Generate names for the current month. Adjust for your specific needs.
      const start = startOfMonth(new Date());
      const end = endOfMonth(new Date());

      eachDayOfInterval({ start, end }).forEach(day => {
        dateNames.push(format(day, dateFormat, { locale: this.locale }));
      });

      return dateNames;
    }
    override getDayOfWeekNames(style: "long" | "short" | "narrow"): string[] {
        return ['Pon', 'Vto', 'Sre', 'Che', 'Pet', 'Sab', 'Ned'];
    }
    override getYearName(date: Date): string {
        return 'OVAA GODINA';
    }
    override getFirstDayOfWeek(): number {
        return startOfWeek(new Date(), {weekStartsOn: 1}).getDay();
    }
    override getNumDaysInMonth(date: Date): number {
        throw new Error("Method not implemented.");
    }
    override clone(date: Date): Date {
        throw new Error("Method not implemented.");
    }
    override createDate(year: number, month: number, date: number): Date {
        throw new Error("Method not implemented.");
    }
    override today(): Date {
        throw new Error("Method not implemented.");
    }
    override parse(value: any, parseFormat: any): Date | null {
        throw new Error("Method not implemented.");
    }
    override format(date: Date, displayFormat: any): string {
        throw new Error("Method not implemented.");
    }
    override addCalendarYears(date: Date, years: number): Date {
        throw new Error("Method not implemented.");
    }
    override addCalendarMonths(date: Date, months: number): Date {
        throw new Error("Method not implemented.");
    }
    override addCalendarDays(date: Date, days: number): Date {
        throw new Error("Method not implemented.");
    }
    override toIso8601(date: Date): string {
        throw new Error("Method not implemented.");
    }
    override isDateInstance(obj: any): boolean {
        throw new Error("Method not implemented.");
    }
    override isValid(date: Date): boolean {
        throw new Error("Method not implemented.");
    }
    override invalid(): Date {
        throw new Error("Method not implemented.");
    }

}
