import React from 'react'
import PropTypes from 'prop-types'

import useFormikSubmit from './use-formik-submit'

/*
  Helper to be used within a <FormContextWrapper> Component
 */
function SubmitButton ({
  children,
  className,
  onError,
  onSubmit,
  as,
  ...rest
}) {
  const submitForm = useFormikSubmit({
    onSubmit,
    onError,
  })
  const Component = as
  return (
    <Component
      className={className}
      onClick={submitForm}
      {...rest}
    >
      {children}
    </Component>
  )
}

SubmitButton.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  onError: PropTypes.func,
  onSubmit: PropTypes.func.isRequired,
  as: PropTypes.elementType,
}

SubmitButton.defaultProps = {
  as: 'button',
}

export default SubmitButton
