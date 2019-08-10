import React from 'react'
import { Form, Field, ErrorMessage } from 'formik'
import { storiesOf } from '@storybook/react'
import * as yup from 'yup'

import { EnhancedFormik, FormContextWrapper, useFormikSubmit } from '../'

storiesOf('Enhanced Formik', module)
  .add('default', () =>
    <div className='container'>
      <ExampleForm />
    </div>
  )

const SubmitButton = ({ onSubmit, onError }) => {
  const submit = useFormikSubmit({ onSubmit, onError })
  return <button type='submit' onClick={ submit }>Click me!</button>
}

function ExampleForm () {
  return (
    <div>
      <FormContextWrapper>
        <EnhancedFormik
          initialValues={ { rando: '' } }
          validationSchema={ yup.object().shape({ rando: yup.string().required('hey I need this') }) }
        >
          { () => (
            <div>
              <Form>
                <div>
                  <label htmlFor='rando'>rando</label>
                  <Field type='text' id='rando' name='rando' />
                  <ErrorMessage name='rando' />
                </div>
                <FormContainerA />
                <FormContainerB />
                <SubmitButton
                  onSubmit={ (values) => console.log('Form values:', values) }
                  onError={ (errors) => console.log('Form errors:', errors) }
                />
              </Form>
            </div>
          ) }
        </EnhancedFormik>
      </FormContextWrapper>
    </div>
  )
}

function transformEmptyValues (value, originalValue) {
  if (originalValue.trim() === '' || originalValue.trim() === '*') {
    return null
  } else {
    return value
  }
}

function FormContainerA () {
  // example of independent validation/submitting while still working in bigger picture
  const submitRef = React.useRef()
  return (
    <div>
      <EnhancedFormik
        initialValues={ {
          obj: {
            foo: '',
            bar: ''
          }
        } }
        validationSchema={ yup.object().shape({
          obj: yup.object({
            foo: yup.string().min(5, 'foo not longer than 5').transform(transformEmptyValues).nullable(),
            bar: yup.string().max(5, 'need not more than 5').transform(transformEmptyValues).nullable()
          })
        }) }
        validateOnBlur={ false }
        validateOnChange={ false }
        handleSubmit={ (values, formikBag) => console.log('Running FormContainerA custom submit', values, formikBag) }
      >
        { ({ submitForm }) => {
          submitRef.current = submitForm
          return (
            <>
              <Field type='text' name='obj.foo' />
              <ErrorMessage name='obj.foo' />
              <Field type='text' name='obj.bar' />
              <ErrorMessage name='obj.bar' />
            </>
          )
        } }
      </EnhancedFormik>
      <button type='submit' onClick={
        () => submitRef && submitRef.current && submitRef.current()
      }>Validate form 1 independently
      </button>
    </div>
  )
}

function FormContainerB () {
  return (
    <div>
      <EnhancedFormik
        initialValues={ {
          foo2: '',
          bar2: ''
        } }
        validationSchema={ yup.object().shape({
          foo2: yup.string().min(5, 'need not longer than 5'),
          bar2: yup.string().max(5, 'need not more than 5')
        }) }
        validateOnBlur={ false }
        validateOnChange={ false }
        render={ () => {
          return (
            <>
              <Field type='text' name='foo2' />
              <ErrorMessage name='foo2' />
              <Field type='text' name='bar2' />
              <ErrorMessage name='bar2' />
            </>
          )
        } }
      />
    </div>
  )
}
