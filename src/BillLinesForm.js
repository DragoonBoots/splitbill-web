import React from 'react';
import {Form as BsForm, InputGroup, Table} from "react-bootstrap";
import {ErrorMessage, Field} from 'formik';
import FormTableActionButtons from "./components/FormTableActionButtons";

function NameField(props) {
    return (
        <div>
            <Field
                as={BsForm.Control}
                name={`lines.${props.index}.name`}
                type="text"
            />
            <ErrorMessage
                name={`lines.${props.index}.name`}
                component="div"
                className="field-error"
            />
        </div>
    );
}

function AmountField(props) {
    return (
        <div>
            <InputGroup>
                <InputGroup.Prepend>
                    <InputGroup.Text>$</InputGroup.Text>
                </InputGroup.Prepend>
                <Field
                    as={BsForm.Control}
                    name={`lines.${props.index}.amount`}
                    type="number"
                    min="0"
                    step="0.01"
                />
            </InputGroup>
            <ErrorMessage
                name={`lines.${props.index}.amount`}
                component="div"
                className="field-error"
            />
        </div>
    );
}

function TaxRateField(props) {
    return (
        <div>
            <InputGroup>
                <Field
                    as={BsForm.Control}
                    name={`lines.${props.index}.tax`}
                    type="number"
                    min="0"
                    step="0.001"
                />
                <InputGroup.Append>
                    <InputGroup.Text>%</InputGroup.Text>
                </InputGroup.Append>
            </InputGroup>
            <ErrorMessage
                name={`lines.${props.index}.tax`}
                component="div"
                className="field-error"
            />
        </div>
    );
}

function IsUsageField(props) {
    return (
        <div>
            <Field
                as={BsForm.Check}
                type="checkbox"
                // id needed for Bootstrap control to function
                id={`lines.${props.index}.usage`}
                name={`lines.${props.index}.usage`}
            />
            <ErrorMessage
                name={`lines.${props.index}.usage`}
                component="div"
                className="field-error"
            />
        </div>
    );
}

export function BillLinesForm(props) {
    const lines = props.values.lines.map((line, index) => (
        <tr key={index}>
            <td>
                <NameField index={index}/>
            </td>
            <td>
                <AmountField index={index}/>
            </td>
            <td>
                {/* Tax rate */}
                <TaxRateField index={index}/>
            </td>
            <td>
                {/* Is usage? */}
                <IsUsageField index={index}/>
            </td>
            <td>
                {/* Actions */}
                <FormTableActionButtons
                    index={index}
                    values={props.values.lines}
                    arrayHelpers={props.arrayHelpers}
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

export default BillLinesForm;
