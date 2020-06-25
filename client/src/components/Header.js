import React, { useContext } from 'react' ;
import { Navbar, Nav,Row } from "react-bootstrap";
import { NavLink } from 'react-router-dom' ;
import {AuthContext} from '../api/AuthContext.js';

const logoIcon = <ion-icon className="mt-2" name="car-outline"></ion-icon>;
// const loggedIcon = <ion-icon  name="person-circle-outline"></ion-icon>;

// onClick={props.showSidebar}/> 

function Header(props){

  const authContext = useContext(AuthContext); 

  return (
  <Navbar bg="light" variant="light" expand="sm" fixed="top">
        
    <Navbar.Brand as={NavLink} to='/' className="d-flex flex-row align-items-center">
      {logoIcon}
      <h4 className="ml-2 mt-2">Car Rental</h4>
    </Navbar.Brand>
    {authContext.authUser ? 
      <>
        <Nav className="mr-auto mt-1">
            <Nav.Link as={NavLink} to="/protected/history">Past and Active rentals</Nav.Link> 
            <Nav.Link as={NavLink} to="/protected/future">Future reservations</Nav.Link> 
        </Nav>
        <Nav className="float-right mr-2">   
            <Nav.Link >
              <Row className="mr-4">
                <h6 className="mr-2 mt-2">{authContext.authUser.username}</h6>  
                <ion-icon name="person-circle-outline"></ion-icon>  
              </Row>
            </Nav.Link>             
            <Nav.Link onClick={() => authContext.logoutUser()}>
              <Row>          
                <ion-icon name="log-out-outline" ></ion-icon>    
                <h6 className="ml-2 mt-2">Logout</h6>   
              </Row>      
            </Nav.Link>            
        </Nav> 
      </> : <>
        <Nav className="mr-auto mt-1">
          <Nav.Link as={NavLink} to={{pathname: "/public/vehicles", state: "desiredState"}} >View our vehicles!</Nav.Link> 
        </Nav>
        <Nav className="float-right mr-2">   
            <Nav.Link as={NavLink} to="/login"> 
              <Row>          
                <ion-icon name="log-in-outline" ></ion-icon>  
                <h6 className="ml-2 mt-2">Login</h6>   
              </Row>
            </Nav.Link>            
        </Nav> 
      </>
    }
  </Navbar>
  );
}

export default Header;