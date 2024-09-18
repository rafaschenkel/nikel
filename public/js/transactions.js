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

  getAllTransactions();
}

function getAllTransactions() {
  const transactionsTable = document.getElementById("transaction-table");
  const transactions = data.transactions;
  let transactionsHtml = ``;

  if (transactions.length) {
    transactions.forEach((transactions, index) => {
      transactionsHtml += `<tr>
                            <th scope="row">${transactions.date}</th>
                              <td>R$ ${transactions.value
                                .toFixed(2)
                                .replace(".", ",")}</td>
                              <td>${
                                transactions.type === "1" ? "Entrada" : "Saída"
                              }</td>
                              <td>${transactions.description}</td>
                              <td><button id="${
                                "index-" + index
                              }" class="remove-transaction"><i class="bi bi-trash-fill text-danger"></i></button></td>
                            </tr>
                            
                          `;
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
      const id = e.target.id.replace("index-", "");
      removeTransaction(id);
    })
  );
}

function removeTransaction(id) {
  const newTransactions = data.transactions.filter(
    (transaction, index) => index != id
  );
  data.transactions = newTransactions;

  saveData(data);

  getAllTransactions();
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

  data.transactions.unshift({
    date,
    value,
    type,
    description,
  });

  saveData(data);

  getAllTransactions();
  myModal.hide();
  e.target.reset();

  alert("Lançamento adicionado com sucesso!");
});

function saveData(data) {
  localStorage.setItem(data.email, JSON.stringify(data));
}

function logout() {
  localStorage.removeItem("session");
  sessionStorage.removeItem("logged");
  window.location.href = "index.html";
}

document.getElementById("button-logout").addEventListener("click", logout);
