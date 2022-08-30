import { Command, Response } from '../command';
import * as _ from 'lodash';
import BigNumber from 'bignumber.js';
export class DatosCierreResponse extends Response {
    constructor(buffer) {
        super(buffer);
        this.indice = parseInt(Command.convertToString(_.slice(this.data, 0, 4)), 10);
        this.procesador_codigo = Command.convertToString(_.slice(this.data, 4, 7));
        this.lote_numero = Command.convertToString(_.slice(this.data, 7, 10));
        this.tarjeta_codigo = Command.convertToString(_.slice(this.data, 10, 13));
        this.ventas_cantidad = parseInt(Command.convertToString(_.slice(this.data, 13, 17)), 10);
        this.ventas_total = new BigNumber(Command.convertToString(_.slice(this.data, 17, 29))).div(100).toNumber();
        this.anulaciones_cantidad = parseInt(Command.convertToString(_.slice(this.data, 29, 33)), 10);
        this.anulaciones_total = new BigNumber(Command.convertToString(_.slice(this.data, 33, 45))).div(100).toNumber();
        this.devoluciones_cantidad = parseInt(Command.convertToString(_.slice(this.data, 45, 49)), 10);
        this.devoluciones_total = new BigNumber(Command.convertToString(_.slice(this.data, 49, 61))).div(100).toNumber();
        this.devoluciones_anulacion_cantidad = parseInt(Command.convertToString(_.slice(this.data, 61, 65)), 10);
        this.devoluciones_anulacion_total = new BigNumber(Command.convertToString(_.slice(this.data, 65, 77))).div(100).toNumber();
        this.cierre_fecha = Command.convertToString(_.slice(this.data, 77, 87));
        this.cierre_hora = Command.convertToString(_.slice(this.data, 87, 95));
        this.terminal_id = Command.convertToString(_.slice(this.data, 95, 103));
    }
}
export class DatosUltimoCierreCommand extends Command {
    constructor(indice = 0) {
        const data = {
            indice: _.padStart(indice.toString(), 4, '0'),
        };
        super('ULC', new Uint8Array(Command.convertToByte(data)));
    }
    indiceNuevo(indice) {
        const data = {
            indice: _.padStart(indice.toString(), 4, '0')
        };
        this.data = new Uint8Array(Command.convertToByte(data));
    }
    decode(buffer) {
        return new DatosCierreResponse(buffer);
    }
}
//# sourceMappingURL=datos-ultimo-cierre.command.js.map