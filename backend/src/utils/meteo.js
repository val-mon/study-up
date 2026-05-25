async function getWeatherByCity(cityName) {
  // geocoding (ville → lat/lon)
  const geoUrl = new URL("https://geocoding-api.open-meteo.com/v1/search");
  geoUrl.searchParams.set("name", cityName);
  geoUrl.searchParams.set("count", "1");
  geoUrl.searchParams.set("language", "fr");

  const geoRes = await fetch(geoUrl);
  const geoData = await geoRes.json();

  if (!geoData.results || geoData.results.length === 0) {
    throw new Error("Ville non trouvée");
  }

  const { latitude, longitude, name, country } = geoData.results[0];

  // coordonnées → météo
  const weatherUrl = new URL("https://api.open-meteo.com/v1/forecast");
  weatherUrl.searchParams.set("latitude", latitude);
  weatherUrl.searchParams.set("longitude", longitude);
  weatherUrl.searchParams.set("current", "temperature_2m,wind_speed_10m");
  weatherUrl.searchParams.set("timezone", "auto");

  const weatherRes = await fetch(weatherUrl);
  const weatherData = await weatherRes.json();

  return {
    city: `${name}, ${country}`,
    temperature: weatherData.current.temperature_2m,
    wind: weatherData.current.wind_speed_10m
  };
}

module.exports = { getWeatherByCity };
