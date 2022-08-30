import {Command, Response} from '../command';
import * as _ from 'lodash';
import {TransaccionResponse} from './venta.command';

export class VentaAnulacionParams {
  cupon_numero: number;
  tarjeta_codigo: string[3];

  constructor(params: VentaAnulacionParams) {
    _.assign(this, params);
  }
}


export class VentaAnulacionCommand extends Command {

  constructor(params: VentaAnulacionParams) {
    const data = {
      cupon_numero: _.padStart(params.cupon_numero.toString(), 7, '0'),
      tarjeta_codigo: _.padStart(params.tarjeta_codigo, 3, '0')
    };

    super('ANV', new Uint8Array(Command.convertToByte(data)));
  }

  decode(buffer: Uint8Array): Response {
    return new TransaccionResponse(buffer);
  }
}
