import Loading from 'components/helpers/loading';

import axios from 'axios';
import {useEffect, useState} from 'react';
import {TileData} from 'types/TiledData';
import {loadMap, Map} from 'engine/maps/Map';

import CrystalTileSprite from 'assets/tilemaps/crystal_min.png';
import {useRef} from 'react';
import Game from 'components/GameLayout/';

const data = {};
const MAPS = [
  'https://ipfs.io/ipfs/QmYQiqDSXW4oztQyN8f6g4EKJF61r2e8Kyg4AVvtpypJF6',
];
const App = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isFailed, setIsFailed] = useState(false);
  const [MapsLoaded, setMapLoaded] = useState<Array<Map>>([]);
  const [MapData, setMapData] = useState<Map>();
  const [isGame, setIsGame] = useState(false);

  useEffect(() => {
    (async () => {
      const {data} = await axios.get(MAPS[0]);
      const {name, image, titleData} = data;

      const tileDataStr: TileData = await axios
        .get(titleData)
        .then((d) => d.data);

      const imgData = await axios.get(image).then((d) => d.data);

      const map = new Map(imgData, tileDataStr);
      await map.loadImage();
      console.log(imgData);
      console.log('map is', map);
      setMapLoaded((old) => [...old, map]);
      setIsLoading(false);
    })();
  }, []);

  function handleSwitch(id: number) {
    setMapData(MapsLoaded[id]);
    setIsGame(true);
  }

  if (isLoading) {
    return <Loading />;
  }

  if (isGame) {
    if (!MapData) throw new Error('dada ended');
    return <Game mapData={MapData} />;
  }

  return (
    <div style={{fontFamily: 'sans-serif'}}>
      <h1>Dadda</h1>
      {MapsLoaded.map((el, id) => (
        <div key={id}>
          <h1>Play on this map</h1>
          <img src={el.tileSheet.src} width="400px" height="100px" alt="aam" />
          <h3>Num pokemons: 3</h3>
          <button
            onClick={(_) => {
              handleSwitch(id);
            }}>
            Enter
          </button>
        </div>
      ))}
    </div>
  );
};

export default App;
