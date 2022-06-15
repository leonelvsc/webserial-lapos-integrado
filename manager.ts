import * as _ from 'lodash';
import {Command, Response} from './command';
import {HAY_MAS_DATOS, NO_HAY_MAS_DATOS, TarjetasCommand, TarjetasResponse} from './commands/tarjetas.command';
import {PlanesCommand, PlanesResponse} from './commands/planes.command';
import {DatosCierreResponse, DatosUltimoCierreCommand} from './commands/datos-ultimo-cierre.command';
import {firstValueFrom, from, interval, race, ReplaySubject, startWith, Subject} from 'rxjs';
import {filter, mapTo} from 'rxjs/operators';
import {TestCommand} from './commands/test.command';
import {esperar} from "./utils";

const STX = 0x02;
const ETX = 0x03;
const ENQ = 0x05;
const ACK = 0x06;
const VENDOR_ID = 0x1234;
const PRODUCT_ID = 0x0101;
const TIMEOUT_CLOSE = 3;
const CHECK_INTERVAL = 5000;

export class Manager {
  reader: any;
  writer: any;
  port: any;

  tarjetas: TarjetasResponse[] = [];
  planes: PlanesResponse[] = [];

  lastCommand: Command;

  inicializando = false;
  cargando = false;
  cargandoDatosLote = false;

  status = new ReplaySubject(1);

  private flags = {
    inicializandoPuertos: false,
    promiseTrigger: new Subject(),
    tick: {
      observable: interval(CHECK_INTERVAL).pipe(startWith(0), filter(trash => !(this.cargando || this.cargandoDatosLote))),
      subscription: null
    }
  };

  constructor(
    private inicializarPlanesYTarjetas = false
  ) {
    this.initialize();
  }

  async obtenerTarjetas() {
    this.inicializando = true;
    this.cargandoDatosLote = true;
    this.tarjetas.splice(0, this.tarjetas.length);
    this.planes.splice(0, this.tarjetas.length);

    try {
      const comando = new TarjetasCommand();

      let res = ((await this.send(comando)) as TarjetasResponse);

      while (_.isEqual(res.status, HAY_MAS_DATOS)) {
        this.tarjetas.push(res);
        comando.indiceNuevo(++res.indice);
        res = ((await this.send(comando)) as TarjetasResponse);
      }

      this.tarjetas.push(res);

      await this.obtenerPlanes(true);

    } finally {
      this.inicializando = false;
      this.cargandoDatosLote = false;
    }
  }

  async obtenerPlanes(evitarCargandoDatosLote = false) {

    try {
      if (!evitarCargandoDatosLote) {
        this.cargandoDatosLote = true;
      }

      const comando = new PlanesCommand();

      let res = ((await this.send(comando)) as PlanesResponse);

      while (_.isEqual(res.status, HAY_MAS_DATOS)) {
        this.planes.push(res);
        comando.indiceNuevo(++res.indice);
        res = ((await this.send(comando)) as PlanesResponse);
      }

      this.planes.push(res);
    } finally {
      if(!evitarCargandoDatosLote) {
        this.cargandoDatosLote = false;
      }
    }
  }

  async obtenerDatosCierre(): Promise<DatosCierreResponse[]> {

    try {

      this.cargandoDatosLote = true;

      await esperar(500);

      const comando = new DatosUltimoCierreCommand();

      const datosCierre: DatosCierreResponse[] = [];

      let res = ((await this.send(comando)) as DatosCierreResponse);

      let respuestaAnterior: DatosCierreResponse;

      while ((!respuestaAnterior) || (res.tarjeta_codigo !== respuestaAnterior.tarjeta_codigo)) {
        if( res.statusCode === '909' || isNaN(res.indice)) {

          // Intenta 1 vez mas
          res = ((await this.send(comando, 0, false)) as DatosCierreResponse);
          if( res.statusCode === '909' || isNaN(res.indice)) {
            break;
          }

        }

        datosCierre.push(res);

        if(_.isEqual(res.status, NO_HAY_MAS_DATOS)) {
          break;
        }

        respuestaAnterior = res;

        comando.indiceNuevo(++res.indice);
        await esperar(500);
        res = ((await this.send(comando, 0, false)) as DatosCierreResponse);
      }

      return datosCierre;
    } finally {
      this.cargandoDatosLote = false;
    }

  }

