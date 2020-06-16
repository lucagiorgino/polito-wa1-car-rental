import React from 'react';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import ListGroup from 'react-bootstrap/ListGroup';
import { Link } from 'react-router-dom';

/*
Gli utenti non autenticati possono navigare l’intero insieme dei veicoli, 
filtrandoli per categoria e/o marca (l’utente può contemporaneamente selezionare 
una o più categorie e una o più marche).
*/

class SideBar extends React.Component {
  
  onChangeHandler = (ev) => {    
    const category = ['A','B','C','D','E'];
    let typeOfFilter = 'brand';
    if( category.includes(ev.target.id) ){
      typeOfFilter = 'category';
    } 
    
    if(ev.target.checked) {
      this.props.addRemoveFilter('add',typeOfFilter,ev.target.id);
    } else {
      this.props.addRemoveFilter('remove',typeOfFilter,ev.target.id);
    }
  }
  

  render() {
    return  (
      <Form method="POST" >
        <Form.Group id="formFilterCategory">
          <h4>Category</h4>
          <Form.Check onChange = {(ev) => this.onChangeHandler(ev)} type="checkbox" id="A" label="A" custom/>
          <Form.Check onChange = {(ev) => this.onChangeHandler(ev)} type="checkbox" id="B" label="B" custom/>
          <Form.Check onChange = {(ev) => this.onChangeHandler(ev)} type="checkbox" id="C" label="C" custom/>
          <Form.Check onChange = {(ev) => this.onChangeHandler(ev)} type="checkbox" id="D" label="D" custom/>
          <Form.Check onChange = {(ev) => this.onChangeHandler(ev)} type="checkbox" id="E" label="E" custom/>
        </Form.Group>
        <Form.Group id="formFilterBrand">
          <h4>Brand</h4>
          {this.props.brands.map(this.createBrand)}
        </Form.Group>
      </Form>
    ); 
  }    

  createBrand = (brand) =>  {
    if (brand){
      return (
        <Form.Check onChange = {(ev) => this.onChangeHandler(ev)} type="checkbox" key={brand} id={brand} label={brand} custom/>
      );
    }
    else return null;
  }
}    
export default SideBar;