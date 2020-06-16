import React from 'react' ;
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Alert from'react-bootstrap/Alert';
import {Redirect} from 'react-router-dom';
import {AuthContext} from '../api/AuthContext.js';

class LoginPage extends React.Component {

    constructor(props) {
        super(props);
        this.state = {username: '', password: '', submitted: false};
    }

    handleSubmit = (event,onLogin) => {
        event.preventDefault();
        onLogin(this.state.username,this.state.password);
        console.log(this.state);
        this.setState({submitted : true});      
    }

    // add updateField

    updateField = (name, value) => {
        this.setState({[name]: value});
    }

    render(){
        if (this.state.submitted)
            return <Redirect to='/protected' />;
        return <AuthContext.Consumer>{(context) => (
        <Col sm={4} lg={8}>
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
        )}
        </AuthContext.Consumer>
    }
}



export default LoginPage;

/*



class LoginForm extends React.Component {
    

      
  
    render() {
        if (this.state.submitted)
            return <Redirect to='/' />;
        return(
            <AuthContext.Consumer>
                {(context) => (
                <>
                <Container fluid>
                    <Row>
                        <Col>
                           

<Form method="POST"}>
<Form.Group controlId="username">
    <Form.Label>E-mail</Form.Label>
    <Form.Control type="email" name="email" placeholder="E-mail" value = {this.state.username} 
    onChange={(ev) => this.onChangeUsername(ev)} required autoFocus/>
</Form.Group>

<Form.Group controlId="password">
    <Form.Label>Password</Form.Label>
    <Form.Control type="password" name="password" placeholder="Password" value = {this.state.password} 
    onChange={(ev) => this.onChangePassword(ev)} required/>
</Form.Group>

<Button variant="primary" type="submit">Login</Button>

                            </Form>

                            
                        </Col>
                    </Row>
                </Container>
                </>
                )}
            </AuthContext.Consumer>

        );
    }


}


*/