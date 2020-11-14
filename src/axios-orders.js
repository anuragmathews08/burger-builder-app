import axios from 'axios';

const instance = axios.create({
    baseURL: 'https://my-burger-site.firebaseio.com/'
});

export default instance;