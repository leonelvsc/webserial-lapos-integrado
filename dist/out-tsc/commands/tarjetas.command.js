import { Command, Response } from '../command';
import * as _ from 'lodash';
export const HAY_MAS_DATOS = [0x30, 0x30, 0x31];
export const NO_HAY_MAS_DATOS = [0x30, 0x30, 0x30];
export class TarjetasResponse extends Response {
    constructor(buffer) {
        super(buffer);
        this.indice = parseInt(Command.convertToString(_.slice(this.data, 0, 4)), 10);
        this.procesador_codigo = Command.convertToString(_.slice(this.data, 4, 7));
        this.tarjeta_codigo = Command.convertToString(_.slice(this.data, 7, 10));
        this.tarjeta_nombre = Command.convertToString(_.slice(this.data, 10, 26));
        this.cuotas_cantidad_maxima = parseInt(Command.convertToString(_.slice(this.data, 26, 28)), 10);
        this.terminal_id = Command.convertToString(_.slice(this.data, 28, 36));
    }
}
export class TarjetasCommand extends Command {
    constructor(indice = 0) {
        const data = {
            indice: _.padStart(indice.toString(), 4, '0'),
        };
        super('TAR', new Uint8Array(Command.convertToByte(data)));
    }
    indiceNuevo(indice) {
        const data = {
            indice: _.padStart(indice.toString(), 4, '0')
        };
        this.data = new Uint8Array(Command.convertToByte(data));
    }
    decode(buffer) {
        return new TarjetasResponse(buffer);
    }
}
//# sourceMappingURL=tarjetas.command.js.map