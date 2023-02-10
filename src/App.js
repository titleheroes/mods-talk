
import './App.css';
// import { NavLink, Route, Routes } from 'react-router-dom';
// import Navbar from './components/navbar';
// import { BrowserRouter as Router} from 'react-router-dom';
// import Home from './pages/home';
// import About from './pages/about';
// import Question from './pages/question';
import Login from './pages/login';

function App() {
  return (
    <Login/>
    // <Router>
    //   <Navbar />
    //   <Routes>
    //     <Route path="/" exact element={<Home/>}> </Route>
    //     <Route path="/about" exact element={<About/>}> </Route>
    //     <Route path="/question" exact element={<Question/>}> </Route>
    //   </Routes>
    // </Router>
  );
}

export default App;
