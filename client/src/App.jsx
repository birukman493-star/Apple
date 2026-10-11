import React from 'react'
import Navbar from './components/Navbar.jsx'
import Front from './pages/Front.jsx'
import Footer from "./components/Footer";
import Accessories from './pages/Accessories.jsx';
import AirPods from './pages/AirPods.jsx';
import Entertainment from './pages/Entertainment.jsx';
import IPad from './pages/iPad.jsx';
import IPhone from './pages/iPhone.jsx';
import Mac from './pages/Mac.jsx';
import Store from './pages/Store.jsx';
import Support from './pages/Support.jsx';
import TVHome from './pages/TVHome.jsx';
import Vision from './pages/Vision.jsx';
import Watch from './pages/Watch.jsx';
import Search from './pages/Search.jsx'
import Bag from './pages/Bag.jsx'
import { Routes, Route } from 'react-router-dom'
import Four04 from './pages/Four04.jsx';
import SharedLayOut from './pages/sharedLayOut.jsx';
import SignIn from "./pages/Signin";

function App() {

  return (
    <>


      <Routes>
        <Route path='/' element={<SharedLayOut />}>
          <Route path='/' element={<Front />} />
          <Route path='/mac' element={<Mac />} />
          <Route path='/store' element={<Store />} />
          <Route path='/ipad' element={<IPad />} />
          <Route path='/iphone' element={<IPhone />} />
          <Route path='/iphone/:id' element={<IPhone />} />
          <Route path='/watch' element={<Watch />} />
          <Route path='/vision' element={<Vision />} />
          <Route path='/airpods' element={<AirPods />} />
          <Route path='/tv-home' element={<TVHome />} />
          <Route path='/entertainment' element={<Entertainment />} />
          <Route path='/accessories' element={<Accessories />} />
          <Route path='/support' element={<Support />} />
          <Route path="/search" element={<Search />} />
          <Route path="/bag" element={<Bag />}> </Route>
          
         </Route>
          <Route path="/signin" element={<SignIn />} ></Route>
         
       
        <Route path='*' element={<Four04 />} />
      </Routes>


    </>
  )
}

export default App
