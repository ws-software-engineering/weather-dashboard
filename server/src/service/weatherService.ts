import dotenv from 'dotenv';
dotenv.config();

// Blueprint for Geocode Query Strings
interface Coordinates {
  lon: number;
  lat: number;
}

// Response Object for Weather Data
interface Weather {
  city?: string;
  date: string;
  icon: string;
  iconDescription: string;
  tempF: number;
  windSpeed: number;
  humidity: number;
}

// Main Weather Service Class
class WeatherService {
  // Date Located in the '.env' file. Connection Information for the OpenWeather API. 
  private baseURL?: string;
  private geoURL?: string;
  private apiKey?: string;

  constructor() {
    this.baseURL = process.env.API_BASE_URL || '';
    this.geoURL = process.env.API_GEOCODE_URL || '';
    this.apiKey = process.env.API_KEY || '';
  }

  // Method to Flatten the City Coordinates Data
  private destructureLocationData(locationData: Coordinates): Coordinates {
    const { lat, lon } = locationData;
    const cityCoordinates = {
      lat: lat,
      lon: lon
    }
    return cityCoordinates;
  }
  
  // Method to Return the (lat, lon) for City Location
  async buildGeocodeQuery(city: string): Promise<any> {
    try {
      const response = await fetch(
        `${this.geoURL}/direct?q=${city}&limit=5&appid=${this.apiKey}`
      );
      const geoCodes = await response.json();
      const firstSelectedGeoCodes = this.destructureLocationData(geoCodes[0]);
      return firstSelectedGeoCodes;
    } catch (err) {
      console.log('Error:', err);
      return err;
    }
  }
  
   // Formulates the Current Response Object for UI 
   async buildCurrentWeatherObject(weatherData: any): Promise<Weather> {
    const today = new Date().toISOString().slice(0, 10)
    const buildWeatherObject: Weather = {
      city: weatherData.name,
      date: today,
      icon: weatherData.weather[0].icon,
      iconDescription: weatherData.weather[0].description,
      tempF: weatherData.main.temp,
      windSpeed: weatherData.wind.speed,
      humidity: weatherData.main.humidity
    };
    return buildWeatherObject;
  }

  // Parses Five Day Forecast from List Based on '21:00:00' Snapshot
  async buildForecastArray(weatherData: any): Promise<Weather[]> {
    const forecastWeather = [];
    const fiveDayForecast = weatherData.list;
    for (const day of fiveDayForecast) {
      const hourComp = day.dt_txt.slice(-8);
      const currentWeather: Weather = {
        date: day.dt_txt.slice(0, 10),
        icon: day.weather[0].icon,
        iconDescription: day.weather[0].description,
        tempF: day.main.temp,
        windSpeed: day.wind.speed,
        humidity: day.main.humidity
      };
      if (hourComp === '00:00:00') {
        forecastWeather.push(
          currentWeather
        );
      } 
    };
    return forecastWeather;
  }

  // Returns the Five Day Forecast 
  async getWeatherForCity(city: string): Promise<unknown> {
    try {
      const geoCodes: Coordinates = await this.buildGeocodeQuery(city);
      const response = await fetch(
        `${this.baseURL}/forecast?lat=${geoCodes.lat}&lon=${geoCodes.lon}&limit=5&units=imperial&appid=${this.apiKey}`);
      const cityWeather = await response.json();
      return cityWeather;
    } catch (err) {
      console.log('Error:', err);
      return err;
    }
  }

  // Returns the Current Weather
  async getCurrentWeatherForCity(city: string): Promise<unknown> {
    try {
      const geoCodes: Coordinates = await this.buildGeocodeQuery(city);
      const response = await fetch(
        `${this.baseURL}/weather?lat=${geoCodes.lat}&lon=${geoCodes.lon}&limit=5&units=imperial&appid=${this.apiKey}`);
      const cityWeather = await response.json();
      return cityWeather;
    } catch (err) {
      console.log('Error:', err);
      return err;
    }
  }
}

export default new WeatherService();
