import React from 'react';
import {Form as BsForm, Table} from "react-bootstrap";
import {ErrorMessage, Field} from 'formik';
import FormTableActionButtons from "./components/FormTableActionButtons";
import {DateTime} from "luxon";
import DateRangePicker from "./components/DateRangePickerField"

function NameField(props) {
    return (
        <div>
            <Field
                as={BsForm.Control}
                name={`people.${props.index}.name`}
                type="text"
                required
            />
            <ErrorMessage
                name={`people.${props.index}.name`}
                component="div"
                className="field-error"
            />
        </div>
    );
}

function DateRangeField(props) {
    return (
        <div>
            <Field
                as={DateRangePicker}
                name={`people.${props.index}.dateRange`}
                maxDate={DateTime.local().toJSDate()}
                calendarIcon={<i className="bi-calendar-range-fill"/>}
                clearIcon={<i className="bi-x-square"/>}
            />
            <ErrorMessage
                name={`people.${props.index}.start`}
                component="div"
                className="field-error"
            />
        </div>
    );
}

export function PeopleForm(props) {
const people = props.values.people.map((person, index) => (
        <tr key={index}>
        <td>
            <NameField index={index}/>
        </td>
        <td>
            {/* Date range */}
            <DateRangeField index={index}/>
        </td>
        <td>
            {/* Actions */}
            <FormTableActionButtons
                index={index}
                values={props.values.people}
                arrayHelpers={props.arrayHelpers}
            />
        </td>
</tr>
))
;
return (
    <div className="d-inline">
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
    </div>
);
}

export default PeopleForm;
