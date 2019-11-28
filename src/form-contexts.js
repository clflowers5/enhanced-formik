import React from 'react'

const FormValuesContext = React.createContext({
  /* Flattened object of all form values */
  formValues: {},

  /* Form values grouped by form name, not flattened */
  formNameValues: {},

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
