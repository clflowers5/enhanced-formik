/* eslint-disable react/prop-types,no-console */
import React from 'react'
import { cleanup, fireEvent, render, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'

import { DebugFormValues, EnhancedFormik, Field, FormContextWrapper } from './index'

describe('DebugFormValues', () => {
  let originalError

  // Current version of React will log errors when testing asynchronous actions, will be resolved in 16.9.0
  // https://react-hooks-testing-library.com/usage/advanced-hooks#act-warning
  beforeAll(() => {
    originalError = console.error
    console.error = jest.fn()
  })

  afterAll(() => {
    console.error = originalError
  })

  afterEach(() => {
    cleanup()
    jest.clearAllMocks()
  })

  it('displays form values in real time as updates are made', async () => {
    const { getByLabelText, getByTestId } = render(
      <FormContextWrapper>
        <EnhancedFormik
          name='myForm'
          initialValues={{ foo: 'bar' }}
        >
          <label>
            <span>Foo Label</span>
            <Field name='foo' />
          </label>
        </EnhancedFormik>

        <DebugFormValues />
      </FormContextWrapper>
    )

    const input = getByLabelText('Foo Label')
    const debugValues = getByTestId('rtl-debug-form-values')
    await waitFor(() => expect(debugValues.innerHTML.replace(/\n/g, '').replace(/\s/g, ''))
      .toEqual('{"myForm":{"foo":"bar"}}'))

    fireEvent.change(input, { target: { value: 'lolcats' } })
    await waitFor(() => expect(debugValues.innerHTML.replace(/\n/g, '').replace(/\s/g, ''))
      .toEqual('{"myForm":{"foo":"lolcats"}}'))

    fireEvent.change(input, { target: { value: 'cool-beans' } })
    await waitFor(() => expect(debugValues.innerHTML.replace(/\n/g, '').replace(/\s/g, ''))
      .toEqual('{"myForm":{"foo":"cool-beans"}}'))
  })
})
