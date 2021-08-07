import {useState, useEffect} from 'react';
import Web3 from 'web3';
import getWeb3 from './getWeb3';

type state = {
  isLoading: boolean;
  web3: Web3 | null;
  account: string;
  hasMetamask: boolean;
};

type Window = any;
declare const window: Window;

const Hooks = (): state => {
  const [state, setState] = useState<state>({
    isLoading: true,
    web3: null,
    hasMetamask: true,
    account: '',
  });

  // reload on the account change
  useEffect(() => {
    window.addEventListener('load', async () => {
      if (window.ethereum) {
        window.ethereum.on('accountsChanged', function () {
          window.location.reload();
        });

        window.ethereum.on('chainChanged', function () {
          window.location.reload();
        });
      }
    });
  }, []);

  useEffect(() => {
    (async (): Promise<void> => {
      try {
        const web3: Web3 = await getWeb3();
        const accounts = await web3.eth.getAccounts();
        setState({
          ...state,
          isLoading: false,
          web3,
          account: accounts[0],
        });
      } catch (e) {
        setState({
          ...state,
          hasMetamask: false,
          isLoading: false,
        });
      }
    })();
  }, [state]);

  const {isLoading, web3, account, hasMetamask} = state;
  return {isLoading, web3, account, hasMetamask};
};
export default Hooks;
