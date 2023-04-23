import "./App.css";
import { useState, useEffect } from "react";
import { NavLink, Route, Routes } from "react-router-dom";
import Navbar from "./components/navbar/";
import { BrowserRouter as Router } from "react-router-dom";
import Home from "./pages/home";
import About from "./pages/about";

import AdminLogin from "./pages/admin/login";
import AdminUser from "./pages/admin/adminUser";
import AdminPost from "./pages/admin/adminPost";
import AdminForgetPass from "./pages/admin/adminforgetPass";
import AdminForgetPassSent from "./pages/admin/adminforgetPassSent";

import Login from "./pages/registration/login";
import SignUp from "./pages/registration/signup";
import ForgetPass from "./pages/registration/forgetPass";
import ForgetPassSent from "./pages/registration/forgetPassSent";
import Authenticate from "./pages/registration/authenticate";
import DataUser from "./pages/registration/datauser";

import Review from "./pages/review/review";
import Post from "./pages/review/post";
import Review_Answer from "./pages/review/review_answer";
import Review_Search from "./pages/review/review_search";
import Review_Tag from "./pages/review/review_tag";

import Question from "./pages/Question/question";
import Question_Search from "./pages/Question/question_search";
import Answer from "./pages/Question/answer";

import { auth, db } from "./config";
import { doc, getDoc } from "firebase/firestore";

function App() {
  const [userData, setUserData] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // pull userData
  useEffect(() => {
    if (currentUser && currentUser.uid) {
      try {
        const docRef = doc(db, "member", currentUser.uid);
        getDoc(docRef).then((docSnap) => {
          if (docSnap.exists()) {
            console.log("Successfully Load userData");
            const data = docSnap.data();
            setUserData(data);
          } else {
            console.error("No such document!");
          }
        });
      } catch (error) {
        console.error("Error fetching document: ", error);
      }
    }
  }, [currentUser]);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setCurrentUser(user);
      setIsLoading(false);
    });

    return unsubscribe;
  }, []);

  if (isLoading) {
    return <div></div>;
  }

  return (
    <Router>
      <Navbar userData={userData} />
      <Routes>
        <Route path="/" exact element={<Home />}></Route>
        <Route path="/about" exact element={<About />}></Route>
        <Route path="/question" exact element={<Question />}></Route>
        <Route
          path="/question/search/:keyword"
          exact
          element={<Question_Search />}
        ></Route>
        <Route
          path="/question/post/:id"
          exact
          element={<Answer userData={userData} />}
        ></Route>
        <Route path="/login" exact element={<Login />}></Route>
        <Route path="/signup" exact element={<SignUp />}></Route>
        <Route path="/forgetpassword" exact element={<ForgetPass />}></Route>
        <Route path="/admin">
          <Route path="/admin/login" exact element={<AdminLogin />}></Route>
          <Route
            path="/admin/forgetpassword"
            exact
            element={<AdminForgetPass />}
          ></Route>
          <Route
            path="/admin/forgetpasswordsent"
            exact
            element={<AdminForgetPassSent />}
          ></Route>

          <Route path="/admin/user" exact element={<AdminUser />}></Route>
          <Route path="/admin/post" exact element={<AdminPost />}></Route>
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
        <Route
          path="/review/post/:id"
          exact
          element={<Review_Answer userData={userData} />}
        ></Route>
        <Route
          path="/review/search/:keyword"
          exact
          element={<Review_Search />}
        ></Route>
        <Route
          path="/review/tag/:keyword"
          exact
          element={<Review_Tag />}
        ></Route>
      </Routes>
    </Router>
  );
}

export default App;
