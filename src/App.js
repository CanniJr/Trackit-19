import React, {useState, useEffect} from 'react'
import { MenuItem, FormControl, Select, Card } from '@material-ui/core'
import DataBox from './DataBox'
import Map from './Map';
import './App.css';

// API endpoint: https://disease.sh/v3/covid-19/countries

function App() {
  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState('worldwide')
  const [countryData, setCountryData] = useState({})
  
  useEffect(() => {
    // async function
    const getCountriesData = async () => {
      await fetch("https://disease.sh/v3/covid-19/countries")
      .then((resp) => resp.json())
      .then((data) => {
        const countriesData = data.map((countryObj) => ({
          id: countryObj.countryInfo._id,
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

    const url = countryCode === 'worldwide' 
    ? 'https://disease.sh/v3/covid-19/all' 
    : `https://disease.sh/v3/covid-19/countries/${countryCode}`

    fetch(url)
    .then(resp => resp.json())
    .then(data => {

      setCountryData(data)
      setCountry(countryCode)
    })
  }

  console.log(countryData)
  return (
    <div className='app'>
      <div className='app__main'>
          <div className='app__header'>
            <h1>Trackit-19!</h1>
            <FormControl className='app__dropdown'>
              <Select variant='outlined' onChange={changeHandler} value={country}>
                <MenuItem value='worldwide'>Worldwide</MenuItem>
                {countries.map((country) => (
                <MenuItem value={country.info}>{country.name}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>
          <div className='app__stats'>
            <DataBox title='Covid-19 Cases' cases={countryData.todayCases} total={countryData.cases}/>
            <DataBox title='Deaths' cases={countryData.todayDeaths} total={countryData.deaths}/>
            <DataBox title='Recovered' cases={countryData.todayRecovered} total={countryData.recovered}/>
          </div>
        <Map/>
      </div>

      <Card className='app__side'>
        <h1>This is the side</h1>
      </Card>
    </div>
  );
}

export default App;