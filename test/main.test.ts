import axios from "axios";

test("Deve criar uma transação", async function () {
  const code = Math.floor(Math.random() * 1000);
  axios({
    url: "http://localhost:3000/transactions",
    method: "POST",
    data: {
      code,
      amount: 1000,
      numberInstallments: 12,
      paymentMethod: "credit_card",
    },
  });
});
