import React from 'react' ;

import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import { Link } from 'react-router-dom';

class PaymentPage extends React.Component {
    constructor(props) {
        super(props);
    }

  updateField = (name, value) => {
    this.setState({[name]: value});
  }

  handleClick = (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    
    if (!form.checkValidity()) {
      form.reportValidity();
    } else {
      
    }
  }

  validateForm = (event) => {
    event.preventDefault();
  }

  render() {   
    return  ( <>
    <Form method="POST" onSubmit={this.validateForm} >  
        <Row className="align-items-center">
            <h1 className="mx-3">Payment</h1>
            <ion-icon name="card-outline"></ion-icon>
        </Row>           
        <Form.Group controlId="fullName">
            <Form.Label>Full Name</Form.Label>
            <Form.Control type="text" placeholder="Enter full name"/>
        </Form.Group>        
        <Form.Row>
            <Form.Group as={Col} xs="9" controlId="cardNumber">
                <Form.Label>Card Number</Form.Label>
                <Form.Control type="text" name="cardNumber" onChange={(ev) => this.updateField(ev.target.name, ev.target.value)} required={true} autoFocus/>
            </Form.Group>

            <Form.Group as={Col} xs="3" controlId="CVVcode">
                <Form.Label>CVV code</Form.Label>
                <Form.Control type="text" name="CVVcode" onChange={(ev) => this.updateField(ev.target.name, ev.target.value)}/>
            </Form.Group>
        </Form.Row>   
        <Button  variant="primary" onClick={(ev)=> this.handleClick(ev)} className="mr-2">Pay</Button>
        <Link to ='/'><Button variant="secondary">Close</Button></Link>
    </Form >

    </>);       
  }
}
export default PaymentPage;