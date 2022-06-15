import {Command, Response} from '../command';
import * as _ from 'lodash';
import {TransaccionResponse} from './venta.command';
import {VentaAnulacionParams} from './venta-anulacion.command';

export class VentaDevolucionAnulacionCommand extends Command {

  constructor(params: VentaAnulacionParams) {
    const data = {
      cupon_numero: _.padStart(params.cupon_numero.toString(), 7, '0'),
      tarjeta_codigo: _.padStart(params.tarjeta_codigo, 3, '0')
    };

    super('AND', new Uint8Array(Command.convertToByte(data)));
  }

  decode(buffer: Uint8Array): Response {
    return new TransaccionResponse(buffer);
  }
}
