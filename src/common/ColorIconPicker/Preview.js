import React from 'react';
import Radium from 'radium';
import {Paper, FontIcon} from 'syncano-material-ui';
import {Color} from 'syncano-components';

export default Radium(({color, icon}) => {
  const getStyles = () => ({
    container: {
      background: Color.getColorByName(color),
      display: 'flex',
      justifyContent: 'center',
      margin: '0 auto',
      width: 100,
      height: 100,
      borderRadius: '50%',
      textAlign: 'center'
    },
    icon: {
      lineHeight: '100px',
      fontSize: 42,
      display: 'inline-flex',
      justifyContent: 'center',
      alignItems: 'center',
      color: '#fff'
    }
  });

  return (
    <Paper
      zDepth={1}
      style={getStyles().container}>
      <FontIcon
        className={`synicon-${icon}`}
        style={getStyles().icon} />
    </Paper>
  );
});
