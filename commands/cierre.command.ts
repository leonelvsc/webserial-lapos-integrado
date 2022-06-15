import {Command} from '../command';

export class CierreCommand extends Command {
  constructor() {
    super('CIE', new Uint8Array(0));
  }
}
