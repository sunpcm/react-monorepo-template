import React, { useState } from "react";
import { Button } from "@niu/ui-lib";

const App = () => {
  const [count, setCount] = useState(0);

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold text-brand-600 mb-8">
          Hello Webpack
        </h1>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <p className="text-lg mb-4">
            Count: <span className="font-bold text-brand-500">{count}</span>
          </p>
          <div className="flex gap-4">
            <button
              onClick={() => setCount((c) => c + 1)}
              className="btn-primary"
            >
              Increment
            </button>
            <Button onClick={() => setCount(0)}>Reset</Button>
          </div>
        </div>

        <div className="prose prose-brand">
          <h2>Tailwind Classes Working!</h2>
          <ul>
            <li>Custom brand colors</li>
            <li>Responsive utilities</li>
            <li>Custom components</li>
          </ul>
        </div>
      </div>
      <div className="bg-brand-500 p-18">测试共享主题</div>
    </div>
  );
};

export default App;
