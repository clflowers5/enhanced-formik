/* istanbul ignore file */
import React from 'react'
import PropTypes from 'prop-types'
import { useContextSelector } from 'use-context-selector'

import { FormValuesContext } from './form-contexts'

/**
 * Simple output of formatted form values. Useful for dev-time testing and debugging.
 */
// todo almost everything works but the debug form values. That would need to dynamically update / rerender...

function DebugFormValues ({ values, title }) {
  // todo: this one might not work as intended
  const formValues = useContextSelector(FormValuesContext, c => c.formValues)
  return (
    <div style={{ marginTop: '2rem' }}>
      <p><b>{title}</b></p>
      <pre>{JSON.stringify(values || formValues, null, 2)}</pre>
    </div>
  )
}

DebugFormValues.propTypes = {
  values: PropTypes.object,
  title: PropTypes.string
}

DebugFormValues.defaultProps = {
  title: 'Debug Form Values'
}

export default DebugFormValues
