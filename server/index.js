const express = require("express");
const app = express();
const cors = require("cors");
const port = 3042;

app.use(cors());
app.use(express.json());

const balances = {
  "03bd92bb70b67aaacfe358d77a06d4cb3c1d722ad4ec79f4f3fb197aea0c1aa1e2": 100,
  "03719c2a484e8e5803e2efc74734439573d61cf8c6babc6b48f66f078d6b820224": 50,
  "27759bbfdd408ffb869d0ac21771e9d7a3c15e915caf7ff8b7d09b15b2df005c9": 75,
};

app.get("/balance/:address", (req, res) => {
  const { address } = req.params;
  const balance = balances[address] || 0;
  res.send({ balance });
});

app.post("/send", (req, res) => {

  //TODO: GET A SIGNATURE FROM THE CLIENT-SIDE APPLICATION
  //RECOVER THE PUBLIC ADDRESS FROM THE SIGNATURE
  const { sender, recipient, amount } = req.body;

  setInitialBalance(sender);
  setInitialBalance(recipient);

  if (balances[sender] < amount) {
    res.status(400).send({ message: "Not enough funds!" });
  } else {
    balances[sender] -= amount;
    balances[recipient] += amount;
    res.send({ balance: balances[sender] });
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});

function setInitialBalance(address) {
  if (!balances[address]) {
    balances[address] = 0;
  }
}
