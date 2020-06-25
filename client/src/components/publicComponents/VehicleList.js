import React from 'react' ;
import Table from 'react-bootstrap/Table';

const VehicleLIst = (props) => {

  let {vehicles} = props;

  return  (<>
    {vehicles && 
    <Table striped bordered hover size="sm">
      <thead>
        <tr>
          <th>Category</th>
          <th>Brand</th>
          <th>Model</th>
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