import { create } from 'apisauce'


// for development server
// export const api = create({
//     baseURL: 'http://192.168.43.30:8000',
//     headers: {
//         'X-Platform': 'android',
//         'X-App-Build-Number': '1.2.0',
//         'X-Col-Build_Number': '0000000000',
//     },
//   });
  
  // for production server
  export const api = create({
    baseURL: 'https://datashop.farookcircle.com',
    headers: {
      'X-Platform': 'android',
      'X-App-Build-Number': '1.2.0',
      'X-Col-Build_Number': '0000000000',
    },
  });