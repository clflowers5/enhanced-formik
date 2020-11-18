/* istanbul ignore file */
import React, { useContext } from 'react'
import PropTypes from 'prop-types'
import { observer } from 'mobx-react-lite'

import { FormValuesContext } from './form-contexts'

/**
 * Simple output of formatted form values. Useful for dev-time testing and debugging.
 */

const DebugFormValues = observer(({ values, title }) => {
  const formValues = useContext(FormValuesContext)
  return (
    <div style={{ marginTop: '2rem' }}>
      <p><b>{title}</b></p>
      <pre>{JSON.stringify(values || formValues, null, 2)}</pre>
    </div>
  )
})

DebugFormValues.propTypes = {
  values: PropTypes.object,
  title: PropTypes.string
}

DebugFormValues.defaultProps = {
  title: 'Debug Form Values'
}

export default DebugFormValues
