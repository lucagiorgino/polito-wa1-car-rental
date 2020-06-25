import React from 'react' ;
import {Button,Form,Col,Row,Badge,Spinner,OverlayTrigger,Tooltip} from 'react-bootstrap';
import {Redirect} from 'react-router-dom';
import moment from 'moment';
import fetchAPI from '../../api/fetchAPI.js';
import { calculatePrice } from '../../api/priceCalculator.js';
import DesiredRental from '../../api/Rental.js';

class ConfigurationFilter extends React.Component {
	constructor(props) {
		super(props);
		this.state = { loading: false,startDate: moment().format("YYYY-MM-DD"),endDate: '', category: "", km: 1, age: 18, extraDrivers: 0, extraInsurance: false, 
						availableNumber: 'not calculable',price: 'not calculable',submitted: false,disabled: false};
	}


    handleSubmit = (event) => {
        event.preventDefault();
        const form = event.currentTarget;
		this.setState({loading : true});  
		if (!form.checkValidity()) {
			form.reportValidity();
			this.setState({loading : false,submitted: false}); 
		}else{
			
			fetchAPI.checkPrice({startDate: this.state.startDate,endDate: this.state.endDate, 
				category: this.state.category, km: this.state.km, age: this.state.age, 
				extraDrivers: this.state.extraDrivers, extraInsurance: this.state.extraInsurance,
				clientCalculatedPrice: this.state.price})
				.then(() => { 
					this.props.updateDesiredRental(new DesiredRental(this.state.startDate,this.state.endDate, this.state.category,this.state.price));
					this.props.setPayment()
					this.setState({loading : false,submitted: true}); 
				})
				.catch((errorObj) => {
					console.log(errorObj);
					this.setState({loading : false,submitted: false}); 
					// this.handleErrors(errorObj);
				});		
		} 
    }

    updateField = (name, value) => {
		this.setState({[name]: value}, () => {
			this.updateAvailableNumber(); // cascade updating 			
		}); 
	}
	
	updateAvailableNumber = () => {			
		if(this.state.category && this.state.startDate && this.state.endDate){
			fetchAPI.getAvailableVehicles(this.state.category,this.state.startDate,this.state.endDate)  
			.then((availableVehicles) => { 
				if(availableVehicles.length === 0)
					this.setState({availableNumber: availableVehicles.length, price: 'not calculable', disabled: true }); 
				else
					this.setState({availableNumber: availableVehicles.length, disabled: false }, () => this.updatePrice() ); 

			})
			.catch((errorObj) => {
				this.setState({availableNumber: 'not calculable'});
				console.log(errorObj)
				// this.handleErrors(errorObj);
			});
		}
	}

	updatePrice = () => {
		let lessThan10 = false;
		let frequentCustomer = false;
		fetchAPI.getNCategoryVehicles(this.state.category)  
			.then((nCategory) => { 
				if( this.state.availableNumber/nCategory*100 < 10 )
					lessThan10 = true;
			})
			.catch((errorObj) => {
				// this.handleErrors(errorObj);
			});
	
		if( this.props.rentals.filter( (r) => moment(r.endDate).isBefore(moment())).length >= 3 ){
			frequentCustomer = true;
		}
		let numberOfDay = moment(this.state.endDate).diff(moment(this.state.startDate),'days')+1;
		let price = calculatePrice(lessThan10,numberOfDay,this.state.category,this.state.km,this.state.age,this.state.extraDrivers,this.state.extraInsurance,frequentCustomer);
		this.setState({price: price})
	}


	render() {   
		if (this.state.submitted)
            return <Redirect to={{pathname: "/protected/payment",state: { rental: "ciao" } }} />;
		return  (<>
		
		<Form method="POST" onSubmit={(event) => this.handleSubmit(event)} >
			<Form.Row>
				<Form.Group as={Col} controlId="formStartDate">
					<Form.Label>Start Date</Form.Label>
					<Form.Control className="mr-sm-2" type="date" name="startDate"
						value = {this.state.startDate} onChange={(ev) => this.updateField(ev.target.name, ev.target.value)} min={moment().format("YYYY-MM-DD")} required={true}/> 
				</Form.Group>
				<Form.Group as={Col} controlId="formEndDate">
					<Form.Label>End Date</Form.Label>
					<Form.Control className="mr-sm-2" type="date" name="endDate"
						value = {this.state.endDate} onChange={(ev) => this.updateField(ev.target.name, ev.target.value)} min={this.state.startDate} required={true}/> 
				</Form.Group>
			</Form.Row> 
			<Form.Row>            
				<Form.Group as={Col} controlId="formCategory">
					<Form.Label>Category</Form.Label>
					<Form.Control as="select" custom required={true} name="category"
						value = {this.state.category} onChange={(ev) => this.updateField(ev.target.name, ev.target.value)}>
						<option disabled="disabled"></option>
						<option value="A">A</option>
						<option value="B">B</option>
						<option value="C">C</option>
						<option value="D">D</option>
						<option value="E">E</option>
					</Form.Control>
				</Form.Group>
				<Form.Group as={Col} controlId="formKm">
						<Form.Label>Estimated Km per day</Form.Label>
						<Form.Control type="number" min="1" name="km"
							value = {this.state.km} onChange={(ev) => this.updateField(ev.target.name, ev.target.value)}/>
				</Form.Group>		
			</Form.Row> 
			<Form.Row className="align-items-center"> 
				<Form.Group as={Col} controlId="formAge">
					<Form.Label>Driver's Age</Form.Label>
					<Form.Control type="number" min="18" name="age"
						value = {this.state.age} onChange={(ev) => this.updateField(ev.target.name, ev.target.value)}/>
				</Form.Group>
				<Form.Group as={Col} controlId="formExtraDrivers">
						<Form.Label>Extra Drivers</Form.Label>
						<Form.Control type="number" min="0" max="5" name="extraDrivers"
							value = {this.state.extraDrivers} onChange={(ev) => this.updateField(ev.target.name, ev.target.value)}/>
				</Form.Group>
				<Form.Check type="checkbox" id="formInsurance" label="Extra insurance" custom name="extraInsurance" 
					checked={this.state.extraInsurance} onChange={(ev) => this.updateField(ev.target.name, ev.target.checked)}/>
			</Form.Row> 
			
			<Form.Group>
				<Button size="lg" block variant="primary" type="submit" disabled={this.state.disabled || this.state.loading}>
				{this.state.loading && <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true"/>}
				{!this.state.loading && <span>Rent</span>}
				</Button>
			</Form.Group>		
		</Form>
		<Row className="pt-4">
			<Col><h4>Price:</h4><h4><Badge variant="success">{this.state.price === 'not calculable' ? this.state.price : 
				 new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(this.state.price)}</Badge></h4></Col>			
			<Col><h4>Available cars:</h4><h4><Badge variant="info">{this.state.availableNumber}</Badge></h4></Col>	
		</Row>   
		</>);       		
	}
}
export default ConfigurationFilter;