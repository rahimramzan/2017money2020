import React, { PropTypes, Component } from 'react';
import { Link } from 'react-router';
import './App.css';

import AppBar from 'material-ui/AppBar';
import IconButton from 'material-ui/IconButton';
import IconMenu from 'material-ui/IconMenu';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import Add from 'material-ui/svg-icons/content/add';
import Alert from 'material-ui/svg-icons/action/announcement';

import Divider from 'material-ui/Divider';

import {List, ListItem} from 'material-ui/List';
// import Subheader from 'material-ui/Subheader';
import Avatar from 'material-ui/Avatar';

class App extends Component {
  // static propTypes = {}
  // static defaultProps = {}
  // state = {}

  render() {
    return (
      <div className="App">
        <AppBar
          title="Stores"
          iconElementRight={<IconButton><MoreVertIcon /></IconButton>}
          iconElementRight={<IconButton><Add /></IconButton>}
        />
        <List>
          <Link to="/dash" >
            <ListItem
              style={{ textAlign: 'left' }}
              primaryText="ABC Business"
              rightIcon={
                <Alert
                  style={{ fill: 'orange' }}
                />}            
              leftAvatar={<Avatar>A</Avatar>}
            />
          </Link>
          <Divider />          
          <ListItem
            style={{ textAlign: 'left' }}
            primaryText="John's Diner"
            leftAvatar={<Avatar>J</Avatar>}
          />
          <Divider />          
        </List>
      </div>
    );
  }
}

export default App;
