import React from 'react'
import Navbar from './components/Navbar.jsx'
import Front from './pages/Front.jsx'
// HomeNew page removed
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
import Checkout from './pages/Checkout.jsx'
import OrderConfirmation from './pages/OrderConfirmation.jsx'
import { CartProvider } from './context/CartContext.jsx'
import { Routes, Route } from 'react-router-dom'
import Four04 from './pages/Four04.jsx';
import SharedLayOut from './pages/sharedLayOut.jsx';
import SignIn from "./pages/Signin";
import Signup from "./pages/Signup.jsx"
import UserDashboard from './pages/userDashboard'
import AdminDashboard from './admin/AdminDashboard.jsx';



function App() {

  return (
    <CartProvider>
      <Routes>
        <Route path='/' element={<SharedLayOut />}>
          <Route path='/' element={<Front />} />

          <Route path='/mac' element={<Mac />} />
          <Route path='/store' element={<Store />} />

          <Route path='/ipad' element={<IPad />} />
          <Route path='/iphone' element={<IPhone />} />
          <Route path='/iphone/:id' element={<IPhone />} />
          <Route path='/watch' element={<Watch />} />
          <Route path='/watch/:id' element={<Watch />} />
          <Route path='/vision' element={<Vision />} />
          <Route path='/airpods' element={<AirPods />} />
          <Route path='/tv-home' element={<TVHome />} />
          <Route path='/entertainment' element={<Entertainment />} />
          <Route path='/accessories' element={<Accessories />} />
          <Route path='/support' element={<Support />} />
          <Route path="/search" element={<Search />} />
          <Route path="/bag" element={<Bag />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/order-confirmation/:orderNumber" element={<OrderConfirmation />} />
          <Route path="/orders" element={<UserDashboard />} />
          <Route path="/account" element={<UserDashboard />} />
          <Route path="/account/*" element={<UserDashboard />} />
          <Route path="/userdashboard" element={<UserDashboard />} />
          <Route path="/userdashboard/*" element={<UserDashboard />} />
          <Route path="/saves" element={<Bag />} />
          <Route path="/your-saves" element={<Bag />} />
        </Route>
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/admindashboard" element={<AdminDashboard />} />

        <Route path='*' element={<Four04 />} />
      </Routes>
    </CartProvider>
  )
}

export default App
