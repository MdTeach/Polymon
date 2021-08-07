import {create} from 'ipfs-http-client';

const ipfs = create({
  host: 'ipfs.infura.io',
  port: 5001,
  protocol: 'https',
});

// const publishMetaData = async (metaData: MetaDataType) => {
//   const dataStr = JSON.stringify(metaData);
//   try {
//     const {path} = await ipfs.add(dataStr);
//     return [path, null];
//   } catch (error) {
//     return [null, error];
//   }
// };

const uploadToIPFS = async (data: any) => {
  try {
    const {path} = await ipfs.add(data);
    return [path, null];
  } catch (error) {
    return [null, error];
  }
};

export {uploadToIPFS};
