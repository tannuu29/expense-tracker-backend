import { useEffect, useState } from "react";

const Developer = () => {
  const [developer, setDeveloper] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("http://localhost:80/developer")
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to fetch developer data");
        }
        return res.json();
      })
      .then((data) => setDeveloper(data))
      .catch((err) => setError(err.message));
  }, []);

  return (
    <>
    <h1 style={{padding: "20px"}}>Expense Management System</h1>
    <div style={{ border: "1px solid #ddd", padding: "20px", width: "350px", borderRadius: "8px", margin: "45px" }}>
      <h2>About Developer</h2>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {developer ? (
        <div  style={{ padding: "20px" }}>
    
          <p><strong>Name:</strong> {developer.name}</p>
          <p><strong>Project:</strong> {developer.project}</p>
          <p><strong>Tech Stack:</strong> {developer.techStack}</p>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
    </>
  );
};

export default Developer;
