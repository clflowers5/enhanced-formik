import React, { useState, useCallback } from 'react'
import PropTypes from 'prop-types'

import {
  FormSubmitContext,
  FormValidationContext,
  FormValuesContext,
} from './form-contexts'

/**
 * FormContextWrapper
 * Wrapper component for EnhancedFormik(s)
 * @param children
 * @param initialSubmitHandlers !!You should not need to provide this outside of tests!!
 * @param initialValidationHandlers !!You should not need to provide this outside of tests!!
 * @param initialFormValues !!You should not need to provide this outside of tests!!
 */
function FormContextWrapper ({
  children,
  initialFormValues,
  initialSubmitHandlers,
  initialValidationHandlers,
}) {
  const [submitHandlers, setSubmitHandlers] = useState(initialSubmitHandlers)
  const [validationHandlers, setValidationHandlers] = useState(initialValidationHandlers)
  const [formValues, setFormValues] = useState(initialFormValues)

  const addSubmitHandler = useCallback((handler) => {
    setSubmitHandlers((prevState) => Object.assign({}, prevState, handler))
  }, [setSubmitHandlers])

  const removeSubmitHandler = useCallback((handler) => {
    setSubmitHandlers((prevState) => {
      const newState = Object.assign({}, prevState)
      delete newState[handler]
      return newState
    })
  }, [setSubmitHandlers])

  const addValidationHandler = useCallback((handler) => {
    setValidationHandlers((prevState) => Object.assign({}, prevState, handler))
  }, [setValidationHandlers])

  const removeValidationHandler = useCallback((handler) => {
    setValidationHandlers((prevState) => {
      const newState = Object.assign({}, prevState)
      delete newState[handler]
      return newState
    })
  }, [setValidationHandlers])

  const addFormValues = useCallback((values) => {
    setFormValues((prevState) => Object.assign({}, prevState, values))
  }, [setFormValues])

  const removeFormValues = useCallback((formName) => {
    setFormValues((prevState) => {
      const newState = Object.assign({}, prevState)
      delete newState[formName]
      return newState
    })
  }, [setFormValues])

  // todo: evaluate if condesning contexts is worthwhile
  return (
    <FormValuesContext.Provider
      value={{
        formValues,
        addFormValues,
        removeFormValues,
      }}
    >
      <FormValidationContext.Provider
        value={{
          validationHandlers,
          addValidationHandler,
          removeValidationHandler,
        }}
      >
        <FormSubmitContext.Provider
          value={{
            submitHandlers,
            addSubmitHandler,
            removeSubmitHandler,
          }}
        >
          {children}
        </FormSubmitContext.Provider>
      </FormValidationContext.Provider>
    </FormValuesContext.Provider>
  )
}

FormContextWrapper.propTypes = {
  children: PropTypes.node.isRequired,
  initialCustomSubmitHandlers: PropTypes.objectOf(PropTypes.func),
  initialFormValues: PropTypes.object,
  initialSubmitHandlers: PropTypes.objectOf(PropTypes.func),
  initialValidationHandlers: PropTypes.objectOf(PropTypes.func),
}

FormContextWrapper.defaultProps = {
  initialCustomSubmitHandlers: {},
  initialFormValues: {},
  initialSubmitHandlers: {},
  initialValidationHandlers: {},
}

export default FormContextWrapper
