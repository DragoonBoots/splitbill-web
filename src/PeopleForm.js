import React from 'react';
import {Form as BsForm, Table} from "react-bootstrap";
import {ErrorMessage, Field, FieldArray, Form, Formik} from 'formik';
import FormTableActionButtons from "./components/FormTableActionButtons";
import {DateTime} from "luxon";
import DateRangePicker from "./components/DateRangePickerField"

const initialValues = {
    people: [
        {
            name: '',
            dateRange: [
                DateTime.local().minus({months: 1}).toJSDate(),
                DateTime.local().toJSDate()
            ]
        },
    ],
};

function People(props) {
    const people = props.values.people.map((person, index) => (
        <tr key={index}>
            <td>
                {/* Name */}
                <Field
                    as={BsForm.Control}
                    name={`people.${index}.name`}
                    type="text"
                />
                <ErrorMessage
                    name={`people.${index}.name`}
                    component="div"
                    className="field-error"
                />
            </td>
            <td>
                {/* Date range */}
                <Field
                    as={DateRangePicker}
                    name={`people.${index}.dateRange`}
                    maxDate={DateTime.local().toJSDate()}
                    calendarIcon={<i className="bi-calendar-range-fill"/>}
                    clearIcon={null}
                />
                <ErrorMessage
                    name={`people.${index}.start`}
                    component="div"
                    className="field-error"
                />
            </td>
            <td>
                {/* Actions */}
                <FormTableActionButtons
                    index={index}
                    values={props.values.people}
                    arrayHelpers={props.arrayHelpers}
                    initialValues={initialValues.people[0]}
                />
            </td>
        </tr>
    ));
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

class PeopleForm extends React.Component {
    render() {
        return (
            <div>
                <Formik
                    initialValues={initialValues}
                    onSubmit={async (values) => {
                        await new Promise((r) => setTimeout(r, 500));
                        alert(JSON.stringify(values, null, 2));
                    }}
                >
                    {({values}) => (
                        <Form>
                            <FieldArray name="people"
                                        render={arrayHelpers => (
                                            <People values={values} arrayHelpers={arrayHelpers}/>
                                        )}
                            />
                        </Form>
                    )}
                </Formik>
            </div>
        );
    }
}

export default PeopleForm;
