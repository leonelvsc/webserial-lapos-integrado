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
exports.DatosUltimoCierreCommand = exports.DatosCierreResponse = void 0;
var command_1 = require("../command");
var _ = require("lodash");
var bignumber_js_1 = require("bignumber.js");
var DatosCierreResponse = /** @class */ (function (_super) {
    __extends(DatosCierreResponse, _super);
    function DatosCierreResponse(buffer) {
        var _this = _super.call(this, buffer) || this;
        _this.indice = parseInt(command_1.Command.convertToString(_.slice(_this.data, 0, 4)), 10);
        _this.procesador_codigo = command_1.Command.convertToString(_.slice(_this.data, 4, 7));
        _this.lote_numero = command_1.Command.convertToString(_.slice(_this.data, 7, 10));
        _this.tarjeta_codigo = command_1.Command.convertToString(_.slice(_this.data, 10, 13));
        _this.ventas_cantidad = parseInt(command_1.Command.convertToString(_.slice(_this.data, 13, 17)), 10);
        _this.ventas_total = new bignumber_js_1["default"](command_1.Command.convertToString(_.slice(_this.data, 17, 29))).div(100).toNumber();
        _this.anulaciones_cantidad = parseInt(command_1.Command.convertToString(_.slice(_this.data, 29, 33)), 10);
        _this.anulaciones_total = new bignumber_js_1["default"](command_1.Command.convertToString(_.slice(_this.data, 33, 45))).div(100).toNumber();
        _this.devoluciones_cantidad = parseInt(command_1.Command.convertToString(_.slice(_this.data, 45, 49)), 10);
        _this.devoluciones_total = new bignumber_js_1["default"](command_1.Command.convertToString(_.slice(_this.data, 49, 61))).div(100).toNumber();
        _this.devoluciones_anulacion_cantidad = parseInt(command_1.Command.convertToString(_.slice(_this.data, 61, 65)), 10);
        _this.devoluciones_anulacion_total = new bignumber_js_1["default"](command_1.Command.convertToString(_.slice(_this.data, 65, 77))).div(100).toNumber();
        _this.cierre_fecha = command_1.Command.convertToString(_.slice(_this.data, 77, 87));
        _this.cierre_hora = command_1.Command.convertToString(_.slice(_this.data, 87, 95));
        _this.terminal_id = command_1.Command.convertToString(_.slice(_this.data, 95, 103));
        return _this;
    }
    return DatosCierreResponse;
}(command_1.Response));
exports.DatosCierreResponse = DatosCierreResponse;
var DatosUltimoCierreCommand = /** @class */ (function (_super) {
    __extends(DatosUltimoCierreCommand, _super);
    function DatosUltimoCierreCommand(indice) {
        if (indice === void 0) { indice = 0; }
        var data = {
            indice: _.padStart(indice.toString(), 4, '0')
        };
        return _super.call(this, 'ULC', new Uint8Array(command_1.Command.convertToByte(data))) || this;
    }
    DatosUltimoCierreCommand.prototype.indiceNuevo = function (indice) {
        var data = {
            indice: _.padStart(indice.toString(), 4, '0')
        };
        this.data = new Uint8Array(command_1.Command.convertToByte(data));
    };
    DatosUltimoCierreCommand.prototype.decode = function (buffer) {
        return new DatosCierreResponse(buffer);
    };
    return DatosUltimoCierreCommand;
}(command_1.Command));
exports.DatosUltimoCierreCommand = DatosUltimoCierreCommand;
