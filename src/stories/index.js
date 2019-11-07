/* eslint-disable react/prop-types */
import React from 'react'
import { Form, Field, ErrorMessage } from 'formik'
import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import * as yup from 'yup'

import { EnhancedFormik, FormContextWrapper, useFormikSubmit } from './../index'

storiesOf('Enhanced Formik', module)
  .add('default', () =>
    <div className='container'>
      <ExampleForm />
    </div>,
  )

const SubmitButton = ({ onSubmit, onError }) => {
  const submit = useFormikSubmit({
    onSubmit,
    onError,
  })
  return <button type='submit' onClick={submit}>Click me!</button>
}

function ExampleForm () {
  return (
    <div>
      <FormContextWrapper>
        <EnhancedFormik
          name='big_form'
          initialValues={{ randomKey: '' }}
          validationSchema={yup.object().shape({ randomKey: yup.string().required('hey I need this') })}
        >
          {() => (
            <div>
              <Form>
                <div>
                  <label htmlFor='randomKey'>randomKey</label>
                  <Field
                    type='text'
                    id='randomKey'
                    name='randomKey'
                  />
                  <ErrorMessage name='randomKey' />
                </div>
                <FormContainerA />
                <FormContainerB />
                <SubmitButton
                  onSubmit={action('Success: onSubmit Form values:')}
                  onError={action('Error: onError Form errors:')}
                />
              </Form>
            </div>
          )}
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
        name='form_a'
        initialValues={{
          obj: {
            foo: '',
            bar: '',
          },
        }}
        validationSchema={yup.object().shape({
          obj: yup.object({
            foo: yup.string().min(5, 'foo not longer than 5').transform(transformEmptyValues).nullable(),
            bar: yup.string().max(5, 'need not more than 5').transform(transformEmptyValues).nullable(),
          }),
        })}
        validateOnBlur={false}
        validateOnChange={false}
        handleSubmit={action('handleSubmit: Running FormContainerA custom submit. Values and Bag:')}
      >
        {({ submitForm }) => {
          submitRef.current = submitForm
          return (
            <React.Fragment>
              <Field type='text' name='obj.foo' />
              <ErrorMessage name='obj.foo' />
              <Field type='text' name='obj.bar' />
              <ErrorMessage name='obj.bar' />
            </React.Fragment>
          )
        }}
      </EnhancedFormik>
      <button
        type='submit'
        onClick={() => submitRef && submitRef.current && submitRef.current()}
      >Validate form 1 independently
      </button>
    </div>
  )
}

function FormContainerB () {
  return (
    <div>
      <EnhancedFormik
        name='form_b'
        initialValues={{
          foo2: '',
          bar2: '',
        }}
        validationSchema={yup.object().shape({
          foo2: yup.string().min(5, 'need not longer than 5'),
          bar2: yup.string().max(5, 'need not more than 5'),
        })}
        validateOnBlur={false}
        validateOnChange={false}
      >
        {() => (
          <>
            <Field type='text' name='foo2' />
            <ErrorMessage name='foo2' />
            <Field type='text' name='bar2' />
            <ErrorMessage name='bar2' />
          </>
        )}
      </EnhancedFormik>
    </div>
  )
}
