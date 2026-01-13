import React, { useState } from "react";
import { Button } from "@niu/ui-lib"; // 直接引入！

const App = () => {
  console.log("API Address:", import.meta.env.VITE_API_URL);

  const [count, setCount] = useState(0);
  return (
    <div className="container">
      <h1>Hello Vite!</h1>
      <p>Count: {count}</p>
      <button onClick={() => setCount((c) => c + 1)}>Add</button>
      <Button>Click Me</Button>
    </div>
  );
};

export default App;
