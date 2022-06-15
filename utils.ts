export function esperar(timeout: number): Promise<any> {
  const prom = new Promise<any>(
    (resolve) => {
      setTimeout(resolve, timeout);
    }
  );

  return prom;
}
