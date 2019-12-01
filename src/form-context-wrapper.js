import React, { useState, useCallback, useRef } from 'react'
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
 * @param initialFormNameValues !!You should not need to provide this outside of tests!!
 */
function FormContextWrapper ({
  children,
  initialFormValues,
  initialSubmitHandlers,
  initialValidationHandlers,
  initialFormNameValues,
}) {
  const [submitHandlers, setSubmitHandlers] = useState(initialSubmitHandlers)
  const [validationHandlers, setValidationHandlers] = useState(initialValidationHandlers)
  const [formValues, setFormValues] = useState(initialFormValues)
  // const formValues = useRef(initialFormValues)
  const formNameValuesRef = useRef(initialFormNameValues)

  const addSubmitHandler = useCallback((handler) => {
    setSubmitHandlers((prevState) => ({ ...prevState, ...handler }))
  }, [setSubmitHandlers])

  const removeSubmitHandler = useCallback((handler) => {
    setSubmitHandlers((prevState) => {
      const newState = { ...prevState }
      delete newState[handler]
      return newState
    })
  }, [setSubmitHandlers])

  const addValidationHandler = useCallback((handler) => {
    setValidationHandlers((prevState) => ({ ...prevState, ...handler }))
  }, [setValidationHandlers])

  const removeValidationHandler = useCallback((handler) => {
    setValidationHandlers((prevState) => {
      const newState = { ...prevState }
      delete newState[handler]
      return newState
    })
  }, [setValidationHandlers])

  const addFormValues = useCallback((formName, values) => {
    setFormValues((prevState) => ({ ...prevState, ...values }))
    // formValues.current = { ...formValues.current, ...values }
    const previousFormValues = formNameValuesRef.current[formName] || {}
    // formNameValuesRef.current = { ...formNameValuesRef.current, [formName]: { ...previousFormValues, ...values } }
    if (formNameValuesRef.current[formName]) {
      Object.assign(formNameValuesRef.current[formName], previousFormValues, values)
    } else {
      formNameValuesRef.current[formName] = {}
    }
  }, [])
  // }, [setFormValues])

  // todo: I don't think this was ever working correctly
  const removeFormValues = useCallback((formName) => {
    // setFormValues((prevState) => {
    //   const newState = { ...prevState }
    //   delete newState[formName]
    //   return newState
    // })
    // }, [setFormValues])
  }, [])

  return (
    <FormValuesContext.Provider
      value={{
        formValues,
        formNameValuesRef,
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
  initialFormValues: PropTypes.object,
  initialSubmitHandlers: PropTypes.objectOf(PropTypes.func),
  initialValidationHandlers: PropTypes.objectOf(PropTypes.func),
  initialFormNameValues: PropTypes.objectOf(PropTypes.object)
}

FormContextWrapper.defaultProps = {
  initialFormValues: {},
  initialSubmitHandlers: {},
  initialValidationHandlers: {},
  initialFormNameValues: {},
}

export default FormContextWrapper
