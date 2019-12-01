import React, { useContext, useEffect, useLayoutEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { withFormik } from 'formik'
import { isEqual } from 'lodash'

import {
  FormSubmitContext,
  FormValidationContext,
  FormValuesContext,
} from './form-contexts'
import { addCustomSubmitHandlerResult } from './use-formik-submit'

function FormWrapper ({ values, name, submitForm, validateForm, children }) {
  const { addSubmitHandler, removeSubmitHandler } = useContext(FormSubmitContext)
  const { addValidationHandler, removeValidationHandler } = useContext(FormValidationContext)
  const { addFormValues, removeFormValues } = useContext(FormValuesContext)

  useEffect(() => {
    addFormValues(name, values)
    return () => {
      removeFormValues(name)
    }
  }, [name, values, addFormValues, removeFormValues])

  useEffect(() => {
    addSubmitHandler({ [name]: submitForm })
    addValidationHandler({ [name]: validateForm })
    return () => {
      removeSubmitHandler(name)
      removeValidationHandler(name)
    }
  }, [name, addSubmitHandler, addValidationHandler, submitForm, validateForm, removeSubmitHandler, removeValidationHandler])

  return children
}

const MemoizedFormWrapper = React.memo(FormWrapper, (prevProps, nextProps) => {
  return isEqual(prevProps.values, nextProps.values)
})

// const MemoizedFormWrapper = React.memo(FormWrapper)

function FormikWrapper ({ children, name, render, ...props }) {
  return (
    <MemoizedFormWrapper
      values={props.values}
      name={name}
      submitForm={props.submitForm}
      validateForm={props.validateForm}
    >
      {
        typeof children === 'function'
          ? children(props)
          : children
      }
    </MemoizedFormWrapper>
  )
}

const MemoizedFormikWrapper = React.memo(FormikWrapper)

FormikWrapper.propTypes = {
  children: PropTypes.oneOfType([PropTypes.node, PropTypes.func]),
  render: PropTypes.func,
  name: PropTypes.string.isRequired,
  submitForm: PropTypes.func.isRequired,
  validateForm: PropTypes.func.isRequired,
  values: PropTypes.object,
}

/**
 * EnhancedFormik - Component
 * @param name - String name/identifier for the form. Required for multi-form management.
 * @param initialValues - Formik equivalent
 * @param validationSchema - Formik equivalent
 * @param validateOnBlur - Formik equivalent
 * @param validateOnChange - Formik equivalent
 * @param handleSubmit - Custom handleSubmit function. If provided, the return/resolve value should be an object that
 * will be added to the `formValues` on submit. These Values will _not_ currently be validated - take care when using
 * this that the return values are valid.
 * @param rest - withFormik HOC props
 * @returns {null || EnhancedFormik}
 * @constructor
 */
function EnhancedFormik ({
  name,
  initialValues,
  validationSchema,
  validateOnBlur,
  validateOnChange,
  handleSubmit,
  ...rest
}) {
  const [isReady, setIsReady] = useState(false)
  const [EnhancedComponent, setEnhancedComponent] = useState(null)
  const mapPropsToValues = React.useCallback(() => initialValues, [])
  const handleFormikSubmit = React.useCallback((values, formikBag) => {
    if (typeof handleSubmit === 'function') {
      addCustomSubmitHandlerResult(name, handleSubmit(values, formikBag))
    }
  }, [])

  useLayoutEffect(() => {
    const EnhancedFormikComponent = withFormik({
      mapPropsToValues,
      validationSchema,
      validateOnBlur,
      validateOnChange,
      handleSubmit: handleFormikSubmit,
    })(MemoizedFormikWrapper)
    console.log('creating memoized formik', name)
    setIsReady(true)
    setEnhancedComponent(() => EnhancedFormikComponent)
    // we only ever want this to be created once per mount of a 'formik' form
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return isReady ? <EnhancedComponent name={name} {...rest} /> : null
}

EnhancedFormik.propTypes = {
  initialValues: PropTypes.object.isRequired,
  name: PropTypes.string.isRequired,
  validationSchema: PropTypes.object,
  validateOnBlur: PropTypes.bool,
  validateOnChange: PropTypes.bool,
  handleSubmit: PropTypes.func,
}

export default EnhancedFormik
