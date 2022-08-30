import {Command} from '../command';

export class ReimprimirUltimoTicketCommand extends Command {
  constructor() {
    super('IMT', new Uint8Array(0));
  }
}
