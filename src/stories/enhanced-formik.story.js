import React from 'react'
import { action } from '@storybook/addon-actions'

import { DebugFormValues, EnhancedFormik, Field, FieldArray, FormContextWrapper, SubmitButton } from '../index'

export default { title: 'Enhanced Formik' }

export function basicUsage () {
  const initialValues1 = {
    foo: '',
    baz: ''
  }

  const initialValues2 = {
    yo: '',
    lo: ''
  }

  const initialValues3 = {
    barList: [
      {
        name: 'uno'
      },
      {
        name: 'ya'
      }
    ]
  }

  const initialValues4 = {
    what: 'what'
  }

  return (
    <div>
      <h1>Forms</h1>
      <FormContextWrapper>
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

        <h2>Form 3...</h2>
        <EnhancedFormik
          name='form3'
          initialValues={initialValues3}
        >
          {({ values }) => (
            <FieldArray name='barList'>
              {({ push, remove }) => (
                <div>
                  {values.barList.map((bar, index) => (
                    <div key={`${index}`}>
                      <Field name={`barList.${index}.name`} />
                      <div>{values.barList[index].name}</div>
                      <div>
                        <button onClick={() => remove(index)}>Remove</button>
                      </div>
                      <div>
                        <button onClick={() => push({ name: '' })}>Add</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </FieldArray>
          )}
        </EnhancedFormik>

        <h2>Form 4... Custom Submit</h2>
        <EnhancedFormik
          name='form4'
          initialValues={initialValues4}
          handleSubmit={(...props) => {
            return new Promise((resolve, reject) => {
              if (props[0].what === 'what') {
                setTimeout(() => {
                  window.alert('Custom Submit Handler - What cannot be what')
                  reject(new Error('What cannot be what async'))
                  // throw new Error('What cannot be what')
                }, 2000)
              } else {
                resolve({
                  newKey: 'foobarlife'
                })
              }
            })
          }}
        >
          <div>
            <Field name='what' />
          </div>
        </EnhancedFormik>

        <SubmitButton
          onSubmit={action('Form Submit')}
          onError={action('Form Error')}
          style={{ marginTop: '3rem' }}
        >
          Submit Form
        </SubmitButton>

        <DebugFormValues />
      </FormContextWrapper>
    </div>
  )
}
