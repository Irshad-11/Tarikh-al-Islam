import { useEffect, useState } from "react";

function App() {
  const [message, setMessage] = useState("Loading...");

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/health/")
      .then(res => res.json())
      .then(data => setMessage(data.message))
      .catch(err => setMessage("Backend connection failed"));
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white text-2xl">
      {message}
    </div>
  );
}

export default App;
