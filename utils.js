"use strict";
exports.__esModule = true;
exports.esperar = void 0;
function esperar(timeout) {
    var prom = new Promise(function (resolve) {
        setTimeout(resolve, timeout);
    });
    return prom;
}
exports.esperar = esperar;