  private async initialize() {
    try {

      this.flags.inicializandoPuertos = true;

      this.tarjetas.splice(0, this.tarjetas.length);
      this.planes.splice(0, this.tarjetas.length);
      const ports = await (navigator as any).serial?.getPorts();
      const port = _.first<any>(ports);

      if (!port) {
        this.flags.inicializandoPuertos = false;
        return;
      }

      console.log('Puerto ya inicializado');
      console.log(port);

      try {
        await this.startReadingPort(port);

        if (this.inicializarPlanesYTarjetas) {
          this.obtenerTarjetas();
        }
      } catch (err) {
        if (err.code === 11) {
          await this.startReadingPort(port, true);

          if (this.inicializarPlanesYTarjetas) {
            this.obtenerTarjetas();
          }
        }
      } finally {
        this.flags.inicializandoPuertos = false;
        this.flags.promiseTrigger.next(true);
      }

    } finally {

      if(!this.flags.tick.subscription) {
        this.flags.tick.subscription = this.flags.tick.observable.subscribe(this.checkStatus.bind(this));
      }

    }
  }

  private async readPort() {

    let command: number[] = [];
    let hayPaquete = false;

    this.reader = await this.port.readable.getReader();

    try {

      while (true) {
        const bufferData = await this.reader.read();

        if (bufferData.done) {
          break;
        }

        for (const value of bufferData.value) {

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

      }
    } catch(e)  {
      await this.close();
    } finally {
      await this.reader?.releaseLock();
    }

  }

  private async claimDevice() {

    let estabaInicializando = false;

    if(this.flags.inicializandoPuertos) {
      estabaInicializando = true;
      await firstValueFrom(this.flags.promiseTrigger);
    }

    if (this.port) {

      if(!estabaInicializando) {
        await this.close();
      } else {
        return;
      }

    }

    const ports = await (navigator as any).serial?.getPorts();
    let port = _.first<any>(ports);

    if (!port) {
      try {
        port = await (navigator as any).serial?.requestPort({usbVendorId: VENDOR_ID, usbProductId: PRODUCT_ID});
        //port = await (navigator as any).serial?.requestPort();
      } catch (e) {
        console.log(e);
        throw e;
      }
    } else {
      console.log('Puerto ya inicializado');
      console.log(port);
    }

    if (!port) {
      throw new Error('No hay un puerto seleccionado');
    }

    try {
      await this.startReadingPort(port);
    } catch (e) {

      // Ya estaba abierto
      if (e.code === 11) {
        await this.startReadingPort(port, true);
      } else {
        console.log(e);
        throw e;
      }
    }

  }

  private async startReadingPort(aPort: any, yaAbierto = false) {

    if(!yaAbierto) {
      try {
        await aPort.open({
          baudRate: 19200,
          dataBits: 8,
          stopBits: 1,
          parity: 'none'
        });
      } catch(err) {
        // 11 significa ya abierto
        if(err.code != 11) {
          throw err;
        }
      }
    }

    this.port = aPort;
    this.writer = await aPort.writable.getWriter();

    this.readPort();
  }

  async close() {
    if (!this.reader || !this.writer) {
      return;
    }

    try {
      try {
        await this.reader.cancel();
      } finally {
        const closePromise = await this.writer.close();
        await closePromise;
        this.writer.releaseLock();
      }
    } catch(e) {
      console.log('Ha ocurrido un error al cerrar el puerto');
      console.log(e);
    } finally {
      this.reader = null;
      this.writer = null;
      await firstValueFrom(race([
        from(this.port.close()),
        interval(TIMEOUT_CLOSE * 1000).pipe(mapTo(false))
      ]));
      this.port = null;
    }
  }

  async send(command: Command, intento = 0, reintentar = true): Promise<Response> {
    try {
      if (!this.reader || !this.writer) {
        await this.claimDevice();
      }

      this.lastCommand = command;

      this.cargando = true;

      await this.writer.write(new Uint8Array([ENQ]));

      await this.writer.write(command.build());
    } catch (err) {
      console.log(err);

      if(reintentar && intento === 0 && this.port && this.reader && this.writer) {
        // Intentamos 1 vez mas luego de cerrar el puerto
        try {
          await this.close();
        } catch(e) {
          console.log('error al cerrar puerto');
        }

        try {
          await this.send(command, ++intento);
        } catch (e) {
          throw e;
        }
      } else {
        throw err;
      }
    }

    return new Promise(
      (resolve) => {
        command.callBack = response => {
          this.cargando = false;
          resolve(response);
        };
      }
    );
  }

  private newPackage(data: Uint8Array) {
    this.writer.write(new Uint8Array([ACK]));

    try {
      this.lastCommand?.callBack(this.lastCommand.decode(data));
    } finally {
      this.lastCommand = null;
    }
  }

  private async checkStatus() {
    let online: boolean;

    const ports = await (navigator as any).serial?.getPorts();

    if(!ports?.length) {
      this.status.next(false);
      return;
    }

    if(this.cargando || this.cargandoDatosLote) {
      return;
    }

    try {
      online = !!(await firstValueFrom(race([
        from(this.send(new TestCommand())),
        interval(10 * 1000).pipe(mapTo(false))
      ])));
    } catch(e) {
      online = false;
    }

    this.status.next(online);
  }
}
