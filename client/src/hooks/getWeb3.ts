import Web3 from 'web3';

interface Window {
  ethereum: any;
  web3: Web3;
  addEventListener: any;
}
declare const window: Window;

const web3 = (): Promise<Web3> => {
  return new Promise((resolve, reject) => {
    window.addEventListener('load', async () => {
      if (window.ethereum) {
        console.log(window.ethereum.networkVersion);
        // Modern Dapp Browser...
        const web3 = new Web3(window.ethereum);
        try {
          await window.ethereum.enable();
          const id: number = await web3.eth.net.getId();
          if (id !== 4) reject(new Error('Invalid network id'));
          resolve(web3);
        } catch (error) {
          reject(error);
        }
      } else if (window.web3) {
        // Use metamask provider
        const web3 = window.web3;
        console.log('Injected web3 detected.');
        const id: number = await web3.eth.net.getId();
        if (id !== 4) reject(new Error('Invalid network id'));

        resolve(web3);
      } else {
        // Fallback to localhost ganache
        // const provider = new Web3.providers.HttpProvider(
        //   'http://127.0.0.1:7545',
        // );
        // const web3 = new Web3(provider);
        console.log('No web3 instance injected, using Local web3.');
        const err = Error('Metamask not found');
        reject(err);
      }
    });
  });
};

export default web3;
