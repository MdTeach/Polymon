import Web3 from 'web3';

interface Web3ContextType {
  web3?: Web3 | null;
  account?: String | undefined;
}

export default Web3ContextType;
