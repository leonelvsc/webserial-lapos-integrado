# webserial-lapos-integrado
Libreria para comunicarse con aparatos que soporten el protocolo POS Integrado de LaPOS mediante WebSerial


```
npm install webserial-lapos-integrado
```


Modo de uso:

- Instanciar el manager principal de la conexión
- Enviar un comando y esperar la respuesta del dispositivo

Ejemplo:

```
import {Manager} from "./manager";
import {TestCommand} from "./commands/test.command";

async ejemplo() {
  const manager = new Manager();
  const command = new TestCommand();
  try {
    const response = await manager.send(command);
    console.log(response);
  } catch (e) {
    console.log(e);
  }
}

ejemplo();
```
