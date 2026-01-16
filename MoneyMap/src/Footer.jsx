import { useEffect, useState } from "react";

const Footer = () => {
  const [developer, setDeveloper] = useState(null);

  useEffect(() => {
    fetch("http://localhost:80/developer")
      .then(res => res.json())
      .then(data => setDeveloper(data))
      .catch(err => console.log("Error:", err));
  }, []);

  return (
    <footer style={{
      marginTop: "10px",
      padding: "15px",
      textAlign: "center",
      backgroundColor: "rgb(10, 56, 5)",   // dark gray
      color: "white",
      fontSize: "14px"
    }}>
      <p style={{ margin: "5px 0" }}>
        © {new Date().getFullYear()} Expense Management System
      </p>

      <p style={{ margin: "5px 0" }}>
        Developed by{" "}
        <strong>
          {developer ? developer.name : "Tanisha Nainwal"}
        </strong>
      </p>

      <div style={{ marginTop: "8px" }}>
        <a href="https://github.com/tannuu29" style={{ color: "#9ca3af", marginRight: "10px", textDecoration: "none" }}>
          GitHub
        </a>
        |
        <a href="https://www.linkedin.com/in/n-tanisha?" style={{ color: "#9ca3af", marginLeft: "10px", textDecoration: "none" }}>
          LinkedIn
        </a>
      </div>
    </footer>
  );
};

export default Footer;
