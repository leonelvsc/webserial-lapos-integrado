import {Command} from '../command';

export class TestCommand extends Command {
  constructor() {
    super('TES', new Uint8Array(0));
  }
}
