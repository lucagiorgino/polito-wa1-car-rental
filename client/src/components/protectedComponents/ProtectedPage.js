import React, { useContext, useEffect, useState } from 'react';
import {Col,Row, Modal, Button} from 'react-bootstrap';
import ConfigurationFilter from './ConfigurationFilter.js';
import RentalList from './RentalList.js';
import {AuthContext} from '../../api/AuthContext.js';
import { Switch,Route,Redirect } from 'react-router-dom';
import PaymentPage from './PaymentPage.js';
import fetchAPI from '../../api/fetchAPI.js';
import moment from 'moment';

function ProtectedPage(props) {
    
    const authContext = useContext(AuthContext);
    const [rentals,setRentals] = useState([]);
    const [desiredRental,setDesiredRental] = useState(null);

    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    useEffect( () => {
        // warning solution from https://stackoverflow.com/questions/53949393/cant-perform-a-react-state-update-on-an-unmounted-component
        let isMounted = true; // note this flag denote mount status 
        fetchAPI.getRentalsForUser()
        .then((r) => { 
            if (isMounted) setRentals(r);
        })
        .catch((errorObj) => {
            // this.handleErrors(errorObj);
        }); 
        return () => { isMounted = false }; // use effect cleanup to set flag false, if unmounted
        
    }, []);
    
    const updateDesiredRental = (desiredRental) => {
        setDesiredRental(desiredRental);
    }
  
    const deleteRental = (rental) => {

        fetchAPI.deleteRental(rental)
        .then( () => {

            fetchAPI.getRentalsForUser()
            .then((r) => { 
                setRentals(r);
            })
            handleShow();
        })
        .catch((errorObj) => {

        });   
  
    };

    return (<>
        {!authContext.authUser && <Redirect to='/login'/>}
        
        <Switch>
            <Route path="/protected/rent">
                <Col sm={3} lg={4}></Col>     
                <Col sm={6} lg={4} >
                    <Row className="align-items-center">
                        <h1 className="mx-3">Rent a car!</h1>
                        <ion-icon name="key-outline"></ion-icon>
                    </Row>            
                    <ConfigurationFilter updateDesiredRental={updateDesiredRental} setPayment={props.setPayment} rentals={rentals}/> 
                </Col> 
            </Route>
            <Route path="/protected/payment">
                <Col sm={3} lg={4}></Col>     
                <Col sm={6} lg={4} >
                    <PaymentPage desiredRental={desiredRental} deleteRental={deleteRental} setPayment={props.setPayment} /> 
                </Col>      
            </Route>
            <Route path="/protected/future">
                <Col sm={2} lg={3}></Col>     
                <Col sm={10} lg={6}>
                    <h2>Your future rentals!</h2>
                    <RentalList rentals={rentals.filter( (r) => moment().isBefore(moment(r.startDate)))} deleteRental={deleteRental}/> 
                </Col>

                <Modal show={show} onHide={handleClose} animation={false} aria-labelledby="contained-modal-title-vcenter" centered>
                    <Modal.Header closeButton >
                    <Modal.Title>Information</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>Your refund credit will appear on your card within 5-7 business days!</Modal.Body>
                    <Modal.Footer>
                    <Button variant="primary" onClick={handleClose}>
                        Close
                    </Button>
                    </Modal.Footer>
                </Modal>
            </Route>
            <Route path="/protected/history">
                <Col sm={2} lg={3}></Col>     
                <Col sm={10} lg={6}>
                    <h2 className="my-3">Your past and active rentals!</h2>
                    <RentalList rentals={rentals.filter( (r) => !moment().isBefore(moment(r.startDate)))} deleteRental={deleteRental}/> 
                </Col>
            </Route>
        </Switch>
            
        
        
        
    </>);
    
}
export default ProtectedPage;