import './style/App.scss';
import {Button, Col, Container, Form as BsForm, InputGroup, Navbar, Row} from "react-bootstrap";
import BillLinesForm from "./BillLinesForm";
import React from "react";
import {Field, FieldArray, Form, Formik} from "formik";
import {DateTime, Interval} from "luxon";
import PeopleForm from "./PeopleForm";
import {Bill, BillLine, PersonPeriod} from "./calculator/calculator";
import Big from "big.js";
import DateRangePicker from "./components/DateRangePickerField";

const defaultValues = {
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

class Permalink {
    static _paramName = 'data';

    static toValues(url) {
        const data = url.searchParams.get(Permalink._paramName);
        if (data === null) {
            return null;
        }
        try {
            return JSON.parse(data);
        } catch (e) {
            alert("The permalink contains invalid data.  Default data has been loaded.");
            return null;
        }
    }

    static fromValues(values) {
        const permalink = new URL(document.location);
        const data = JSON.stringify(values, (key, value) => {
            if (key.startsWith('_')) {
                return undefined;
            }
            return value;
        }, null);
        permalink.searchParams.set(Permalink._paramName, data);

        return permalink;
    }
}

class App extends React.Component {
    constructor(props) {
        super(props);

        this.handleCalculate = this.handleCalculate.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handlePermalink = this.handlePermalink.bind(this);
    }

    handleCalculate(values, formikBag) {
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

    handlePermalink(values, formikBag) {
        const permalink = Permalink.fromValues(values);
        const permalinkDisplay = document.getElementById('permalink-display');
        permalinkDisplay.getElementsByTagName('input')[0].value = permalink.toString();
        permalinkDisplay.classList.remove('invisible');
    }

    copyPermalink() {
        const permalinkDisplay = document.getElementById('permalink-display');
        const permalinkField = permalinkDisplay.getElementsByTagName('input')[0];
        const oldDesignMode = document.designMode;
        document.designMode = "on";
        permalinkField.select();
        document.execCommand('copy', false, permalinkField.value);
        document.designMode = oldDesignMode;
    }

    handleSubmit(values, formikBag) {
        const button = values._submitButton;
        if (button === 'calculate') {
            this.handleCalculate(values, formikBag);
        } else if (button === 'permalink') {
            this.handlePermalink(values, formikBag);
        }
        formikBag.setSubmitting(false);
    }

    render() {
        const initialValues = Permalink.toValues(new URL(document.location)) ?? defaultValues;
        initialValues['_submitButton'] = '';

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
                        {formikProps => (
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
                                            <FieldArray name="people">
                                                {arrayHelpers => (
                                                    <PeopleForm values={formikProps.values}
                                                                arrayHelpers={arrayHelpers}/>
                                                )}
                                            </FieldArray>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col>
                                            <h1>Lines</h1>
                                            <FieldArray name="lines">
                                                {arrayHelpers => (
                                                    <BillLinesForm values={formikProps.values}
                                                                   arrayHelpers={arrayHelpers}/>
                                                )}
                                            </FieldArray>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col>
                                            <h1>Results</h1>
                                            <div className="result-buttons">
                                                <Button className="result-buttons__calculate" variant="primary"
                                                        type="submit"
                                                        disabled={formikProps.isSubmitting}
                                                        onClick={() => formikProps.setFieldValue('_submitButton', 'calculate')}>
                                                    Calculate
                                                </Button>
                                                <Button className="result-buttons__permalink" variant="secondary"
                                                        type="submit"
                                                        disabled={formikProps.isSubmitting}
                                                        onClick={() => formikProps.setFieldValue('_submitButton', 'permalink')}>
                                                    Create Permalink
                                                </Button>
                                                <InputGroup id="permalink-display"
                                                            className="result-buttons__permalink__display invisible">
                                                    <BsForm.Control type="text"/>
                                                    <InputGroup.Append>
                                                        <Button variant="outline-primary" type="button"
                                                                onClick={this.copyPermalink}>
                                                            <span className="sr-only">Copy</span>
                                                            <i className="bi-clipboard"/>
                                                        </Button>
                                                    </InputGroup.Append>
                                                </InputGroup>
                                            </div>
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
