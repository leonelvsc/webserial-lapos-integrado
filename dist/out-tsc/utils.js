export function esperar(timeout) {
    const prom = new Promise((resolve) => {
        setTimeout(resolve, timeout);
    });
    return prom;
}
//# sourceMappingURL=utils.js.map