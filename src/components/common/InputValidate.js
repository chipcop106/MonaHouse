import React, { useContext, useState, useEffect } from 'react';
import {Input, Icon} from '@ui-kitten/components';
import { useFormikContext, useField, setFieldTouched } from 'formik';


const AlertTriangleIcon = (style) => <Icon {...style} name='alert-triangle-outline'/>;
export const InputValidate =  props => {
    
    const formContext = useFormikContext();
   
    const { id } = props;
    const { touched, errors } = formContext;
    const { [id]: error } = errors;
    const { [id]: idTouched } = touched;
    const fieldProps= {
        status: !!error && idTouched && 'danger',
        captionIcon: !!error && idTouched && AlertTriangleIcon,
    };
    
    return (
        <Input
            {...props}
            {...fieldProps}
            caption={!!error && idTouched && error}
            onChangeText={(txt)=>{
                formContext.setFieldTouched(id, true);
                formContext.setFieldValue(id, txt);
            }}
            
            value={formContext.values[id]}
        />
    );
}
