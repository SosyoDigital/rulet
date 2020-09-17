import axios from 'axios';

export default axios.create({
    baseURL: 'https://api.casualita.app',
    timeout: 10000
})