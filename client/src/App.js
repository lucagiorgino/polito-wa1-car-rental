
import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import {withRouter} from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Header from './components/Header.js';
import LoginPage from './components/LoginPage.js';
import PublicPage from './components/PublicPage.js';
import PaymentPage from './components/PaymentPage.js';
import ConfigurationFilter from './components/ConfigurationFilter.js';
import './custom.css';
import {AuthContext} from './api/AuthContext.js';
import authAPI from './api/authAPI.js';
import fetchAPI from './api/fetchAPI.js';
class App extends React.Component {

  constructor(props) {
    super(props);    
    this.state = {loading: false, openMobileMenu: false, isLoggedIn: false, user:'', brands:[]};
  }

  componentDidMount() {
    // loading something from the server using API, updating state 
    console.log("calling API");
  }

  // Add a logout method
  logout = () => {
    authAPI.userLogout().then(() => {
      // clearing state
      this.setState({authUser: null,authErr: null});
    });
  }

  // Add a login method
  login = (username, password) => {
    console.log("calling api login")
    
    authAPI.userLogin(username, password).then(
      (user) => { 
        // api call, updating state
        console.log(user);
        this.setState({authUser: user, authErr: null});
        this.props.history.push("/protected");
      }
    ).catch((errorObj) => {
        console.log(errorObj)
        const err0 = errorObj.errors[0];
        this.setState({authErr: err0});
      }
    );
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
    <Router>
      <Header showSidebar={this.showSidebar} />
      <Container fluid>
        <Row className="vheight-100 below-nav ">
          <Switch>
            <Route path="/public/vehicles">              
              <PublicPage/>                 
            </Route>
            <Route path="/protected">
              <Col sm={4} lg={8}>
                <ConfigurationFilter/> 
              </Col>       
            </Route>
            <Route path="/payment">
              <Col sm={4} lg={8}>
                <PaymentPage />
              </Col>
            </Route>
            <Route path="/login">            
                <LoginPage />
            </Route>
            
          </Switch>
        </Row> 
      </Container>
    </Router>
    </AuthContext.Provider>
    );
  } }

export default App;