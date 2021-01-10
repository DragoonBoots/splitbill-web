import React from 'react';
import {Button, ButtonGroup, Form as BsForm, InputGroup, Table} from "react-bootstrap";
import {Formik, Field, Form, ErrorMessage, FieldArray} from 'formik';

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

function UpButton(props) {
    return (
        <Button
            variant="outline-secondary"
            disabled={props.disabled ?? false}
            onClick={props.onClick}
        >
            <span className="sr-only">Move up</span>
            <i className="bi-arrow-up-circle-fill"/>
        </Button>
    );
}

function DownButton(props) {
    return (
        <Button
            variant="outline-secondary"
            disabled={props.disabled ?? false}
            onClick={props.onClick}
        >
            <span className="sr-only">Move down</span>
            <i className="bi-arrow-down-circle-fill"/>
        </Button>
    );
}

function AddButton(props) {
    return (
        <Button
            variant="outline-success"
            disabled={props.disabled ?? false}
            onClick={props.onClick}
        >
            <span className="sr-only">Insert above</span>
            <i className="bi-plus-circle-fill"/>
        </Button>
    );
}

function RemoveButton(props) {
    return (
        <Button
            variant="outline-danger"
            disabled={props.disabled ?? false}
            onClick={props.onClick}
        >
            <span className="sr-only">Remove</span>
            <i className="bi-x-circle-fill"/>
        </Button>
    );
}

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
                <ButtonGroup>
                    <UpButton
                        disabled={index === 0}
                        onClick={() => props.arrayHelpers.move(index, index - 1)}
                    />
                    <DownButton
                        disabled={index === props.values.lines.length - 1}
                        onClick={() => props.arrayHelpers.move(index, index + 1)}
                    />
                    <AddButton
                        onClick={() => props.arrayHelpers.insert(index, initialValues.lines[0])}
                    />
                    <RemoveButton
                        disabled={props.values.lines.length === 1}
                        onClick={() => props.arrayHelpers.remove(index)}
                    />
                </ButtonGroup>
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
