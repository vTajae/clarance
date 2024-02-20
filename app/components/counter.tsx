import { useTypedSelector } from "../hooks/user";
import { useDispatch } from "../hooks/user";
import { AppDispatch, RootState } from "../state/store";
import {
  decrement,
  increment,
  // incrementByAmount,
  // incrementAsync,
} from "../state/counter/counterSlice";

const Counter = () => {
  const count = useTypedSelector((state: RootState) => state.counter.value);
  const dispatch = useDispatch();

  const handleIncrement = () => {
    console.log("handleIncrement");
    dispatch(increment());
  };

  const handleDecrement = () => {
    console.log("handleIncrement");

    dispatch(increment());
  };

  return (
    <div>
      <h2>{count}</h2>
      <div>
        <button onClick={handleIncrement}>Increment</button>
        <button onClick={handleDecrement}>Decrement</button>
      </div>
    </div>
  );
};

export default Counter;
