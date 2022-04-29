import { FeedUserDataApiTokenMiddleware } from './feed-user-data-api-token.middleware';

describe('FeedUserDataApiTokenMiddleware', () => {
  it('should be defined', () => {
    expect(new FeedUserDataApiTokenMiddleware()).toBeDefined();
  });
});
