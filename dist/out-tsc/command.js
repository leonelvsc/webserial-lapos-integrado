import * as _ from 'lodash';
const STX = 0x02;
const ETX = 0x03;
export class Response {
    constructor(buffer) {
        this.STX = buffer[0];
        this.command = [buffer[1], buffer[2], buffer[3]];
        this.status = [buffer[4], buffer[5], buffer[6]];
        this.statusCode = Command.convertToString(new Uint8Array(this.status));
        this.dataLength = buffer[7] + (buffer[8] << 8);
        this.data = (this.dataLength > 0) ? new Uint8Array(_.slice(buffer, 9, buffer.length - 1)) : new Uint8Array(0);
        this.ETX = buffer[buffer.length - 1];
    }
}
export class Command {
    constructor(command, data) {
        this.command = command;
        this.data = data;
    }
    static convertToByte(params) {
        const buffer = [];
        const values = (typeof params === 'object') ? Object.values(params) : params;
        for (const valor of values) {
            if (typeof valor === 'string') {
                for (let i = 0; i < valor.length; i++) {
                    buffer.push(parseInt(valor.charCodeAt(i).toString(16), 16));
                }
            }
            else {
                if (typeof valor === 'number') {
                    buffer.push(valor);
                }
            }
        }
        return buffer;
    }
    static convertToString(bytes) {
        let string = '';
        for (const byte of bytes) {
            string += String.fromCharCode(byte);
        }
        return string;
    }
    build() {
        const commandBytes = Command.convertToByte(this.command);
        const buffer = [STX, commandBytes[0], commandBytes[1], commandBytes[2], this.data.length & 255, this.data.length >> 8 & 255];
        for (const byte of this.data) {
            buffer.push(byte);
        }
        buffer.push(ETX);
        buffer.push(0x00);
        const command = new Uint8Array(buffer);
        this.checkSum(command);
        return command;
    }
    decode(buffer) {
        return new Response(buffer);
    }
    checkSum(command) {
        let cs = 0;
        for (let i = 1; i < command.length; i++) {
            cs ^= command[i];
        }
        command[command.length - 1] = cs;
    }
    checkSumVerify(command) {
        let cs = 0;
        for (let i = 1; i < command.length; i++) {
            cs ^= command[i];
        }
        return cs;
    }
}
//# sourceMappingURL=command.js.map