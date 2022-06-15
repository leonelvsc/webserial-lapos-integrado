import {Command, Response} from '../command';
import * as _ from 'lodash';

export class PlanesResponse extends Response {
  indice: number;
  tarjeta_codigo: string;
  plan_codigo: string;
  plan_nombre: string;
  terminal_id: string;

  constructor(buffer: Uint8Array) {
    super(buffer);

    this.indice = parseInt(Command.convertToString(_.slice(this.data, 0, 4)), 10);
    this.tarjeta_codigo = Command.convertToString(_.slice(this.data, 4, 7));
    this.plan_codigo = Command.convertToString(_.slice(this.data, 7, 8));
    this.plan_nombre = Command.convertToString(_.slice(this.data, 8, 23));
    this.terminal_id = Command.convertToString(_.slice(this.data, 23, 31));
  }
}

export class PlanesCommand extends Command {

  constructor(indice = 0) {
    const data = {
      indice: _.padStart(indice.toString(), 4, '0'),
    };

    super('PLA', new Uint8Array(Command.convertToByte(data)));
  }

  indiceNuevo(indice: number) {
    const data = {
      indice: _.padStart(indice.toString(), 4, '0')
    };

    this.data = new Uint8Array(Command.convertToByte(data));
  }

  decode(buffer: Uint8Array): Response {
    return new PlanesResponse(buffer);
  }

}
