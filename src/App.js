import "./App.css";
import { useState, useEffect } from "react";
import { NavLink, Route, Routes, useNavigate } from "react-router-dom";
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

import Notification from "./pages/notification";
import Profile from "./pages/profile";

function App() {
  const [userData, setUserData] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoading2, setIsLoading2] = useState(true);

  // pull userData
  useEffect(() => {
    if (currentUser && currentUser.uid) {
      try {
        const docRef = doc(db, "member", currentUser.uid);
        getDoc(docRef).then((docSnap) => {
          if (docSnap.exists()) {
            console.log("Successfully Load userData");
            const data = docSnap.data();
            setUserData({ ...data, id: docSnap.id }); // add id to userData
          } else {
            console.error("No such document!");
            setUserData("Login But no Data");
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
  } else if (userData.suspended === 1) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <h1>บัญชีของคุณถูกระงับโปรดติดต่อ Admin</h1>
      </div>
    );
  } else {
    return (
      <Router>
        <Navbar userData={userData} />
        <Routes>
          <Route path="/" exact element={currentUser ? <Review /> : <Home />} />
          <Route path="/about" exact element={<About />} />
          <Route path="/question" exact element={<Question />} />
          <Route
            path="/question/search/:keyword"
            exact
            element={<Question_Search />}
          />
          <Route
            path="/question/post/:id"
            exact
            element={<Answer userData={userData} />}
          />
          <Route path="/login" exact element={<Login />} />
          <Route path="/signup" exact element={<SignUp />} />
          <Route path="/forgetpassword" exact element={<ForgetPass />} />
          {/* <Route path="/admin/login" exact element={<AdminLogin />} />
            <Route
              path="/admin/forgetpassword"
              exact
              element={<AdminForgetPass />}
            />
            <Route
              path="/admin/forgetpasswordsent"
              exact
              element={<AdminForgetPassSent />}
            /> */}

          <Route
            path="/admin/user"
            exact
            element={<AdminUser userData={userData} />}
          />
          <Route
            path="/admin/post"
            exact
            element={<AdminPost userData={userData} />}
          />

          <Route
            path="/forgetpassword/sent"
            exact
            element={<ForgetPassSent />}
          />
          <Route path="/authenticate" exact element={<Authenticate />} />
          <Route path="/datauser" exact element={<DataUser />} />
          <Route path="/post" exact element={<Post />} />
          <Route
            path="/profile/:id"
            exact
            element={<Profile userData={userData} />}
          />
          <Route
            path="/notification"
            exact
            element={<Notification userData={userData} />}
          />
          <Route path="/review" exact element={<Review />} />
          <Route
            path="/review/post/:id"
            exact
            element={<Review_Answer userData={userData} />}
          />
          <Route
            path="/review/search/:keyword"
            exact
            element={<Review_Search />}
          />
          <Route path="/review/tag/:keyword" exact element={<Review_Tag />} />
        </Routes>
      </Router>
    );
  }
}

export default App;
