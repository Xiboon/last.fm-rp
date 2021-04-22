import SongHandler from './handlers/SongHandler';
import RPCHandler from './handlers/RPCHandler';
const config = require('../config.json');
const RPHandler = new RPCHandler();
const TrackHandler = new SongHandler(config.user, config.apikey);
TrackHandler.on('songChange', async function (song) {
  if (!RPHandler.ready) return;
  song = TrackHandler.parseTrack(song);
  if (song['@attr']?.nowplaying !== 'true') return;
  const info = await TrackHandler.getSongInfo(song.artist['#text'], song.name);
  const rp = RPHandler.parseToRP(info);
  RPHandler.setRP(rp);
});
TrackHandler.on('songPause', () => {
  RPHandler.clear();
});
