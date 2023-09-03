import logo from './logo.svg';
import './App.css';
import {Outlet} from "react-router-dom";

function App() {
  return (
    <div className="App">
        <h1>App</h1>
        <Outlet />
        <p>footer</p>
    </div>
  );
}

export default App;
