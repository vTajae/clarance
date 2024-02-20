import React, { useReducer, createContext, useContext } from "react";

// Define the action and state types for the reducer
type ActionType = { type: 'add' | 'subtract' };
type StateType = number;

// Reducer function to handle counter state changes
const reducer = (state: StateType, action: ActionType): StateType => {
  switch (action.type) {
    case "add":
      return state + 1;
    case "subtract":
      return state - 1;
    default:
      return state;
  }
};

// Define the context type
interface CounterContextType {
  counter: StateType;
  dispatch: React.Dispatch<ActionType>;
}

// Create a context for the counter with a default value
const CounterContext = createContext<CounterContextType | undefined>(undefined);

const CounterContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [counter, dispatch] = useReducer(reducer, 0);

  return (
    <CounterContext.Provider value={{ counter, dispatch }}>
      {children}
    </CounterContext.Provider>
  );
};

// Component for adding to the counter
const AddOneButton: React.FC = () => {
  const context = useContext(CounterContext);
  if (!context) throw new Error("CounterContext not found");
  const { dispatch } = context;

  return (
    <button onClick={() => dispatch({ type: "add" })}>
      Add One
    </button>
  );
};

// Component for subtracting from the counter
const SubtractOneButton: React.FC = () => {
  const context = useContext(CounterContext);
  if (!context) throw new Error("CounterContext not found");
  const { dispatch } = context;

  return (
    <button onClick={() => dispatch({ type: "subtract" })}>
      Subtract One
    </button>
  );
};

// Component to display the current counter
const Counter: React.FC = () => {
  const context = useContext(CounterContext);
  if (!context) throw new Error("CounterContext not found");
  const { counter } = context;

  return <div>Counter: {counter}</div>;
};

// Main container component
const Container: React.FC = () => (
  <div>
    <AddOneButton />
    <SubtractOneButton />
    <Counter />
  </div>
);

// Application component that sets up the context
const CounterUseStatePage: React.FC = () => {
  return (
    <CounterContextProvider>
      <Container />
    </CounterContextProvider>
  );
};

export default CounterUseStatePage;
