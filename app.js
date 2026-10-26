// ---------- Sign up form: real-time validation ----------

const nombre = document.querySelector("#nombre");
const errorNombre = document.querySelector("#error-nombre");

nombre.addEventListener("input", () => {
  const valor = nombre.value.trim();

  if (valor === "") {
    errorNombre.textContent = "Name is required.";
    nombre.className = "invalido";
  } else if (valor.length < 3) {
    errorNombre.textContent = "At least 3 characters.";
    nombre.className = "invalido";
  } else {
    errorNombre.textContent = "";
    nombre.className = "valido";
  }
});

const email = document.querySelector("#email");
const errorEmail = document.querySelector("#error-email");

email.addEventListener("input", () => {
  const valor = email.value.trim();
  const formatoEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (valor === "") {
    errorEmail.textContent = "Email is required.";
    email.className = "invalido";
  } else if (!formatoEmail.test(valor)) {
    errorEmail.textContent = "Enter a valid email (e.g., ana@email.com).";
    email.className = "invalido";
  } else {
    errorEmail.textContent = "";
    email.className = "valido";
  }
});

const edad = document.querySelector("#edad");
const errorEdad = document.querySelector("#error-edad");

edad.addEventListener("input", () => {
  const valor = Number(edad.value);

  if (edad.value === "") {
    errorEdad.textContent = "Age is required.";
    edad.className = "invalido";
  } else if (valor < 18 || valor > 99) {
    errorEdad.textContent = "Age must be between 18 and 99.";
    edad.className = "invalido";
  } else {
    errorEdad.textContent = "";
    edad.className = "valido";
  }
});

const telefono = document.querySelector("#telefono");
const errorTelefono = document.querySelector("#error-telefono");

telefono.addEventListener("input", () => {
  const valor = telefono.value.trim();

  if (valor === "") {
    errorTelefono.textContent = "Phone is required.";
    telefono.className = "invalido";
  } else if (!/^\d{10}$/.test(valor)) {
    errorTelefono.textContent = "It must have exactly 10 digits.";
    telefono.className = "invalido";
  } else {
    errorTelefono.textContent = "";
    telefono.className = "valido";
  }
});

const password = document.querySelector("#password");
const errorPassword = document.querySelector("#error-password");
const confirmar = document.querySelector("#confirmar");
const errorConfirmar = document.querySelector("#error-confirmar");

password.addEventListener("input", () => {
  const valor = password.value;

  if (valor === "") {
    errorPassword.textContent = "Password is required.";
    password.className = "invalido";
  } else if (valor.length < 8 || !/\d/.test(valor)) {
    errorPassword.textContent = "At least 8 characters and one number.";
    password.className = "invalido";
  } else {
    errorPassword.textContent = "";
    password.className = "valido";
  }

  // Re-check the confirm field when the password changes
  if (confirmar.value !== "") {
    confirmar.dispatchEvent(new Event("input"));
  }
});

confirmar.addEventListener("input", () => {
  if (confirmar.value === "") {
    errorConfirmar.textContent = "Confirm your password.";
    confirmar.className = "invalido";
  } else if (confirmar.value !== password.value) {
    errorConfirmar.textContent = "Passwords do not match.";
    confirmar.className = "invalido";
  } else {
    errorConfirmar.textContent = "";
    confirmar.className = "valido";
  }
});

const formulario = document.querySelector("#formulario");

formulario.addEventListener("submit", (e) => {
  e.preventDefault();

  const campos = [nombre, email, edad, telefono, password, confirmar];

  // Run every validation before sending
  campos.forEach((campo) => {
    campo.dispatchEvent(new Event("input"));
  });

  const todoValido = campos.every((campo) => campo.className === "valido");

  if (todoValido) {
    alert("Form submitted successfully!");
  }
});

// ---------- City weather: validation + async/await with fetch ----------

const inputCiudad = document.querySelector("#ciudad");
const mensajeCiudad = document.querySelector("#mensaje-ciudad");
const btnBuscar = document.querySelector("#btn-buscar");
const resultado = document.querySelector("#resultado");

// Real-time validation for the city field
inputCiudad.addEventListener("input", () => {
  if (inputCiudad.value.trim().length < 3) {
    mensajeCiudad.textContent = "Type at least 3 letters";
    mensajeCiudad.className = "error";
    inputCiudad.className = "invalido";
  } else {
    mensajeCiudad.textContent = "Looks good";
    mensajeCiudad.className = "ok";
    inputCiudad.className = "valido";
  }
});

// Get the weather: async function that uses await fetch
async function buscarClima() {
  const ciudad = inputCiudad.value.trim();

  if (ciudad.length < 3) {
    mensajeCiudad.textContent = "Type at least 3 letters";
    mensajeCiudad.className = "error";
    inputCiudad.className = "invalido";
    return;
  }

  resultado.innerHTML = "<p>Loading…</p>";

  try {
    // Step 1: find the coordinates of the city
    const resGeo = await fetch(
      `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(ciudad)}&count=1&language=en`
    );
    if (!resGeo.ok) {
      throw new Error("Could not search the city.");
    }
    const datosGeo = await resGeo.json();

    if (!datosGeo.results) {
      throw new Error("City not found");
    }
    const lugar = datosGeo.results[0];

    // Step 2: get the current weather with those coordinates
    const resClima = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${lugar.latitude}&longitude=${lugar.longitude}&current=temperature_2m,relative_humidity_2m,wind_speed_10m&timezone=auto`
    );
    if (!resClima.ok) {
      throw new Error("Could not get the weather.");
    }
    const datosClima = await resClima.json();
    const actual = datosClima.current;

    // Render the data in the DOM
    resultado.innerHTML = `
      <div class="tarjeta">
        <h3>${lugar.name}, ${lugar.country}</h3>
        <p>🌡️ Temperature: ${actual.temperature_2m} °C</p>
        <p>💧 Humidity: ${actual.relative_humidity_2m} %</p>
        <p>💨 Wind: ${actual.wind_speed_10m} km/h</p>
      </div>
    `;
  } catch (error) {
    // Show a clear error message in the page
    const mensaje =
      error.message === "Failed to fetch"
        ? "Connection error. Check your internet."
        : error.message;
    resultado.innerHTML = `<p class="error-api">${mensaje}</p>`;
  }
}

btnBuscar.addEventListener("click", buscarClima);