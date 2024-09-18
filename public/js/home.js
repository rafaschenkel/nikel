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

  if (!logged) {
    window.location.href = "index.html";
    return;
  }

  const dataUser = localStorage.getItem(logged);
  if (dataUser) {
    data = JSON.parse(dataUser);
  }

  getCashIn();
  getCashOut();
  getTotal();
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

  data.transactions.unshift({
    date,
    value,
    type,
    description,
  });

  saveData(data);

  myModal.hide();
  e.target.reset();

  alert("Lançamento adicionado com sucesso!");

  getCashIn();
  getCashOut();
  getTotal();
});

function saveData(data) {
  localStorage.setItem(data.email, JSON.stringify(data));
}

function getCashIn() {
  const cashInList = document.getElementById("cash-in-list");
  const transactions = data.transactions;
  const cashIn = transactions.filter((transaction) => transaction.type === "1");

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
                      <span class="fs-2 fw-semibold">R$ ${cashIn[i].value
                        .toFixed(2)
                        .replace(".", ",")}</span>
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
                            <span class="fw-medium">${cashIn[i].date}</span>
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
  const cashOut = transactions.filter(
    (transaction) => transaction.type === "2"
  );

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
                      <span class="fs-2 fw-semibold">R$ ${cashOut[i].value
                        .toFixed(2)
                        .replace(".", ",")}</span>
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
                            <span class="fw-medium">${cashOut[i].date}</span>
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
    if (transactions.type === "1") {
      total += transactions.value;
    } else {
      total -= transactions.value;
    }
  });

  document.getElementById("total").innerHTML = `R$ ${total
    .toFixed(2)
    .replace(".", ",")}`;
}
