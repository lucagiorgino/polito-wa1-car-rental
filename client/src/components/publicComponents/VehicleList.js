import React from 'react' ;
import {Table} from 'react-bootstrap';

const VehicleLIst = (props) => {

  let {vehicles, sortVehicles} = props;
  return  (<>
    {vehicles && 
    <Table striped bordered hover size="sm">
      <thead>
        <tr>
          <th>Category <ion-icon  class="float-right mt-1 mr-2" style={{fontSize: '16px'}} onClick={() => sortVehicles('category')} name="arrow-up-outline"></ion-icon></th>
          <th>Brand <ion-icon class="float-right mt-1 mr-2" style={{fontSize: '16px'}} onClick={() => sortVehicles('brand')} name="arrow-up-outline"></ion-icon></th>
          <th>Model <ion-icon class="float-right mt-1 mr-2" style={{fontSize: '16px'}} onClick={() => sortVehicles('model')} name="arrow-up-outline"></ion-icon></th>
        </tr>
      </thead>
      <tbody>
        {vehicles.map((v) =>
          <tr key={v.category+v.brand+v.model}>
            <td>{v.category}</td>
            <td>{v.brand}</td>
            <td>{v.model}</td>
          </tr>
        )}
      </tbody>
  </Table>}
  </>);
           
}



export default VehicleLIst;