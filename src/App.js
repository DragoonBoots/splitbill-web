import './style/App.scss';
import {Button, Col, Container, Navbar, Row, Form as BsForm, InputGroup} from "react-bootstrap";
import BillLinesForm from "./BillLinesForm";
import React from "react";
import {FieldArray, Field, Form, Formik} from "formik";
import {DateTime, Interval} from "luxon";
import PeopleForm from "./PeopleForm";
import {Bill, BillLine, PersonPeriod} from "./calculator/calculator";
import Big from "big.js";
import DateRangePicker from "./components/DateRangePickerField";

const initialValues = {
    bill: {
        total: 0,
        dateRange: [
            // Initialize to a range starting 1 month prior to today
            DateTime.local().minus({months: 1}).toJSDate(),
            DateTime.local().toJSDate()
        ],
    },
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
    constructor(props) {
        super(props);

        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleSubmit(values) {
        const bill = new Bill();
        for (const line of values.lines) {
            const billLine = new BillLine();
            billLine.name = line.name;
            billLine.amount = new Big(line.amount);
            billLine.taxRate = line.tax / 100.0;
            billLine.split = line.usage;
            bill.lines.push(billLine);
        }
        const personNames = [];
        const personPeriods = [];
        for (const person of values.people) {
            personNames.push(person.name);
            personPeriods.push(new PersonPeriod(person.name, Interval.fromDateTimes(
                person.dateRange[0],
                person.dateRange[1]
            )));
        }
        const split = bill.split(Interval.fromDateTimes(
            values.bill.dateRange[0],
            values.bill.dateRange[1]
        ), personPeriods, personNames);
    }

    render() {
        return (
            <div>
                <Navbar bg="dark" variant="dark">
                    <Navbar.Brand>Split Bill</Navbar.Brand>
                </Navbar>
                <Container>
                    <Formik
                        initialValues={initialValues}
                        onSubmit={this.handleSubmit}
                    >
                        {({values}) => (
                            <div>
                                <Form>
                                    <Row>
                                        <Col>
                                            <h1>Bill</h1>
                                            <BsForm.Row>
                                                <BsForm.Group as={Col} controlId="bill.total">
                                                    <BsForm.Label>Total</BsForm.Label>
                                                    <InputGroup>
                                                        <InputGroup.Prepend>
                                                            <InputGroup.Text>$</InputGroup.Text>
                                                        </InputGroup.Prepend>
                                                        <Field
                                                            as={BsForm.Control}
                                                            name="bill.total"
                                                            type="number"
                                                            min="0"
                                                            step="0.01"
                                                        />
                                                    </InputGroup>
                                                </BsForm.Group>
                                                <BsForm.Group as={Col} controlId="bill.dateRange">
                                                    <BsForm.Label>Date Range</BsForm.Label>
                                                    <Field
                                                        as={DateRangePicker}
                                                        name="bill.dateRange"
                                                        maxDate={DateTime.local().toJSDate()}
                                                        calendarIcon={<i className="bi-calendar-range-fill"/>}
                                                        clearIcon={null}
                                                    />
                                                </BsForm.Group>
                                            </BsForm.Row>
                                        </Col>
                                    </Row>
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
