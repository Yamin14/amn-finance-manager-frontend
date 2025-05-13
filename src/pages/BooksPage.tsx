import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import type { Book, Distribution } from '../types/types';
import { API } from '../api/api';

const BooksPage = () => {
  const { token } = useAuth();
  const [books, setBooks] = useState<Book[]>([]);
  const [distributions, setDistributions] = useState<Distribution[]>([]);
  const [newBook, setNewBook] = useState({ title: '', cost: 0, totalGiven: 0 });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const booksRes = await API.get('/api/books', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setBooks(booksRes.data);

        const distRes = await API.get('/api/distributions', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setDistributions(distRes.data);
      } catch (err) {
        console.error('Failed to load books or distributions:', err);
      }
    };

    if (token) fetchData();
  }, [token]);

  const handleAddBook = async () => {
    try {
      const res = await API.post('/api/books', newBook, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBooks([...books, res.data]);
      setNewBook({ title: '', cost: 0, totalGiven: 0 });
    } catch (err) {
      console.error('Error adding book:', err);
    }
  };

  const getBookDistributions = (bookId: string) =>
    distributions.filter((d) => d.book._id === bookId);

  const getPaidStudents = (bookId: string, cost: number) =>
    getBookDistributions(bookId).filter((d) => d.amountPaid >= cost);

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Books</h1>

      <div className="flex flex-col md:flex-row gap-2 mb-6">
        <input
          type="text"
          placeholder="Title"
          value={newBook.title}
          onChange={(e) => setNewBook({ ...newBook, title: e.target.value })}
          className="border px-3 py-1 rounded w-full md:w-1/3"
        />
        <input
          type="number"
          placeholder="Cost"
          value={newBook.cost}
          onChange={(e) => setNewBook({ ...newBook, cost: parseFloat(e.target.value) })}
          className="border px-3 py-1 rounded w-full md:w-1/4"
        />
        <input
          type="number"
          placeholder="Total Quantity"
          value={newBook.totalGiven}
          onChange={(e) => setNewBook({ ...newBook, totalGiven: parseInt(e.target.value) })}
          className="border px-3 py-1 rounded w-full md:w-1/4"
        />
        <button
          onClick={handleAddBook}
          className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700"
        >
          Add Book
        </button>
      </div>

      {books.map((book) => {
        const bookDists = getBookDistributions(book._id);
        const paid = getPaidStudents(book._id, book.cost);
        const totalPaid = bookDists.reduce((sum, d) => sum + d.amountPaid, 0);

        return (
          <div key={book._id} className="border p-4 rounded shadow mb-4">
            <h2 className="text-xl font-semibold mb-1">{book.title}</h2>
            <p className="text-sm text-gray-600 mb-2">
              Cost: Rs. {book.cost} | Total Quantity: {book.totalGiven}
            </p>
            <p className="text-sm mb-2">
              Distributed to {bookDists.length} students | Paid by {paid.length} students
            </p>
            <p className="text-sm font-medium text-green-600 mb-2">
              Total Amount Collected: Rs. {totalPaid}
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-t">
                <thead>
                  <tr>
                    <th className="py-1 pr-4">Student</th>
                    <th className="py-1 pr-4">Amount Paid</th>
                  </tr>
                </thead>
                <tbody>
                  {bookDists.map((dist) => (
                    <tr key={dist._id}>
                      <td className="py-1 pr-4">{dist.student?.name}</td>
                      <td className={`py-1 pr-4 ${dist.amountPaid >= book.cost ? 'text-green-600' : 'text-red-600'}`}>
                        Rs. {dist.amountPaid}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default BooksPage;
