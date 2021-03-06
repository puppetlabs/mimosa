import React, {Component} from 'react';
import 'semantic-ui-css/semantic.min.css'
import './App.css'
import {MimosaHeader} from './components';
import {
  Login,
  HostsView,
  RunTask,
  Home,
  Workspaces,
  RunContext,
  RunDetail,
  HostDetailView,
  NotFound,
  TaskResult,
  VulnsView,
  VulnsDetailView
} from './view';
import {
  Switch,
  Router,
  Route,
} from "react-router-dom";
import { withFirebase } from './utils/Firebase';
import history from './utils/history';
import cookie from 'react-cookies';

// The router will only allow access to login for 
// users that have not logged in. 
// Also history is passed in to be used by components e.g. NavMenu
class App  extends Component {
  constructor(props) {
    super(props);
    this.state = {
      authUser: null,
    };
  }
  // get user and set as state if logged into firebase
  componentDidMount() {
    this.listener = this.props.firebase.auth.onAuthStateChanged(authUser => {
      authUser
      ? this.setState({ authUser })
      : this.setState({ authUser: null });
    });
  }
  // when leaving/unmounting App, remote the listener
  // done to avoid potential performance issues
  componentWillUnmount() {
    this.listener();
  }

  render() {
    const {firebase} = this.props;

    return (
        <div>
          <MimosaHeader />
          <Router history={history}>
            <Switch>
              <Route exact path="/login" render={() => <Login authUser={this.state.authUser} history={history} />} firebase={firebase} />
              <Route exact path="/ws/:wsid/home" authUser={this.state.authUser} render={() => <Home authUser={this.state.authUser} history={history} firebase={firebase}  />}/>
              <Route exact path="/ws" render={() => <Workspaces authUser={this.state.authUser} firebase={firebase}/>} />
              <Route exact path="/ws/:wsid/hosts" render={() => <HostsView authUser={this.state.authUser} firebase={firebase} />} />
              <Route exact path="/ws/:wsid/host/:hostid" render={() => <HostDetailView authUser={this.state.authUser} firebase={firebase} />} />
              <Route exact path="/ws/:wsid/vulns" render={() => <VulnsView authUser={this.state.authUser} firebase={firebase} />} />
              <Route exact path="/ws/:wsid/vuln/:vulnid" render={() => <VulnsDetailView authUser={this.state.authUser} firebase={firebase} />} />
              <Route exact path="/ws/:wsid/run-context" render={() => <RunContext authUser={this.state.authUser} firebase={firebase} />} />
              <Route exact path="/ws/:wsid/run-task" render={() => <RunTask authUser={this.state.authUser} firebase={firebase} />} />
              <Route exact path="/ws/:wsid/run/:runid" render={() => <TaskResult authUser={this.state.authUser} history={history} firebase={firebase} />} />
              <Route render={() => <NotFound history={history}/> } />
            </Switch>
          </Router>
        </div>
    )
  }
}
export default withFirebase(App);
