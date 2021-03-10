import React, {useState, useEffect} from 'react'
import { MenuItem, FormControl, Select, Card, CardContent } from '@material-ui/core'
import DataBox from './DataBox'
import Map from './Map';
import Table from './Table'
import LineGraph from './LineGraph'
import { sortData } from './utility'
import './CSS/App.css';

// API endpoint: https://disease.sh/v3/covid-19/countries

function App() {
  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState('worldwide')
  const [countryData, setCountryData] = useState({})
  const [tableData, setTableData] = useState([]);
  const [sortValue, setSortValue] = useState('')
  
  //Loads worldwide cases data after component load
  useEffect(()=> {
    fetch('https://disease.sh/v3/covid-19/all')
    .then(resp => resp.json())
    .then(data => {
      setCountryData(data)
    });
  }, [])

  //Loads dropdown menu with countries and related data.
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

        const sortedData = sortData(data)
        setCountries(countriesData)
        setTableData(sortedData)

      });
    }
    getCountriesData();
  }, [])

  const changeHandler = (e) => {
    const countryCode = e.target.value; 

    // to be continued: set alphabetic sort change value
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

  const sortHandler = (e) => {
    const sortedValue = e.target.value;
    setSortValue(sortedValue)

  }

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
        <CardContent>
        <div className='app__side__cardHeader'>
          <h1>Live Cases by Country</h1>
          <FormControl className='cardHeader__dropdown'>
            <Select variant='outlined' onChange={sortHandler} value={sortValue}>
                  <MenuItem value='alphabet'>Sort by Country</MenuItem>
                  <MenuItem value='cases'>Sort by Cases</MenuItem>
            </Select>
          </FormControl>
        </div>

        <Table countries={tableData}/>
        <h3>Worldwide new cases</h3>
        <LineGraph />
        {/* Graph */}
        </CardContent>
      </Card>
    </div>
  );
}

export default App;