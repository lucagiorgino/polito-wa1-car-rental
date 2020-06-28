
import React from 'react';
import { Route, Switch,withRouter, Redirect } from 'react-router-dom';
import {Container,Row,Spinner} from 'react-bootstrap';

import Header from './components/Header.js';
import LoginPage from './components/LoginPage.js';
import PublicPage from './components/publicComponents/PublicPage.js';
import ProtectedPages from './components/protectedComponents/ProtectedPages.js';

import {AuthContext} from './api/AuthContext.js';
import authAPI from './api/authAPI.js';
import './custom.css';

class App extends React.Component {

  constructor(props) {
    super(props);    
    this.state = {loading: false, authUser: null, authErr: null };
  }

  componentDidMount() {
    this.isAuthenticated();
  }

  isAuthenticated = () => {
    //check if the user is authenticated
    this.setState({loading: true});
    authAPI.isAuthenticated().then(
      (user) => {
        console.log("Already logged in")
        this.setState({loading:false,authUser: user});
      }
    ).catch((err) => { 
      // this.setState({authUser: null});
      // this.setState({authErr: err.errObj.errors[0]});   // on Reload will appear message   

      this.setState({loading:false},() => {
        // to stay on public page
        if(this.props.location.pathname.search("protected") !== -1){
          this.props.history.push("/login");
        }
      });    
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
    ).catch((err) => {
        const err0 = err.errObj.errors[0];
        this.setState({authUser: null, authErr: err0});
      }
    );
  }
  
  handleUnauthorizedErrors = (err) => {
    if (err) {
        if (err.status && err.status === 401) {
          this.setState({authUser: null, authErr: err.errObj.errors[0]});
          this.props.history.push("/login");
        }
    }
  }
  
  render() { 
    // console.log()
    // compose value prop as object with user object and logout method
    const value = {
      authUser: this.state.authUser,
      authErr: this.state.authErr,
      loginUser: this.login,
      logoutUser: this.logout,
      errorAuthHandler: this.handleUnauthorizedErrors 
    }

    return (<>
    { this.state.loading ? 
      <Container>
        <Row className="vheight-100 d-flex align-content-center justify-content-md-center">
          <Spinner variant="primary" animation='border' role="status" aria-hidden="true"/> 
        </Row>
      </Container>
      : 
      <AuthContext.Provider value={value}>
      {this.props.location.pathname !== '/protected/payment' && <Header showSidebar={this.showSidebar} />}
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
            <Route path="/protected" >
             
              <ProtectedPages isAuthenticated={this.isAuthenticated} />
                   
            </Route>
            <Route path="/login">
                {this.state.authUser && <Redirect to='/protected/rent'/>}            
                <LoginPage />
            </Route>            
          </Switch>
        </Row> 
      </Container>
    </AuthContext.Provider>

    }
    </>);
  } }

export default withRouter(App);