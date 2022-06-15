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
exports.PlanesCommand = exports.PlanesResponse = void 0;
var command_1 = require("../command");
var _ = require("lodash");
var PlanesResponse = /** @class */ (function (_super) {
    __extends(PlanesResponse, _super);
    function PlanesResponse(buffer) {
        var _this = _super.call(this, buffer) || this;
        _this.indice = parseInt(command_1.Command.convertToString(_.slice(_this.data, 0, 4)), 10);
        _this.tarjeta_codigo = command_1.Command.convertToString(_.slice(_this.data, 4, 7));
        _this.plan_codigo = command_1.Command.convertToString(_.slice(_this.data, 7, 8));
        _this.plan_nombre = command_1.Command.convertToString(_.slice(_this.data, 8, 23));
        _this.terminal_id = command_1.Command.convertToString(_.slice(_this.data, 23, 31));
        return _this;
    }
    return PlanesResponse;
}(command_1.Response));
exports.PlanesResponse = PlanesResponse;
var PlanesCommand = /** @class */ (function (_super) {
    __extends(PlanesCommand, _super);
    function PlanesCommand(indice) {
        if (indice === void 0) { indice = 0; }
        var data = {
            indice: _.padStart(indice.toString(), 4, '0')
        };
        return _super.call(this, 'PLA', new Uint8Array(command_1.Command.convertToByte(data))) || this;
    }
    PlanesCommand.prototype.indiceNuevo = function (indice) {
        var data = {
            indice: _.padStart(indice.toString(), 4, '0')
        };
        this.data = new Uint8Array(command_1.Command.convertToByte(data));
    };
    PlanesCommand.prototype.decode = function (buffer) {
        return new PlanesResponse(buffer);
    };
    return PlanesCommand;
}(command_1.Command));
exports.PlanesCommand = PlanesCommand;
