import React from "react";
import {useField, useFormikContext} from "formik";
import DateRangePicker from "@wojtekmaj/react-daterange-picker/dist/entry.nostyle";
import {Form as BsForm, InputGroup} from "react-bootstrap";
import {DateTime} from "luxon";

export function DatePickerField(props) {
    const {setFieldValue} = useFormikContext();
    const [field] = useField(props);
    let startDate = null;
    let endDate = null;
    let minDate = props.minDate ?? null;
    let maxDate = props.maxDate ?? DateTime.local().toISODate();
    if (Array.isArray(field.value)) {
        startDate = DateTime.fromJSDate(field.value[0]).toISODate();
        endDate = DateTime.fromJSDate(field.value[1]).toISODate();
    }

    // Convert the values returned from the pair of native controls
    function updateValueFromNativeControl(start, end) {
        // Normalize existing data
        let oldStart = null;
        let oldEnd = null;
        if (Array.isArray(field.value)) {
            oldStart = field.value[0];
            oldEnd = field.value[1];
        }
        // Update data
        let values = [
            start !== null ? start.toJSDate() : oldStart,
            end !== null ? end.toJSDate() : oldEnd,
        ]

        // Normalize no start or end date
        if (values.every(test => test === null)) {
            values = null;
        }

        // Set field values
        setFieldValue(field.name, values);
    }

    return (
        <div>
            <div className="d-md-none">
                <InputGroup>
                    <BsForm.Control
                        type="date"
                        value={startDate}
                        min={minDate}
                        max={endDate}
                        onChange={e => {
                            const control = e.target;
                            updateValueFromNativeControl(DateTime.fromISO(control.value), null);
                        }}
                    />
                    <BsForm.Control
                        type="date"
                        value={endDate}
                        min={startDate}
                        max={maxDate}
                        onChange={e => {
                            const control = e.target;
                            updateValueFromNativeControl(null, DateTime.fromISO(control.value));
                        }}
                    />
                </InputGroup>
            </div>
            <div className="d-none d-md-block">
                <DateRangePicker
                    {...field}
                    {...props}
                    onChange={val => setFieldValue(field.name, val)}
                />
            </div>
        </div>
    );
}

export default DatePickerField;
