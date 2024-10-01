// CRIAR CONTA

const myModal = new bootstrap.Modal("#register-modal");
let logged = sessionStorage.getItem("logged");
const userSession = localStorage.getItem("session");

document.getElementById("register-form").addEventListener("submit", (e) => {
  e.preventDefault();

  const email = document.getElementById("email-create-input").value;
  const password = document.getElementById("password-create-input").value;

  if (!validaDados(email, password)) return;

  axios
    .post("http://localhost:3333/user", {
      email,
      password,
    })
    .then(function (response) {
      myModal.hide();
      e.target.reset();
      alert("Conta criada com sucesso!");
    })
    .catch(function (error) {
      alert(error.response.msg);
    });
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

// ==============================================================

// LOGIN

function checkLogged() {
  if (userSession) {
    sessionStorage.setItem("logged", userSession);
    logged = userSession;
  }

  if (logged) {
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
  axios
    .post("http://localhost:3333/login", {
      email,
      password,
    })
    .then(function (response) {
      saveSession(response.data.data, checkSession);

      window.location.href = "home.html";
    })
    .catch(function (error) {
      alert(`${error.response.data.msg}`);
      return;
    });
}

function saveSession(data, checkSession) {
  if (checkSession) {
    localStorage.setItem("session", JSON.stringify(data));
  }

  sessionStorage.setItem("logged", JSON.stringify(data));
}
