import React from 'react'

import {
  DebugFormValues,
  EnhancedFormik,
  FormContextWrapper,
  Form,
  Field,
  SubmitButton,
} from '../index'

export default { title: 'Enhanced Formik' }

export function basicUsage() {
  const initialValues1 = {
    foo: '',
    baz: '',
  }

  const initialValues2 = {
    yo: '',
    lo: '',
  }

  return (
    <div>
      <h1>Forms</h1>
      <FormContextWrapper>
        <Form>
          <h2>Form 1</h2>
          <EnhancedFormik
            name='form1'
            initialValues={initialValues1}
          >
            <Field name='foo' />
            <Field name='baz' style={{ marginLeft: '1rem' }} />
          </EnhancedFormik>

          <h2>Form 2</h2>
          <EnhancedFormik
            name='form2'
            initialValues={initialValues2}
          >
            <Field name='yo' />
            <Field name='lo' style={{ marginLeft: '1rem' }} />
          </EnhancedFormik>

          <SubmitButton
            onSubmit={(values) => {
              alert('submit')
              console.log(JSON.stringify(values))
            }}
          >
            Submit Form
          </SubmitButton>

        </Form>
        <DebugFormValues />
      </FormContextWrapper>
    </div>
  )
}
