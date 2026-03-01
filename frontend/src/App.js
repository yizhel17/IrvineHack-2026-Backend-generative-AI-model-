import { BrowserRouter, Routes, Route} from "react-router";
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import LoadingPage from './pages/Loading';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage/>} />
        <Route path="/loading" element={<LoadingPage/>} />
        <Route path="/dashboard" element={<Dashboard/>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
