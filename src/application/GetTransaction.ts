import pgp from "pg-promise";

type Output = {
  code: string;
  amount: number;
  numberInstallments: number;
  paymentMethod: string;
  installments: { number: number; amount: number }[];
};

export default class GetTransaction {
  constructor() {}

  async execute(code: string): Promise<Output> {
    const connection = pgp()("postgress://postgress:123456@localhost:5432/app");
    const transaction = await connection.one(
      "select * from branas.transaction where code = $1",
      [code]
    );
    transaction.amount = parseFloat(transaction.amount);
    transaction.paymentMethod = transaction.payment_method;
    const installments = await connection.query(
      "select * from branas.installment where code = $1",
      [code]
    );
    for (const installment of installments) {
      installment.amount = parseFloat(installment.amount);
    }
    transaction.installments = installments;
    await connection.$pool.end();
    return transaction;
  }
}
