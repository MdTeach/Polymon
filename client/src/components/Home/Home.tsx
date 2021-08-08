import Loading from 'components/helpers/loading';

import axios from 'axios';
import {useEffect, useState} from 'react';
import {TileData} from 'types/TiledData';
import {loadMap, Map} from 'engine/maps/Map';

import CrystalTileSprite from 'assets/tilemaps/crystal_min.png';
import {useRef} from 'react';

const data = {};
const MAPS = [
  'https://ipfs.io/ipfs/QmfSR3M7o2dpoAcws5JumFAcMiWRZn9vFsR1ZydMhGeVB3',
];
const App = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isFailed, setIsFailed] = useState(false);
  const [MapsLoaded, setMapLoaded] = useState<Array<Map>>([]);

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

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div>
      <h1>Dadda</h1>
      {MapsLoaded.map((el, id) => (
        <div key={id}>
          <h1>Play on this map</h1>
          <img src={el.tileSheet.src} width="400px" height="100px" alt="aam" />
          <h3>Num pokemons: 3</h3>
        </div>
      ))}
    </div>
  );
};

export default App;
