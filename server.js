import express from 'express';

const app = express();

app.use(express.static(`${__dirname}/client`));
app.listen(3000, () => console.log('Listening on port 3000!'));

// import http from 'http';
//
// const port = 3000;
// // https://data-live.flightradar24.com/zones/fcgi/feed.js
// const server = http.createServer((request, response) => {
//   // response.setHeader('Access-Control-Allow-Origin', 'http://localhost:63342');
//     http.get('http://data-live.flightradar24.com/zones/fcgi/feed.js', (res) => {
//         const { statusCode } = res;
//
//         if (statusCode !== 200) {
//             const error = new Error('Request Failed.\n' + `Status Code: ${statusCode}`);
//             console.error(error.message);
//             res.resume();
//             return;
//         }
//
//         res.setEncoding('utf8');
//         let rawData = '';
//         res.on('data', (chunk) => { rawData += chunk; });
//         res.on('end', () => {
//             try {
//                 const parsedData = JSON.parse(rawData);
//                 response.end(rawData);
//             } catch (e) {
//                 console.error(e.message);
//             }
//         });
//     }).on('error', (e) => {
//         console.error(`Got error: ${e.message}`);
//     });
// });
//
// server.listen(port, (err) => {
//   if (err) {
//     return console.log('something bad happened', err)
//   }
//   console.log(`server is listening on ${port}`)
// })
