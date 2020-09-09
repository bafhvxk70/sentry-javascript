import { Dsn } from '../src/dsn';
import { BeidouError } from '../src/error';

describe('Dsn', () => {
  describe('fromComponents', () => {
    test('applies all components', () => {
      const dsn = new Dsn({
        host: 'beidou.io',
        pass: 'xyz',
        port: '1234',
        projectId: '123',
        protocol: 'https',
        user: 'abc',
      });
      expect(dsn.protocol).toBe('https');
      expect(dsn.user).toBe('abc');
      expect(dsn.pass).toBe('xyz');
      expect(dsn.host).toBe('beidou.io');
      expect(dsn.port).toBe('1234');
      expect(dsn.path).toBe('');
      expect(dsn.projectId).toBe('123');
    });

    test('applies partial components', () => {
      const dsn = new Dsn({
        host: 'beidou.io',
        projectId: '123',
        protocol: 'https',
        user: 'abc',
      });
      expect(dsn.protocol).toBe('https');
      expect(dsn.user).toBe('abc');
      expect(dsn.pass).toBe('');
      expect(dsn.host).toBe('beidou.io');
      expect(dsn.port).toBe('');
      expect(dsn.path).toBe('');
      expect(dsn.projectId).toBe('123');
    });

    test('throws for missing components', () => {
      expect(
        () =>
          new Dsn({
            host: '',
            projectId: '123',
            protocol: 'https',
            user: 'abc',
          }),
      ).toThrow(BeidouError);
      expect(
        () =>
          new Dsn({
            host: 'beidou.io',
            projectId: '',
            protocol: 'https',
            user: 'abc',
          }),
      ).toThrow(BeidouError);
      expect(
        () =>
          new Dsn({
            host: 'beidou.io',
            projectId: '123',
            protocol: '' as 'http', // Trick the type checker here
            user: 'abc',
          }),
      ).toThrow(BeidouError);
      expect(
        () =>
          new Dsn({
            host: 'beidou.io',
            projectId: '123',
            protocol: 'https',
            user: '',
          }),
      ).toThrow(BeidouError);
    });

    test('throws for invalid components', () => {
      expect(
        () =>
          new Dsn({
            host: 'beidou.io',
            projectId: '123',
            protocol: 'httpx' as 'http', // Trick the type checker here
            user: 'abc',
          }),
      ).toThrow(BeidouError);
      expect(
        () =>
          new Dsn({
            host: 'beidou.io',
            port: 'xxx',
            projectId: '123',
            protocol: 'https',
            user: 'abc',
          }),
      ).toThrow(BeidouError);
    });
  });

  describe('fromString', () => {
    test('parses a valid full Dsn', () => {
      const dsn = new Dsn('https://abc:xyz@beidou.io:1234/123');
      expect(dsn.protocol).toBe('https');
      expect(dsn.user).toBe('abc');
      expect(dsn.pass).toBe('xyz');
      expect(dsn.host).toBe('beidou.io');
      expect(dsn.port).toBe('1234');
      expect(dsn.path).toBe('');
      expect(dsn.projectId).toBe('123');
    });

    test('parses a valid partial Dsn', () => {
      const dsn = new Dsn('https://abc@beidou.io/123/321');
      expect(dsn.protocol).toBe('https');
      expect(dsn.user).toBe('abc');
      expect(dsn.pass).toBe('');
      expect(dsn.host).toBe('beidou.io');
      expect(dsn.port).toBe('');
      expect(dsn.path).toBe('123');
      expect(dsn.projectId).toBe('321');
    });

    test('with a long path', () => {
      const dsn = new Dsn('https://abc@beidou.io/beidou/custom/installation/321');
      expect(dsn.protocol).toBe('https');
      expect(dsn.user).toBe('abc');
      expect(dsn.pass).toBe('');
      expect(dsn.host).toBe('beidou.io');
      expect(dsn.port).toBe('');
      expect(dsn.path).toBe('beidou/custom/installation');
      expect(dsn.projectId).toBe('321');
    });

    test('with a query string', () => {
      const dsn = new Dsn('https://abc@beidou.io/321?sample.rate=0.1&other=value');
      expect(dsn.protocol).toBe('https');
      expect(dsn.user).toBe('abc');
      expect(dsn.pass).toBe('');
      expect(dsn.host).toBe('beidou.io');
      expect(dsn.port).toBe('');
      expect(dsn.path).toBe('');
      expect(dsn.projectId).toBe('321');
    });

    test('throws when provided invalid Dsn', () => {
      expect(() => new Dsn('some@random.dsn')).toThrow(BeidouError);
    });

    test('throws without mandatory fields', () => {
      expect(() => new Dsn('://abc@beidou.io/123')).toThrow(BeidouError);
      expect(() => new Dsn('https://@beidou.io/123')).toThrow(BeidouError);
      expect(() => new Dsn('https://abc@123')).toThrow(BeidouError);
      expect(() => new Dsn('https://abc@beidou.io/')).toThrow(BeidouError);
    });

    test('throws for invalid fields', () => {
      expect(() => new Dsn('httpx://abc@beidou.io/123')).toThrow(BeidouError);
      expect(() => new Dsn('httpx://abc@beidou.io:xxx/123')).toThrow(BeidouError);
      expect(() => new Dsn('http://abc@beidou.io/abc')).toThrow(BeidouError);
    });
  });

  describe('toString', () => {
    test('excludes the password by default', () => {
      const dsn = new Dsn('https://abc:xyz@beidou.io:1234/123');
      expect(dsn.toString()).toBe('https://abc@beidou.io:1234/123');
    });

    test('optionally includes the password', () => {
      const dsn = new Dsn('https://abc:xyz@beidou.io:1234/123');
      expect(dsn.toString(true)).toBe('https://abc:xyz@beidou.io:1234/123');
    });

    test('renders no password if missing', () => {
      const dsn = new Dsn('https://abc@beidou.io:1234/123');
      expect(dsn.toString(true)).toBe('https://abc@beidou.io:1234/123');
    });

    test('renders no port if missing', () => {
      const dsn = new Dsn('https://abc@beidou.io/123');
      expect(dsn.toString()).toBe('https://abc@beidou.io/123');
    });

    test('renders the full path correctly', () => {
      const dsn = new Dsn('https://abc@beidou.io/beidou/custom/installation/321');
      expect(dsn.toString()).toBe('https://abc@beidou.io/beidou/custom/installation/321');
    });
  });
});
