import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import { Container, Paper, Button } from '@material-ui/core';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import './WeatherCard.css';
import Popup from './Popup';

const settings = {
  dots: true,
  infinite: true,
  slidesToShow: 4,
  slidesToScroll: 1,
  nextArrow: <SampleArrow />,
  prevArrow: <SampleArrow />
};

function SampleArrow(props) {
  const { className, style, onClick } = props;
  return (
    <div
      className={className}
      style={{ ...style, display: "block", background: "black" }}
      onClick={onClick}
    />
  );
}
const useStyles = makeStyles((theme) => ({
  root: {
    '& > *': {
      margin: theme.spacing(1),

    },
  },
}));

export default function Request() {
  const paperStyle = { padding: '50px 20px', width: 600, margin: '15px auto' };
  const [city, setCity] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [weathers, setWeathers] = useState([])
  const classes = useStyles();
  const [isOpen, setIsOpen] = useState(false);


  const togglePopup = () => {
    setIsOpen(!isOpen);
  }

  const handleClick = (e) => {
    e.preventDefault()
    const request = { city, startDate, endDate }
    setCity(request.city)
    setStartDate(request.startDate)
    setEndDate(request.endDate)

    fetch(`https://mobileaction-final-backend.herokuapp.com/getWeather/?city=${city}&startDate=${startDate}&endDate=${endDate}`)
      .then(response => {
        if (response.status !== 200 && response.status !== 201) {
          togglePopup()
        }
        return response.json();
      })
      .then((result) => {
        //result status code
        setWeathers(result.Results)
        settings.slidesToShow = result.Results.length < 4 ? result.Results.length : 4
      })

  }
  useEffect(() => {
  }, [weathers])
  return (
    <Container>
      <Paper elevation={6} style={paperStyle}>
        <h1 style={{ color: "blue" }}>Search Weather</h1>
        <form className={classes.root} noValidate autoComplete="off">
          <TextField id="outlined-basic" label="City Name" variant="outlined" fullWidth
            value={city || ""}
            onChange={(e) => setCity(e.target.value)}
          />
          <TextField id="outlined-basic" label="First Date / dd-mm-yyyy" variant="outlined" fullWidth
            value={startDate || ""}
            onChange={(e) => setStartDate(e.target.value)}
          />
          <TextField id="outlined-basic" label="Last Date / dd-mm-yyyy" variant="outlined" fullWidth
            value={endDate || ""}
            onChange={(e) => setEndDate(e.target.value)}
          />
          <Button variant="contained" color="secondary" onClick={handleClick}>
            Submit
          </Button>
        </form>
      </Paper>
      <h1>Air Pollution</h1>
      <div className="App">

        <Slider {...settings}>
          {weathers && weathers.map(
            weather => (
              //add margin to weather box style
              <div className='item'>
                <Paper elevation={6} style={{ margin: "10px", padding: "15px", textAlign: "left", paddingLeft: "50px" }} key={weather.id}>
                  <h1>{weather.Date.slice(0, 10)}</h1>
                  <h4>CO Quality: {weather.Categories[0].CO}</h4>
                  <h4>SO2 Quality: {weather.Categories[1].SO2}</h4>
                  <h4>O3 Quality: {weather.Categories[2].O3}</h4>
                </Paper>
              </div>

            ))
          }
        </Slider>
      </div>
      {isOpen && <Popup
        content={<>
          <b>Invalid Request</b>
          <p>It could be for these reasons:</p>
          <ul>
            <li>Date Format: dd-mm-yyyy</li>
            <li>The end date cannot be earlier than the first date.</li>
            <li>The first date cannot be earlier than 27 November 2020, as data access is restricted by the API from 27 November 2020 to date.</li>
          </ul>
        </>}
        handleClose={togglePopup}
      />}
    </Container>
  );
}