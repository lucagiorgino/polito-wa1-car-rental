import React from 'react';
import Col from 'react-bootstrap/Col';
import SideFilter from './SideFilter.js';
import VehicleLIst from "./VehicleList.js";
import fetchAPI from '../../api/fetchAPI.js';
import {withRouter} from 'react-router-dom';

class PublicPage extends React.Component {

    constructor(props) {
        super(props);   
        this.state = {vehicles:[],brands:[],categoriesFilter:[],brandsFilter:[]};       
    }

    componentDidMount() {          
        fetchAPI.getBrands()
        .then((brands) => {          
            this.setState({brands: brands.map( (b) => b.brand).sort() });
        })
        .catch((errorObj) => {
        // this.handleErrors(errorObj);
        });
        this.setFilteredVehicles(this.props.query);     
    }

    // example: ?brand[]=Smart&brand[]=Peugeot&brand[]=Fiat&
    setFilteredVehicles = (search) => {
        search = search.replaceAll('brand[]=','');
        search = search.replaceAll('category[]=','');
        search = search.replace('?','');
        search = search.split("&")
        search = search.filter ( (f) => {return f!== "";});
        // result here ["Smart","Peugeot","Fiat"]
        
        const categoriesFilter = [];
        const brandsFilter = [];        
        const category = ['A','B','C','D','E'];

        search.map ((f) => {
            f = f.replace("%20"," "); // evenutale spazio se si proviene da un link
            if( category.includes(f) ){
                categoriesFilter.push(f);
            }else{            
                brandsFilter.push(f);
            }
        });   
        
        this.setState( { categoriesFilter: categoriesFilter, brandsFilter: brandsFilter});

        // unica chiamata al server
        fetchAPI.getVehicles(categoriesFilter,brandsFilter) 
        .then((returnValue) => {          
            this.setState({vehicles: returnValue.vehicles});
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
        
        this.setState({categoriesFilter: categoriesFilter, brandsFilter: brandsFilter}, () => {
            fetchAPI.getVehicles(categoriesFilter,brandsFilter)
            .then((returnValue) => {
                this.setState({vehicles: returnValue.vehicles}, () => this.props.history.push("/public"+returnValue.url)  );              
            })
            .catch((errorObj) => {
                // this.handleErrors(errorObj);
            });
        });     
    }

    componentDidUpdate() {
        // nel caso in cui si prema il link nella navbar sulla stessa route e le checkbox rimangano selezionate
        // https://stackoverflow.com/questions/38839510/forcing-a-react-router-link-to-load-a-page-even-if-were-already-on-that-page
        if(this.props.location.state === "desiredState"){
            this.setState({categoriesFilter:[],brandsFilter:[]}, () => this.setFilteredVehicles(this.props.query) );
        }this.props.location.state = null;
    }
   
    render() {     
        return (<>     
            <Col className="ml-2 mt-2" sm={3}>
                <SideFilter brands={this.state.brands} addRemoveFilter={this.addRemoveFilter} activeBrands={this.state.brandsFilter} activeCategories={this.state.categoriesFilter}/> 
            </Col>                                          
            <Col sm={6}>
                <h2>Vehicles</h2>
                <VehicleLIst vehicles={this.state.vehicles}/>               
            </Col>
        </>);
    } 
}
export default withRouter(PublicPage); // per il redirect ad ogni aggiunta/rimozione filtro