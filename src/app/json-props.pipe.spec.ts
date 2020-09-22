import { JsonPropListPipe } from './json-props.pipe';

describe('JsonPropsPipe', () => {
  it('create an instance', () => {
    const pipe = new JsonPropListPipe();
    expect(pipe).toBeTruthy();
  });
});
