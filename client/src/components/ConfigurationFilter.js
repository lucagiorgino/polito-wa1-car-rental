import React from 'react' ;

import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import moment from 'moment';
import {Redirect} from 'react-router-dom';
import {AuthContext} from '../api/AuthContext'

class ConfigurationFilter extends React.Component {
	constructor(props) {
		super(props);
	}


	render() {   
		return  (
			<AuthContext.Consumer>
      {(context) => (
        <>
        {context.authErr && <Redirect to = "/login"></Redirect>}
         
		<Form method="POST" >
			<Form.Row>
				<Form.Group as={Col} controlId="formStartDate">
					<Form.Label>Start Date</Form.Label>
					<Form.Control className="mr-sm-2" type="date"/> 
				</Form.Group>
				<Form.Group as={Col} controlId="formEndDate">
					<Form.Label>End Date</Form.Label>
					<Form.Control className="mr-sm-2" type="date"/> 
				</Form.Group>
			</Form.Row> 
			<Form.Row>            
				<Form.Group as={Col} controlId="formCategory">
					<Form.Label>Category</Form.Label>
					<Form.Control as="select" defaultValue="..." custom>
						<option disabled="disabled">...</option>
						<option value="A">A</option>
						<option value="B">B</option>
						<option value="C">C</option>
						<option value="D">D</option>
						<option value="E">E</option>
					</Form.Control>
				</Form.Group>
				<Form.Group as={Col} controlId="formKm">
						<Form.Label>Estimated Km</Form.Label>
						<Form.Control type="number" min="1"/>
				</Form.Group>
				<Form.Group as={Col} controlId="formAge">
						<Form.Label>Driver's Age</Form.Label>
						<Form.Control type="number" min="18" />
				</Form.Group>
				
			</Form.Row> 
			<Form.Row className="align-items-center"> 
				<Form.Group as={Col} controlId="formExtraDrivers">
						<Form.Label>Extra Drivers</Form.Label>
						<Form.Control type="number" min="0" max="5" />
				</Form.Group>
				<Form.Check type="checkbox" id="formInsurance" label="Extra insurance" custom/>
			</Form.Row> 
		</Form>
		</>
      )}
    </AuthContext.Consumer>
		);       		
	}
}
export default ConfigurationFilter;