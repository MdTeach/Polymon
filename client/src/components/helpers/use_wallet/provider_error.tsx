import bg from './load.svg';
function ProviderInfo() {
  return (
    <div
      className="someClassName"
      style={{
        padding: '5% 25%',
        textAlign: 'center',
        minHeight: '100vh',
        backgroundImage: `url(${bg})`,
        backgroundRepeat: 'no-repeat',
        // background-repeat: 'no-repeat',
      }}>
      <div
        style={{
          marginTop: '5em',
          backgroundColor: '#2F2E41',
          padding: '4em',
          borderRadius: '5px',
          marginLeft: '50px',
        }}>
        <h1 style={{fontSize: '2.5em', color: '#7071FC'}}>
          Opps! Metamask not detected or not connected to Rinkey Testnet
        </h1>
        <br />
        <p style={{fontSize: '1.5em', fontWeight: 'bold', color: '#7071FC'}}>
          Ensure that metamask browser extention is installed and connected to
          rinkeby testnetwork
        </p>
      </div>
    </div>
  );
}
export default ProviderInfo;
