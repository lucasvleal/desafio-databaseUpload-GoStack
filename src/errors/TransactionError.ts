class TransactionError {
  public readonly error: string;

  public readonly statusCode: number;

  constructor(message: string, statusCode = 400) {
    this.error = message;
    this.statusCode = statusCode;
  }
}

export default TransactionError;
