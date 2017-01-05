import React from 'react';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';

import {greenA700, greenA400, pink400, blue700, blue800} from 'material-ui/styles/colors';

const muiTheme = getMuiTheme({
  palette: {
    primary1Color: blue700,
    primary2Color: blue800,
    accent1Color:  pink400
  },
  appBar: {

  },
});

var Theme = React.createClass({
  render: function() {
    return (
      <MuiThemeProvider muiTheme={muiTheme}>
			  <div style={{width: '100vw'}}> {this.props.children} </div>
			</MuiThemeProvider>
		);
  }
});

export default Theme;
