import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [name, setName] = useState("");
  const [datetime, setDatetime] = useState("");
  const [description, setDescription] = useState("");
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    getTransactions().then(setTransactions);
  }, []);

  async function getTransactions() {
    const url = process.env.REACT_APP_API_URL + "/transactions";
    const response = await fetch(url);

    return await response.json();
  }

  function addNewTransaction(ev) {
    ev.preventDefault();
    // console.log(JSON.stringify({ name, description, datetime }));
    const url = process.env.REACT_APP_API_URL + "/transaction";

    const price = name.split(" ")[0];

    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        price,
        name: name.substring(price.length + 1),
        description,
        datetime,
      }),
    })
      .then((response) => {
        // console.log("response status:", response.status);
        response.text().then((text) => {
          // console.log("response text:", text);
          setName("");
          setDescription("");
          setDatetime("");
          try {
            const json = JSON.parse(text);
            console.log("result", json);
          } catch (e) {
            console.error("Error parsing JSON:", e);
          }
        });
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }

  let balance = 0;
  for (let transaction of transactions) {
    balance = balance + transaction.price;
  }

  return (
    <div className="App">
      <h1>
        ${balance}
        <span>.00</span>
      </h1>
      <form onSubmit={addNewTransaction}>
        <div className="basic">
          <input
            type="text"
            value={name}
            onChange={(ev) => setName(ev.target.value)}
            placeholder="+200 new samsung TV"
          />
          <input
            type="datetime-local"
            value={datetime}
            onChange={(ev) => setDatetime(ev.target.value)}
          />
        </div>
        <div className="description">
          <input
            type="text"
            value={description}
            onChange={(ev) => setDescription(ev.target.value)}
            placeholder="description"
          />
        </div>
        <button type="submit">Add New Transaction</button>
      </form>
      <div className="transactions">
        {transactions.length > 0 &&
          transactions.map((transaction) => {
            return (
              <div className="transaction" key={transaction._id}>
                <div className="left">
                  <div className="name">{transaction.name}</div>
                  <div className="description">{transaction.description}</div>
                </div>
                <div className="right">
                  <div
                    className={
                      "price " + (transaction.price < 0 ? "red" : "green")
                    }
                  >
                    {transaction.price}
                  </div>
                  <div className="datetime">{transaction.datetime}</div>
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
}

export default App;
