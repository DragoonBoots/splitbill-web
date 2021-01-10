import {Button, ButtonGroup} from "react-bootstrap";
import React from "react";

export function UpButton(props) {
    return (
        <Button
            {...props}
            variant="outline-secondary"
        >
            <span className="sr-only">Move up</span>
            <i className="bi-arrow-up-circle-fill"/>
        </Button>
    );
}

export function DownButton(props) {
    return (
        <Button
            {...props}
            variant="outline-secondary"
        >
            <span className="sr-only">Move down</span>
            <i className="bi-arrow-down-circle-fill"/>
        </Button>
    );
}

export function AddButton(props) {
    return (
        <Button
            {...props}
            variant="outline-success"
        >
            <span className="sr-only">Insert below</span>
            <i className="bi-plus-circle-fill"/>
        </Button>
    );
}

export function RemoveButton(props) {
    return (
        <Button
            {...props}
            variant="outline-danger"
        >
            <span className="sr-only">Remove</span>
            <i className="bi-x-circle-fill"/>
        </Button>
    );
}

export function FormTableActionButtons(props) {
    return (
        <ButtonGroup>
            <UpButton
                disabled={props.index === 0}
                onClick={() => props.arrayHelpers.move(props.index, props.index - 1)}
            />
            <DownButton
                disabled={props.index === props.values.length - 1}
                onClick={() => props.arrayHelpers.move(props.index, props.index + 1)}
            />
            <AddButton
                onClick={() => props.arrayHelpers.insert(props.index + 1, props.initialValues)}
            />
            <RemoveButton
                disabled={props.values.length === 1}
                onClick={() => props.arrayHelpers.remove(props.index)}
            />
        </ButtonGroup>
    );
}

export default FormTableActionButtons;
