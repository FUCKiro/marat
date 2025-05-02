import React from 'react';
import { Book } from '../pages/Works';
import { descriptions } from '../data/bookDescriptions';

interface BookDescriptionProps {
  book: Book;
}

const BookDescription: React.FC<BookDescriptionProps> = ({ book }) => {
  const DescriptionComponent = descriptions[book.id];
  
  if (!DescriptionComponent) {
    return <p className="text-[#5C4033] mb-6">{book.description}</p>;
  }

  return <DescriptionComponent />;
};

export default BookDescription;