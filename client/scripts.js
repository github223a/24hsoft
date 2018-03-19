const domodedovo = ['55.410307', '37.902451'];
const deg2rad = deg => deg * (Math.PI / 180);

const getDistance = (lat1, lon1, lat2 = domodedovo[0], lon2 = domodedovo[1]) => {
  const R = 6371;
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // km
};

const tableHeadersNames = {
  latitude: 'Широта',
  longitude: 'Долгота',
  course: 'Курс(град)',
  altitude: 'Высота полета(м)',
  speed: 'Скорость(км/ч)',
  'departure-code': 'Код вылета',
  'destination-code': 'Код назначения',
  flight: 'Номер рейса',
};

const xhr = new XMLHttpRequest();
setInterval(() => {
  xhr.open('GET', 'https://data-live.flightradar24.com/zones/fcgi/feed.js', true);
  xhr.onreadystatechange = () => {
    if (xhr.readyState !== 4) {
      return;
    }
    if (xhr.status !== 200) {
      console.log(`status = ${xhr.status} : text = ${xhr.statusText}`);
    } else {
      const data = JSON.parse(xhr.responseText);
      const root = document.getElementById('root');
      const table = document.createElement('table');
      const tableHeader = document.createElement('caption');
      const tableHeaders = document.createElement('tr');
      const lastTable = document.getElementById('table');
      const flights = [];

      if (lastTable) {
        lastTable.parentNode.removeChild(lastTable);
      }
      table.setAttribute('id', 'table');
      tableHeader.className = 'table__main-header';
      tableHeader.innerText = 'Данные';
      tableHeaders.className = 'table__headers';

      table.appendChild(tableHeader);
      table.appendChild(tableHeaders);
      root.appendChild(table);
      const keys = Object.keys(tableHeadersNames);
      keys.forEach((key) => {
        const th = document.createElement('th');
        th.className = `table__headers table__headers_${key}`;
        th.innerText = tableHeadersNames[key];
        tableHeaders.appendChild(th);
      });
      const dataKeys = Object.keys(data);
      dataKeys.forEach((key) => {
        if (key !== 'full_count' && key !== 'version') {
          const airData = data[key];
          const [, latitude, longitude, course, altitude, speed,,,,,,
            departureCode, destionationCode, flight] = airData;
          const flightData = {
            latitude, longitude, course, altitude, speed, departureCode, destionationCode, flight,
          };
          flights.push(flightData);
        }
      });
      flights.sort((a, b) => {
        const dist1 = getDistance(a.latitude, a.longitude);
        const dist2 = getDistance(b.latitude, b.longitude);
        return dist1 - dist2;
      });
      flights.forEach((flight) => {
        const flightRow = document.createElement('tr');
        const fields = Object.keys(flight);

        fields.forEach((field) => {
          const td = document.createElement('td');
          td.innerText = flight[field];
          flightRow.appendChild(td);
        });
        flightRow.className = `flight flight-${flight}`;
        table.appendChild(flightRow);
      });
    }
  };
  xhr.send();
}, 3000);

// for (let key in tableHeadersNames) {
//   const th = document.createElement('th');
//     th.className = `table__headers table__headers_${key}`;
//     th.innerText = tableHeadersNames[key];
//     tableHeaders.appendChild(th);
// }

// for (let key in data) {
//   if (key !== 'full_count' && key !== 'version') {
//     const airData = data[key];
//     const [, latitude, longitude, course, altitude, speed,,,,,,
//         departureCode, destionationCode, flight ] = airData;
//     const flightData = {
//         latitude, longitude, course,
//         altitude, speed, departureCode,
//         destionationCode, flight
//     };
//     flights.push(flightData);
//   }
// }

// for (let field in flight) {
//   const td = document.createElement('td');
//   td.innerText = flight[field];
//   flightRow.appendChild(td);
// }

// for (let flight of flights) {
//   const flightRow = document.createElement('tr');
//   for (let field in flight) {
//     const td = document.createElement('td');
//     td.innerText = flight[field];
//     flightRow.appendChild(td);
//   }
//   flightRow.className = `flight flight-${flight}`;
//   table.appendChild(flightRow);
//   }
// }
