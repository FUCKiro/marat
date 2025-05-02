import React from 'react';
import { Book } from '../pages/Works';

interface BookHeaderProps {
  book: Book;
}

const BookHeader: React.FC<BookHeaderProps> = ({ book }) => {
  return (
    <div className="relative h-96">
      <img
        src={book.cover}
        alt={book.title}
        className="w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
      <div className="absolute bottom-0 left-0 p-8">
        <h1 className="text-4xl font-serif text-white mb-2">{book.title}</h1>
        <p className="text-[#DEB887]">{book.year}</p>
      </div>
    </div>
  );
}

export default BookHeader;