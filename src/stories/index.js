/* eslint-disable react/prop-types */
import React from 'react'
import { Form, Field, ErrorMessage } from 'formik'
import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import * as yup from 'yup'

import { EnhancedFormik, FormContextWrapper, FormValuesContext, SubmitButton } from './../index'
import FormValues from './../FormValues'

storiesOf('Enhanced Formik', module)
  .add('default', () =>
    <div className='container'>
      <ExampleForm />
    </div>,
  )

function ExampleForm () {
  const [displayForm2, setDisplayForm2] = React.useState(true)
  const toggleForm2 = React.useCallback(() => setDisplayForm2((prevValue) => !prevValue), [])
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
              </Form>
            </div>
          )}
        </EnhancedFormik>
        {displayForm2 && (
          <>
            <FormContainerA />
            <FormContainerB />
          </>
        )}
        <SubmitButton
          onSubmit={action('Success: onSubmit Form values:')}
          onError={action('Error: onError Form errors:')}
        >DO the submit</SubmitButton>

        <div>
          <button onClick={toggleForm2}>Make form 2 go away!</button>
        </div>

        <MyValues />
      </FormContextWrapper>
    </div>
  )
}

function MyValues () {
  const { formNameValues } = React.useContext(FormValuesContext)
  return (
    <div>
      <FormValues />
      <FormValues name='Form Name Values' values={formNameValues} />
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

  const { formNameValues } = React.useContext(FormValuesContext)
  const initialValues = formNameValues['form_a']
  return (
    <div>
      <EnhancedFormik
        name='form_a'
        initialValues={initialValues || {
          obj: {
            foo: '',
            bar: '',
          },
        }}
        validationSchema={yup.object().shape({
          obj: yup.object({
            foo: yup.string().required('i need').min(5, 'foo not longer than 5').transform(transformEmptyValues).nullable(),
            bar: yup.string().required('u need').max(5, 'need not more than 5').transform(transformEmptyValues).nullable(),
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
        onClick={() => {
          if (submitRef && submitRef.current) {
            submitRef.current()
          }
        }}
      >Validate form 1 independently
      </button>
    </div>
  )
}

// todo: potential stopper - verify previous version
// 'submitForm' above also triggers example_form's submit - this shouldn't happen

function FormContainerB () {
  const { formNameValues } = React.useContext(FormValuesContext)
  const initialValues = formNameValues['form_b']

  return (
    <div>
      <EnhancedFormik
        name='form_b'
        initialValues={initialValues || {
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
