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
      getAllTransactions();
    })
    .catch(function (error) {
      alert(`${error.response.data.msg}`);
      return;
    });
}

function getAllTransactions() {
  const transactionsTable = document.getElementById("transaction-table");
  const transactions = data.transactions;
  let transactionsHtml = ``;

  if (transactions.length) {
    transactions.forEach((transaction, index) => {
      transactionsHtml += `<tr scope="row" class="${transaction.id}">
                            <td>${new Date(transaction.date).toLocaleDateString(
                              "pt-br"
                            )}</td>
                            <td>${Intl.NumberFormat("pt-br", {
                              style: "currency",
                              currency: "BRL",
                            }).format(transaction.value)}</td>
                            <td>${
                              transaction.type === 1 ? "Entrada" : "Saída"
                            }</td>
                            <td class="d-flex justify-content-between relative">${
                              transaction.description
                            }
                              <div>
                                <button class="remove-transaction">
                                  <i id=${
                                    transaction.id
                                  } class="bi bi-trash-fill text-danger"></i>
                                </button>
                              </div>
                            </td>
                          </tr>`;
    });
  } else {
    transactionsHtml = `<td colspan="4">Não há registros de transações !</td>`;
  }

  transactionsTable.innerHTML = transactionsHtml;
  const buttonsRemoveTransaction = document.querySelectorAll(
    ".remove-transaction"
  );
  buttonsRemoveTransaction.forEach((button) =>
    button.addEventListener("click", (e) => {
      removeTransaction(e.target.id);
    })
  );
}

function removeTransaction(id) {
  axios
    .delete(`http://localhost:3333/transactions/${data.user.id}/${id}`, {
      headers: {
        email: data.user.email,
        password: data.user.password,
        "Content-Type": "application/json",
      },
    })
    .then(function (response) {
      alert("Transação removida com sucesso!");
      window.location.reload();
    })
    .catch(function (error) {
      alert(`${error.response.data.msg}`);

      return;
    });
}

checkLogged();

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
      getAllTransactions();
    })
    .catch(function (error) {
      alert(`${error.response.data.msg}`);

      return;
    });
}

function logout() {
  localStorage.removeItem("session");
  sessionStorage.removeItem("logged");
  window.location.href = "index.html";
}

document.getElementById("button-logout").addEventListener("click", logout);
