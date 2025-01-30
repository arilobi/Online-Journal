import './App.css'
import {BrowserRouter, Routes, Route} from "react-router-dom"
import Layout from "./components/Layout"
import Home from "./pages/Home"
import Login from "./pages/Login"
import Register from "./pages/Register"
import Profile from "./pages/Profile"
import NoPage from "./pages/NoPage"
import Settings from "./pages/Settings"
import About from "./pages/About"
import { EntryProvider } from './context/EntryContext'
import { UserProvider } from './context/UserContext'
import AddEntry from "./pages/AddEntry";
import SingleEntry from "./pages/SingleEntry"

function App() {
 
  return (
    <BrowserRouter>
      <UserProvider>
        <EntryProvider>
          <Routes>
            <Route path = "/" element={<Layout />} >
                
                <Route index element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/about" element={<About />} />
                <Route path="/addentry" element={<AddEntry />} />   
                <Route path="/entry/:id" element={<SingleEntry />} />   
                <Route path="/profile" element={<Profile />} />
                <Route path="*" element={<NoPage />} />
            </Route>
          </Routes>
        </EntryProvider>
      </UserProvider>
    </BrowserRouter>
  )
}

export default App
