import React, { PropTypes, Component } from 'react';
import AppBar from 'material-ui/AppBar';
import IconButton from 'material-ui/IconButton';
import IconMenu from 'material-ui/IconMenu';
import Back from 'material-ui/svg-icons/hardware/keyboard-arrow-left'
import Add from 'material-ui/svg-icons/content/add';
import FlatButton from 'material-ui/FlatButton';

import Divider from 'material-ui/Divider';
import Down from 'material-ui/svg-icons/hardware/keyboard-arrow-down';
import Avatar from 'material-ui/Avatar';

import {List, ListItem} from 'material-ui/List';
import {Card, CardHeader, CardText} from 'material-ui/Card';

export default class Dash extends Component {
  // static propTypes = {}
  // static defaultProps = {}
  // state = {}

  render() {
    const { props } = this.props;
    return (
      <div className="Dash">
        <AppBar
          style={{ textAlign: 'center' }}
          title="ABC Business"
          iconElementLeft={<IconButton><Back /></IconButton>}
          // iconElementRight={<IconButton><Add /></IconButton>}
        />
        <Card style={{ margin: '11px' }}>
          <CardHeader
            title="Transactions"
          />
          <List>
            <Divider />                    
              <ListItem
                style={{ textAlign: 'left' }}          
              >
                <div style={{ display: 'flex', flexDirection: 'row' }}>
                    <div style={{ textAlign: 'center', color: 'gray' }}>
                      <div>Oct</div>
                      <div>21</div>
                    </div>
                    <div style={{ marginLeft: '22px' }}>
                      <div>
                        <div>Alameda Wholesalers</div>
                        <div style={{ fontSize: 'smaller', color: 'gray' }}>Inventory</div>
                      </div>
                    </div>
                    <div>
                      <div style={{ color: 'red', position: 'absolute', right: '44px'}}>
                        238.95
                      </div>
                    </div>
                    <Down
                      style={{ position: 'absolute', right: '9px', top: '12px' }}
                    />
                </div>
              </ListItem>
            <Divider />          
            <ListItem
              style={{ textAlign: 'left' }}
            >
              <div style={{ display: 'flex', flexDirection: 'row' }}>
                <div style={{ textAlign: 'center', color: 'gray' }}>
                  <div>Oct</div>
                  <div>18</div>
                </div>
                <div style={{ marginLeft: '22px' }}>
                  <div>
                    <div>DAS IT Solutions</div>
                    <div style={{ fontSize: 'smaller', color: 'gray' }}>Equipment</div>
                  </div>
                </div>
                <div>
                  <div style={{ color: 'red', position: 'absolute', right: '44px'}}>
                    419.06
                  </div>
                </div>
                <Down
                  style={{ position: 'absolute', right: '9px', top: '12px' }}
                />
              </div>
            </ListItem>
            <Divider />                      
            <ListItem
              style={{ textAlign: 'left' }}
            >
              <div style={{ display: 'flex', flexDirection: 'row' }}>
                <div style={{ textAlign: 'center', color: 'gray' }}>
                  <div>Sept</div>
                  <div>27</div>
                </div>
                <div style={{ marginLeft: '15px' }}>
                  <div>
                    <div>OfficeMart</div>
                    <div style={{ fontSize: 'smaller', color: 'gray' }}>Office Supplies</div>
                  </div>
                </div>
                <div>
                  <div style={{ color: 'red', position: 'absolute', right: '44px'}}>
                    31.15
                  </div>
                </div>
                <Down
                  style={{ position: 'absolute', right: '9px', top: '12px' }}
                />
              </div>
            </ListItem>
            <Divider />
            <div style={{ textAlign: 'center' }}>
              <FlatButton label="More Transactions" />
            </div>
          </List> 
          {/*
            <CardActions>
              <FlatButton label="Action1" />
              <FlatButton label="Action2" />
            </CardActions>*/
          }
          // <CardText expandable={true}>
          //   Lorem ipsum dolor sit amet, consectetur adipiscing elit.
          //   Donec mattis pretium massa. Aliquam erat volutpat. Nulla facilisi.
          //   Donec vulputate interdum sollicitudin. Nunc lacinia auctor quam sed pellentesque.
          //   Aliquam dui mauris, mattis quis lacus id, pellentesque lobortis odio.
          // </CardText>
        </Card>
      </div>
    );
  }
}