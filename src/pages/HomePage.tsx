import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { getBooks, getDistributionsByBook, addDistribution, API } from '../api/api';
import type { Book, Distribution, Student } from '../types/types';

const Home = () => {
  const { token } = useAuth();
  const [books, setBooks] = useState<Book[]>([]);
  const [selectedBookId, setSelectedBookId] = useState('');
  const [distributions, setDistributions] = useState<Distribution[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [newStudentId, setNewStudentId] = useState('');
  const [newAmount, setNewAmount] = useState("0");

  useEffect(() => {
    const fetchData = async () => {
      const booksRes = await getBooks();
      setBooks(booksRes);
      if (booksRes.length > 0) {
        setSelectedBookId(booksRes[0]._id);
      }

      const studentsRes = await API.get('/api/students', {
        headers: { Authorization: `Bearer ${token}` },
      }).then(res => res.data);
      setStudents(studentsRes);
    };

    fetchData();
  }, [token]);

  useEffect(() => {
    if (selectedBookId) {
      getDistributionsByBook(selectedBookId).then(setDistributions);
    }
  }, [selectedBookId]);

  const selectedBook = books.find(b => b._id === selectedBookId);
  const totalCollected = distributions.reduce((sum, d) => sum + d.amountPaid, 0);

  const handleAddStudent = async () => {
    if (!newStudentId || !newAmount || !selectedBookId) return;
  
    const existingDistribution = distributions.find(
      (d) =>
        d.student &&
        d.student._id === newStudentId &&
        d.book &&
        d.book._id === selectedBookId
    );
  
    if (existingDistribution) {
      // Update existing distribution
      await API.put(
        `/api/distributions/${existingDistribution._id}`,
        { amountPaid: Number(newAmount) },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
    } else {
      // Create new distribution
      await addDistribution({
        book: selectedBookId,
        student: newStudentId,
        amountPaid: Number(newAmount),
      });
    }
  
    // Clear form and refresh
    setNewStudentId('');
    setNewAmount("0");
    getDistributionsByBook(selectedBookId).then(setDistributions);
  };
  

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Home</h1>

      <div className="mb-4">
        <label className="font-medium mr-2">Select Book:</label>
        <select
          className="p-2 border rounded"
          value={selectedBookId}
          onChange={(e) => setSelectedBookId(e.target.value)}
        >
          {books.map((book) => (
            <option key={book._id} value={book._id}>
              {book.title}
            </option>
          ))}
        </select>
      </div>

      {selectedBook && (
        <div className="mb-4 space-y-1">
          <p>📚 <strong>Cost:</strong> Rs. {selectedBook.cost}</p>
          <p>📦 <strong>Total Given:</strong> {distributions.length}</p>
          <p>💰 <strong>Total Collected:</strong> Rs. {totalCollected}</p>
        </div>
      )}

      <div className="flex gap-4 mb-6">
        <select
          className="border p-2 rounded max-h-48 overflow-y-scroll"
          value={newStudentId}
          onChange={(e) => setNewStudentId(e.target.value)}
        >
          <option value="">Select Student</option>
          {students.map((student) => (
            <option key={student._id} value={student._id}>
              {student.name}
            </option>
          ))}
        </select>
        <input
          type="number"
          placeholder="Amount Paid"
          value={newAmount}
          onChange={(e) => setNewAmount(e.target.value)}
          className="p-2 border rounded w-32"
        />
        <button
          onClick={handleAddStudent}
          className="bg-emerald-700 text-white px-4 py-2 rounded hover:bg-emerald-800"
        >
          Add
        </button>
      </div>

      <div className="overflow-x-auto mb-4">
        <table className="min-w-full bg-white border">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 text-left border">Student Name</th>
              <th className="px-4 py-2 text-left border">Amount Paid</th>
            </tr>
          </thead>
          <tbody>
            {distributions.map((dist) => {
              if (!selectedBook) return null;
              const paidEnough = dist.amountPaid >= selectedBook.cost;

              return (
                <tr
                  key={dist._id}
                  className={paidEnough ? 'bg-green-100' : 'bg-red-100'}
                >
                  <td className="px-4 py-2 border">{dist.student?.name}</td>
                  <td className="px-4 py-2 border">Rs. {dist.amountPaid}</td>
                </tr>
              );
            })}
            <tr>
              <td colSpan={2} className="font-semibold p-2">
                Total Amount Collected: Rs. {distributions.reduce((acc, dist) => acc + dist.amountPaid, 0)}
              </td>
            </tr>
          </tbody>
        </table>
      </div>




    </div>
  );
};

export default Home;
