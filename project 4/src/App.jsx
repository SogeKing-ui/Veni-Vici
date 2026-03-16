import { useState } from "react";
import "./App.css";

function App() {
  const API_KEY = import.meta.env.VITE_CAT_API_KEY;

  const [catData, setCatData] = useState(null);
  const [banList, setBanList] = useState([]);

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

        const isBanned =
          banList.includes(newCat.breed) ||
          banList.includes(newCat.origin) ||
          banList.includes(newCat.lifeSpan);

        if (!isBanned) {
          foundCat = newCat;
        }
      }

      setCatData(foundCat);
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

            <img src={catData.image} alt={catData.breed} width="300" />
          </div>
        )}

        <button onClick={fetchCat}>Discover!</button>
      </div>

      <div className="ban-list">
        <h2>Ban List</h2>
        <p>Click an item to remove it</p>

        {banList.length === 0 ? (
          <p>No banned attributes yet.</p>
        ) : (
          banList.map((item, index) => (
            <button key={index} onClick={() => removeBan(item)}>
              {item}
            </button>
          ))
        )}
      </div>
    </div>
  );
}

export default App;
