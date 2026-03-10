import { useEffect, useState } from "react";
import axios from "axios";

function Faculty() {

  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [subject, setSubject] = useState("");
  const [marks, setMarks] = useState("");
  const [attendance, setAttendance] = useState("");
  const [remark, setRemark] = useState("");

  useEffect(() => {
    axios.get("http://localhost:5000/api/students")
      .then(res => setStudents(res.data));
  }, []);

  const uploadMarks = async () => {
    await axios.post("http://localhost:5000/api/add-marks", {
      studentId: selectedStudent._id,
      subject,
      marks,
      attendance,
      remark
    });

    alert("Marks uploaded");
  };

  return (
    <div style={{ display: "flex" }}>

      {/* SIDEBAR */}
      <div style={{ width: "250px", background: "#f3f4f6", padding: "20px" }}>
        <h3>Students</h3>
        {students.map(stu => (
          <p
            key={stu._id}
            style={{ cursor: "pointer" }}
            onClick={() => setSelectedStudent(stu)}
          >
            {stu.name}
          </p>
        ))}
      </div>

      {/* MAIN AREA */}
      <div style={{ padding: "30px", width: "100%" }}>

        {selectedStudent ? (
          <>
            <h2>{selectedStudent.name}</h2>

            <input placeholder="Subject" onChange={e => setSubject(e.target.value)} />
            <input placeholder="Marks" onChange={e => setMarks(e.target.value)} />
            <input placeholder="Attendance %" onChange={e => setAttendance(e.target.value)} />
            <input placeholder="Remark" onChange={e => setRemark(e.target.value)} />

            <button onClick={uploadMarks}>Upload</button>
          </>
        ) : (
          <h3>Select a student</h3>
        )}

      </div>

    </div>
  );
}

export default Faculty;
