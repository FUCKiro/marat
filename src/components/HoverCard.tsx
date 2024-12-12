import { motion } from 'framer-motion';
import { useState } from 'react';

interface Props {
  image: string;
  name: string;
  role: string;
  briefDescription: string;
  fullDescription?: string;
  className?: string;
}

export default function HoverCard({ image, name, role, briefDescription, fullDescription, className = '' }: Props) {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <motion.div
      className={`relative overflow-hidden rounded-lg h-[500px] ${className}`}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onTouchStart={() => setIsHovered(!isHovered)}
    >
      <div className="h-64">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover object-center"
        />
      </div>
      <div className="p-6 bg-white h-[276px]">
        <h3 className="text-2xl font-bold text-gray-800 mb-2">{name}</h3>
        <p className="text-teal-600 font-semibold">{role}</p>
        <p className="text-gray-600 mt-2 text-sm leading-tight">{briefDescription}</p>
      </div>
      
      {fullDescription && (
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