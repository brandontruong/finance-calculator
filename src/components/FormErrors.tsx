import * as React from 'react';
export const FormErrors = ({ formErrors }) =>
    <div>
        {(formErrors.loanAmount !== '' || formErrors.selectedTermIndex !== '' || formErrors.deposit !== '') &&
            Object.keys(formErrors).map((fieldName, i) => {
                if (formErrors[fieldName].length > 0) {
                    return (
                        <div className="alert alert-danger mt-3 " role="alert">
                            <div key={i}>{formErrors[fieldName]}</div>
                        </div>
                    )
                } else {
                    return '';
                }
            })}
    </div>
