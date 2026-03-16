import { useState } from "react";
import "./App.css";

function App() {

  const API_KEY = import.meta.env.VITE_CAT_API_KEY;

  const [catData, setCatData] = useState(null);
  const [banList, setBanList] = useState([]);

  const fetchCat = async () => {
    const response = await fetch(
      "https://api.thecatapi.com/v1/images/search?has_breeds=1",
      {
        headers: {
          "x-api-key": API_KEY
        }
      }
    );

    const data = await response.json();
    console.log(data);

    const cat = data[0];

    if (cat && cat.breeds && cat.breeds.length > 0) {
      const breed = cat.breeds[0];

      const newCat = {
        image: cat.url,
        breed: breed.name,
        origin: breed.origin,
        lifeSpan: breed.life_span
      };

      setCatData(newCat);
    }
  };

  return (
    <div className="app">

      <h1>Veni Vici!</h1>
      <p>Discover cats from your wildest dreams!</p>

      {catData && (
        <div>

          <div className="attributes">
            <button>{catData.breed}</button>
            <button>{catData.origin}</button>
            <button>{catData.lifeSpan}</button>
          </div>

          <img src={catData.image} width="300" />

        </div>
      )}

      <button onClick={fetchCat}>
        Discover!
      </button>

    </div>
  );
}

export default App;
