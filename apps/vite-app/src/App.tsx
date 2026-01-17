import React, { useState } from "react";
import { Button } from "@biu/ui-lib";

const App = () => {
  console.log("API Address:", import.meta.env.VITE_API_URL);

  const [count, setCount] = useState(0);

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-12">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-brand-600 mb-8 text-4xl font-bold">Hello Vite + Tailwind!</h1>

        <div className="card mb-6">
          <p className="mb-4 text-lg">
            Count: <span className="text-brand-500 font-bold">{count}</span>
          </p>
          <div className="flex gap-4">
            <button onClick={() => setCount((c) => c + 1)} className="btn-primary">
              Increment
            </button>
            <Button onClick={() => setCount(0)}>Reset</Button>
          </div>
        </div>

        <div className="prose prose-brand max-w-none">
          <h2>Tailwind Classes Working!</h2>
          <ul>
            <li>Custom brand colors from shared config</li>
            <li>Responsive utilities</li>
            <li>Custom component classes</li>
            <li>Same config as Webpack app</li>
          </ul>
        </div>
      </div>
      <div className="bg-brand-500 p-18">测试共享主题</div>
    </div>
  );
};

export default App;
