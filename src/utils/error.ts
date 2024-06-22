export class ApiError extends Error {
  public readonly status: number;
  public readonly isPublic: boolean;
  public readonly validationError: string;

  constructor(
    status: number,
    public readonly message: string,
    isPublic: boolean = true,
    validationError: string = "",
    stack = ""
  ) {
    super(message);
    Object.setPrototypeOf(this, ApiError.prototype);
    this.status = status;
    this.isPublic = isPublic;
    this.validationError = validationError;
    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}
