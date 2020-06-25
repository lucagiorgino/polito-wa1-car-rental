import React from 'react';
import {Form} from 'react-bootstrap';


function SideBar(props){

  const onChangeHandler = (ev) => { 
    const category = ['A','B','C','D','E'];
    let typeOfFilter = 'brand';
    if( category.includes(ev.target.id) ){
      typeOfFilter = 'category';
    } 
    
    if(ev.target.checked) {
      props.addRemoveFilter('add',typeOfFilter,ev.target.id);
    } else {
      props.addRemoveFilter('remove',typeOfFilter,ev.target.id);
    }
  };
  
  const createBrand = (brand) =>  {
    if (brand){
      return (
        <Form.Check onChange = {(ev) => onChangeHandler(ev)} type="checkbox" key={brand} checked={props.activeBrands.includes(brand)} id={brand} label={brand} custom/>
      );
    }
    else return null;
  };

  
  return  (
    <Form method="POST" >
      <Form.Group id="formFilterCategory">
        <h4>Category</h4>
        <Form.Check onChange = {(ev) => onChangeHandler(ev)} type="checkbox" checked={props.activeCategories.includes('A')} id="A" label="A" custom />
        <Form.Check onChange = {(ev) => onChangeHandler(ev)} type="checkbox" checked={props.activeCategories.includes('B')} id="B" label="B" custom />
        <Form.Check onChange = {(ev) => onChangeHandler(ev)} type="checkbox" checked={props.activeCategories.includes('C')} id="C" label="C" custom />
        <Form.Check onChange = {(ev) => onChangeHandler(ev)} type="checkbox" checked={props.activeCategories.includes('D')} id="D" label="D" custom />
        <Form.Check onChange = {(ev) => onChangeHandler(ev)} type="checkbox" checked={props.activeCategories.includes('E')} id="E" label="E" custom />
      </Form.Group>
      <Form.Group id="formFilterBrand">
        <h4>Brand</h4>
        {props.brands.map(createBrand)}
      </Form.Group>
    </Form>
  ); 
}    

export default SideBar;