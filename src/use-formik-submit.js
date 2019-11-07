import { useEffect, useState, useContext } from 'react'
import flatMap from 'lodash/flatMap'
import isFunction from 'lodash/isFunction'
import isObject from 'lodash/isObject'

import { FormSubmitContext, FormValuesContext, FormValidationContext } from './form-contexts'

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
function addCustomSubmitHandlerResult (handlerReturnValue) {
  customSubmitHandlers.push(Promise.resolve(handlerReturnValue))
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

function useFormikSubmit ({ onSubmit, onError }) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { submitHandlers } = useContext(FormSubmitContext)
  const { validationHandlers } = useContext(FormValidationContext)
  const { formValues, addFormValues } = useContext(FormValuesContext)

  useEffect(() => {
    if (isSubmitting && formValues) {
      onSubmit(formValues)
      setIsSubmitting(false)
    }
  }, [isSubmitting, formValues, onSubmit])

  async function submit () {
    // submitForm does not reject if invalid per docs
    // run all submit handlers
    await Promise.all(Object.values(submitHandlers).map(handler => handler()))

    const customResults = await Promise.all(customSubmitHandlers)
    customResults.forEach(result => result && addFormValues(result))

    // run all validations and flatten error object
    const results = await Promise.all(Object.values(validationHandlers).map(handler => handler()))
    const validationErrors = flatMap(results, flattenErrors)

    // cleanup customSubmitHandlers added during submit process.
    clearCustomSubmitHandlers()

    if (validationErrors.length === 0) {
      setIsSubmitting(true)
    } else {
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
  addCustomSubmitHandlerResult,
}
