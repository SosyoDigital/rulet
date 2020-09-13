const axios = require('axios');
const config = require('../config');


module.exports = { 
    service: {
        sendOtp(number){
            return axios.get('https://2factor.in/API/V1/'+config.fakey+'/SMS'+'/'+number+'/AUTOGEN')
        },
        verifyOtp(payload){
            return axios.get('https://2factor.in/API/V1/'+config.fakey+'/SMS/VERIFY/'+payload.sessionId+'/'+payload.otpInput)
        }
    }
}