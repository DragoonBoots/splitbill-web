import React from "react";
import {Table} from "react-bootstrap";

export function ResultsTable(props) {
    if (props.portions.length === 0) {
        return null;
    }
    const portions = props.portions.map(portion => (
        <tr key={portion.name}>
            <td>{portion.name}</td>
            <td>${portion.generalTotal.round(2).toFixed(2)}</td>
            <td>${portion.usageTotal.round(2).toFixed(2)}</td>
            <td>${portion.generalTotal.plus(portion.usageTotal).round(2).toFixed(2)}</td>
        </tr>
    ));

    return (
        <Table striped bordered hover>
            <thead>
            <tr>
                <th>Name</th>
                <th>General</th>
                <th>Usage</th>
                <th>Total</th>
            </tr>
            </thead>
            <tbody>
            {portions}
            </tbody>
        </Table>
    );
}

export default ResultsTable;
