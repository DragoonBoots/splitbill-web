import React from 'react';
import {Accordion, Card, Form as BsForm, InputGroup, Table} from "react-bootstrap";
import {ErrorMessage, Field} from 'formik';
import FormTableActionButtons from "./components/FormTableActionButtons";
import SmallFormAccordionToggle from "./components/SmallFormAccordionToggle";

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
                label={props.label}
            />
            <ErrorMessage
                name={`lines.${props.index}.usage`}
                component="div"
                className="field-error"
            />
        </div>
    );
}


function BillLinesFormSm(props) {
    const lines = props.values.lines.map((line, index) => (
        <Card key={index}>
            <Card.Header className="d-flex justify-content-between">
                <SmallFormAccordionToggle eventKey={`lines.${index}`}>
                    {line.name.length === 0 ? <em>Untitled</em> : line.name}
                </SmallFormAccordionToggle>
                <FormTableActionButtons
                    index={index}
                    values={props.values.lines}
                    arrayHelpers={props.arrayHelpers}
                />
            </Card.Header>
            <Accordion.Collapse eventKey={`lines.${index}`}>
                <Card.Body>
                    <BsForm.Group>
                        <BsForm.Label>Name</BsForm.Label>
                        <NameField index={index}/>
                    </BsForm.Group>
                    <BsForm.Group>
                        <BsForm.Label>Amount</BsForm.Label>
                        <AmountField index={index}/>
                    </BsForm.Group>
                    <BsForm.Group>
                        <BsForm.Label>Tax Rate</BsForm.Label>
                        <TaxRateField index={index}/>
                    </BsForm.Group>
                    <BsForm.Group>
                        <IsUsageField index={index} label="Usage"/>
                    </BsForm.Group>
                </Card.Body>
            </Accordion.Collapse>
        </Card>
    ));
    return (
        <Accordion defaultActiveKey="lines.0">
            {lines}
        </Accordion>
    );
}

function BillLinesFormMd(props) {
    const lines = props.values.lines.map((line, index) => (
        <tr key={index}>
            <td>
                <NameField index={index}/>
            </td>
            <td>
                <AmountField index={index}/>
            </td>
            <td>
                <TaxRateField index={index}/>
            </td>
            <td>
                <IsUsageField index={index}/>
            </td>
            <td>
                <FormTableActionButtons
                    index={index}
                    values={props.values.lines}
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
    );
}

export function BillLinesForm(props) {
    return (
        <div>
            <div className="d-md-none">
                <BillLinesFormSm {...props}/>
            </div>
            <div className="d-none d-md-block">
                <BillLinesFormMd {...props}/>
            </div>
        </div>
    );
}

export default BillLinesForm;
