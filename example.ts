import {Manager} from "./manager";
import {TestCommand} from "./commands/test.command";

async function ejemplo() {
  const manager = new Manager();
  const command = new TestCommand();
  try {
    await manager.send(command);
  } catch (e) {
    console.log(e);
  }
}

ejemplo();
