import React, { Component } from 'react';
import { Container, Divider, Icon, Header } from 'semantic-ui-react';
import {NavMenu} from '../components';
import { withRouter } from 'react-router';

class Home extends Component {
  render() {
    const {authUser} = this.props;
    return (
      <div>
        <NavMenu authUser={authUser} activePath="home"/>
        <Container>
          <Header as="h1">
            <Icon name="cocktail" />
            Welcome to Mimosa
          </Header>
          <Divider />
          <p>Project Mimosa is Puppet working to do more cloudy...stuff</p>
        </Container>
      </div>
    )
  }
}

const condition = authUser => !!authUser;

console.log(condition);

export default withRouter(Home);