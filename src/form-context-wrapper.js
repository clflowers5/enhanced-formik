import React, { useRef } from 'react'
import PropTypes from 'prop-types'
import { useLocalObservable } from 'mobx-react-lite'

import {
  FormSubmitContext,
  FormValidationContext,
  FormValuesContext
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
  initialValidationHandlers
}) {
  const submitHandlers = useRef(initialSubmitHandlers)
  const validationHandlers = useRef(initialValidationHandlers)
  const formValues = useLocalObservable(() => initialFormValues)

  // todo: still evaluate if condensing contexts is worthwhile - maybe so with the switch to mobx
  return (
    <FormValuesContext.Provider value={formValues}>
      <FormValidationContext.Provider value={validationHandlers.current}>
        <FormSubmitContext.Provider value={submitHandlers.current}>
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
  initialValidationHandlers: PropTypes.objectOf(PropTypes.func)
}

FormContextWrapper.defaultProps = {
  initialCustomSubmitHandlers: {},
  initialFormValues: {},
  initialSubmitHandlers: {},
  initialValidationHandlers: {}
}

export default FormContextWrapper
