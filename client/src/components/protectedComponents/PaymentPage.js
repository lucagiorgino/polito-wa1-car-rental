import React from 'react' ;
import {Col,Row,Form,Button,Badge} from 'react-bootstrap';
import { Redirect } from 'react-router-dom';
import fetchAPI from '../../api/fetchAPI.js';
import paymentAPI from '../../api/paymentAPI.js';

class PaymentPage extends React.Component {
  
  constructor(props) {
    super(props);    
    this.state = {submitted:false,fullName:"",cardNumber:"",CVVcode:""};
  }

  updateField = (name, value) => {
    this.setState({[name]: value});
  }

  handlePayment = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    
    if (!form.checkValidity()) {
      form.reportValidity();
    } else {

      try{
        await paymentAPI.pay({fullName: this.state.fullName,cardNumber: this.state.cardNumber,CVVcode: this.state.CVVcode});
        await fetchAPI.addRental(this.props.desiredRental);
      }catch(err){
        // handle error
        console.log(err)
      }
      this.props.setPayment();
      this.setState({submitted: true});
    }
  }

  handleClosing = () => {
    this.props.setPayment();
    this.setState({submitted: true});
  }


  render() {
    if (this.state.submitted || !this.props.desiredRental)
      return <Redirect to='/' />;   
    return  ( <>
    <Form method="POST" onSubmit={this.handlePayment} >  
        <Row className="align-items-center">
            <h1 className="mx-3">Payment</h1>
            <ion-icon name="card-outline"></ion-icon>
        </Row>           
        <Form.Group controlId="fullName">
            <Form.Label>Full Name</Form.Label>
            <Form.Control type="text" placeholder="Enter full name" name="fullName" value={this.state.fullName} onChange={(ev) => this.updateField(ev.target.name, ev.target.value)} required/>
        </Form.Group>        
        <Form.Row>
            <Form.Group as={Col} xs="9" controlId="cardNumber">
                <Form.Label>Card Number</Form.Label>
                <Form.Control  minLength="16" maxLength="16" size="16"  type="text" name="cardNumber" value={this.state.cardNumber} onChange={(ev) => this.updateField(ev.target.name, ev.target.value)} required autoFocus/>
            </Form.Group>

            <Form.Group as={Col} xs="3" controlId="CVVcode">
                <Form.Label>CVV code</Form.Label>
                <Form.Control minLength="3" maxLength="3" size="3" type="text" name="CVVcode" value={this.state.CVVcode} onChange={(ev) => this.updateField(ev.target.name, ev.target.value)} required/>
            </Form.Group>
        </Form.Row>
        <Row>
          <Col sm={8}>
            <Row className="mt-2">
              <h4>Price:</h4><h4><Badge className="ml-2" variant="success">{new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(this.props.desiredRental.price)}</Badge></h4>   
            </Row>
          </Col>
          <Col sm={4}>
            <Row>
              <Button className="mr-2" variant="primary" type="submit">Pay</Button>
              <Button variant="secondary" onClick={()=> this.handleClosing()}>Close</Button>
            </Row>            
          </Col>
        </Row>   
        
    </Form >
    
    </>);       
  }
}
export default PaymentPage;