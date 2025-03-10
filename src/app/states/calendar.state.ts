import {CalendarEventInstancesContainer} from "../interfaces/calendar-event-instances-container";
import {patchState, signalStore, withMethods, withState} from "@ngrx/signals";
import {CalendarEventInstanceInfo} from "../interfaces/calendar-event-instance-info";
import {format} from "date-fns";

type CalendarState = {
  calendarEventInstancesContainer: CalendarEventInstancesContainer | null;
}

const initialState: CalendarState = {
  calendarEventInstancesContainer: null
}

export const CalendarStore = signalStore(
  {providedIn: 'root'},

  withState(initialState),

  withMethods((store) => ({
    initEventContainer(container: CalendarEventInstancesContainer) {
      patchState(store, () => ({
        calendarEventInstancesContainer: {...container}
      }));
    },
    mergeCurrentContainerWith(newContainer: CalendarEventInstancesContainer): void {
      patchState(store, (state) => {
        if (!state.calendarEventInstancesContainer) {
          return {
            calendarEventInstancesContainer: {...newContainer}
          }
        }
        const container = { ...state.calendarEventInstancesContainer };
        const oldKeys = Object.keys(container);
        const newKeys = Object.keys(newContainer);
        const intersection = oldKeys.filter(key => newKeys.includes(key));
        const difference = newKeys.filter(key => !oldKeys.includes(key));
        intersection.forEach(key => container[key] = [...container[key], ...newContainer[key]]); // tuka frla error
        difference.forEach(key => container[key] = newContainer[key]);
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
    updateContainer(sequenceId: string, other: CalendarEventInstancesContainer) {
      const container = store.calendarEventInstancesContainer();
      if (!container) {
        return;
      }
      const keys = Object.keys(container);
      // first delete the old events from the modified sequence from the container
      const newContainer = keys.reduce((acc, key) => ({
        ...acc,
        [key]: container[key].filter(instance => instance.event.sequenceId !== sequenceId)
      }), {} as CalendarEventInstancesContainer);
      const otherKeys = Object.keys(other);
      // add the new updated events into the container
      otherKeys.forEach(key => {
        newContainer[key] ? newContainer[key] = [...newContainer[key], ...other[key]] :
          newContainer[key] = [...other[key]];
      });
      patchState(store, () => ({
        calendarEventInstancesContainer: {...newContainer}
      }));
    },
    updateSequenceVisibility(sequenceId: string, isPublic: boolean) {
      const container = store.calendarEventInstancesContainer();
      if (!container) {
        return;
      }
      const keys = Object.keys(container);
      const newContainer = {} as CalendarEventInstancesContainer;
      keys.forEach(date => {
        const instances = container[date];
        const transformedInstances = instances.map(instance => {
          if (instance.event.sequenceId === sequenceId) {
            return {
              ...instance,
              event: {
                ...instance.event,
                isPublic
              }
            };
          } else {
            return instance;
          }
        });
        newContainer[date] = transformedInstances;
      });
      patchState(store, () => ({
        calendarEventInstancesContainer: {...newContainer}
      }));
    },
    updateCalendarVisibility(isPublic: boolean) {
      const container = store.calendarEventInstancesContainer();
      if (!container) {
        return;
      }
      const keys = Object.keys(container);
      const newContainer = {} as CalendarEventInstancesContainer;
      keys.forEach(date => {
        const instances = container[date];
        const transformedInstances = instances.map(instance => {
          return {
            ...instance,
            event: {
              ...instance.event,
              isPublic
            }
          };
        });
        newContainer[date] = transformedInstances;
      });
      patchState(store, () => ({
        calendarEventInstancesContainer: {...newContainer}
      }));
    }
  }))
);
