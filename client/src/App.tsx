import Game from 'components/GameLayout/';
import Web3 from 'components/web3/App';
import BuildMapLayout from 'components/BuildMap/BuildMapLayout';
import SuperGraph from 'components/SuperfluidGraph/SuperGraph';

import useWeb3 from 'hooks/web3';
import Web3Context from './contexts/Web3Context';
import Loading from 'components/helpers/loading';
import MetaMaskMissing from 'components/helpers/use_wallet/provider_error';
import {useEffect, useState} from 'react';

function App() {
  const {isLoading, web3, account, hasMetamask} = useWeb3();
  const [isConfigured, setIsConfigured] = useState(false);

  useEffect(() => {
    (async () => {
      if (web3 !== null) {
        setIsConfigured(true);
      }
    })();
  }, [web3]);

  if (!isLoading && !hasMetamask) {
    return <MetaMaskMissing />;
  }
  if (isLoading || !isConfigured) {
    return <Loading />;
  }
  return (
    <div className="App">
      <Web3Context.Provider
        value={{
          web3,
          account,
        }}>
        {/* <BuildMapLayout /> */}
        {/* <Game /> */}
        {/* <Web3 /> */}
        <SuperGraph />
      </Web3Context.Provider>
    </div>
  );
}

export default App;
