import LinearProgress from '@material-ui/core/LinearProgress';

const getAddress = (s: string) => {
  const lenght = s.length - 1;
  const ss = s.substring(0, 7) + '....' + s.substring(lenght - 7, lenght);
  return ss;
};

const Box = ({acc1}: {acc1: string}) => {
  return (
    <div
      style={{
        backgroundColor: '#ffffff',
        width: '320px',
        height: '100px',
        borderRadius: '18px',
        border: '4px solid #cbd0d5 ',
      }}>
      <div
        style={{
          padding: '42px 10px',
          color: '#9da1a5',
          fontWeight: 'bold',
          fontSize: '16px',
        }}>
        {getAddress(acc1)}
      </div>
    </div>
  );
};

const App = ({
  title,
  inflow,
  rate,
  acc1,
  acc2,
}: {
  title: String;
  inflow: boolean;
  rate: number;
  acc1: string;
  acc2: string;
}) => {
  return (
    <div style={{width: '1100px', backgroundColor: '#f8fafc', padding: '1em'}}>
      <div
        style={{
          color: '#9da1a5',
          fontWeight: 'bold',
          fontSize: '18px',
          padding: '0.5em',
        }}>
        <h4 style={{textAlign: 'left'}}>{title}</h4>
      </div>
      <div style={{display: 'flex', justifyContent: 'space-between'}}>
        <Box acc1={acc1} />
        <div style={{flex: 3, paddingTop: '13px'}}>
          <p
            style={{
              margin: '10px 0',
              color: '#9da1a5',
              fontWeight: 'bold',
              fontSize: '12px',
            }}>
            {rate} tokens per second
          </p>
          <LinearProgress color={inflow ? 'primary' : 'secondary'} />
          <br />
          <LinearProgress color={inflow ? 'primary' : 'secondary'} />
          <br />
        </div>
        <Box acc1={acc2} />
      </div>
    </div>
  );
};
export default App;
