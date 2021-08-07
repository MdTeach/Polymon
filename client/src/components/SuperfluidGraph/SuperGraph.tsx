import axios from 'axios';
import {useEffect} from 'react';
import StreamComponent from './StreamComponent';
import Loading from 'components/helpers/loading';
import {useState} from 'react';

let contractAddrs = '0x9750A27877BF4A2993b26921b53584Eb4c673618';
contractAddrs = contractAddrs.toLowerCase();
const App = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [playerAddr, setPlayerAddrs] = useState('0x0');
  const [ownAddr, setOwnAddrs] = useState('0x0');
  const [musicAddr, setMusicAddrs] = useState('0x0');
  const [graphAddr, setGraphAddrs] = useState('0x0');
  const [ownerRate, setOwnerRate] = useState(0);
  const [creatorRate, setCreatorRates] = useState(0);
  const [inRates, setInRate] = useState(0);

  const fetchData = async () => {
    // GrapgQL
    const QUERY_URL =
      'https://api.thegraph.com/subgraphs/name/superfluid-finance/superfluid-mumbai';

    const query = `{
			account(id: "${contractAddrs}") {
				flowsReceived {
					flowRate
          owner{
            id
          }
				}
        flowsOwned{
          flowRate
          recipient{
            id
          }
        }
			}
		}
	`;
    const result = await axios.post(QUERY_URL, {query});
    console.log(result);

    const acc = result.data.data.account;

    const player = acc.flowsReceived[0].owner.id;
    const flowIn = acc.flowsReceived[0].flowRate;

    const graphics = acc.flowsOwned[0].recipient.id;
    const music = acc.flowsOwned[1].recipient.id;
    const owner = acc.flowsOwned[2].recipient.id;

    const creatorRate = acc.flowsOwned[0].flowRate;
    const ownerRate = acc.flowsOwned[2].flowRate;

    setInRate(flowIn);
    setPlayerAddrs(player);
    setGraphAddrs(graphics);
    setMusicAddrs(music);
    setOwnAddrs(owner);
    setCreatorRates(creatorRate);
    setOwnerRate(ownerRate);
  };

  useEffect(() => {
    (async () => {
      await fetchData();
      setIsLoading(false);
    })();
  }, []);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div
      style={{
        backgroundColor: '#f8fafc',
        width: '100vw',
        minWidth: '100vw',
        minHeight: '100vh',

        textAlign: 'center',
      }}>
      <div style={{marginLeft: '5em'}}>
        <h2 style={{color: 'gray', padding: '1em', textAlign: 'left'}}>
          Realtime Contract Flow on the SuperContract:
          {' ' + contractAddrs}
        </h2>
        <StreamComponent
          title={'1) From Player to Contract'}
          inflow={true}
          rate={inRates}
          acc1={playerAddr}
          acc2={contractAddrs}
        />
        <StreamComponent
          title={'2) From Contract to MapOwner'}
          inflow={false}
          rate={ownerRate}
          acc1={contractAddrs}
          acc2={ownAddr}
        />
        <StreamComponent
          title={'3) From Contract to MusicOwner'}
          inflow={false}
          rate={creatorRate}
          acc1={contractAddrs}
          acc2={musicAddr}
        />
        <StreamComponent
          title={'4) From Contract to GraphicOwner'}
          inflow={false}
          rate={creatorRate}
          acc1={contractAddrs}
          acc2={graphAddr}
        />
      </div>
    </div>
  );
};

export default App;
