const myModal = new bootstrap.Modal("#add-transaction");
let logged = sessionStorage.getItem("logged");
const userSession = localStorage.getItem("session");
let data = {
  transactions: [],
};

function checkLogged() {
  if (userSession) {
    sessionStorage.setItem("logged", userSession);
    logged = userSession;
  }

  if (userSession === null && logged === null) {
    window.location.href = "index.html";
  }

  const dataString = sessionStorage.getItem("logged");
  data.user = JSON.parse(dataString);

  axios
    .get(`http://localhost:3333/transactions/${data.user.id}`, {
      headers: {
        email: data.user.email,
        password: data.user.password,
      },
    })
    .then(function (response) {
      data.transactions = response.data.data;
    })
    .then(function (response) {
      getCashIn();
      getCashOut();
      getTotal();
    })
    .catch(function (error) {
      alert(`${error.response.data.msg}`);
      window.location.href = "index.html";
    });
}

checkLogged();

document.getElementById("button-logout").addEventListener("click", logout);
document.getElementById("transaction-button").addEventListener("click", () => {
  window.location.href = "transactions.html";
});

function logout() {
  localStorage.removeItem("session");
  sessionStorage.removeItem("logged");
  window.location.href = "index.html";
}

document.getElementById("transaction-form").addEventListener("submit", (e) => {
  e.preventDefault();

  const date = document.getElementById("date-transaction-input").value;
  const value = parseFloat(
    document.getElementById("value-transaction-input").value
  );
  const type = document.querySelector('input[name="type-input"]:checked').value;
  const description = document.getElementById(
    "description-transaction-input"
  ).value;

  addNewTransaction(date, value, type, description);

  myModal.hide();
  e.target.reset();

  window.location.reload();
});

function addNewTransaction(date, value, type, description) {
  axios
    .post(
      `http://localhost:3333/transactions/${data.user.id}`,
      { description, type, value, date },
      {
        headers: {
          email: data.user.email,
          password: data.user.password,
          "Content-Type": "application/json",
        },
      }
    )
    .then(function (response) {
      alert("Transação adicionada com sucesso!");
      getCashIn();
      getCashOut();
      getTotal();
    })
    .catch(function (error) {
      alert(`${error.response.data.msg}`);

      return;
    });
}

function getCashIn() {
  const cashInList = document.getElementById("cash-in-list");
  const transactions = data.transactions;

  const cashIn = transactions.filter((transaction) => transaction.type === 1);

  if (cashIn.length) {
    let cashHtml = ``;
    let limit = 0;

    if (cashIn.length > 5) {
      limit = 5;
    } else {
      limit = cashIn.length;
    }

    for (let i = 0; i < limit; i++) {
      cashHtml += `<div class="row pe-5">
                    <div class="col">
                      <span class="fs-2 fw-semibold">${Intl.NumberFormat(
                        "pt-br",
                        {
                          style: "currency",
                          currency: "BRL",
                        }
                      ).format(cashIn[i].value)}</span>
                      <div
                        class="container"
                      >
                        <div class="row">
                          <div class="col-12 col-sm-6 p-0">
                            <span class="fw-medium">${
                              cashIn[i].description
                            }</span>
                          </div>
                          <div class="col-12 col-sm-6 p-0">
                            <span class="fw-medium">${new Date(
                              cashIn[i].date
                            ).toLocaleDateString("pt-br")}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>`;
    }
    cashInList.innerHTML = cashHtml;
  }
}

function getCashOut() {
  const cashOutList = document.getElementById("cash-out-list");
  const transactions = data.transactions;
  const cashOut = transactions.filter((transaction) => transaction.type === 2);

  if (cashOut.length) {
    let cashHtml = ``;
    let limit = 0;

    if (cashOut.length > 5) {
      limit = 5;
    } else {
      limit = cashOut.length;
    }

    for (let i = 0; i < limit; i++) {
      cashHtml += `<div class="row pe-5">
                    <div class="col">
                      <span class="fs-2 fw-semibold">${Intl.NumberFormat(
                        "pt-br",
                        {
                          style: "currency",
                          currency: "BRL",
                        }
                      ).format(cashOut[i].value)}</span>
                      <div
                        class="container"
                      >
                        <div class="row">
                          <div class="col-12 col-sm-6 p-0">
                            <span class="fw-medium">${
                              cashOut[i].description
                            }</span>
                          </div>
                          <div class="col-12 col-sm-6 p-0">
                            <span class="fw-medium">${new Date(
                              cashOut[i].date
                            ).toLocaleDateString("pt-br")}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>`;
    }
    cashOutList.innerHTML = cashHtml;
  }
}

function getTotal() {
  const transactions = data.transactions;
  let total = 0;

  transactions.forEach((transactions) => {
    if (transactions.type === 1) {
      total += Number(transactions.value);
    } else {
      total -= Number(transactions.value);
    }
  });

  document.getElementById("total").innerHTML = `${Intl.NumberFormat("pt-br", {
    style: "currency",
    currency: "BRL",
  }).format(total)}`;
}
