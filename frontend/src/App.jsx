import { useEffect, useState } from "react";

function App() {
  const [items, setItems] = useState([]);
  const [name, setName] = useState("");

  useEffect(() => {
    fetch("http://localhost:5000/items")
      .then(res => res.json())
      .then(data => setItems(data));
  }, []);

  const addItem = async () => {
    await fetch("http://localhost:5000/items", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name })
    });
    window.location.reload();
  };

  const styles = {
    container: {
      fontFamily: "Arial, sans-serif",
      textAlign: "center",
      marginTop: "50px"
    },
    heading: {
      color: "#333"
    },
    input: {
      padding: "8px",
      marginRight: "10px",
      borderRadius: "5px",
      border: "1px solid #ccc"
    },
    button: {
      padding: "8px 16px",
      backgroundColor: "#007bff",
      color: "white",
      border: "none",
      borderRadius: "5px",
      cursor: "pointer"
    },
    list: {
      marginTop: "20px",
      listStyleType: "none",
      padding: 0
    },
    listItem: {
      padding: "10px",
      margin: "5px auto",
      width: "200px",
      backgroundColor: "#f2f2f2",
      borderRadius: "5px"
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>MERN Docker App</h1>

      <input
        style={styles.input}
        onChange={e => setName(e.target.value)}
        placeholder="Enter item"
      />

      <button style={styles.button} onClick={addItem}>
        Add
      </button>
      <h1>Welcome to ZoHo</h1>

      <ul style={styles.list}>
        {items.map(i => (
          <li style={styles.listItem} key={i._id}>
            {i.name}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;