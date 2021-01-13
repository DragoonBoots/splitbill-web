import React from 'react';
import {Accordion, Button, Card, Form as BsForm, Table} from "react-bootstrap";
import {ErrorMessage, Field} from 'formik';
import FormTableActionButtons from "./components/FormTableActionButtons";
import {DateTime} from "luxon";
import DateRangePicker from "./components/DateRangePickerField"

function NameField(props) {
    const controlId = `people.${props.index}.name`;
    return (
        <div>
            <Field
                as={BsForm.Control}
                id={controlId}
                name={controlId}
                type="text"
                required
            />
            <ErrorMessage
                name={controlId}
                component="div"
                className="field-error"
            />
        </div>
    );
}

function DateRangeField(props) {
    const controlId = `people.${props.index}.dateRange`;
    return (
        <div>
            <Field
                as={DateRangePicker}
                id={controlId}
                name={controlId}
                maxDate={DateTime.local().toJSDate()}
                calendarIcon={<i className="bi-calendar-range-fill"/>}
                clearIcon={<i className="bi-x-square"/>}
            />
            <ErrorMessage
                name={controlId}
                component="div"
                className="field-error"
            />
        </div>
    );
}

function PeopleFormSm(props) {
    const people = props.values.people.map((person, index) => (
        <Card key={index}>
            <Card.Header className="d-flex justify-content-between">
                <Accordion.Toggle as={Button} variant="link" eventKey={`people.${index}`}>
                    {person.name.length === 0 ? <em>Unnamed</em> : person.name}
                </Accordion.Toggle>
                <FormTableActionButtons
                    index={index}
                    values={props.values.people}
                    arrayHelpers={props.arrayHelpers}
                />
            </Card.Header>
            <Accordion.Collapse eventKey={`people.${index}`}>
                <Card.Body>
                    <BsForm.Group>
                        <BsForm.Label>Name</BsForm.Label>
                        <NameField index={index}/>
                    </BsForm.Group>
                    <BsForm.Group>
                        <BsForm.Label>Date Range</BsForm.Label>
                        <DateRangeField index={index}/>
                    </BsForm.Group>
                </Card.Body>
            </Accordion.Collapse>
        </Card>
    ));
    return (
        <Accordion defaultActiveKey="people.0">
            {people}
        </Accordion>
    );
}

function PeopleFormMd(props) {
    const people = props.values.people.map((person, index) => (
        <tr key={index}>
            <td>
                <NameField index={index}/>
            </td>
            <td>
                <DateRangeField index={index}/>
            </td>
            <td>
                <FormTableActionButtons
                    index={index}
                    values={props.values.people}
                    arrayHelpers={props.arrayHelpers}
                />
            </td>
        </tr>
    ));
    return (
        <Table striped bordered hover>
            <thead>
            <tr>
                <th scope="col">Name</th>
                <th scope="col">Date Range</th>
                <th scope="col"><span className="sr-only">Actions</span></th>
            </tr>
            </thead>
            <tbody>
            {people}
            </tbody>
        </Table>
    );
}

export function PeopleForm(props) {
    return (
        <div>
            <div className="d-md-none">
                <PeopleFormSm {...props}/>
            </div>
            <div className="d-none d-md-block">
                <PeopleFormMd {...props}/>
            </div>
        </div>
    );
}

export default PeopleForm;
