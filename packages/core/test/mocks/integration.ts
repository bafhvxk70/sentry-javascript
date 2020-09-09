import { getCurrentHub } from '@beidou/hub';
import { configureScope } from '@beidou/minimal';
import { Event, Integration } from '@beidou/types';

export class TestIntegration implements Integration {
  public static id: string = 'TestIntegration';

  public name: string = 'TestIntegration';

  public setupOnce(): void {
    configureScope(scope => {
      scope.addEventProcessor((event: Event) => {
        if (!getCurrentHub().getIntegration(TestIntegration)) {
          return event;
        }

        return null;
      });
    });
  }
}
