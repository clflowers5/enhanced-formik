import { useEffect, useState, useContext } from 'react'

import { FormSubmitContext, FormValuesContext, FormValidationContext } from './form-contexts'

function useFormikSubmit ({ onSubmit, onError = () => {} }) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { submitHandlers } = useContext(FormSubmitContext)
  const { validationHandlers } = useContext(FormValidationContext)
  const { formValues } = useContext(FormValuesContext)

  useEffect(() => {
    if (isSubmitting && formValues) {
      onSubmit(formValues)
      setIsSubmitting(false)
    }
  }, [isSubmitting, formValues, onSubmit])

  async function submit () {
    // submitForm does not reject if invalid per docs
    // run all submit handlers
    await Promise.all(submitHandlers.map(handler => handler()))
    // run all validations and flatten error object
    const results = await Promise.all(validationHandlers.map(handler => handler()))
    const validationErrors = results.flatMap(x => Object.keys(x))

    if (validationErrors.length === 0) {
      setIsSubmitting(true)
    } else {
      setIsSubmitting(false)
      // not sure how useful this is, but need something to trigger onError
      onError(validationErrors)
    }
  }

  return submit
}

export default useFormikSubmit
