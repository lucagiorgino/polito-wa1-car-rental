import React from 'react';
import Col from 'react-bootstrap/Col';
import SideFilter from './SideFilter.js';
import VehicleLIst from "./VehicleLIst.js";
import fetchAPI from '../api/fetchAPI.js';
import {withRouter} from 'react-router-dom';

class PublicPage extends React.Component {

    constructor(props) {
        super(props);    
        this.state = {vehicles:[],brands:[],categoriesFilter:[],brandsFilter:[]};
    }

    componentDidMount() {
        fetchAPI.getVehicles()
        .then((returnValue) => {          
            this.setState({vehicles: returnValue.vehicles,  brands: [...new Set(returnValue.vehicles.map(v => v.brand))].sort() });
        })
        .catch((errorObj) => {
        // this.handleErrors(errorObj);
        });
    }

    


    addRemoveFilter = (operation,typeOfFilter,filter) => {

        let brandsFilter = this.state.brandsFilter;
        let categoriesFilter = this.state.categoriesFilter;

        if (typeOfFilter === 'brand' && operation === 'add') {
            brandsFilter = brandsFilter.concat(filter);            
        } else if ( typeOfFilter === 'brand' && operation === 'remove' ) {
            brandsFilter = brandsFilter.filter((item) => item !== filter);
        } else if ( typeOfFilter === 'category' && operation === 'add' ) {
            categoriesFilter = categoriesFilter.concat(filter);
        } else if ( typeOfFilter === 'category' && operation === 'remove' ) {
            categoriesFilter = categoriesFilter.filter((item) => item !== filter);
        }
        
        this.setState({categoriesFilter: categoriesFilter, brandsFilter: brandsFilter});
        
        fetchAPI.getVehicles(categoriesFilter,brandsFilter)
        .then((returnValue) => {
            this.setState({vehicles: returnValue.vehicles});
            this.props.history.push("/public"+returnValue.url);           
        })
        .catch((errorObj) => {
            // this.handleErrors(errorObj);
        });

    }


    render() {     
        return (<>     
            <Col sm={3}>
                <SideFilter brands={this.state.brands}  addRemoveFilter={this.addRemoveFilter}/> 
            </Col>                                          
            <Col sm={9}>
                <h2>Vehicles</h2>
                <VehicleLIst vehicles={this.state.vehicles}/>               
            </Col>
        </>);
    } 
}
export default withRouter(PublicPage);