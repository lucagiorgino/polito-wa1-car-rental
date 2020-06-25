
import React from 'react';
import { Route, Switch,withRouter, Redirect } from 'react-router-dom';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Header from './components/Header.js';
import LoginPage from './components/LoginPage.js';
import PublicPage from './components/publicComponents/PublicPage.js';
import ProtectedPage from './components/protectedComponents/ProtectedPage.js';

import './custom.css';
import {AuthContext} from './api/AuthContext.js';
import authAPI from './api/authAPI.js';

class App extends React.Component {

  constructor(props) {
    super(props);    
    this.state = {loading: false, openMobileMenu: false, isLoggedIn: false, user:'', payment: false};
  }

  componentDidMount() {
    //check if the user is authenticated
    authAPI.isAuthenticated().then(
      (user) => {
        console.log("Already logged in")
        this.setState({authUser: user});
      }
    ).catch((err) => { 
      this.setState({authErr: err.errorObj});      
      // to stay on public page
      if(this.props.location.pathname.search("protected") !== -1){
        this.props.history.push("/login");
      }
    });
  }

  // Add a logout method
  logout = () => {
    authAPI.userLogout().then(() => {
      // clearing state
      this.setState({authUser: null,authErr: null});
      this.props.history.push("/login");
    });
  }

  // Add a login method
  login = (username, password) => {    
    authAPI.userLogin(username, password).then(
      (user) => { 
        this.setState({authUser: user, authErr: null});
        this.props.history.push("/protected/rent");
      }
    ).catch((errorObj) => {
        console.log(errorObj)
        const err0 = errorObj.errors[0];
        this.setState({authErr: err0});
      }
    );
  }

  // hide Header for payment page 
  setPayment = () => {
    this.setState({payment: !this.state.payment});
  }

  handleError = (errorObj) => {
    const err0 = errorObj.errors[0];
    this.setState({authErr: err0});
  }

  render() { 
    // compose value prop as object with user object and logout method
    const value = {
      authUser: this.state.authUser,
      authErr: this.state.authErr,
      loginUser: this.login,
      logoutUser: this.logout
    }

    return (
    <AuthContext.Provider value={value}>
      {!this.state.payment && <Header showSidebar={this.showSidebar} />}
      <Container fluid>
        <Row className="vheight-100 below-nav ">
          <Switch>
            <Route exact path="/">
              {this.state.authUser ? <Redirect to='/protected/rent'/> : <Redirect to='/login'/>}    
            </Route>
            <Route path="/public/vehicles" render={(match) => {
              // for url direct access and enabling checkbox
              return <PublicPage query={match.location.search}/>;
            }}>              
                              
            </Route>
            <Route path="/protected">
              <ProtectedPage setPayment={this.setPayment}/>      
            </Route>
            <Route path="/login">
                {this.state.authUser && <Redirect to='/protected/rent'/>}            
                <LoginPage />
            </Route>            
          </Switch>
        </Row> 
      </Container>
    </AuthContext.Provider>
    );
  } }

export default withRouter(App);