import { expect } from 'chai';

import { BaseTransport } from '../../../src/transports/base';

const testDsn = 'https://123@beidou.io/42';

class SimpleTransport extends BaseTransport { }

describe('BaseTransport', () => {
  it('doesnt provide sendEvent() implementation', async () => {
    const transport = new SimpleTransport({ dsn: testDsn });

    try {
      await transport.sendEvent({});
    } catch (e) {
      expect(e.message).equal('Transport Class has to implement `sendEvent` method');
    }
  });

  it('has correct endpoint url', () => {
    const transport = new SimpleTransport({ dsn: testDsn });
    // eslint-disable-next-line deprecation/deprecation
    expect(transport.url).equal('https://beidou.io/api/42/store/?beidou_key=123&beidou_version=7');
  });
});
