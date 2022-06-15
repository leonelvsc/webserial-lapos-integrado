"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.Manager = void 0;
var _ = require("lodash");
var tarjetas_command_1 = require("./commands/tarjetas.command");
var planes_command_1 = require("./commands/planes.command");
var datos_ultimo_cierre_command_1 = require("./commands/datos-ultimo-cierre.command");
var rxjs_1 = require("rxjs");
var operators_1 = require("rxjs/operators");
var test_command_1 = require("./commands/test.command");
var utils_1 = require("./utils");
var STX = 0x02;
var ETX = 0x03;
var ENQ = 0x05;
var ACK = 0x06;
var VENDOR_ID = 0x1234;
var PRODUCT_ID = 0x0101;
var TIMEOUT_CLOSE = 3;
var CHECK_INTERVAL = 5000;
var Manager = /** @class */ (function () {
    function Manager(inicializarPlanesYTarjetas) {
        if (inicializarPlanesYTarjetas === void 0) { inicializarPlanesYTarjetas = false; }
        var _this = this;
        this.inicializarPlanesYTarjetas = inicializarPlanesYTarjetas;
        this.tarjetas = [];
        this.planes = [];
        this.inicializando = false;
        this.cargando = false;
        this.cargandoDatosLote = false;
        this.status = new rxjs_1.ReplaySubject(1);
        this.flags = {
            inicializandoPuertos: false,
            promiseTrigger: new rxjs_1.Subject(),
            tick: {
                observable: (0, rxjs_1.interval)(CHECK_INTERVAL).pipe((0, rxjs_1.startWith)(0), (0, operators_1.filter)(function (trash) { return !(_this.cargando || _this.cargandoDatosLote); })),
                subscription: null
            }
        };
        this.initialize();
    }
    Manager.prototype.obtenerTarjetas = function () {
        return __awaiter(this, void 0, void 0, function () {
            var comando, res;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.inicializando = true;
                        this.cargandoDatosLote = true;
                        this.tarjetas.splice(0, this.tarjetas.length);
                        this.planes.splice(0, this.tarjetas.length);
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, , 7, 8]);
                        comando = new tarjetas_command_1.TarjetasCommand();
                        return [4 /*yield*/, this.send(comando)];
                    case 2:
                        res = (_a.sent());
                        _a.label = 3;
                    case 3:
                        if (!_.isEqual(res.status, tarjetas_command_1.HAY_MAS_DATOS)) return [3 /*break*/, 5];
                        this.tarjetas.push(res);
                        comando.indiceNuevo(++res.indice);
                        return [4 /*yield*/, this.send(comando)];
                    case 4:
                        res = (_a.sent());
                        return [3 /*break*/, 3];
                    case 5:
                        this.tarjetas.push(res);
                        return [4 /*yield*/, this.obtenerPlanes(true)];
                    case 6:
                        _a.sent();
                        return [3 /*break*/, 8];
                    case 7:
                        this.inicializando = false;
                        this.cargandoDatosLote = false;
                        return [7 /*endfinally*/];
                    case 8: return [2 /*return*/];
                }
            });
        });
    };
    Manager.prototype.obtenerPlanes = function (evitarCargandoDatosLote) {
        if (evitarCargandoDatosLote === void 0) { evitarCargandoDatosLote = false; }
        return __awaiter(this, void 0, void 0, function () {
            var comando, res;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, , 5, 6]);
                        if (!evitarCargandoDatosLote) {
                            this.cargandoDatosLote = true;
                        }
                        comando = new planes_command_1.PlanesCommand();
                        return [4 /*yield*/, this.send(comando)];
                    case 1:
                        res = (_a.sent());
                        _a.label = 2;
                    case 2:
                        if (!_.isEqual(res.status, tarjetas_command_1.HAY_MAS_DATOS)) return [3 /*break*/, 4];
                        this.planes.push(res);
                        comando.indiceNuevo(++res.indice);
                        return [4 /*yield*/, this.send(comando)];
                    case 3:
                        res = (_a.sent());
                        return [3 /*break*/, 2];
                    case 4:
                        this.planes.push(res);
                        return [3 /*break*/, 6];
                    case 5:
                        if (!evitarCargandoDatosLote) {
                            this.cargandoDatosLote = false;
                        }
                        return [7 /*endfinally*/];
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    Manager.prototype.obtenerDatosCierre = function () {
        return __awaiter(this, void 0, void 0, function () {
            var comando, datosCierre, res, respuestaAnterior;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, , 9, 10]);
                        this.cargandoDatosLote = true;
                        return [4 /*yield*/, (0, utils_1.esperar)(500)];
                    case 1:
                        _a.sent();
                        comando = new datos_ultimo_cierre_command_1.DatosUltimoCierreCommand();
                        datosCierre = [];
                        return [4 /*yield*/, this.send(comando)];
                    case 2:
                        res = (_a.sent());
                        respuestaAnterior = void 0;
                        _a.label = 3;
                    case 3:
                        if (!((!respuestaAnterior) || (res.tarjeta_codigo !== respuestaAnterior.tarjeta_codigo))) return [3 /*break*/, 8];
                        if (!(res.statusCode === '909' || isNaN(res.indice))) return [3 /*break*/, 5];
                        return [4 /*yield*/, this.send(comando, 0, false)];
                    case 4:
                        // Intenta 1 vez mas
                        res = (_a.sent());
                        if (res.statusCode === '909' || isNaN(res.indice)) {
                            return [3 /*break*/, 8];
                        }
                        _a.label = 5;
                    case 5:
                        datosCierre.push(res);
                        if (_.isEqual(res.status, tarjetas_command_1.NO_HAY_MAS_DATOS)) {
                            return [3 /*break*/, 8];
                        }
                        respuestaAnterior = res;
                        comando.indiceNuevo(++res.indice);
                        return [4 /*yield*/, (0, utils_1.esperar)(500)];
                    case 6:
                        _a.sent();
                        return [4 /*yield*/, this.send(comando, 0, false)];
                    case 7:
                        res = (_a.sent());
                        return [3 /*break*/, 3];
                    case 8: return [2 /*return*/, datosCierre];
                    case 9:
                        this.cargandoDatosLote = false;
                        return [7 /*endfinally*/];
                    case 10: return [2 /*return*/];
                }
            });
        });
    };
    Manager.prototype.initialize = function () {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            var ports, port, err_1;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, , 9, 10]);
                        this.flags.inicializandoPuertos = true;
                        this.tarjetas.splice(0, this.tarjetas.length);
                        this.planes.splice(0, this.tarjetas.length);
                        return [4 /*yield*/, ((_a = navigator.serial) === null || _a === void 0 ? void 0 : _a.getPorts())];
                    case 1:
                        ports = _b.sent();
                        port = _.first(ports);
                        if (!port) {
                            this.flags.inicializandoPuertos = false;
                            return [2 /*return*/];
                        }
                        console.log('Puerto ya inicializado');
                        console.log(port);
                        _b.label = 2;
                    case 2:
                        _b.trys.push([2, 4, 7, 8]);
                        return [4 /*yield*/, this.startReadingPort(port)];
                    case 3:
                        _b.sent();
                        if (this.inicializarPlanesYTarjetas) {
                            this.obtenerTarjetas();
                        }
                        return [3 /*break*/, 8];
                    case 4:
                        err_1 = _b.sent();
                        if (!(err_1.code === 11)) return [3 /*break*/, 6];
                        return [4 /*yield*/, this.startReadingPort(port, true)];
                    case 5:
                        _b.sent();
                        if (this.inicializarPlanesYTarjetas) {
                            this.obtenerTarjetas();
                        }
                        _b.label = 6;
                    case 6: return [3 /*break*/, 8];
                    case 7:
                        this.flags.inicializandoPuertos = false;
                        this.flags.promiseTrigger.next(true);
                        return [7 /*endfinally*/];
                    case 8: return [3 /*break*/, 10];
                    case 9:
                        if (!this.flags.tick.subscription) {
                            this.flags.tick.subscription = this.flags.tick.observable.subscribe(this.checkStatus.bind(this));
                        }
                        return [7 /*endfinally*/];
                    case 10: return [2 /*return*/];
                }
            });
        });
    };
    Manager.prototype.readPort = function () {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            var command, hayPaquete, _b, bufferData, _i, _c, value, e_1;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        command = [];
                        hayPaquete = false;
                        _b = this;
                        return [4 /*yield*/, this.port.readable.getReader()];
                    case 1:
                        _b.reader = _d.sent();
                        _d.label = 2;
                    case 2:
                        _d.trys.push([2, 6, 8, 10]);
                        _d.label = 3;
                    case 3:
                        if (!true) return [3 /*break*/, 5];
                        return [4 /*yield*/, this.reader.read()];
                    case 4:
                        bufferData = _d.sent();
                        if (bufferData.done) {
                            return [3 /*break*/, 5];
                        }
                        for (_i = 0, _c = bufferData.value; _i < _c.length; _i++) {
                            value = _c[_i];
                            if (value === STX || hayPaquete) {
                                command.push(value);
                                hayPaquete = true;
                            }
                            if (value === ETX) {
                                hayPaquete = false;
                                this.newPackage(new Uint8Array(command));
                                command = [];
                            }
                        }
                        return [3 /*break*/, 3];
                    case 5: return [3 /*break*/, 10];
                    case 6:
                        e_1 = _d.sent();
                        return [4 /*yield*/, this.close()];
                    case 7:
                        _d.sent();
                        return [3 /*break*/, 10];
                    case 8: return [4 /*yield*/, ((_a = this.reader) === null || _a === void 0 ? void 0 : _a.releaseLock())];
                    case 9:
                        _d.sent();
                        return [7 /*endfinally*/];
                    case 10: return [2 /*return*/];
                }
            });
        });
    };
    Manager.prototype.claimDevice = function () {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function () {
            var estabaInicializando, ports, port, e_2, e_3;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        estabaInicializando = false;
                        if (!this.flags.inicializandoPuertos) return [3 /*break*/, 2];
                        estabaInicializando = true;
                        return [4 /*yield*/, (0, rxjs_1.firstValueFrom)(this.flags.promiseTrigger)];
                    case 1:
                        _c.sent();
                        _c.label = 2;
                    case 2:
                        if (!this.port) return [3 /*break*/, 5];
                        if (!!estabaInicializando) return [3 /*break*/, 4];
                        return [4 /*yield*/, this.close()];
                    case 3:
                        _c.sent();
                        return [3 /*break*/, 5];
                    case 4: return [2 /*return*/];
                    case 5: return [4 /*yield*/, ((_a = navigator.serial) === null || _a === void 0 ? void 0 : _a.getPorts())];
                    case 6:
                        ports = _c.sent();
                        port = _.first(ports);
                        if (!!port) return [3 /*break*/, 11];
                        _c.label = 7;
                    case 7:
                        _c.trys.push([7, 9, , 10]);
                        return [4 /*yield*/, ((_b = navigator.serial) === null || _b === void 0 ? void 0 : _b.requestPort({ usbVendorId: VENDOR_ID, usbProductId: PRODUCT_ID }))];
                    case 8:
                        port = _c.sent();
                        return [3 /*break*/, 10];
                    case 9:
                        e_2 = _c.sent();
                        console.log(e_2);
                        throw e_2;
                    case 10: return [3 /*break*/, 12];
                    case 11:
                        console.log('Puerto ya inicializado');
                        console.log(port);
                        _c.label = 12;
                    case 12:
                        if (!port) {
                            throw new Error('No hay un puerto seleccionado');
                        }
                        _c.label = 13;
                    case 13:
                        _c.trys.push([13, 15, , 19]);
                        return [4 /*yield*/, this.startReadingPort(port)];
                    case 14:
                        _c.sent();
                        return [3 /*break*/, 19];
                    case 15:
                        e_3 = _c.sent();
                        if (!(e_3.code === 11)) return [3 /*break*/, 17];
                        return [4 /*yield*/, this.startReadingPort(port, true)];
                    case 16:
                        _c.sent();
                        return [3 /*break*/, 18];
                    case 17:
                        console.log(e_3);
                        throw e_3;
                    case 18: return [3 /*break*/, 19];
                    case 19: return [2 /*return*/];
                }
            });
        });
    };
    Manager.prototype.startReadingPort = function (aPort, yaAbierto) {
        if (yaAbierto === void 0) { yaAbierto = false; }
        return __awaiter(this, void 0, void 0, function () {
            var err_2, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!!yaAbierto) return [3 /*break*/, 4];
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, aPort.open({
                                baudRate: 19200,
                                dataBits: 8,
                                stopBits: 1,
                                parity: 'none'
                            })];
                    case 2:
                        _b.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        err_2 = _b.sent();
                        // 11 significa ya abierto
                        if (err_2.code != 11) {
                            throw err_2;
                        }
                        return [3 /*break*/, 4];
                    case 4:
                        this.port = aPort;
                        _a = this;
                        return [4 /*yield*/, aPort.writable.getWriter()];
                    case 5:
                        _a.writer = _b.sent();
                        this.readPort();
                        return [2 /*return*/];
                }
            });
        });
    };
    Manager.prototype.close = function () {
        return __awaiter(this, void 0, void 0, function () {
            var closePromise, e_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.reader || !this.writer) {
                            return [2 /*return*/];
                        }
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 8, 9, 11]);
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, , 4, 7]);
                        return [4 /*yield*/, this.reader.cancel()];
                    case 3:
                        _a.sent();
                        return [3 /*break*/, 7];
                    case 4: return [4 /*yield*/, this.writer.close()];
                    case 5:
                        closePromise = _a.sent();
                        return [4 /*yield*/, closePromise];
                    case 6:
                        _a.sent();
                        this.writer.releaseLock();
                        return [7 /*endfinally*/];
                    case 7: return [3 /*break*/, 11];
                    case 8:
                        e_4 = _a.sent();
                        console.log('Ha ocurrido un error al cerrar el puerto');
                        console.log(e_4);
                        return [3 /*break*/, 11];
                    case 9:
                        this.reader = null;
                        this.writer = null;
                        return [4 /*yield*/, (0, rxjs_1.firstValueFrom)((0, rxjs_1.race)([
                                (0, rxjs_1.from)(this.port.close()),
                                (0, rxjs_1.interval)(TIMEOUT_CLOSE * 1000).pipe((0, operators_1.mapTo)(false))
                            ]))];
                    case 10:
                        _a.sent();
                        this.port = null;
                        return [7 /*endfinally*/];
                    case 11: return [2 /*return*/];
                }
            });
        });
    };
    Manager.prototype.send = function (command, intento, reintentar) {
        if (intento === void 0) { intento = 0; }
        if (reintentar === void 0) { reintentar = true; }
        return __awaiter(this, void 0, void 0, function () {
            var err_3, e_5, e_6;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 5, , 15]);
                        if (!(!this.reader || !this.writer)) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.claimDevice()];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2:
                        this.lastCommand = command;
                        this.cargando = true;
                        return [4 /*yield*/, this.writer.write(new Uint8Array([ENQ]))];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, this.writer.write(command.build())];
                    case 4:
                        _a.sent();
                        return [3 /*break*/, 15];
                    case 5:
                        err_3 = _a.sent();
                        console.log(err_3);
                        if (!(reintentar && intento === 0 && this.port && this.reader && this.writer)) return [3 /*break*/, 13];
                        _a.label = 6;
                    case 6:
                        _a.trys.push([6, 8, , 9]);
                        return [4 /*yield*/, this.close()];
                    case 7:
                        _a.sent();
                        return [3 /*break*/, 9];
                    case 8:
                        e_5 = _a.sent();
                        console.log('error al cerrar puerto');
                        return [3 /*break*/, 9];
                    case 9:
                        _a.trys.push([9, 11, , 12]);
                        return [4 /*yield*/, this.send(command, ++intento)];
                    case 10:
                        _a.sent();
                        return [3 /*break*/, 12];
                    case 11:
                        e_6 = _a.sent();
                        throw e_6;
                    case 12: return [3 /*break*/, 14];
                    case 13: throw err_3;
                    case 14: return [3 /*break*/, 15];
                    case 15: return [2 /*return*/, new Promise(function (resolve) {
                            command.callBack = function (response) {
                                _this.cargando = false;
                                resolve(response);
                            };
                        })];
                }
            });
        });
    };
    Manager.prototype.newPackage = function (data) {
        var _a;
        this.writer.write(new Uint8Array([ACK]));
        try {
            (_a = this.lastCommand) === null || _a === void 0 ? void 0 : _a.callBack(this.lastCommand.decode(data));
        }
        finally {
            this.lastCommand = null;
        }
    };
    Manager.prototype.checkStatus = function () {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            var online, ports, e_7;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, ((_a = navigator.serial) === null || _a === void 0 ? void 0 : _a.getPorts())];
                    case 1:
                        ports = _b.sent();
                        if (!(ports === null || ports === void 0 ? void 0 : ports.length)) {
                            this.status.next(false);
                            return [2 /*return*/];
                        }
                        if (this.cargando || this.cargandoDatosLote) {
                            return [2 /*return*/];
                        }
                        _b.label = 2;
                    case 2:
                        _b.trys.push([2, 4, , 5]);
                        return [4 /*yield*/, (0, rxjs_1.firstValueFrom)((0, rxjs_1.race)([
                                (0, rxjs_1.from)(this.send(new test_command_1.TestCommand())),
                                (0, rxjs_1.interval)(10 * 1000).pipe((0, operators_1.mapTo)(false))
                            ]))];
                    case 3:
                        online = !!(_b.sent());
                        return [3 /*break*/, 5];
                    case 4:
                        e_7 = _b.sent();
                        online = false;
                        return [3 /*break*/, 5];
                    case 5:
                        this.status.next(online);
                        return [2 /*return*/];
                }
            });
        });
    };
    return Manager;
}());
exports.Manager = Manager;
