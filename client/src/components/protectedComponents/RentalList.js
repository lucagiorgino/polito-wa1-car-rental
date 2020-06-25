import React from 'react' ;
import RentalItem from "./RentalItem.js";
import {ListGroup,Row,Col} from 'react-bootstrap';

const RentalList = (props) => {

  let {rentals, deleteRental} = props;    
  
  return  (
  <>
      {rentals && 
      <ListGroup as="ul" variant="flush"> 
        <ListGroup.Item>
          <Row className="justify-content-between">
            <Col sm="1"><h6>Cat.</h6></Col>   
            <Col sm="2"><h6>Brand</h6></Col>
            <Col sm="2"><h6>Model</h6></Col>
            <Col sm="3"><h6>Start Date</h6></Col>
            <Col sm="3"><h6>End Date</h6></Col>
            <Col sm="1"></Col>
          </Row>
        </ListGroup.Item>
        {rentals.map((r) => <RentalItem key= {r.car.licensePlate+r.startDate+r.endDate} rental={r} deleteRental = {deleteRental}/>) }
      </ListGroup>}
  </>
  );
           
}

export default RentalList;