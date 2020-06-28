import React from 'react' ;
import {Button,Form,Row,Col,Alert} from 'react-bootstrap/';
import {AuthContext} from '../api/AuthContext.js';

class LoginPage extends React.Component {

    constructor(props) {
        super(props);
        this.state = {username: '', password: ''};
    }

    handleSubmit = (event,onLogin) => {
        event.preventDefault();
        onLogin(this.state.username,this.state.password);             
    }

    updateField = (name, value) => {
        this.setState({[name]: value});
    }

    render(){
        return <AuthContext.Consumer>{(context) => (
            <>
            <Col sm={3} lg={4}></Col>     
            <Col sm={6} lg={4}>
                <Form method="POST"  onSubmit={(event) => this.handleSubmit(event, context.loginUser)}>
                    <Row className="align-items-center">
                        <h1 className="mx-3">Log In</h1>
                        <ion-icon name="log-in-outline"></ion-icon>  
                    </Row>  
                
                    <Form.Group controlId="formUsername">
                        <Form.Label>Username</Form.Label>
                        <Form.Control type="text" placeholder="Enter username" name="username"
                            value = {this.state.username} onChange={(ev) => this.updateField(ev.target.name, ev.target.value)} required/>
                        <Form.Text className="text-muted">
                            We'll never share your information with anyone else.
                        </Form.Text>
                    </Form.Group>
                
                    <Form.Group controlId="formPassword">
                        <Form.Label>Password</Form.Label>
                        <Form.Control type="password" placeholder="Password" name="password"
                        value = {this.state.password} onChange={(ev) => this.updateField(ev.target.name, ev.target.value)} required/>
                    </Form.Group>
                    <Button variant="primary" type="submit">Log In</Button>
                    
                </Form>     
                {context.authErr && <Alert className="my-2" variant= "danger">{context.authErr.msg}</Alert>}
            </Col>
            </>
        )}
        </AuthContext.Consumer>
    }
}

export default LoginPage;