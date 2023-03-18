import "./App.css";
import { NavLink, Route, Routes } from "react-router-dom";
import Navbar from "./components/navbar";
import { BrowserRouter as Router } from "react-router-dom";
import Home from "./pages/home";
import About from "./pages/about";
import Question from "./pages/question";
import Answer from './pages/Answer/answer';
import AdminUser from './pages/admin/adminUser';
import AdminPost from './pages/admin/adminPost';

import Login from "./pages/registration/login";
import SignUp from "./pages/registration/signup";
import ForgetPass from "./pages/registration/forgetPass";
import ForgetPassSent from "./pages/registration/forgetPassSent";
import Authenticate from "./pages/registration/authenticate";
import DataUser from "./pages/registration/datauser";

import Review from "./pages/review/review copy";
import Post from "./pages/review/post";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" exact element={<Home />}></Route>
        <Route path="/about" exact element={<About />}></Route>
        <Route path="/question" exact element={<Question/>}> </Route>
        <Route path="/Answer" exact element={<Answer/>}> </Route>
        <Route path="/login" exact element={<Login />}></Route>
        <Route path="/signup" exact element={<SignUp />}></Route>
        <Route path="/forgetpassword" exact element={<ForgetPass />}></Route>
        <Route path="/admin" >
          <Route path="/admin/user" exact element={<AdminUser/>}></Route>
          <Route path="/admin/post" exact element={<AdminPost/>}></Route>
        </Route>
        <Route
          path="/forgetpassword/sent"
          exact
          element={<ForgetPassSent />}
        ></Route>
        <Route path="/authenticate" exact element={<Authenticate />}></Route>
        <Route path="/datauser" exact element={<DataUser />}></Route>
        <Route path="/review" exact element={<Review />}></Route>
        <Route path="/post" exact element={<Post />}></Route>
      </Routes>
    </Router>
  );
}

export default App;
