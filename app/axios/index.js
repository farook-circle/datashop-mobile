import axios from 'axios';

// for development server
export default axios.create({
  baseURL: 'http://192.168.43.39:8000',
});

// for production server
// export default axios.create({
//   baseURL: 'https://data-shop-server-application.herokuapp.com',
// });
