import React, { useContext } from 'react'
import { FormValuesContext } from './form-contexts'

function FormValues ({ name = 'Form Values', values }) {
  const { formValues } = useContext(FormValuesContext)
  return (
    <div style={{ margin: '2rem 0' }}>
      <b>{name}</b>
      <div style={{ backgroundColor: 'gainsboro', padding: '0.5em', border: '1px solid black' }}>
        <pre><code>{JSON.stringify(values || formValues, null, 2)}</code></pre>
      </div>
    </div>
  )
}

export default FormValues
