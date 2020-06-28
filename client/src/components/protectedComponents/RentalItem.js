import React from 'react' ;
import moment from 'moment';
import {ListGroup,Badge,Col,Row} from 'react-bootstrap';


const RentalItem = (props) => {

  let {rental, deleteRental} = props;

  let active = moment().isAfter(moment(rental.startDate,"YYYY-MM-DD")) && moment().isBefore(moment(rental.endDate,"YYYY-MM-DD"));
  let future = moment(rental.startDate,"YYYY-MM-DD").isAfter(moment());
  let color = "";
  if (active)
    color = "bg-warning";
  return(
    <ListGroup.Item>
        <Row className="justify-content-md-center">
          <Col sm="1"><Badge variant="light">{rental.car.category}</Badge></Col>
          <Col sm="2"><small>{rental.car.brand}</small></Col>
          <Col sm="2"><small>{rental.car.model}</small></Col>
          <Col sm="3"><small>{moment(rental.startDate,"YYYY-MM-DD").format('ll')}</small></Col>
          <Col sm="3"><small className={color}>{moment(rental.endDate,"YYYY-MM-DD").format('ll')}</small></Col>
          <Col sm="1">{
            (future && <ion-icon style={{fontSize: '16px'}} onClick={() => deleteRental(rental)} name="trash-outline"></ion-icon> ) ||
            (active && <ion-icon style={{fontSize: '16px'}} name="radio-button-on-outline"></ion-icon>)
          } 
          </Col>
            
          </Row>
    </ListGroup.Item>
  );
}


export default RentalItem;