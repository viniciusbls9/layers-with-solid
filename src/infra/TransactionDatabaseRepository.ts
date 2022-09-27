import pgp from "pg-promise";
import Installment from "../domain/entity/Installment";

import Transaction from "../domain/entity/Transaction";
import TransactionRepository from "../domain/repository/TransactionRepository";
import Connection from "./database/Connection";

export default class TransactionDatabaseRepository
  implements TransactionRepository
{
  constructor(readonly connection: Connection) {}

  async save(transaction: Transaction): Promise<void> {
    const connection = pgp()("postgress://postgress:123456@localhost:5432/app");
    await connection.query(
      "insert into branas.transaction (code, amount, number_installments, payment_method) values $1, $2, $3, $4)",
      [
        transaction.code,
        transaction.amount,
        transaction.numberInstallments,
        transaction.paymentMethod,
      ]
    );

    for (const installment of transaction.installments) {
      await connection.query(
        "insert into branas.installment (code, number, amount) values $1, #2, $3",
        [transaction.code, installment.number, installment.amount]
      );
    }

    await connection.$pool.end();
  }

  async get(code: string): Promise<Transaction> {
    const connection = pgp()("postgress://postgress:123456@localhost:5432/app");
    const transactionData = await connection.one(
      "select * from branas.transaction where code = $1",
      [code]
    );
    const transaction = new Transaction(
      transactionData.code,
      parseFloat(transactionData.amount),
      transactionData.number_installments,
      transactionData.payment_method
    );

    const installmentsData = await connection.query(
      "select * from branas.installment where code = $1",
      [code]
    );
    for (const installmentData of installmentsData) {
      const installment = new Installment(
        installmentData.number,
        parseFloat(transactionData.amount)
      );
      transaction.installments.push(installment);
    }
    await connection.$pool.end();
    return transaction;
  }
}
