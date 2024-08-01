import {CalendarEventInstancesContainer} from "../interfaces/calendar-event-instances-container";
import {patchState, signalStore, withComputed, withMethods, withState} from "@ngrx/signals";
import {CalendarEventInstanceInfo} from "../interfaces/calendar-event-instance-info";
import {format, set} from "date-fns";

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
    initEventInstances(newContainer: CalendarEventInstancesContainer): void {
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
      if (!container) {
        return [];
      }
      const dayStr = format(date, 'yyyy-MM-dd');
      return container[dayStr];
    },
    removeSingleInstance(date: Date, eventId: number) {
      const container = store.calendarEventInstancesContainer();
      if (!container) {
        return;
      }
      const day = format(date, 'yyyy-MM-dd');
      const instances = container[day];
      const newContainer = { ...container, [day]: instances.filter(i => i.eventId !== eventId) };
      patchState(store, (state) => ({
        calendarEventInstancesContainer: { ...newContainer }
      }));
    },
    removeThisAndAllFollowingInstances(fromDate: Date, sequenceId: string) {
      const container = store.calendarEventInstancesContainer();
      if (!container) {
        return;
      }
      const fromDateAtStartOfDay = set(fromDate, {
        hours: 0,
        minutes: 0,
        seconds: 0,
        milliseconds: 0
      });
      const newContainer = { ...container };
      const keys = Object.keys(container);
      for (let key of keys) {
        const date = new Date(key);
        if (date < fromDateAtStartOfDay) {
          continue;
        }
        const instancesInDay = container[key];
        const instanceInDayExceptForSequence =
          instancesInDay.filter(instance => instance.event.sequenceId !== sequenceId)
        newContainer[key] = instanceInDayExceptForSequence;
      }
      patchState(store, (state) => ({
        calendarEventInstancesContainer: { ...newContainer }
      }));
    },
    removeAllEventsInSequence(sequenceId: string) {
      const container = store.calendarEventInstancesContainer();
      if (!container) {
        return;
      }
      const newContainer = { ...container };
      const keys = Object.keys(container);
      for (let key of keys) {
        const instances = container[key];
        const instancesExceptForSequence =
          instances.filter(instance => instance.event.sequenceId !== sequenceId)
        newContainer[key] = instancesExceptForSequence;
      }
      patchState(store, (state) => ({
        calendarEventInstancesContainer: { ...newContainer }
      }));
    },
    updateContainer(updatedEventContainer: CalendarEventInstancesContainer) {
      const container = store.calendarEventInstancesContainer();
      if (!container) {
        return;
      }
      const updatedEventContainerKeys = Object.keys(updatedEventContainer);
      if (!updatedEventContainerKeys.length) {
        return;
      }
      const updatedEventSequenceId = updatedEventContainer[updatedEventContainerKeys[0]][0].event.sequenceId;
      const oldContainerKeys = Object.keys(container);
      const newContainer: CalendarEventInstancesContainer = {};
      oldContainerKeys.forEach(key => {
        const updatedEventInstanceForDay = updatedEventContainer[key][0];
        if (updatedEventInstanceForDay) {
          const instances = container[key].map(instance => {
            if (instance.event.sequenceId === updatedEventSequenceId) {
              return updatedEventInstanceForDay;
            } else {
              return instance;
            }
          });
          newContainer[key] = instances;
        } else {
          newContainer[key] = { ...container[key] }
        }
      });
      patchState(store, (state) => ({
        calendarEventInstancesContainer: { ...newContainer }
      }));
    }
  }))
);
