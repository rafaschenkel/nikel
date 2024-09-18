// CRIAR CONTA

const myModal = new bootstrap.Modal("#register-modal");
let logged = sessionStorage.getItem("logged");
const userSession = localStorage.getItem("session");

document.getElementById("register-form").addEventListener("submit", (e) => {
  e.preventDefault();

  const email = document.getElementById("email-create-input").value;
  const password = document.getElementById("password-create-input").value;

  if (!validaDados(email, password)) return;

  saveAccount({
    email,
    password,
    transactions: [],
  });

  myModal.hide();
  e.target.reset();
  alert("Conta criada com sucesso!");
});

function validaDados(email, password) {
  if (email.length < 5) {
    alert("Preencha o campo com um e-mail válido.");
    return false;
  }

  if (password.length < 4) {
    alert("A senha deve conter no mínimo 4 caracteres.");
    return false;
  }

  return true;
}

function saveAccount(data) {
  localStorage.setItem(data.email, JSON.stringify(data));
}

// ==============================================================

// LOGIN

function checkLogged() {
  if (userSession) {
    sessionStorage.setItem("logged", userSession);
    logged = userSession;
  }

  if (logged) {
    saveSession(logged, userSession);
    window.location.href = "home.html";
  }
}

checkLogged();

document.getElementById("login-form").addEventListener("submit", (e) => {
  e.preventDefault();

  const email = document.getElementById("email-login-input").value;
  const password = document.getElementById("password-login-input").value;
  const checkSession = document.getElementById("check-login-input").checked;

  login(email, password, checkSession);
});

function login(email, password, checkSession) {
  const data = getAccount(email);
  if (data == "") {
    alert("Verifique o e-mail ou a senha informada!");
    return;
  }
  if (data.password !== password) {
    alert("Verifique o e-mail ou a senha informada!");
    return;
  }

  saveSession(email, checkSession);

  window.location.href = "home.html";
}

function saveSession(data, checkSession) {
  if (checkSession) {
    localStorage.setItem("session", data);
  }

  sessionStorage.setItem("logged", data);
}

function getAccount(key) {
  const data = localStorage.getItem(key);
  if (!data) {
    return "";
  }

  return JSON.parse(data);
}
