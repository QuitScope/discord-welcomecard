import { describe, it, expect } from 'vitest';
import { WelcomeCardError } from '../src/errors.js';

describe('WelcomeCardError', () => {
  it('is an Error with the given message and name', () => {
    const err = new WelcomeCardError('missing username');
    expect(err).toBeInstanceOf(Error);
    expect(err.name).toBe('WelcomeCardError');
    expect(err.message).toBe('missing username');
  });
});
