import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import type { Student } from '../types/types';
import { API } from '../api/api';


const StudentsPage = () => {
  const { token } = useAuth();
  const [students, setStudents] = useState<Student[]>([]);
  const [newStudent, setNewStudent] = useState({ name: '', className: '' });

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const res = await API.get('/api/students', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setStudents(res.data);
      } catch (err) {
        console.error('Error fetching students:', err);
      }
    };

    if (token) fetchStudents();
  }, [token]);

  const handleAddStudent = async () => {
    try {
      const res = await API.post(
        '/api/students',
        newStudent,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setStudents([...students, res.data]);
      setNewStudent({ name: '', className: '' });
    } catch (err) {
      console.error('Error adding student:', err);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-2xl font-semibold mb-4">Students</h1>

      <div className="mb-4 flex flex-col md:flex-row gap-2">
        <input
          type="text"
          placeholder="Name"
          value={newStudent.name}
          onChange={(e) => setNewStudent({ ...newStudent, name: e.target.value })}
          className="border rounded px-3 py-1 w-full md:w-1/3"
        />
        <input
          type="text"
          placeholder="Class"
          value={newStudent.className}
          onChange={(e) => setNewStudent({ ...newStudent, className: e.target.value })}
          className="border rounded px-3 py-1 w-full md:w-1/3"
        />
        <button
          onClick={handleAddStudent}
          className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700"
        >
          Add Student
        </button>
      </div>

      <table className="w-full table-auto border">
        <thead>
          <tr className="bg-gray-100">
            <th className="border px-4 py-2 text-left">Name</th>
            <th className="border px-4 py-2 text-left">Class</th>
          </tr>
        </thead>
        <tbody>
          {students.map((s) => (
            <tr key={s._id}>
              <td className="border px-4 py-2">{s.name}</td>
              <td className="border px-4 py-2">{s.className}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default StudentsPage;
