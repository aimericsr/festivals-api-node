import { ErrorType, ErrorValidation, ErrorResponse } from './ErrorType';

export class CustomError extends Error {
  private httpStatusCode: number;
  private errorType: ErrorType;
  private errorsValidation: ErrorValidation[] | null;

  constructor(
    httpStatusCode: number,
    errorType: ErrorType,
    errorMessage: string,
    errorsValidation: ErrorValidation[] | null = null,
  ) {
    super(errorMessage);
    this.httpStatusCode = httpStatusCode;
    this.errorType = errorType;
    this.errorsValidation = errorsValidation;
  }

  get HttpStatusCode() {
    return this.httpStatusCode;
  }

  get JSON(): ErrorResponse {
    return {
      errorType: this.errorType,
      errorMessage: this.message,
      errorsValidation: this.errorsValidation
    };
  }
}
