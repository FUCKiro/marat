import { motion } from 'framer-motion';
import { useState } from 'react';

interface Props {
  image: string;
  name: string;
  role: string;
  briefDescription: string;
  fullDescription?: string;
  className?: string;
  onClick?: () => void;
}

export default function HoverCard({
  image,
  name,
  role,
  briefDescription,
  fullDescription,
  className = '',
  onClick
}: Props) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      className={`relative overflow-hidden rounded-lg h-[500px] ${className} ${onClick ? 'cursor-pointer group' : ''}`}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onClick={onClick}
      onTouchStart={() => setIsHovered(!isHovered)}
    >
      <div className="h-64 overflow-hidden">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-110"
        />
      </div>
      <div className="p-6 bg-white h-[236px]">
        <h3 className="text-2xl font-bold text-gray-800 mb-2">{name}</h3>
        <p className="text-teal-600 font-semibold mb-2">{role}</p>
        <p className="text-gray-600 text-sm leading-tight line-clamp-4">{briefDescription}</p>
      </div>

      {onClick && (
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-100 flex justify-center">
          <span className="text-teal-600 font-bold text-sm uppercase tracking-wider group-hover:text-teal-700 transition-colors">
            Scopri di più
          </span>
        </div>
      )}

      {fullDescription && !onClick && (
        <motion.div
          className="absolute inset-0 bg-teal-600/95 p-4 md:p-6 flex items-center justify-center text-white text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <p className="text-sm md:text-base leading-tight md:leading-relaxed">{fullDescription}</p>
        </motion.div>
      )}
    </motion.div>
  );
}