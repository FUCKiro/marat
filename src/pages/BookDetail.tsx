import React from 'react';
import { useParams } from 'react-router-dom';
import { books } from './Works';
import BookHeader from '../components/BookHeader';
import BookDescription from '../components/BookDescription';
import DownloadButton from '../components/DownloadButton';
import BackButton from '../components/BackButton';
import NotFound from '../components/NotFound';

const BookDetail = () => {
  const { id } = useParams();
  const book = books.find(b => b.id === Number(id));

  if (!book) {
    return <NotFound />;
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <BackButton />
        <div className="bg-white rounded-lg shadow-xl overflow-hidden animate-fade-in">
          <BookHeader book={book} />
          <div className="p-8">
            <div className="prose prose-lg max-w-none">
              <BookDescription book={book} />
              <DownloadButton pdfUrl={book.pdfUrl} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookDetail;