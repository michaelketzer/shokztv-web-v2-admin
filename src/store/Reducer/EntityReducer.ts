import difference from 'lodash/difference';
import get from 'lodash/get';
import isPlainObject from 'lodash/isPlainObject';
import mergeWith from 'lodash/mergeWith';

function selectEntities(action: object, name: string): object {
  return get(action, `response.entities.${name}`, null);
}

function mergeCustomizer(fieldsToCopy: Set<string>): Function {
  return (objValue: any, srcValue: any, key?: string) => {
    if (Array.isArray(srcValue) || fieldsToCopy instanceof Set && fieldsToCopy.has(key)) {
      return srcValue;
    }
    return undefined;
  };
}

function mergeEntities(previous: object, incoming: object, fieldsToCopy: Set<string>): object {
  const newState = {...previous};
  for (const [key, value] of Object.entries(incoming)) {
    if (isPlainObject(value)) {
      newState[key] = mergeWith({}, newState[key], value, mergeCustomizer(fieldsToCopy));
    } else {
      newState[key] = value;
    }
  }
  return newState;
}

export function entitiesReducer(reducer: Function, entityName: string): (state: object, action: object, globalState: object) => object {
  return (state = {}, action = {}, globalState = {}) => {
    let newState = state;
    const incommingEntities = selectEntities(action, entityName);

    if (incommingEntities) {
        //@ts-ignore
        newState = mergeEntities(newState, incommingEntities, reducer.fieldsToCopy);
    }

    return reducer(newState, action, globalState);
  };
}

function reduceEntityReducerMap(reducerMap: Map<string, Function>): Function {
  return (state = {}, action = {}) => {
    const newState = {...state};
    let changed = false;
    reducerMap.forEach((reducer, key) => {
      const newEntities = entitiesReducer(reducer, key)(newState[key], action, newState);
      if (newState[key] !== newEntities) {
        newState[key] = newEntities;
        changed = true;
      }
    });
    return changed ? newState : state;
  };
}

export function combineEntitiesReducers(reducers: object): Function[] {
  const reducerMap = new Map(Object.entries(reducers));
  return [
    reduceEntityReducerMap(reducerMap),
    (newReducers) => Object.entries(newReducers).forEach(([k, r]) => reducerMap.set(k, r)),
    (removedReducers) => removedReducers.forEach((k) => reducerMap.delete(k)),
  ];
}

export function clearNullEntities(state: object): object {
  const newState = {...state};
  let changed = false;
  Object.keys(newState).forEach((key) => {
    if (newState[key] === null) {
      changed = true;
      delete newState[key];
    }
  });
  return changed ? newState : state;
}

export function setNotFoundEntitiesToNull(requestedIdsPath: string, resultIdsPath = 'response.result'): Function {
  return setNotFoundEntitiesToNullByFn(
    (action) => difference(get(action, requestedIdsPath), get(action, resultIdsPath)),
  );
}

export function setNotFoundEntitiesToNullByFn(diffFn: Function): Function {
  return (state, action) => {
    const diff = diffFn(action);
    if (diff.length) {
      const newState = {...state};
      diff.forEach((key) => newState[key] = null);
      return newState;
    }
    return state;
  };
}

export function simpleReducer(state = {}): object {
  return state;
}
