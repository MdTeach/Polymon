import {useEffect, useRef} from 'react';
import Portis from '@portis/web3';
import Web3 from 'web3';
import {useState} from 'react';
import Crypt from './miners';
const SuperfluidSDK = require('@superfluid-finance/js-sdk');
const {Web3Provider} = require('@ethersproject/providers');
// const portis = new Portis("f97033cf-d0ae-4221-880b-f4cafbacd59b", "rinkeby");
// const portis = new Portis(
//   "f97033cf-d0ae-4221-880b-f4cafbacd59b",
//   "maticMumbai"
// );

// https://polygon-mumbai.infura.io/v3/ad0f7d8b5f45447fa15576f4f2c0c0bf
const myLocalPOANode = {
  nodeUrl: 'https://matic-mumbai.chainstacklabs.com',
  chainId: 80001,
};

type Window = any;
declare const window: Window;
const p: any = Portis;
// const portis = new p("f97033cf-d0ae-4221-880b-f4cafbacd59b", myLocalPOANode);
// const web3 = new Web3(portis.provider);
const web3 = new Web3(window.ethereum);
const sf = new SuperfluidSDK.Framework({
  web3: web3,
});
const crypt = new Crypt(web3);

const randomNum = 8104;
const puzzleChar = 'f';

function App() {
  const [acc, setAcc] = useState('0x0');
  const [isLoading, setIsLoading] = useState(true);
  const [isStreaming, setIsStreaming] = useState(false);
  const [user, setUser] = useState<any>();
  // const flowRate = 3858024635802;
  const flowRate = 57870370370370; //150 permonth
  const ctr = useRef(0);
  const id = useRef<any>(null);
  const receipt = '0x5A6C83E613B36a045b59139A48dc177B5B3fc657';
  const handleFlow = async () => {
    await user.flow({
      recipient: receipt,
      flowRate: `${flowRate}`,
    });

    setIsStreaming(true);
    console.log('abishek bashyal');
  };

  const stopFlow = async () => {
    await user.flow({
      recipient: receipt,
      flowRate: '0',
    });
    setIsStreaming(false);
  };

  useEffect(() => {
    (async () => {
      // const [acc] = await web3.eth.getAccounts();
      const acc = '0xafe0DA2BDBc38A2376C7b775e784075523d3C1AC';
      setAcc(acc);
      console.log('Accountds loaded');
      await sf.initialize();
      console.log('sf inited');

      const carol = sf.user({
        address: acc,
        token: '0x5D8B4C2554aeB7e86F387B4d6c00Ac33499Ed01f',
      });
      setUser(carol);
      setIsLoading(false);
    })();
  }, []);

  const timeOutFunc = async () => {
    id.current = setInterval(async () => {
      ctr.current += 1;
      console.log('Doing', ctr.current);
      if (crypt.HashValidate(ctr.current * flowRate, randomNum, puzzleChar)) {
        // found flow
        console.log('minted at', ctr.current * flowRate, randomNum);
        console.log(
          'reqhash',
          crypt.getHash(ctr.current * flowRate, randomNum),
        );

        await stopFlow();
      }
    }, 1000);
  };

  useEffect(() => {
    if (isStreaming) {
      timeOutFunc();
    } else {
      console.log('clear');
      clearInterval(id.current);
    }
  }, [isStreaming]);

  return (
    <div className="App" style={{textAlign: 'center'}}>
      {isLoading ? (
        <div>Loading..</div>
      ) : (
        <div>
          Acc {acc}
          {isStreaming ? <h4>Streaming....</h4> : null}
          <h1>Hello</h1>
          <br />
          <br />
          <button onClick={() => handleFlow()}>Handle flow</button>
          <br />
          <br />
          <button onClick={() => stopFlow()}>Stop flow</button>
        </div>
      )}
    </div>
  );
}

export default App;
