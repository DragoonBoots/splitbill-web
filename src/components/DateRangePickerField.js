import React from "react";
import {useField, useFormikContext} from "formik";
import DateRangePicker from "@wojtekmaj/react-daterange-picker/dist/entry.nostyle";

// Adapted from https://stackoverflow.com/questions/56312372/react-datepicker-with-a-formik-form

export function DatePickerField(props) {
    const {setFieldValue} = useFormikContext();
    const [field] = useField(props);
    return (
        <DateRangePicker
            {...field}
            {...props}
            onChange={val => setFieldValue(field.name, val)}
        />
    );
}

export default DatePickerField;
