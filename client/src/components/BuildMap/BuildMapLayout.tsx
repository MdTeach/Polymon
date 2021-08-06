import TextField from '@material-ui/core/TextField';
import SaveIcon from '@material-ui/icons/Save';
import Button from '@material-ui/core/Button';
import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import Typography from '@material-ui/core/Typography';

import './BuildMap.css';
import {useState} from 'react';

export default function LayoutTextFields() {
  const [selectedFile, setSelectedFile] = useState(undefined);

  return (
    <div className="container">
      <div>
        <Breadcrumbs aria-label="breadcrumb">
          <h1>Enter the Map NFT Detail here</h1>
        </Breadcrumbs>
        <Breadcrumbs>
          <h3>*Income will be shared between the creators</h3>
          <h4>Map Owner 60%</h4>
          <h4>Graphics 20%</h4>
          <h4>Music 20%</h4>
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
          variant="filled"
        />

        <div className="uploadFile">
          <h3>Enter Tile Source Image(png file)</h3>
          <input type="file" value={selectedFile} onChange={(e) => {}} />
        </div>
        <div className="uploadFile">
          <h3>Enter Music File(.mp3)</h3>
          <input type="file" value={selectedFile} onChange={(e) => {}} />
        </div>
        <div className="uploadFile">
          <h3>Enter TileMap data(json file)</h3>
          <input type="file" value={selectedFile} onChange={(e) => {}} />
        </div>

        <Button
          variant="contained"
          color="primary"
          size="large"
          startIcon={<SaveIcon />}>
          MINT THE MAP
        </Button>
      </div>
    </div>
  );
}
