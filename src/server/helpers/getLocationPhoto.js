const axios = require('axios');

module.exports = {
    getLocationPhoto: async formattedUserInput => {
        const res = await axios.get(`https://pixabay.com/api/?key=${process.env.PIXABAY_API_KEY}&q=${formattedUserInput}+city&image_type=photo`);
        return res.data.hits[Math.floor(Math.random(res.data.hits.length))];
    }
};