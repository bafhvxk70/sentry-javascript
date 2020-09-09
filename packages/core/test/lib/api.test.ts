import { Dsn } from '@beidou/utils';

import { API } from '../../src/api';

const ingestDsn = 'https://abc@xxxx.ingest.beidou.io:1234/subpath/123';
const dsnPublic = 'https://abc@beidou.io:1234/subpath/123';
const legacyDsn = 'https://abc:123@beidou.io:1234/subpath/123';

describe('API', () => {
  test('getStoreEndpoint', () => {
    expect(new API(dsnPublic).getStoreEndpointWithUrlEncodedAuth()).toEqual(
      'https://beidou.io:1234/subpath/api/123/store/?beidou_key=abc&beidou_version=7',
    );
    expect(new API(dsnPublic).getStoreEndpoint()).toEqual('https://beidou.io:1234/subpath/api/123/store/');
    expect(new API(ingestDsn).getStoreEndpoint()).toEqual('https://xxxx.ingest.beidou.io:1234/subpath/api/123/store/');
  });

  test('getRequestHeaders', () => {
    expect(new API(dsnPublic).getRequestHeaders('a', '1.0')).toMatchObject({
      'Content-Type': 'application/json',
      'X-Beidou-Auth': expect.stringMatching(/^Beidou beidou_version=\d, beidou_client=a\/1\.0, beidou_key=abc$/),
    });

    expect(new API(legacyDsn).getRequestHeaders('a', '1.0')).toMatchObject({
      'Content-Type': 'application/json',
      'X-Beidou-Auth': expect.stringMatching(
        /^Beidou beidou_version=\d, beidou_client=a\/1\.0, beidou_key=abc, beidou_secret=123$/,
      ),
    });
  });

  test('getReportDialogEndpoint', () => {
    expect(new API(ingestDsn).getReportDialogEndpoint({})).toEqual(
      'https://xxxx.ingest.beidou.io:1234/subpath/api/embed/error-page/?dsn=https://abc@xxxx.ingest.beidou.io:1234/subpath/123',
    );

    expect(new API(dsnPublic).getReportDialogEndpoint({})).toEqual(
      'https://beidou.io:1234/subpath/api/embed/error-page/?dsn=https://abc@beidou.io:1234/subpath/123',
    );
    expect(
      new API(dsnPublic).getReportDialogEndpoint({
        eventId: 'abc',
        testy: '2',
      }),
    ).toEqual(
      'https://beidou.io:1234/subpath/api/embed/error-page/?dsn=https://abc@beidou.io:1234/subpath/123&eventId=abc&testy=2',
    );

    expect(
      new API(dsnPublic).getReportDialogEndpoint({
        eventId: 'abc',
        user: {
          email: 'email',
          name: 'yo',
        },
      }),
    ).toEqual(
      'https://beidou.io:1234/subpath/api/embed/error-page/?dsn=https://abc@beidou.io:1234/subpath/123&eventId=abc&name=yo&email=email',
    );

    expect(
      new API(dsnPublic).getReportDialogEndpoint({
        eventId: 'abc',
        user: undefined,
      }),
    ).toEqual(
      'https://beidou.io:1234/subpath/api/embed/error-page/?dsn=https://abc@beidou.io:1234/subpath/123&eventId=abc',
    );
  });
  test('getDsn', () => {
    expect(new API(dsnPublic).getDsn()).toEqual(new Dsn(dsnPublic));
  });
});
