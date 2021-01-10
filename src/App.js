import './style/App.scss';
import {Col, Container, Navbar, Row} from "react-bootstrap";
import BillLinesForm from "./BillLinesForm";
import React from "react";

class App extends React.Component {
    constructor(props) {
        super(props);

        this.handleSubmit = this.handleSubmit.bind(this);
    }


    handleSubmit(e) {

    }

    render() {
        return (
            <div>
                <Navbar bg="dark" variant="dark">
                    <Navbar.Brand>Split Bill</Navbar.Brand>
                </Navbar>
                <Container>
                    <Row>
                        <Col>
                            <BillLinesForm onSubmit={this.handleSubmit()}/>
                        </Col>
                    </Row>
                    <Row>
                        <Col><p>People</p></Col>
                        <Col><p>Split results</p></Col>
                    </Row>
                </Container>
            </div>
        );
    }
}

export default App;
