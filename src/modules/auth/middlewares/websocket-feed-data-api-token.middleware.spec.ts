import { WebsocketFeedDataApiTokenMiddleware } from './websocket-feed-data-api-token.middleware';

describe('WebsocketFeedDataApiTokenMiddleware', () => {
  it('should be defined', () => {
    expect(new WebsocketFeedDataApiTokenMiddleware()).toBeDefined();
  });
});
