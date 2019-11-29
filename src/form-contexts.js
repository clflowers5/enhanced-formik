import React from 'react'

const FormValuesContext = React.createContext({
  /* Flattened object of all form values */
  formValues: {},

  /* Ref - Form values grouped by form name, not flattened */
  formNameValuesRef: {},

  /* Provided by `FormContextWrapper`, generally not for external use */
  addFormValues: () => {},
  removeFormValues: () => {},
})

const FormSubmitContext = React.createContext({
  submitHandlers: {},
  addSubmitHandler: () => {},
  removeSubmitHandler: () => {},
})

const FormValidationContext = React.createContext({
  validationHandlers: {},
  addValidationHandler: () => {},
  removeValidationHandler: () => {},
})

export {
  FormValuesContext,
  FormSubmitContext,
  FormValidationContext,
}
