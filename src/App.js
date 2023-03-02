import "./App.css";
import { NavLink, Route, Routes } from "react-router-dom";
import Navbar from "./components/navbar";
import { BrowserRouter as Router } from "react-router-dom";
import Home from "./pages/home";
import About from "./pages/about";
import Question from "./pages/question";
import Login from "./pages/registration/login";
import SignUp from "./pages/registration/signup";
import Authenticate from "./pages/registration/authenticate";
import DataUser from "./pages/registration/datauser";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" exact element={<Home />}></Route>
        <Route path="/about" exact element={<About />}></Route>
        <Route path="/question" exact element={<Question />}></Route>
        <Route path="/login" exact element={<Login />}></Route>
        <Route path="/signup" exact element={<SignUp />}></Route>
        <Route path="/authenticate" exact element={<Authenticate />}></Route>
        <Route path="/datauser" exact element={<DataUser />}></Route>
      </Routes>
    </Router>
  );
}

export default App;
