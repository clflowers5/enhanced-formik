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
  ...rest
}) {
  const submitForm = useFormikSubmit({
    onSubmit,
    onError,
  })
  return (
    <button
      className={className}
      onClick={submitForm}
      {...rest}
    >
      {children}
    </button>
  )
}

SubmitButton.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  onError: PropTypes.func,
  onSubmit: PropTypes.func.isRequired,
}

export default SubmitButton
