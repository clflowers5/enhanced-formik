import { createContext } from 'use-context-selector'

const FormValuesContext = createContext({
  formValues: {},
  addFormValues: () => {},
  removeFormValues: () => {}
})

const FormSubmitContext = createContext({
  submitHandlers: {},
  addSubmitHandler: () => {},
  removeSubmitHandler: () => {}
})

const FormValidationContext = createContext({
  validationHandlers: {},
  addValidationHandler: () => {},
  removeValidationHandler: () => {}
})

export {
  FormValuesContext,
  FormSubmitContext,
  FormValidationContext
}
