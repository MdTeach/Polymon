import Game from 'components/GameLayout/';
import Web3 from 'components/web3/App';
import BuildMapLayout from 'components/BuildMap/BuildMapLayout';
import SuperGraph from 'components/SuperfluidGraph/SuperGraph';

function App() {
  return (
    <div className="App">
      {/* <BuildMapLayout /> */}
      {/* <Game /> */}
      {/* <Web3 /> */}
      <SuperGraph />
    </div>
  );
}

export default App;
