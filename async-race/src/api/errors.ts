export class ApiError extends Error {
  constructor(public status: number, text: string) {
    super(text);
  }
}
