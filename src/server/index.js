var path = require('path')
const express = require('express')
const axios = require('axios');
require('dotenv').config({path: __dirname.replace('src/server','') + '/.env'})
const {
    getLocationPhoto,
    formatUserInput,
    returnDaysBeforeTrip,
    convertCelsiusToFarenheight
} = require(`${__dirname}/helpers/helperFunctions.js`);

const app = express()

app.use(express.static('dist'))

console.log(__dirname)

app.get('/', function (req, res) {
    // res.sendFile('dist/index.html')
    res.sendFile(path.resolve('src/client/views/index.html'))
})

let tempNumber = 0;

// designates what port the app will listen to for incoming requests
app.listen(8081, function () {
    console.log('Example app listening on port 8081!')
})

app.get('/searchPlace/:city/:state/:country/:travelDate', async (req, res) => {

    const formattedUserInput = formatUserInput(req.params)

    // let weatherPromise = new Promise(async (resolve,reject) => {    
    //     try {
    //         let response = await axios.get(`http://api.geonames.org/findNearbyPostalCodesJSON?placename=${formattedUserInput}&username=${process.env.GEONAMES_USERNAME}`)
    //         if (!response.data || !response.data.postalCodes || response.data.postalCodes.length === 0) {
    //             resolve({error:"Could not find location"})
    //             return
    //         }

    //         const {lat,lng} = response.data.postalCodes[0];            
    //         const daysBeforeTrip = returnDaysBeforeTrip(req.params)
    //         let weatherData = {};
    //         if (daysBeforeTrip <= 16) {
    //         //for weather in 16 days : https://www.weatherbit.io/api/weather-forecast-16-day
    //             response = await axios.get(`https://api.weatherbit.io/v2.0/forecast/daily?lat=${lat}&lon=${lng}&key=${process.env.WEATHERBIT_API_KEY}&include=minutely`)
    //             weatherData = response.data.data.find(d => d.valid_date === req.params.travelDate)
    //         } else {
    //                 //for weather past 16 days : https://www.weatherbit.io/api/weather-history-daily
    //                 response = await axios.get(`https://api.weatherbit.io/v2.0/history/daily?lat=${lat}&lon=${lng}&start_date=2021-09-03&end_date=2021-09-04&key=${process.env.WEATHERBIT_API_KEY}&include=minutely`)
    //                 weatherData.temp = response.data.data[0].temp
    //         }
    //         if (!weatherData) resolve({error:"Could not get weather"})
    //         else {
    //             resolve({
    //                 daysBeforeTrip,
    //                 celcius : weatherData.temp,
    //                 farenheight : convertCelsiusToFarenheight(weatherData.temp)
    //             })
    //         }
    //     } catch(e) {
    //         console.log('Error: ', e ? e : 'unkown')
    //     }
    // })
    // .catch((e) => console.log('in catch'))
    
    // let imagePromise = new Promise(async (resolve,reject) => {
    //     let image = await getLocationPhoto(req.params.city)
    //     if (!image) image = await getLocationPhoto(req.params.country)
    //     if (!image) image = 'https://www.salonlfc.com/wp-content/uploads/2018/01/image-not-found-scaled-1150x647.png'
    //     resolve({webformatURL : image.webformatURL})
    // })    
    // Promise.all([weatherPromise,imagePromise]).then((values) => {
    //     console.log(values)
    //     if (!values[0].farenheight) {
    //         return values[0]
    //     }
    //     res.send(Object.assign(values[0],values[1]))
    // });
    

    // console.log(req.params)
    res.send({daysBeforeTrip: tempNumber++, celcius: 33, farenheight: 91, webformatURL: 'https://thumbor.forbes.com/thumbor/960x0/https%3A%2F%2Fblogs-images.forbes.com%2Flaurabegleybloom%2Ffiles%2F2018%2F06%2FCappadocia-by-%40izkiz-1200x801.jpg'}) 
})