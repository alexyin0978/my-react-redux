import {
  createContext,
  FC,
  ReactNode,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { Store, SubscribeFn } from "../redux";

type ContextType = {
  store: Store;
};
type ProviderProps = {
  store: Store;
  children: ReactNode;
};
type Selector<State, SelectedState> = (state: State) => SelectedState;
type EqualityFn<SelectedState> = (
  currentState: SelectedState,
  newState: SelectedState
) => boolean;

const defaultEqualityFn = <T,>(a: T, b: T) => a === b;

const Context = createContext<ContextType | null>(null);

const useReducerContext = () => {
  const contextValue = useContext(Context);

  if (!contextValue) {
    throw new Error(
      "could not find react-redux context value; please ensure the component is wrapped in a <Provider>"
    );
  }

  return contextValue;
};

const Provider: FC<ProviderProps> = ({ store, children }) => {
  return <Context.Provider value={{ store }}>{children}</Context.Provider>;
};

const useDispatch = () => {
  const { store } = useReducerContext();
  return store.dispatch;
};

const useSelector = <State, SelectedState>(
  selector: Selector<State, SelectedState>,
  equalityFn: EqualityFn<SelectedState> = defaultEqualityFn
) => {
  const { store } = useReducerContext();

  const [, forceRender] = useState(0);

  const selectedState = selector(store.getState());
  const lastSelectedState = useRef<SelectedState>(selectedState);

  const checkForceUpdate: SubscribeFn = () => {
    if (equalityFn(selectedState, lastSelectedState.current)) {
      return;
    }

    lastSelectedState.current = selectedState;
    forceRender((s) => s + 1);
  };

  useEffect(() => {
    const unsubscribe = store.subscribe(checkForceUpdate);

    return unsubscribe;
  }, []);

  return selectedState;
};

export default {
  Provider,
  useDispatch,
  useSelector,
};
