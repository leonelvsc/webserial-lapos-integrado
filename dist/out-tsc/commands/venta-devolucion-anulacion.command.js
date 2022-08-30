import { Command } from '../command';
import * as _ from 'lodash';
import { TransaccionResponse } from './venta.command';
export class VentaDevolucionAnulacionCommand extends Command {
    constructor(params) {
        const data = {
            cupon_numero: _.padStart(params.cupon_numero.toString(), 7, '0'),
            tarjeta_codigo: _.padStart(params.tarjeta_codigo, 3, '0')
        };
        super('AND', new Uint8Array(Command.convertToByte(data)));
    }
    decode(buffer) {
        return new TransaccionResponse(buffer);
    }
}
//# sourceMappingURL=venta-devolucion-anulacion.command.js.map