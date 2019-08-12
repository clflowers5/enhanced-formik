import React, { useContext, useEffect, useLayoutEffect, useState } from 'react'
import { withFormik } from 'formik'

import { FormSubmitContext, FormValidationContext, FormValuesContext } from './form-contexts'

function FormWrapper ({ submitForm, validateForm, children }) {
  const { addSubmitHandler } = useContext(FormSubmitContext)
  const { addValidationHandler } = useContext(FormValidationContext)

  useEffect(() => {
    addSubmitHandler(submitForm)
    addValidationHandler(validateForm)
  }, [addSubmitHandler, addValidationHandler, submitForm, validateForm])

  return children
}

function FormikWrapper ({ children, render, ...props }) {
  return (
    <FormWrapper submitForm={ props.submitForm } validateForm={ props.validateForm }>
      {// honor render first, then fallback to children
        typeof render === 'function'
          ? render(props)
          : typeof children === 'function'
            ? children(props) : children
      }
    </FormWrapper>
  )
}

function EnhancedFormik ({
  initialValues,
  validationSchema,
  validateOnBlur,
  validateOnChange,
  handleSubmit,
  ...rest
}) {
  const [isReady, setIsReady] = useState(false)
  const [EnhancedComp, setEnhancedComp] = useState(null)

  const { addFormValues } = useContext(FormValuesContext)

  function registerValues (values) {
    addFormValues(values)
  }

  useLayoutEffect(() => {
    const EnhancedComp1 = withFormik({
      // enableReinitialize: true,
      mapPropsToValues: () => initialValues,
      validationSchema,
      validateOnBlur,
      validateOnChange,
      handleSubmit: (values, formikBag) => {
        // if default provided, invoke - still register values
        handleSubmit && handleSubmit(values, formikBag)
        registerValues(values)
      }
    })(FormikWrapper)
    setIsReady(true)
    setEnhancedComp(() => EnhancedComp1)
    // we only ever want this to be created once per mount of a 'formik' form
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  // the rest here might not really be needed since we're using withFormik
  return isReady ? <EnhancedComp { ...rest } /> : null
}

export default EnhancedFormik
