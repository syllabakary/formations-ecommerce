import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Catalog from './pages/Catalog';
import Blog from './pages/Blog';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import PaymentPage from './pages/paiement';
import Footer from './components/Footer';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import Apropos from './pages/Apropos';
import Contact from './pages/Contacts';
import Presentiel from './pages/presentiel';
import Catalog2 from './pages/Catalog2';
import Settings from './pages/Settings';
import Chat from './components/Chat';

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
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
                <Route path="/settings" element={<Settings />} />
                <Route path="/chat" element={<Chat />} />
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