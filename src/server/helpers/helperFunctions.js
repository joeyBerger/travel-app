const axios = require('axios');

returnDaysBeforeTrip = ({travelDate}) => {
        var now = new Date();
        now.setUTCHours(0,0,0,0);
        var travelDateObj = new Date(travelDate);

        // difference in time
        var timeDelta = travelDateObj.getTime() - now.getTime();
          
        // difference in days
        var dayDelta = timeDelta / (1000 * 3600 * 24);
        return dayDelta+1;
}

module.exports = {
    getLocationPhoto: async formattedUserInput => {
        const res = await axios.get(`https://pixabay.com/api/?key=${process.env.PIXABAY_API_KEY}&q=${formattedUserInput}+city&image_type=photo`);
        return res.data.hits[Math.floor(Math.random(res.data.hits.length))];
    },
    formatUserInput: ({city,state,country}) => {
        return `${city}${state === 'undefined'?'':(','+state)},${country}`.replace(' ','%20')
    },
    convertCelsiusToFarenheight: (temp) => {return Math.round(((temp / 5) * 9) + 32);},
    returnDaysBeforeTrip: returnDaysBeforeTrip,
};