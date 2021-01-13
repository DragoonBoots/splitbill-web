import {Button, useAccordionToggle} from "react-bootstrap";
import React from "react";

export function SmallFormAccordionToggle({children, eventKey}) {
    return (
        <Button
            block
            variant="link"
            className="text-left text-truncate"
            onClick={useAccordionToggle(eventKey)}>
            {children}
        </Button>
    );
}

export default SmallFormAccordionToggle;
