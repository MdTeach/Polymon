import Game from 'components/GameLayout/';
import Web3 from 'components/web3/App';
import BuildMapLayout from 'components/BuildMap/BuildMapLayout';
import SuperGraph from 'components/SuperfluidGraph/SuperGraph';
import Home from 'components/Home/Home';

import {BrowserRouter, Route, Switch} from 'react-router-dom';

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
    <BrowserRouter>
      <div className="App">
        <Web3Context.Provider
          value={{
            web3,
            account,
          }}>
          <Switch>
            <Route exact path="/newMap">
              <BuildMapLayout />
            </Route>
            <Route exact path="/home">
              <Home />
            </Route>
            <Route exact path="/graph">
              <SuperGraph />
            </Route>
            <Route exact path="/">
              <Web3 />
            </Route>
          </Switch>
          {/* <Game /> */}
        </Web3Context.Provider>
      </div>
    </BrowserRouter>
  );
}

export default App;
