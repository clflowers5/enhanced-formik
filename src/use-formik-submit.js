import { useContext, useEffect, useState } from 'react'
import { flatMap, isFunction, isObject } from 'lodash'

import { FormSubmitContext, FormValidationContext, FormValuesContext } from './form-contexts'

/*
    Formik doesn't support awaiting `handleSubmit` by default.
    _However_ since we're keeping track of the custom handlers already,
    we can await their completion independently of Formik.
    This can't be handled by a Context since a `setState` in that context
    will not be guaranteed to occur during the `submit` execution frame.
    A static array holding those callbacks is necessary to capture the Promises.
*/
const customSubmitHandlers = []

/*
    Internal helper function, you should _not_ need to use this directly in your form.
 */
function addCustomSubmitHandlerResult (handlerReturnValue, formName) {
  customSubmitHandlers.push({ value: Promise.resolve(handlerReturnValue), formName })
}

function clearCustomSubmitHandlers () {
  customSubmitHandlers.length = 0
}

function flattenErrors (current) {
  if (isObject(current)) {
    return flatMap(current, flattenErrors)
  }
  return current
}

function useFormikSubmit ({ onSubmit, onError, focusFirstError = false }) {
  const [errorMessageToFocus, setErrorMessageToFocus] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const submitHandlers = useContext(FormSubmitContext)
  const validationHandlers = useContext(FormValidationContext)
  const formValues = useContext(FormValuesContext)

  useEffect(() => {
    if (isSubmitting && formValues) {
      onSubmit(formValues)
      setIsSubmitting(false)
    }
  }, [isSubmitting, formValues, onSubmit])

  useEffect(function focusFirstFormError () {
    if (errorMessageToFocus) {
      const errorElement = document.querySelector(`[data-error-message="${errorMessageToFocus}"]`)
      if (errorElement) {
        const inputId = errorElement.getAttribute('data-error-for')
        const inputElement = document.getElementById(inputId)
        inputElement && inputElement.focus()
      }

      setErrorMessageToFocus(null)
    }
  }, [errorMessageToFocus])

  async function submit () {
    // submitForm does not reject if invalid per docs
    // run all submit handlers
    await Promise.all(Object.values(submitHandlers).map(handler => handler()))

    // run custom submit handlers
    let customResults
    let formNames
    try {
      const callbacks = customSubmitHandlers.map(customSubmit => customSubmit.value)
      formNames = customSubmitHandlers.map(customSubmit => customSubmit.formName)
      customResults = await Promise.all(callbacks)
    } catch (e) {
      // if errors occur during custom submit phase, clear out and abort submit
      clearCustomSubmitHandlers()
      return
    }
    customResults.forEach((result, index) => {
      if (result) {
        const formName = formNames[index]
        formValues[formName] = {
          ...formValues[formName],
          ...result
        }
      }
    })

    // run all validations and flatten error object
    const results = await Promise.all(Object.values(validationHandlers).map(handler => handler()))
    const validationErrors = flatMap(results, flattenErrors)

    // cleanup customSubmitHandlers added during submit process.
    clearCustomSubmitHandlers()

    if (validationErrors.length === 0) {
      setIsSubmitting(true)
    } else {
      if (focusFirstError) {
        setErrorMessageToFocus(validationErrors[0])
      }

      setIsSubmitting(false)

      if (isFunction(onError)) {
        onError(validationErrors)
      }
    }
  }

  return submit
}

export {
  useFormikSubmit as default,
  addCustomSubmitHandlerResult
}
