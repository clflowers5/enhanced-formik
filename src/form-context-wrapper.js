import React, { useState, useCallback } from 'react'
import PropTypes from 'prop-types'

import { FormValidationContext, FormValuesContext, FormSubmitContext } from './form-contexts'

function FormContextWrapper ({ children }) {
  const [submitHandlers, setSubmitHandlers] = useState([])
  const [validationHandlers, setValidationHandlers] = useState([])
  const [formValues, setFormValues] = useState({})

  const addSubmitHandler = useCallback((handler) => {
    setSubmitHandlers((prevStat) => [...prevStat, handler])
  }, [setSubmitHandlers])

  const addValidationHandler = useCallback((handler) => {
    setValidationHandlers((prevState) => [...prevState, handler])
  }, [setValidationHandlers])

  const addFormValues = useCallback((values) => {
    setFormValues((prevState) => {
      return Object.assign({}, prevState, values)
    })
  }, [setFormValues])

  return (
    <FormValuesContext.Provider value={ { formValues, addFormValues } }>
      <FormValidationContext.Provider value={ { validationHandlers, addValidationHandler } }>
        <FormSubmitContext.Provider value={ { submitHandlers, addSubmitHandler } }>
          { children }
        </FormSubmitContext.Provider>
      </FormValidationContext.Provider>
    </FormValuesContext.Provider>
  )
}

FormContextWrapper.propTypes = {
  children: PropTypes.node.isRequired,
}

export default FormContextWrapper
