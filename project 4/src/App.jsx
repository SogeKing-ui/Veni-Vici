import { useState } from "react";
import "./App.css";

function App() {
  const API_KEY = import.meta.env.VITE_CAT_API_KEY;

  const [catData, setCatData] = useState(null);
  const [banList, setBanList] = useState([]);
  const [history, setHistory] = useState([]);

  const fetchCat = async () => {
    try {
      let foundCat = null;
      let attempts = 0;

      while (!foundCat && attempts < 20) {
        attempts++;

        const response = await fetch(
          "https://api.thecatapi.com/v1/images/search?has_breeds=1",
          {
            headers: {
              "x-api-key": API_KEY,
            },
          }
        );

        const data = await response.json();
        const cat = data[0];

        if (!cat || !cat.breeds || cat.breeds.length === 0) continue;

        const breed = cat.breeds[0];

        const newCat = {
          image: cat.url,
          breed: breed.name,
          origin: breed.origin,
          lifeSpan: breed.life_span,
        };

        const banned =
          banList.includes(newCat.breed) ||
          banList.includes(newCat.origin) ||
          banList.includes(newCat.lifeSpan);

        if (!banned) {
          foundCat = newCat;
        }
      }

      if (foundCat) {
        setCatData(foundCat);
        setHistory((prev) => [foundCat, ...prev]);
      }
    } catch (error) {
      console.error("Error fetching cat:", error);
    }
  };

  const addBan = (value) => {
    if (!banList.includes(value)) {
      setBanList([...banList, value]);
    }
  };

  const removeBan = (value) => {
    setBanList(banList.filter((item) => item !== value));
  };

  return (
    <div className="app">

      {/* History Panel */}
      <div className="history-panel">
        <h2>Who have we seen so far?</h2>

        {history.length === 0 ? (
          <p>No cats discovered yet.</p>
        ) : (
          history.map((cat, index) => (
            <div key={index} className="history-item">
              <img src={cat.image} alt="cat" />
              <p>{cat.breed} from {cat.origin}</p>
            </div>
          ))
        )}
      </div>

      {/* Main Content */}
      <div className="main-content">

        <h1>Veni Vici!</h1>
        <p>Discover cats from your wildest dreams!</p>

        {catData && (
          <div className="cat-section">

            <div className="attributes">
              <button onClick={() => addBan(catData.breed)}>
                {catData.breed}
              </button>

              <button onClick={() => addBan(catData.origin)}>
                {catData.origin}
              </button>

              <button onClick={() => addBan(catData.lifeSpan)}>
                {catData.lifeSpan} years
              </button>
            </div>

            <img
              className="cat-image"
              src={catData.image}
              alt={catData.breed}
            />

          </div>
        )}

        <button className="discover-btn" onClick={fetchCat}>
          Discover!
        </button>

      </div>

      {/* Ban List */}
      <div className="ban-list">
        <h2>Ban List</h2>
        <p>Click an item to remove it</p>

        {banList.length === 0 ? (
          <p>No banned attributes yet.</p>
        ) : (
          banList.map((item, index) => (
            <button
              key={index}
              className="ban-item"
              onClick={() => removeBan(item)}
            >
              {item}
            </button>
          ))
        )}

      </div>

    </div>
  );
}

export default App;
