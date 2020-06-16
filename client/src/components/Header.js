import React from 'react' ;
import Navbar from 'react-bootstrap/Navbar';
import Form from 'react-bootstrap/Form';
import FormControl from 'react-bootstrap/FormControl';
import Nav from 'react-bootstrap/Nav';

import { NavLink } from 'react-router-dom' ;

const logoIcon = <ion-icon name="car-outline"></ion-icon>;
const loggedIcon = <ion-icon  name="person-circle-outline"></ion-icon>;

// onClick={props.showSidebar}/> 

const Header = (props) => {

    return (
    <Navbar bg="light" variant="light" expand="sm" fixed="top">
      <NavLink to='/'> <Navbar.Brand className="d-flex flex-row align-items-center">
        {logoIcon}
        <h4 className="mt-2 ml-2">Car Rental</h4>
      </Navbar.Brand> </NavLink>
      <Form inline className="my-2 my-lg-0 mx-auto d-none d-sm-block"> 
        <FormControl type="text" placeholder="Search" className="mr-sm-2" aria-label="Search"/>
      </Form>
      <Nav className="float-right">
        <NavLink to='/login'>
          <ion-icon  name="person-circle-outline"  onClick={()=> props.userLogout()}></ion-icon>            
        </NavLink>       
      </Nav> 
    </Navbar>
    );
}

export default Header;