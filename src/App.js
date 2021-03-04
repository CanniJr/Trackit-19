import React, {useState, useEffect} from 'react'
import { MenuItem, FormControl, Select } from '@material-ui/core'
import './App.css';

// API endpoint: https://disease.sh/v3/covid-19/countries

function App() {
  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState('worldwide')
  
  useEffect(() => {
    // async function
    const getCountriesData = async () => {
      await fetch("https://disease.sh/v3/covid-19/countries")
      .then((resp) => resp.json())
      .then((data) => {
        const countriesData = data.map((countryObj) => ({
          name: countryObj.country,
          info: countryObj.countryInfo.iso2,
        }));
        setCountries(countriesData)
      });
    }
    getCountriesData();
  }, [])

  const changeHandler = (e) => {
    const countryCode = e.target.value;
    setCountry(countryCode)
  }

  return (
   <div className='app'>
      <div className='app__header'>
      <h1>Let's Track Covid-19 !</h1>
        <FormControl className='app__dropdown'>
          <Select variant='outlined' onChange={changeHandler} value={country}>
            <MenuItem value='worldwide'>Worldwide</MenuItem>
            {countries.map((country) => (
              <MenuItem value={country.info}>{country.name}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </div>
        
      {/*Infobox */}
      {/*Infobox */}
      {/*Infobox */}
    
      {/*Table */}
      {/*Graph */}
      {/*Map */}
   </div>
  );
}

export default App;