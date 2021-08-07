import axios from 'axios';
import {useEffect} from 'react';
import StreamComponent from './StreamComponent';
const myAcc = '0xb651D9b48020fa9C02Aa722c3ADb3cF0c4bb5146';

const App = () => {
  const start = async () => {
    // GrapgQL
    const QUERY_URL =
      'https://thegraph.com/explorer/subgraph/superfluid-finance/superfluid-mumbai';
    const query = `{
			account(id: "0xafe0DA2BDBc38A2376C7b775e784075523d3C1AC") {
				flowOwned {
					flowRate
					sum
					lastUpdated
					token {
						id
						symbol
					}
				}
			}
		}
	`;
    const result = await axios.post(QUERY_URL, {query});
    console.log('result ', result);
  };

  useEffect(() => {
    (() => {
      //   start();
    })();
  }, []);

  return (
    <div
      style={{
        backgroundColor: '#f8fafc',
        width: '100vw',
        minWidth: '100vw',
        minHeight: '100vh',

        textAlign: 'center',
      }}>
      <div style={{marginLeft: '2em'}}>
        <h2 style={{color: 'gray', padding: '1em', textAlign: 'left'}}>
          Contract Flow on the MapContract
          0xafe0DA2BDBc38A2376C7b775e784075523d3C1AC
        </h2>
        <StreamComponent
          title={'1) From Player to Contract'}
          inflow={true}
          rate={3500}
          acc1={'0xafe0DA2BDBc38A2376C7b775e784075523d3C1AC'}
          acc2={'0xafe0DA2BDBc38A2376C7b775e784075523d3C1AC'}
        />
        <StreamComponent
          title={'2) From Contract to MapOwner'}
          inflow={false}
          rate={3500}
          acc1={'0xafe0DA2BDBc38A2376C7b775e784075523d3C1AC'}
          acc2={'0xafe0DA2BDBc38A2376C7b775e784075523d3C1AC'}
        />
        <StreamComponent
          title={'3) From Contract to MusicOwner'}
          inflow={false}
          rate={3500}
          acc1={'0xafe0DA2BDBc38A2376C7b775e784075523d3C1AC'}
          acc2={'0xafe0DA2BDBc38A2376C7b775e784075523d3C1AC'}
        />
        <StreamComponent
          title={'4) From Contract to GraphicOwner'}
          inflow={false}
          rate={3500}
          acc1={'0xafe0DA2BDBc38A2376C7b775e784075523d3C1AC'}
          acc2={'0xafe0DA2BDBc38A2376C7b775e784075523d3C1AC'}
        />
      </div>
    </div>
  );
};

export default App;
