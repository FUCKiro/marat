import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useScrollTop } from '../hooks/useScrollTop';

const NotFound: React.FC = () => {
  const navigate = useNavigate();
  const scrollToTop = useScrollTop();

  const handleClick = () => {
    navigate('/opere');
    scrollToTop();
  };

  return (
    <div className="container mx-auto px-4 py-12 text-center">
      <h1 className="text-2xl text-[#8B4513]">Opera non trovata</h1>
      <button
        onClick={handleClick}
        className="mt-4 inline-flex items-center px-4 py-2 bg-[#8B4513] text-white rounded-lg hover:bg-[#654321] transition-all duration-700"
      >
        <ArrowLeft className="h-5 w-5 mr-2" />
        Torna alle Opere
      </button>
    </div>
  );
}

export default NotFound;