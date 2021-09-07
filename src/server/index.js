var path = require('path')
const express = require('express')
const axios = require('axios');
require('dotenv').config({path: __dirname.replace('src/server','') + '/.env'})
const {getLocationPhoto, formatUserInput} = require(`${__dirname}/helpers/helperFunctions.js`);

const app = express()

app.use(express.static('dist'))

console.log(__dirname)

app.get('/', function (req, res) {
    // res.sendFile('dist/index.html')
    res.sendFile(path.resolve('src/client/views/index.html'))
})

// designates what port the app will listen to for incoming requests
app.listen(8081, function () {
    console.log('Example app listening on port 8081!')
})

app.get('/searchPlace/:city/:state/:country', async (req, res) => {


    const formattedUserInput = formatUserInput(req.params)

    let response = await axios.get(`http://api.geonames.org/findNearbyPostalCodesJSON?placename=${formattedUserInput}&username=${process.env.GEONAMES_USERNAME}`)
    
    const {lat,lng} = response.data.postalCodes[0]


    //for weather in 16 days : https://api.weatherbit.io/v2.0/forecast/daily?city=Raleigh,NC&key=API_KEY
    response = await axios.get(`https://api.weatherbit.io/v2.0/forecast/daily?lat=${lat}&lon=${lng}&key=${process.env.WEATHERBIT_API_KEY}&include=minutely`)
    console.log(response.data)

    //for weather past 16 days : https://api.weatherbit.io/v2.0/history/daily?postal_code=27601&country=US&start_date=2021-09-03&end_date=2021-09-04&key=API_KEY

    // response = await axios.get(`https://api.weatherbit.io/v2.0/current?lat=${lat}&lon=${lng}&key=${process.env.WEATHERBIT_API_KEY}&include=minutely`)



    console.log(response.data.data[0])

    let image = await getLocationPhoto(formattedUserInput.replace(',','+'))
})