import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import { Reducer, SubscribeFn, createStore } from "./redux";

const initCount = 0;
const countReducer = (currentState: number, action: { type: string }) => {
  switch (action.type) {
    case "increment": {
      return 1 + currentState;
    }
    case "decrement": {
      return currentState - 1;
    }
    default: {
      return initCount;
    }
  }
};

const { dispatch, getState, subscribe } = createStore(countReducer as Reducer);

function App() {
  const [count, setCount] = useState(0);
  dispatch({ type: "increment" });
  dispatch({ type: "increment" });
  dispatch({ type: "increment" });
  dispatch({ type: "decrement" });

  const subscriber = () => {
    console.log(getState());
  };
  subscribe(subscriber as SubscribeFn);

  return (
    <>
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  );
}

export default App;
