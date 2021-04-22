import { Client } from 'discord-rpc';
export default class RPCHandler {
  rpc: any;
  ready: boolean;
  constructor() {
    this.ready = false;
    const connect = () => {
      this.rpc = new Client({ transport: 'ipc' });
      this.rpc.login({ clientId: '820262433611317259' }).catch(() => {
        console.log('Could not connect, retrying in 5 seconds');
        setTimeout(connect, 5000);
      });
      this.rpc.on('ready', () => {
        this.ready = true;
      });
      // @ts-ignore
      this.rpc.on('disconnected', () => {
        console.log('Disconnected, trying to reconnect in 5 seconds!');
        setTimeout(connect, 5000);
      });
    };
    connect();
  }
  parseToRP(data: any) {
    if (!data) {
      return false;
    }
    const object = {
      details: data.name,
      state: data.artist.name,
      largeImageKey: 'lastfm',
      largeImageText: data.album?.name || 'None',
      startTimestamp: Date.now(),
    };

    if (data.duration === '0') {
      return object;
    } else {
      // @ts-ignore
      object.endTimestamp = Date.now() + parseInt(data.duration);
    }
    return object;
  }
  setRP(
    data:
      | {
          details: string;
          state: string;
          largeImageKey: string;
          largeImageText: string;
          startTimestamp: number;
          endTimestamp?: number;
        }
      | boolean,
  ) {
    if (!data) {
      this.rpc.clearActivity();
    }
    this.rpc.setActivity(data);
  }
  clear() {
    this.rpc.clearActivity();
  }
}
