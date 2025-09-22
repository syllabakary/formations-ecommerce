import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home.tsx';
import Catalog from './pages/Catalog.tsx';
import Blog from './pages/Blog.tsx';
import Login from './pages/Login.tsx';
import Dashboard from './pages/Dashboard.tsx';
import PaymentPage from './pages/paiement.tsx';
import Footer from './components/Footer';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import Apropos from './pages/apropos.tsx';
import Contact from './pages/Contacts.tsx';
import Presentiel from './pages/Presentiel.tsx';
import Catalog2 from './pages/Catalog2.tsx';

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <div className="flex flex-col min-h-screen">
            <div className="flex-grow">
              <Navbar />
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/catalog" element={<Catalog />} />
                <Route path="/blog" element={<Blog />} />
                <Route path="/login" element={<Login />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/paiement" element={<PaymentPage />} />
                <Route path="/apropos" element={<Apropos />} />
                <Route path="/contacts" element={<Contact />} />
                <Route path="/presentiel" element={<Presentiel />} />
                <Route path="/catalog2" element={<Catalog2 />} />
              </Routes>
            </div>
            <Footer />
          </div>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;