import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import LoginForm from "./Pages/LoginForm/LoginForm";
import Dashboard from "./Pages/Home/Dashboard";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" exact element={<LoginForm />} />
        <Route path="/signup" exact element={<LoginForm />} />
        <Route path="/dashboard" exact element={<Dashboard />} />
        <Route path="*" exact element={<LoginForm />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
