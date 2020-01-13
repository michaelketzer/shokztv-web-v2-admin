import isPlainObject from 'is-plain-object';

function applyNextState(previousState: object, nextState: object): object {
  if (isPlainObject(previousState) && isPlainObject(nextState)) {
    return Object.assign(previousState, nextState);
  } else {
    return nextState;
  }
}

function checkHasChanged(previousState: object, nextState: object): boolean {
  if (isPlainObject(previousState) && isPlainObject(nextState)) {
    if (previousState === nextState) {
      return false;
    } else {
      return Object.keys(nextState).some((key) => previousState[key] !== nextState[key]);
    }
  } else {
    return previousState !== nextState;
  }
}

function throwUndefinedStateError(nextStateForKey: object, key: string, action: object): void {
  if (typeof nextStateForKey === 'undefined') {
    //@ts-ignore
    const actionType = action && action.type;
    const actionName = (actionType && `"${actionType.toString()}"`) || 'an action';
    throw new Error((
      `Given action ${actionName}, reducer "${key}" returned undefined. ` +
      `To ignore an action, you must explicitly return the previous state. ` +
      `If you want this reducer to hold no value, you can return null instead of undefined.`
    ));
  }
}

/**
 * Combines multiple reducers. Either
 * @param {Object|Array} reducers
 * @return {function(state: Object, action: Object): Object}
 */
export function combiner(reducers: object | [] | Function): (state: object, action: object) => object {
  if (Array.isArray(reducers)) {
    if (reducers.length === 0) {
      throw new Error('Empty reducers array');
    }
    return (state, action) => {
      let finalNextState = isPlainObject(state) ? Object.assign({}, state) : state;
      let hasChanged = false;
      const getPreviousState = () => typeof state === 'undefined' ? state : finalNextState;
      reducers.forEach((reducer) => {
        const nextState = combiner(reducer)(getPreviousState(), action);
        if (checkHasChanged(finalNextState, nextState)) {
          hasChanged = true;
          finalNextState = applyNextState(finalNextState, nextState);
        }
      });
      return hasChanged ? finalNextState : state;
    };
  } else if (isPlainObject(reducers)) {
    if (Object.keys(reducers).length === 0) {
      throw new Error('Empty reducers object');
    }
    return (state = {}, action) => {
      let hasChanged = false;
      const nextState = {...state};
      //@ts-ignore
      Object.entries(reducers).forEach(([key, reducer]) => {
        const previousStateForKey = state[key];
        const nextStateForKey = combiner(reducer)(previousStateForKey, action);
        throwUndefinedStateError(nextStateForKey, key, action);
        nextState[key] = nextStateForKey;
        hasChanged = hasChanged || nextStateForKey !== previousStateForKey;
      });
      return hasChanged ? nextState : state;
    };
  } else if (typeof reducers === 'function') {
    //@ts-ignore
    return reducers;
  }
  throw new Error('Invalid reducers type');
}
