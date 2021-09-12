const returnDaysBeforeTrip = ({travelDate}) => {
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
    formatUserInput: ({city,state,country}) => {
        return `${city}${state === 'undefined'?'':(','+state)},${country}`.replace(' ','%20')
    },
    convertCelsiusToFahrenheit: (temp) => {return Math.round(((temp / 5) * 9) + 32);},
    returnDaysBeforeTrip: returnDaysBeforeTrip,
};