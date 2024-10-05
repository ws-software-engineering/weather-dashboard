import { Router } from 'express';
const router = Router();

import HistoryService from '../../service/historyService.js';
import WeatherService from '../../service/weatherService.js';

// Main POST Request to Retrieve Weather Data
router.post('/', async (req, res) => {
  try {
    const cityName = req.body.cityName;
    // Retrieves Five Day Forecast
    const forecastWeather = await WeatherService.getWeatherForCity(cityName);
    // Returns Current Weather
    const currentWeather = await WeatherService.getCurrentWeatherForCity(cityName);
    // Saves City to Search History
    await HistoryService.addCity(cityName)
    // Builds the Forecast Array 
    const weatherForecast = await WeatherService.buildForecastArray(forecastWeather);
    // Defines a Current Weather Object for Client-Side Rendering
    const weatherObject = await WeatherService.buildCurrentWeatherObject(currentWeather);
    res.json([weatherObject, weatherForecast]);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }

});

// Returns the Search History 
router.get('/history', async (_req, res) => {
  try {
    const savedCities = await HistoryService.getCities();
    res.json(savedCities);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// Deletes a City Based on the State ID
router.delete('/history/:id', async (req, res) => {
  try {
    if (!req.params.id) {
      res.status(400).json({ msg: 'State id is required' });
    }
    await HistoryService.removeCity(req.params.id);
    res.json({ success: 'State successfully removed from search history' });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

export default router;
