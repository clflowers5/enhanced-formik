import React from 'react'

const FormValuesContext = React.createContext({
  formValues: {},
  addFormValues: () => { }
})

const FormSubmitContext = React.createContext({
  submitHandlers: [],
  addSubmitHandler: () => { }
})

const FormValidationContext = React.createContext({
  validationHandlers: [],
  addValidationHandler: () => { }
})

export {
  FormValuesContext,
  FormSubmitContext,
  FormValidationContext
}
