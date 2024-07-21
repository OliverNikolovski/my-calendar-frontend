import {CalendarEventInstancesContainer} from "../interfaces/calendar-event-instances-container";
import {patchState, signalStore, withComputed, withMethods, withState} from "@ngrx/signals";
import {CalendarEventInstanceInfo} from "../interfaces/calendar-event-instance-info";
import {format} from "date-fns";
import {inject, runInInjectionContext} from "@angular/core";

type CalendarState = {
  calendarEventInstancesContainer: CalendarEventInstancesContainer | null;
}

const initialState: CalendarState = {
  calendarEventInstancesContainer: null
}

export const CalendarStore = signalStore(
  { providedIn: 'root' },

  withState(initialState),

  withMethods((store) => ({
    updateEventInstances(newContainer: CalendarEventInstancesContainer): void {
      patchState(store, (state) => {
        const container = state.calendarEventInstancesContainer;
        if (!container) {
          console.log('newContainer', newContainer)
          return {
            calendarEventInstancesContainer: {...newContainer}
          }
        }
        const oldKeys = Object.keys(container);
        const newKeys = Object.keys(newContainer);
        const intersection = oldKeys.filter(key => newKeys.includes(key));
        const difference = newKeys.filter(key => !oldKeys.includes(key));
        intersection.forEach(key => container[key] = [...container[key], ...newContainer[key]]);
        difference.forEach(key => container[key] = newContainer[key]);
        console.log('container', container);
        return {
          calendarEventInstancesContainer: {...container}
        };
      });
    },
    getCalendarEventInstances(date: Date, container: CalendarEventInstancesContainer | null): CalendarEventInstanceInfo[] {
      //console.log('container', container)
      if (!container) {
        return [];
      }
      const dayStr = format(date, 'yyyy-MM-dd');
      return container[dayStr];
    }
  }))
);
