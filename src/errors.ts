export class WelcomeCardError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'WelcomeCardError';
  }
}
