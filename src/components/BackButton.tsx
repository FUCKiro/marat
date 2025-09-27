import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useScrollTop } from '../hooks/useScrollTop';

const BackButton: React.FC = () => {
  const navigate = useNavigate();
  const scrollToTop = useScrollTop();

  const handleClick = () => {
    navigate('/opere');
    scrollToTop();
  };

  return (
    <button
      onClick={handleClick}
      className="mb-8 inline-flex items-center px-4 py-2 bg-[#8B4513] text-white rounded-lg hover:bg-[#654321] transition-all duration-700"
    >
      <ArrowLeft className="h-5 w-5 mr-2" />
      Torna alle Opere
    </button>
  );
}

export default BackButton;