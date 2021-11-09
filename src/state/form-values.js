import { proxy, useSnapshot } from 'valtio'

let formValuesState = proxy({})

// continue to elaborate on this
function setFormValuesState (formValues) {
  // formValuesState = proxy({})
  Object.entries(formValues).forEach(([key, value]) => {
    formValuesState[key] = value
  })
}

function setFormValues (formName, formValues) {
  formValuesState[formName] = formValues
}

function useFormValues () {
  // useProxy(formValuesState)
  return {
    snapshot: useSnapshot(formValuesState),
    state: formValuesState
  }
}

export {
  formValuesState as default,
  setFormValuesState,
  setFormValues,
  useFormValues
}
