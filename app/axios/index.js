import axios from 'axios';

// for development server
// export default axios.create({
//   baseURL: 'http://192.168.43.39:8000',
//   'X-Platform': 'android',
//   'X-App-Build-Number': '1.0.01',
//   'X-Col-Build-Number': '1234567890',
// });

// for production server
export default axios.create({
  baseURL: 'https://data-shop-server-application.herokuapp.com',
  'X-Platform': 'android',
  'X-App-Build-Number': '1.0.01',
  'X-Col-Build_Number': '0000000000',
});
