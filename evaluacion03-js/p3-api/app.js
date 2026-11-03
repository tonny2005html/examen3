const inputCiudad = document.getElementById('ciudad');
const btnBuscar = document.getElementById('btn-buscar');
const btnMedir = document.getElementById('btn-medir');
const estado = document.getElementById('mensaje-estado');
const resultado = document.getElementById('resultado');

async function buscarCiudad(nombre) {
  const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(nombre)}&count=1&language=es`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Error al conectar con el servicio de geolocalización');
  const data = await res.json();

  if (!data.results || data.results.length === 0) {
    throw new Error(`No se encontró la ciudad: "${nombre}"`);
  }
  return data.results[0];
}

async function obtenerClima(lat, lon) {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,wind_speed_10m`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Error al consultar datos del clima');
  return await res.json();
}

btnBuscar.addEventListener('click', async () => {
  const ciudad = inputCiudad.value.trim();
  if (!ciudad) return;

  estado.textContent = 'Cargando...';
  estado.className = 'estado';
  btnBuscar.disabled = true;
  resultado.style.display = 'none';

  try {
    const geo = await buscarCiudad(ciudad);
    const clima = await obtenerClima(geo.latitude, geo.longitude);

    resultado.innerHTML = `
      <h3>${geo.name}, ${geo.admin1 || geo.country}</h3>
      <p><strong>Temperatura:</strong> ${clima.current.temperature_2m} °C</p>
      <p><strong>Viento:</strong> ${clima.current.wind_speed_10m} km/h</p>
    `;
    resultado.style.display = 'block';
    estado.textContent = '';
  } catch (err) {
    estado.textContent = err.message;
    estado.className = 'error';
  } finally {
    btnBuscar.disabled = false;
  }
});

btnMedir.addEventListener('click', async () => {
  const ciudades = ['Lima', 'Cusco', 'Arequipa'];
  estado.textContent = 'Midiendo tiempos... Revisa la consola o la alerta.';
  
  const t0 = performance.now();
  for (const c of ciudades) {
    const geo = await buscarCiudad(c);
    await obtenerClima(geo.latitude, geo.longitude);
  }
  const t1 = performance.now();
  const tiempoSecuencial = (t1 - t0).toFixed(2);

  const t2 = performance.now();
  await Promise.all(ciudades.map(async (c) => {
    const geo = await buscarCiudad(c);
    return await obtenerClima(geo.latitude, geo.longitude);
  }));
  const t3 = performance.now();
  const tiempoParalelo = (t3 - t2).toFixed(2);

  estado.textContent = '';
  alert(`Resultados de Mediciones:

Secuencial: ${tiempoSecuencial} ms
Paralelo (Promise.all): ${tiempoParalelo} ms`);
});
