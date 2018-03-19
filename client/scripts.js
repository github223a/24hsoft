const URL = 'https://data-live.flightradar24.com/zones/fcgi/feed.js?bounds=56.84,55.27,33.48,41.48';
const xhr = new XMLHttpRequest();
const deg2rad = deg => deg * (Math.PI / 180);

class Fly {
  constructor() {
    this.data = {};
    this.flights = [];
    this.feet = 3.28084;
    this.domodedovo = ['55.410307', '37.902451'];
  }

  getDistance(lat1, lon1, lat2 = this.domodedovo[0], lon2 = this.domodedovo[1]) {
    const R = 6371;
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + 
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // km
  }

  clearFlights() {
    this.flights = [];
  }

  fetchData() {
    xhr.open('GET', URL, true);
    xhr.onreadystatechange = () => {
      if (xhr.readyState !== 4) {
        return;
      }
      if (xhr.status !== 200) {
        console.error(`status = ${xhr.status} : text = ${xhr.statusText}`);
      } else {
        try {
          this.data = JSON.parse(xhr.responseText);
        } catch (e) {
          console.error('error = ', e);
        }
      }
    };
    xhr.send();
  }

  render() {
    const table = document.getElementById('table');

    this.interval = setInterval(() => {
      this.fetchData();

      const dataKeys = Object.keys(this.data);
      dataKeys.forEach((id) => {
        if (id !== 'full_count' && id !== 'version') {
          const airData = this.data[id];
          const [, latitude, longitude, course, altitude, speed,,,,,,
            departureCode, destionationCode, flight] = airData;
          const height = (altitude / this.feet).toFixed(0);
          const flightData = {
            id,
            latitude,
            longitude,
            course,
            altitude: height,
            speed,
            departureCode,
            destionationCode,
            flight,
          };
          this.flights.push(flightData);
        }
      });
      this.flights.sort((a, b) => {
        const dist1 = this.getDistance(a.latitude, a.longitude);
        const dist2 = this.getDistance(b.latitude, b.longitude);
        return dist1 - dist2;
      });
      this.flights.forEach((flight) => {
        const flightRow = document.createElement('tr');
        const fields = Object.keys(flight);

        fields.forEach((field) => {
          if (field !== 'id') {
            const td = document.createElement('td');
            td.innerText = flight[field];
            flightRow.appendChild(td);
          }
        });
        flightRow.className = `flight flight-${flight.id}`;
        const lastRow = document.getElementsByClassName(`flight-${flight.id}`)[0];
        if (lastRow) {
          lastRow.parentNode.replaceChild(flightRow, lastRow);
        } else {
          table.appendChild(flightRow);
        }
      });
      this.clearFlights();
    }, 3000);
  }
}
const fly = new Fly();
fly.render();
