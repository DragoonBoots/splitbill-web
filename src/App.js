import './style/App.scss';
import {Button, Col, Container, Navbar, Row} from "react-bootstrap";
import BillLinesForm from "./BillLinesForm";
import React from "react";
import {FieldArray, Form, Formik} from "formik";
import {DateTime} from "luxon";
import PeopleForm from "./PeopleForm";

const initialValues = {
    lines: [
        {
            name: '',
            amount: 0,
            tax: 0,
            usage: true,
        },
    ],
    people: [
        {
            name: '',
            dateRange: [
                // Initialize to a range starting 1 month prior to today
                DateTime.local().minus({months: 1}).toJSDate(),
                DateTime.local().toJSDate()
            ]
        },
    ],
};

class App extends React.Component {
    render() {
        return (
            <div>
                <Navbar bg="dark" variant="dark">
                    <Navbar.Brand>Split Bill</Navbar.Brand>
                </Navbar>
                <Container>
                    <Formik
                        initialValues={initialValues}
                        onSubmit={async (values) => {
                            await new Promise((r) => setTimeout(r, 500));
                            alert(JSON.stringify(values, null, 2));
                        }}
                    >
                        {({values}) => (
                            <div>
                                <Form>
                                    <Row>
                                        <Col>
                                            <h1>People</h1>
                                            <FieldArray name="people"
                                                        render={arrayHelpers => (
                                                            <PeopleForm values={values} arrayHelpers={arrayHelpers}/>
                                                        )}
                                            />
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col>
                                            <h1>Lines</h1>
                                            <FieldArray name="lines"
                                                        render={arrayHelpers => (
                                                            <BillLinesForm values={values} arrayHelpers={arrayHelpers}/>
                                                        )}
                                            />
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col>
                                            <h1>Results</h1>
                                            <p><Button variant="primary" type="submit">Calculate</Button></p>
                                        </Col>
                                    </Row>
                                </Form>
                            </div>
                        )}
                    </Formik>
                </Container>
            </div>
        );
    }
}

export default App;
