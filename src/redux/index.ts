export type Reducer = <S, A>(currentState: S, action: A) => S;
export type SubscribeFn = <T>() => T;

function createStore(reducer: Reducer) {
  let currentState = reducer(undefined, {});
  let subscribers: Array<SubscribeFn> = [];

  function dispatch<A>(action: A) {
    currentState = reducer(currentState, action);

    subscribers.forEach((s) => s());
  }

  function getState() {
    return currentState;
  }

  function subscribe(newSubscriber: SubscribeFn) {
    subscribers.push(newSubscriber);

    function unsubscribe() {
      subscribers = subscribers.filter((s) => s !== newSubscriber);
    }
    return unsubscribe;
  }

  return {
    dispatch,
    getState,
    subscribe,
  };
}

export default { createStore };
