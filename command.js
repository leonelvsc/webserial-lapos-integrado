"use strict";
exports.__esModule = true;
exports.Command = exports.Response = void 0;
var _ = require("lodash");
var STX = 0x02;
var ETX = 0x03;
var Response = /** @class */ (function () {
    function Response(buffer) {
        this.STX = buffer[0];
        this.command = [buffer[1], buffer[2], buffer[3]];
        this.status = [buffer[4], buffer[5], buffer[6]];
        this.statusCode = Command.convertToString(new Uint8Array(this.status));
        this.dataLength = buffer[7] + (buffer[8] << 8);
        this.data = (this.dataLength > 0) ? new Uint8Array(_.slice(buffer, 9, buffer.length - 1)) : new Uint8Array(0);
        this.ETX = buffer[buffer.length - 1];
    }
    return Response;
}());
exports.Response = Response;
var Command = /** @class */ (function () {
    function Command(command, data) {
        this.command = command;
        this.data = data;
    }
    Command.convertToByte = function (params) {
        var buffer = [];
        var values = (typeof params === 'object') ? Object.values(params) : params;
        for (var _i = 0, values_1 = values; _i < values_1.length; _i++) {
            var valor = values_1[_i];
            if (typeof valor === 'string') {
                for (var i = 0; i < valor.length; i++) {
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
    };
    Command.convertToString = function (bytes) {
        var string = '';
        for (var _i = 0, bytes_1 = bytes; _i < bytes_1.length; _i++) {
            var byte = bytes_1[_i];
            string += String.fromCharCode(byte);
        }
        return string;
    };
    Command.prototype.build = function () {
        var commandBytes = Command.convertToByte(this.command);
        var buffer = [STX, commandBytes[0], commandBytes[1], commandBytes[2], this.data.length & 255, this.data.length >> 8 & 255];
        for (var _i = 0, _a = this.data; _i < _a.length; _i++) {
            var byte = _a[_i];
            buffer.push(byte);
        }
        buffer.push(ETX);
        buffer.push(0x00);
        var command = new Uint8Array(buffer);
        this.checkSum(command);
        return command;
    };
    Command.prototype.decode = function (buffer) {
        return new Response(buffer);
    };
    Command.prototype.checkSum = function (command) {
        var cs = 0;
        for (var i = 1; i < command.length; i++) {
            cs ^= command[i];
        }
        command[command.length - 1] = cs;
    };
    Command.prototype.checkSumVerify = function (command) {
        var cs = 0;
        for (var i = 1; i < command.length; i++) {
            cs ^= command[i];
        }
        return cs;
    };
    return Command;
}());
exports.Command = Command;
