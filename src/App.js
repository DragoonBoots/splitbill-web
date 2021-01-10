import './style/App.scss';
import {Col, Container, Navbar, Row} from "react-bootstrap";
import BillLinesForm from "./BillLinesForm";
import React from "react";
import PeopleForm from "./PeopleForm";

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
                            <h1>People</h1>
                            <PeopleForm/>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <h1>Lines</h1>
                            <BillLinesForm onSubmit={this.handleSubmit()}/>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <h1>Results</h1>
                            <p>Split results</p>
                        </Col>
                    </Row>
                </Container>
            </div>
        );
    }
}

export default App;
