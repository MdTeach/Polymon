import TextField from '@material-ui/core/TextField';
import SaveIcon from '@material-ui/icons/Save';
import Button from '@material-ui/core/Button';
import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import {useState, useRef} from 'react';
import {uploadToIPFS} from 'ipfs/ipfs_upload';
import './BuildMap.css';

export default function LayoutTextFields() {
  const [name, setName] = useState('');
  const [owner, setOwner] = useState('');
  const [musicOwner, setMusicOwner] = useState('');
  const [graphicOwner, setGraphicOwner] = useState('');

  const selectedImage = useRef<any>();
  const selectedFile = useRef<any>();
  const selectedAudio = useRef<any>();

  const readUploadedFileAsText = (inputFile: File) => {
    const temporaryFileReader = new FileReader();
    return new Promise((resolve, reject) => {
      temporaryFileReader.onerror = () => {
        temporaryFileReader.abort();
        reject(new DOMException('Problem parsing input file.'));
      };

      temporaryFileReader.onload = () => {
        resolve(temporaryFileReader.result);
      };
      temporaryFileReader.readAsText(inputFile, 'UTF-8');
    });
  };

  const handleJSONUpload = async (file: File) => {
    try {
      const fileContents: any = await readUploadedFileAsText(file);
      const obj = JSON.parse(fileContents);
      console.log(obj);
    } catch (e) {
      console.warn(e.message);
    }
  };

  const handleUpload = async () => {
    const ipfsURI = 'https://ipfs.io/ipfs/';
    if (!selectedImage.current) throw new Error('data not complete');
    if (!selectedFile.current) throw new Error('data not complete');
    if (!selectedAudio.current) throw new Error('data not complete');
    console.log('File check completed, uploading...');

    // upload the image
    var [imgPath, err] = await uploadToIPFS(selectedImage.current);
    if (err) throw new Error('Tile Upload Failed');
    console.log('Img Uploaded');

    // upload the audio
    var [audioPath, err] = await uploadToIPFS(selectedAudio.current);
    if (err) throw new Error('Tile Upload Failed');
    console.log('Music Uploaded');

    // get the json data
    const stringMap: any = await readUploadedFileAsText(selectedFile.current);
    const jsonMap = JSON.parse(stringMap);
    // add audio info to the json
    jsonMap['music'] = ipfsURI + audioPath;
    // upload the jsonMap
    var [mapPath, err] = await uploadToIPFS(JSON.stringify(jsonMap));
    if (err) throw new Error('Tile Upload Failed');
    console.log('Map Uploaded');

    // create full metadata
    const metaData = {
      name: name,
      image: ipfsURI + imgPath,
      titleData: ipfsURI + mapPath,
    };

    // upload the full metadata
    var [mapData, err] = await uploadToIPFS(JSON.stringify(metaData));
    if (err) throw new Error('Tile Upload Failed');
    console.log('All Uploaded');

    return mapData;
  };

  return (
    <div className="container">
      <div>
        <Breadcrumbs aria-label="breadcrumb">
          <h1>Enter the Map NFT Detail here</h1>
        </Breadcrumbs>
        <Breadcrumbs>
          <h3>*Income will be shared between the creators</h3>
          <h4>Map Owner 60%</h4>
          <h4>Graphics Owner 20%</h4>
          <h4>Music Owner 20%</h4>
        </Breadcrumbs>
        <TextField
          id="filled-full-width"
          label="Map Name"
          placeholder="Enter the map name"
          fullWidth
          margin="normal"
          InputLabelProps={{
            shrink: true,
          }}
          value={name}
          onChange={(e) => {
            setName(e.target.value);
          }}
          variant="filled"
        />
        <TextField
          id="filled-full-width"
          label="Map Owner"
          placeholder="Enter Map Owner Address"
          fullWidth
          margin="normal"
          InputLabelProps={{
            shrink: true,
          }}
          value={owner}
          onChange={(e) => {
            setOwner(e.target.value);
          }}
          variant="filled"
        />
        <TextField
          id="filled-full-width"
          label="Graphics Owner"
          placeholder="Enter Graphics Owner Address"
          helperText="cannot be changed later"
          fullWidth
          margin="normal"
          InputLabelProps={{
            shrink: true,
          }}
          value={graphicOwner}
          onChange={(e) => {
            setGraphicOwner(e.target.value);
          }}
          variant="filled"
        />
        <TextField
          id="filled-full-width"
          label="Music Owner"
          placeholder="Enter Music Owner Address"
          helperText="cannot be changed later"
          fullWidth
          margin="normal"
          InputLabelProps={{
            shrink: true,
          }}
          value={musicOwner}
          onChange={(e) => {
            setMusicOwner(e.target.value);
          }}
          variant="filled"
        />

        <div className="uploadFile">
          <h3>Enter Tile Source Image(png file)</h3>
          <input
            type="file"
            value={selectedImage.current}
            onChange={(e) => {
              if (e.target.files && e.target.files[0])
                selectedImage.current = e.target.files[0];
            }}
          />
        </div>
        <div className="uploadFile">
          <h3>Enter Music File(.mp3)</h3>
          <input
            type="file"
            value={selectedAudio.current}
            onChange={(e) => {
              if (e.target.files && e.target.files[0])
                selectedAudio.current = e.target.files[0];
            }}
          />
        </div>
        <div className="uploadFile">
          <h3>Enter TileMap data(json file)</h3>
          <input
            type="file"
            value={selectedFile.current}
            onChange={(e) => {
              if (e.target.files && e.target.files[0])
                selectedFile.current = e.target.files[0];
            }}
          />
        </div>

        <Button
          variant="contained"
          color="primary"
          size="large"
          startIcon={<SaveIcon />}
          onClick={async () => {
            const metaData = await handleUpload();
            console.log('metaData', metaData);
          }}>
          MINT THE MAP
        </Button>
      </div>
    </div>
  );
}
