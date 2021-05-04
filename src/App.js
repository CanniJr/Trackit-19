import React, {useState, useEffect} from 'react'
import { MenuItem, FormControl, Select, Card, CardContent } from '@material-ui/core'
import DataBox from './DataBox'
import Map from './Map';
import Table from './Table'
import LineGraph from './LineGraph'
import { sortData, formatNums } from './utility'
import './CSS/App.css';
import 'leaflet/dist/leaflet.css';


// API endpoint: https://disease.sh/v3/covid-19/countries

function App() {
  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState('worldwide');
  const [countryData, setCountryData] = useState({});
  const [tableData, setTableData] = useState([]);
  const [mapCountries, setMapCountries] = useState([]);
  const [sortValue, setSortValue] = useState('');
  const [mapZoom, setMapZoom] = useState(3);
  const [mapCenter, setMapCenter] = useState({ lat: 34.80746, lng: -40.4796 });
  const [casesType, setCasesType] = useState('cases');
  
  //Loads worldwide cases data after component load
  useEffect(()=> {
    fetch('https://disease.sh/v3/covid-19/all')
    .then(resp => resp.json())
    .then(data => {
      setCountryData(data);
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
        setMapCountries(data)

      });
    }
    getCountriesData();
  }, [])

  const changeHandler = async (e) => {
    const countryCode = e.target.value; 

    // to be continued: set alphabetic sort change value
    setCountry(countryCode)

    const url = countryCode === 'worldwide' 
    ? 'https://disease.sh/v3/covid-19/all'
    : `https://disease.sh/v3/covid-19/countries/${countryCode}`

    await fetch(url)
    .then((resp) => resp.json())
    .then((data) => {

      setCountryData(data)
      setCountry(countryCode)
      
      countryCode === 'worldwide' 
        ? setMapCenter({
            lat: 34.80746,
            lng: -40.4796})
        : setMapCenter([data.countryInfo.lat, data.countryInfo.long])
      
      countryCode === 'worldwide' ? setMapZoom(2) : setMapZoom(4)
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
            <h1>Trackit-19 🦠</h1>
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
            <DataBox 
            isRed
            onClick={(e) => setCasesType('cases')}
            active={casesType === 'cases'}
            title='Covid-19 Cases' 
            cases={formatNums(countryData.todayCases)} 
            total={formatNums(countryData.cases)}/>
            <DataBox
            onClick={(e) => setCasesType('recovered')}
            active={casesType === 'recovered'}
            title='Recovered' 
            cases={formatNums(countryData.todayRecovered)} 
            total={formatNums(countryData.recovered)}/>
            <DataBox
            isRed
            onClick={(e) => setCasesType('deaths')}
            active={casesType === 'deaths'}
            title='Deaths' 
            cases={formatNums(countryData.todayDeaths)} 
            total={formatNums(countryData.deaths)}/>
          </div>
        <Map 
          casesType={casesType}
          countries={mapCountries}
          center={mapCenter}
          zoom={mapZoom}
        />
      </div>

      <Card className='app__side'>
        <CardContent>
        <div className='app__side__cardHeader'>
          <h1>Live Cases by Country</h1>
          <FormControl variant='outlined'>
            <Select >
              <MenuItem value='alphabet'>Sort by Country</MenuItem>
              <MenuItem value='cases'>Sort by Cases</MenuItem>
            </Select>
          </FormControl>
        </div>

        <Table countries={tableData}/>
        <h3 className='app__graphTitle'>Worldwide new {casesType}</h3>
        <LineGraph className='app__graph' casesType={casesType} />
        </CardContent>
      </Card>
    </div>
  );
}

export default App;
