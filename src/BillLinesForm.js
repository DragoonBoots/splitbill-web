import React from 'react';
import {Button, Form as BsForm, InputGroup, Table} from "react-bootstrap";
import {ErrorMessage, Field, FieldArray, Form, Formik} from 'formik';
import FormTableActionButtons from "./components/FormTableActionButtons";

const initialValues = {
    lines: [
        {
            name: '',
            amount: 0,
            tax: 0,
            usage: true,
        },
    ],
};

function BillLines(props) {
    const lines = props.values.lines.map((line, index) => (
        <tr key={index}>
            <td>
                {/* Name */}
                <Field
                    as={BsForm.Control}
                    name={`lines.${index}.name`}
                    type="text"
                />
                <ErrorMessage
                    name={`lines.${index}.name`}
                    component="div"
                    className="field-error"
                />
            </td>
            <td>
                {/* Amount */}
                <InputGroup>
                    <InputGroup.Prepend>
                        <InputGroup.Text>$</InputGroup.Text>
                    </InputGroup.Prepend>
                    <Field
                        as={BsForm.Control}
                        name={`lines.${index}.amount`}
                        type="number"
                        min="0"
                        step="0.01"
                    />
                </InputGroup>
                <ErrorMessage
                    name={`lines.${index}.amount`}
                    component="div"
                    className="field-error"
                />
            </td>
            <td>
                {/* Tax rate */}
                <InputGroup>
                    <Field
                        as={BsForm.Control}
                        name={`lines.${index}.tax`}
                        type="number"
                        min="0"
                        step="0.001"
                    />
                    <InputGroup.Append>
                        <InputGroup.Text>%</InputGroup.Text>
                    </InputGroup.Append>
                </InputGroup>
                <ErrorMessage
                    name={`lines.${index}.tax`}
                    component="div"
                    className="field-error"
                />
            </td>
            <td>
                {/* Is usage? */}
                <Field
                    as={BsForm.Check}
                    id={`lines.${index}.usage`}
                    name={`lines.${index}.usage`}
                    type="switch"
                />
                <ErrorMessage
                    name={`lines.${index}.usage`}
                    component="div"
                    className="field-error"
                />
            </td>
            <td>
                {/* Actions */}
                <FormTableActionButtons
                    index={index}
                    values={props.values.lines}
                    arrayHelpers={props.arrayHelpers}
                    initialValues={initialValues.lines[0]}
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
                    <th scope="col">Amount</th>
                    <th scope="col">Tax</th>
                    <th scope="col">Usage</th>
                    <th scope="col"><span className="sr-only">Actions</span></th>
                </tr>
                </thead>
                <tbody>
                {lines}
                </tbody>
            </Table>
        </div>
    );
}

class BillLinesForm extends React.Component {
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
                            <FieldArray name="lines"
                                        render={arrayHelpers => (
                                            <BillLines values={values} arrayHelpers={arrayHelpers}/>
                                        )}
                            />
                            <Button variant="primary" type="submit">Calculate</Button>
                        </Form>
                    )}
                </Formik>
            </div>
        );
    }
}

export default BillLinesForm;
