import fs from 'node:fs/promises';
import { v4 as uuidv4 } from 'uuid';

// City Definition for Retrieving Data from the 'searchHistory.json' File
class City {
  name: string;
  id: string;

  constructor(
    name: string,
    id: string
  ) {
    this.name = name;
    this.id = id;
  }
}

// Main History Service Class
class HistoryService {
  // Method to Read for the 'searchHistory.json' File
  private async read() {
    return await fs.readFile('db/searchHistory.json', {
      flag: 'a+',
      encoding: 'utf8',
    });
  }
  // Method to Write to the  'searchHistory.json' File
  private async write(cities: City[]) {
    return await fs.writeFile('db/searchHistory.json', JSON.stringify(cities, null, '\t'));
  }
  // Method Reads to Read History. Returns an Array of Objects
  async getCities() {
    return await this.read().then((cities) => {
      let parsedCities: City[];

      try {
        parsedCities = [].concat(JSON.parse(cities));
      } catch (err) {
        parsedCities = [];
      }

      return parsedCities;
    });
  }
  // Method Adds a City to the 'searchHistory.json' File
  async addCity(city: string) {
    if (!city) {
      throw new Error('state cannot be blank');
    }

    // Adds a Unique Key to the City Entry in the Database
    const newCity: City = { name: city, id: uuidv4() };

    // Adds a New City to the List. Returns the List
    return await this.getCities()
      .then((cities) => {
        if (cities.find((index) => index.name === city)) {
          return cities;
        }
        return [...cities, newCity];
      })
      .then((updatedCities) => this.write(updatedCities))
      .then(() => newCity);
  }
  // Removes a City from the 'searchHistory.json' File
  async removeCity(id: string) {
    return await this.getCities()
      .then((cities) => cities.filter((city) => city.id !== id))
      .then((filteredCities) => this.write(filteredCities));
  }
}

export default new HistoryService();
