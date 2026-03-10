import { useEffect, useState } from "react";
import axios from "axios";

function Student() {

  const [marks, setMarks] = useState([]);
  const [loading, setLoading] = useState(true);

  // Get student id from login
  const studentId = localStorage.getItem("userId");

  useEffect(() => {

    const fetchMarks = async () => {

      try {

        const res = await axios.get(
          `http://localhost:5000/api/student-marks/${studentId}`
        );

        setMarks(res.data);
        setLoading(false);

      } catch (err) {

        console.log("Fetch Error:", err);
        alert("Failed to load marks");

      }
    };

    if (studentId) {
      fetchMarks();
    }

  }, [studentId]);

  if (loading) {
    return <h2>Loading...</h2>;
  }

  return (
    <div style={{ padding: "30px" }}>

      <h1>My Performance</h1>

      {marks.length === 0 ? (

        <p>No marks uploaded yet</p>

      ) : (

        <table border="1" width="80%" cellPadding="10">

          <thead>
            <tr>
              <th>Subject</th>
              <th>Marks</th>
              <th>Attendance</th>
              <th>Suggestion</th>
            </tr>
          </thead>

          <tbody>
            {marks.map((m, i) => (
              <tr key={i}>
                <td>{m.subject}</td>
                <td>{m.marks}</td>
                <td>{m.attendance}%</td>
                <td>{m.suggestion}</td>
              </tr>
            ))}
          </tbody>

        </table>
      )}

    </div>
  );
}

export default Student;