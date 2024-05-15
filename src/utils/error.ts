export class ApiError extends Error {
  public readonly status: number;
  public readonly isPublic: boolean;
  public readonly validationError: string;

  constructor(public readonly message: string, status: number, isPublic: boolean, validationError: string = "") {
    super(message);
    Object.setPrototypeOf(this, ApiError.prototype);
    this.status = status;
    this.isPublic = isPublic;
    this.validationError = validationError;
  }
}

export function createApiError(
  status: number,
  message: string,
  isPublic: boolean = true,
  validationError?: string
): ApiError {
  return new ApiError(message, status, isPublic, validationError);
}
