import Web3 from 'web3';

class CryptHelper {
  web3: Web3;
  constructor(web3: Web3) {
    this.web3 = web3;
  }

  HashValidate(flow: number, randomNum: number, puzzleChar: string) {
    console.log('validating', flow);
    const hash = this.getHash(flow, randomNum);
    if (hash && this.checkHash(hash, puzzleChar)) {
      console.log('at', flow, randomNum);
      return true;
    } else {
      return false;
    }
  }

  getHash(flow: number, randomNum: number) {
    const encoded = this.web3.eth.abi.encodeParameters(
      ['uint', 'uint'],
      [`${flow}`, `${randomNum}`],
    );

    const hash = this.web3.utils.sha3(encoded);
    return hash;
  }

  checkHash(hash: string, char: string) {
    console.log(hash.substring(2, 3));
    return hash.substring(2, 3) === char;
  }
}

export default CryptHelper;
