import { ConvertUtcToLocalDatePipe } from './convert-utc-to-local-date.pipe';

describe('ConvertUtcToLocalDatePipe', () => {
  it('create an instance', () => {
    const pipe = new ConvertUtcToLocalDatePipe();
    expect(pipe).toBeTruthy();
  });
});
