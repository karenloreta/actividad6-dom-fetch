const nombre = document.querySelector("#nombre");
const errorNombre = document.querySelector("#error-nombre");

nombre.addEventListener("input", () => {
  const valor = nombre.value.trim();

  if (valor === "") {
    errorNombre.textContent = "El nombre es obligatorio.";
    nombre.className = "invalido";
  } else if (valor.length < 3) {
    errorNombre.textContent = "Mínimo 3 caracteres.";
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
    errorEmail.textContent = "El correo es obligatorio.";
    email.className = "invalido";
  } else if (!formatoEmail.test(valor)) {
    errorEmail.textContent = "Escribe un correo válido (ej: ana@correo.com).";
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
    errorEdad.textContent = "La edad es obligatoria.";
    edad.className = "invalido";
  } else if (valor < 18 || valor > 99) {
    errorEdad.textContent = "La edad debe estar entre 18 y 99.";
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
    errorTelefono.textContent = "El teléfono es obligatorio.";
    telefono.className = "invalido";
  } else if (!/^\d{10}$/.test(valor)) {
    errorTelefono.textContent = "Debe tener exactamente 10 dígitos.";
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
    errorPassword.textContent = "La contraseña es obligatoria.";
    password.className = "invalido";
  } else if (valor.length < 8 || !/\d/.test(valor)) {
    errorPassword.textContent = "Mínimo 8 caracteres y al menos un número.";
    password.className = "invalido";
  } else {
    errorPassword.textContent = "";
    password.className = "valido";
  }

  if (confirmar.value !== "") {
    confirmar.dispatchEvent(new Event("input"));
  }
});

confirmar.addEventListener("input", () => {
  if (confirmar.value === "") {
    errorConfirmar.textContent = "Confirma tu contraseña.";
    confirmar.className = "invalido";
  } else if (confirmar.value !== password.value) {
    errorConfirmar.textContent = "Las contraseñas no coinciden.";
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

  campos.forEach((campo) => {
    campo.dispatchEvent(new Event("input"));
  });

  const todoValido = campos.every((campo) => campo.className === "valido");

  if (todoValido) {
    alert("¡Formulario enviado correctamente!");
  }
});
const inputCiudad = document.querySelector("#ciudad");
const btnBuscar = document.querySelector("#btn-buscar");
const resultado = document.querySelector("#resultado");

async function buscarClima() {
  const ciudad = inputCiudad.value.trim();

  if (ciudad === "") {
    resultado.innerHTML = "<p class='error-api'>Escribe el nombre de una ciudad.</p>";
    return;
  }

  resultado.innerHTML = "<p>Cargando...</p>";

  try {
    const resGeo = await fetch(
      `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(ciudad)}&count=1&language=es`
    );
    if (!resGeo.ok) {
      throw new Error("No se pudo buscar la ciudad.");
    }
    const datosGeo = await resGeo.json();

    if (!datosGeo.results) {
      throw new Error("No se encontró esa ciudad.");
    }
    const lugar = datosGeo.results[0];

    const resClima = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${lugar.latitude}&longitude=${lugar.longitude}&current=temperature_2m,relative_humidity_2m,wind_speed_10m&timezone=auto`
    );
    if (!resClima.ok) {
      throw new Error("No se pudo obtener el clima.");
    }
    const datosClima = await resClima.json();
    const actual = datosClima.current;

    resultado.innerHTML = `
      <div class="tarjeta">
        <h3>${lugar.name}, ${lugar.country}</h3>
        <p>🌡️ Temperatura: ${actual.temperature_2m} °C</p>
        <p>💧 Humedad: ${actual.relative_humidity_2m} %</p>
        <p>💨 Viento: ${actual.wind_speed_10m} km/h</p>
      </div>
    `;
  } catch (error) {
    const mensaje =
      error.message === "Failed to fetch"
        ? "Error de conexión. Revisa tu internet."
        : error.message;
    resultado.innerHTML = `<p class="error-api">${mensaje}</p>`;
  }
}

btnBuscar.addEventListener("click", buscarClima);