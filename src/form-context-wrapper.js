import React, { useEffect, useRef } from 'react'
import PropTypes from 'prop-types'

import { FormSubmitContext, FormValidationContext } from './form-contexts'
import { setFormValuesState } from './state/form-values'

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
  initialValidationHandlers
}) {
  const submitHandlers = useRef(initialSubmitHandlers)
  const validationHandlers = useRef(initialValidationHandlers)

  useEffect(function setInitialFormValues () {
    if (initialFormValues) {
      setFormValuesState(initialFormValues)
    }
  }, [initialFormValues])

  return (
    <FormValidationContext.Provider value={validationHandlers.current}>
      <FormSubmitContext.Provider value={submitHandlers.current}>
        {children}
      </FormSubmitContext.Provider>
    </FormValidationContext.Provider>
  )
}

FormContextWrapper.propTypes = {
  children: PropTypes.node.isRequired,
  initialCustomSubmitHandlers: PropTypes.objectOf(PropTypes.func),
  initialFormValues: PropTypes.object,
  initialSubmitHandlers: PropTypes.objectOf(PropTypes.func),
  initialValidationHandlers: PropTypes.objectOf(PropTypes.func)
}

FormContextWrapper.defaultProps = {
  initialCustomSubmitHandlers: {},
  initialFormValues: {},
  initialSubmitHandlers: {},
  initialValidationHandlers: {}
}

export default FormContextWrapper
