import React from 'react'

const FormValuesContext = React.createContext({
  formValues: {},
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
