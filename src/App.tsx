import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Author from './pages/Author';
import Works from './pages/Works';
import BookDetail from './pages/BookDetail';
import Footer from './components/Footer';

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-[#FDF5E6] flex flex-col">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/autore" element={<Author />} />
          <Route path="/opere" element={<Works />} />
          <Route path="/opere/:id" element={<BookDetail />} />
        </Routes>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
