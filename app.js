const DATA_URL = 'data.json';
const REFRESH_INTERVAL = 5;

const tableBody      = document.getElementById('sensor-body');
const countdownEl    = document.getElementById('countdown');
const totalCountEl   = document.getElementById('total-count');
const onlineCountEl  = document.getElementById('online-count');
const offlineCountEl = document.getElementById('offline-count');
const lastUpdateEl   = document.getElementById('last-update');

async function fetchSensorData() {
  try {
    const response = await fetch(DATA_URL);
    const data = await response.json();
    renderTable(data);
    updateStats(data);
  } catch (error) {
    tableBody.innerHTML = `<tr><td colspan="5" style="color:red;text-align:center;padding:20px;">Error loading data: ${error.message}</td></tr>`;
  }
}

function renderTable(sensors) {
  tableBody.innerHTML = sensors.map(sensor => `
    <tr>
      <td><strong>${sensor.id}</strong></td>
      <td>${sensor.name}</td>
      <td><strong>${sensor.value}</strong></td>
      <td>${sensor.unit}</td>
      <td><span class="badge-${sensor.status}">${sensor.status === 'online' ? '● Online' : '○ Offline'}</span></td>
    </tr>
  `).join('');
}

function updateStats(sensors) {
  const online  = sensors.filter(s => s.status === 'online').length;
  const offline = sensors.filter(s => s.status === 'offline').length;
  totalCountEl.textContent   = sensors.length;
  onlineCountEl.textContent  = online;
  offlineCountEl.textContent = offline;
  lastUpdateEl.textContent   = new Date().toLocaleTimeString();
}

let countdown = REFRESH_INTERVAL;

function startCountdown() {
  countdown = REFRESH_INTERVAL;
  countdownEl.textContent = `Refreshing in ${countdown}s...`;
  const timer = setInterval(() => {
    countdown--;
    if (countdown > 0) {
      countdownEl.textContent = `Refreshing in ${countdown}s...`;
    } else {
      countdownEl.textContent = 'Refreshing...';
      clearInterval(timer);
    }
  }, 1000);
}

fetchSensorData();
startCountdown();

setInterval(() => {
  fetchSensorData();
  startCountdown();
}, REFRESH_INTERVAL * 1000);
