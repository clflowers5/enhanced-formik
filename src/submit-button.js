import React from 'react'
import PropTypes from 'prop-types'

import useFormikSubmit from './use-formik-submit'

/* Helper to be used within a <FormContextWrapper> Component */
function SubmitButton ({
  as,
  children,
  className,
  focusFirstError,
  onError,
  onSubmit,
  ...props
}) {
  const Component = as
  const submitForm = useFormikSubmit({
    onSubmit,
    onError,
    focusFirstError,
  })
  return (
    <Component
      className={className}
      onClick={submitForm}
      data-testid='rtl-formik-submit-button'
      {...props}
    >
      {children}
    </Component>
  )
}

SubmitButton.propTypes = {
  as: PropTypes.oneOfType([PropTypes.string, PropTypes.elementType]),
  children: PropTypes.node,
  className: PropTypes.string,
  focusFirstError: PropTypes.bool,
  onError: PropTypes.func,
  onSubmit: PropTypes.func.isRequired,
}

SubmitButton.defaultProps = {
  as: 'button',
}

export default SubmitButton
