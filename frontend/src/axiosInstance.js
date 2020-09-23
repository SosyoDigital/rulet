import axios from 'axios';

export default axios.create({
    baseURL: 'http://35.240.197.189',
    timeout: 5000,
    headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      }
})