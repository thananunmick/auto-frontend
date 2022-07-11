import logo from './logo.svg';
import './App.css';
import TextField from '@mui/material/TextField';
import { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import ScrollableFeed from 'react-scrollable-feed';
import Histogram from 'react-chart-histogram';
// import ReactApexChart from 'apexcharts';
import ReactApexChart from "react-apexcharts";


function App() {
  const [input, setInput] = useState('');
  const [sites, setSites] = useState([]);
  const [results, setResults] = useState({});
  const [extracted, setExtracted] = useState(false);
  // const width = window.innerWidth;
  const [series, setSeries] = useState([
    {
      data: []
    }
  ]);
  const [options, setOptions] = useState({
    legend: {
      show: false
    },
    chart: {
      height: "90%",
      type: 'treemap'
    },
    title: {
      text: 'Extracted Words'
    }
  });

  const labels = ['2016', '2017', '2018', 'Python', 'C++', '2017', '2018', 'Python', 'C++', '2017', '2018', 'Python', 'C++'];
  const data = [1, 2, 1, 3, 0, 2, 1, 3, 0, 2, 1, 3, 0];
  // const options = { fillColor: '#FFFFFF', strokeColor: '#0000FF' };
  // const items = ['Item 1', 'Item 2', 'Item 2', 'Item 2', 'Item 2', 'Item 2', 'Item 2', 'Item 2', 'Item 2'];

  useEffect(() => {
    if (extracted === true) {
      let combinedDict = {};
      console.log("LMAO")
      console.log(results)
      console.log("DONE")

      for (var companyKey in results) {
        console.log("JEEE")
        for (var wordKey in results[companyKey]) {
          if (wordKey in combinedDict) {
            combinedDict[wordKey] += results[companyKey][wordKey];
          } else {
            combinedDict[wordKey] = results[companyKey][wordKey];
          }
        }
      }

      console.log(combinedDict);
      console.log("HAHAHA")

      let holderData = [];

      for (var wordKey in combinedDict) {
        holderData.push({
          x: wordKey,
          y: combinedDict[wordKey]
        });
      }

      console.log(holderData);

      setSeries([{
        data: holderData
      }]);

      console.log(series);
    }
  }, [results]);

  const handleBackButton = (event) => {
    setExtracted(false);
  }

  const handleKeyEnter = (event) => {
    if (event.key === 'Enter') {
      if (input != '') {
        setSites([...sites, input]);
        setInput('');
      }
      // console.log(input);
      // console.log(sites)
    }
  }

  const handleButtonAdd = (event) => {
    if (input != '') {
      setSites([...sites, input]);
      setInput('');
    }
    // console.log(input);
  }

  const handleButtonExtract = (event) => {
  // async function handleButtonExtract() {
    let dict = {};

    for (let i=0; i<sites.length; i++) {
      const url = sites[i];
      try {
        const domain = (new URL(url));
        const hostname = domain.hostname;
        const company = hostname.replace("www.", "").replace(".com", "");
        const pathname = domain.pathname;
        const tag = company + "-" + pathname;

        dict[tag] = url;
      } catch {
        console.log("Not a valid url");
      }
    }

    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dict)
    };

    fetch('https://auto-api-heroku.herokuapp.com/generate', requestOptions)
      .then(response => response.json())
      .then(data => setResults(data))
      // .then(combineResults)
      .then(setExtracted(true))
      .then(console.log(results));

    console.log(sites);
    console.log('Extracted');
    console.log(results);
  }

  // console.log(input);
  return (
    <div>
      { !extracted &&
        <div className="App">
          <p className="Font-name">Auto Extracter</p>
          <div className="Inputs">
            <TextField 
              className="Textfield"
              label="Job Link"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyPress={handleKeyEnter}/>

            <Button
              className="Add-button"
              variant="contained"
              style={{backgroundColor: "#DFE8CC" , color: "black", marginLeft: "5pt", fontWeight: "bold"}}
              onClick={handleButtonAdd}>Add</Button>

            <Button
              className="Extract-button"
              variant="contained"
              style={{backgroundColor: "#CCD6A6", color: "black", marginLeft: "5pt", fontWeight: "bold"}}
              onClick={handleButtonExtract}>Extract</Button> 
          </div>
        </div>

        /* <ScrollableFeed className="Scroll-container">
          {items.map((item, i) => <div key={i}>{item}</div>)}
        </ScrollableFeed> */
      }
      { extracted &&
        <div className="App">
          {/* <Histogram
            xLabels={labels}
            yValues={data}
            width='1000'
            height='200'
            options={options}
          /> */}
          <Button
            // className="Extract-button"
            variant="contained"
            style={{backgroundColor: "#CCD6A6", color: "black", marginLeft: "5pt", fontWeight: "bold", alignItems: "end"}}
            onClick={handleBackButton}>Back</Button> 
          <ReactApexChart options={options} series={series} type="treemap" height="90%" width="400%"/>
        </div>
      }
    </div>
  );
}

export default App;
