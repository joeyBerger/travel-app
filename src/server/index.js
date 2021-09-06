var path = require('path')
const express = require('express')
const axios = require('axios');

require('dotenv').config({path: __dirname.replace('src/server','') + '/.env'})

const getLocationPhoto = require(`${__dirname}/helpers/getLocationPhoto.js`).getLocationPhoto

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
    const formatUserInput = ({city,state,country}) => {
        return `${city}${state === 'undefined'?'':(','+state)},${country}`.replace(' ','%20')
    }

    const formattedUserInput = formatUserInput(req.params)

    let response = await axios.get(`http://api.geonames.org/findNearbyPostalCodesJSON?placename=${formattedUserInput}&username=${process.env.GEONAMES_USERNAME}`)
    
    const {lat,lng} = response.data.postalCodes[0]

    response = await axios.get(`https://api.weatherbit.io/v2.0/current?lat=${lat}&lon=${lng}&key=${process.env.WEATHERBIT_API_KEY}&include=minutely`)

    console.log(response.data.data[0])

    let image = await getLocationPhoto(formattedUserInput.replace(',','+'))
})