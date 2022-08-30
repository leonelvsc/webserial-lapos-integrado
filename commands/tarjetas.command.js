"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
exports.TarjetasCommand = exports.TarjetasResponse = exports.NO_HAY_MAS_DATOS = exports.HAY_MAS_DATOS = void 0;
var command_1 = require("../command");
var _ = require("lodash");
exports.HAY_MAS_DATOS = [0x30, 0x30, 0x31];
exports.NO_HAY_MAS_DATOS = [0x30, 0x30, 0x30];
var TarjetasResponse = /** @class */ (function (_super) {
    __extends(TarjetasResponse, _super);
    function TarjetasResponse(buffer) {
        var _this = _super.call(this, buffer) || this;
        _this.indice = parseInt(command_1.Command.convertToString(_.slice(_this.data, 0, 4)), 10);
        _this.procesador_codigo = command_1.Command.convertToString(_.slice(_this.data, 4, 7));
        _this.tarjeta_codigo = command_1.Command.convertToString(_.slice(_this.data, 7, 10));
        _this.tarjeta_nombre = command_1.Command.convertToString(_.slice(_this.data, 10, 26));
        _this.cuotas_cantidad_maxima = parseInt(command_1.Command.convertToString(_.slice(_this.data, 26, 28)), 10);
        _this.terminal_id = command_1.Command.convertToString(_.slice(_this.data, 28, 36));
        return _this;
    }
    return TarjetasResponse;
}(command_1.Response));
exports.TarjetasResponse = TarjetasResponse;
var TarjetasCommand = /** @class */ (function (_super) {
    __extends(TarjetasCommand, _super);
    function TarjetasCommand(indice) {
        if (indice === void 0) { indice = 0; }
        var data = {
            indice: _.padStart(indice.toString(), 4, '0')
        };
        return _super.call(this, 'TAR', new Uint8Array(command_1.Command.convertToByte(data))) || this;
    }
    TarjetasCommand.prototype.indiceNuevo = function (indice) {
        var data = {
            indice: _.padStart(indice.toString(), 4, '0')
        };
        this.data = new Uint8Array(command_1.Command.convertToByte(data));
    };
    TarjetasCommand.prototype.decode = function (buffer) {
        return new TarjetasResponse(buffer);
    };
    return TarjetasCommand;
}(command_1.Command));
exports.TarjetasCommand = TarjetasCommand;
