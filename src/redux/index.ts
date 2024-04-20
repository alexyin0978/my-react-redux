export type Reducer = <S, A>(currentState: S, action: A) => S;
export type Dispatch = <A>(action: A) => void;
export type GetState = <S>() => S;
export type SubscribeFn = () => void;
export type Store = {
  dispatch: Dispatch;
  getState: GetState;
  subscribe: (newSubscriber: SubscribeFn) => () => void;
};

export function createStore(reducer: Reducer): Store {
  let currentState = reducer(undefined, {});
  let subscribers: Array<SubscribeFn> = [];

  function dispatch<A>(action: A) {
    currentState = reducer(currentState, action);

    subscribers.forEach((s) => s());
  }

  function getState<S>() {
    return currentState as S;
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
