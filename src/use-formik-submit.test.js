/* eslint-disable react/prop-types,no-console */
import React from 'react'
import { act, renderHook } from '@testing-library/react-hooks'

import useFormikSubmit, { addCustomSubmitHandlerResult } from './use-formik-submit'
import FormContextWrapper from './form-context-wrapper'

// todo: get jest-babel setup to actually run tests
describe('useFormikSubmit', () => {
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

  it('invokes provided `onError` callback if validation handlers return errors', (done) => {
    expect.assertions(2)
    const mockOnSubmit = jest.fn()
    const mockOnError = jest.fn()
    const mockSubmitHandler = jest.fn()
    const mockValidationHandler = jest.fn(() => ({ foo: 'woops!' }))
    const mockFormValues = {
      foo: 'bar',
      bar: 'baz',
      baz: {
        foo: 'zoink',
        bar: 'derp'
      },
      bing: ['yolo']
    }

    const wrapper = ({ children }) => (
      <FormContextWrapper
        initialFormValues={mockFormValues}
        initialSubmitHandlers={{ myForm: mockSubmitHandler }}
        initialValidationHandlers={{ myForm: mockValidationHandler }}
      >
        {children}
      </FormContextWrapper>
    )

    const { result, rerender } = renderHook(() => useFormikSubmit({
      onSubmit: mockOnSubmit,
      onError: mockOnError
    }), { wrapper })

    act(async () => {
      await result.current()
      rerender()
      expect(mockOnSubmit).not.toHaveBeenCalled()
      expect(mockOnError).toHaveBeenCalledWith(['woops!'])
      done()
    })
  })

  it('`onError` is an optional prop', (done) => {
    expect.assertions(1)
    const mockOnSubmit = jest.fn()
    const mockSubmitHandler = jest.fn()
    const mockValidationHandler = jest.fn(() => ({ foo: 'woops!' }))
    const mockFormValues = {
      foo: 'bar',
      bar: 'baz',
      baz: {
        foo: 'zoink',
        bar: 'derp'
      },
      bing: ['yolo']
    }

    const wrapper = ({ children }) => (
      <FormContextWrapper
        initialFormValues={mockFormValues}
        initialSubmitHandlers={{ myForm: mockSubmitHandler }}
        initialValidationHandlers={{ myForm: mockValidationHandler }}
      >
        {children}
      </FormContextWrapper>
    )

    const { result, rerender } = renderHook(() => useFormikSubmit({
      onSubmit: mockOnSubmit
    }), { wrapper })

    act(async () => {
      await result.current()
      rerender()
      expect(mockOnSubmit).not.toHaveBeenCalled()
      // we didn't blow up, yay!
      done()
    })
  })

  it('invokes provided `onSubmit` callback on successful invocation and validation', (done) => {
    expect.assertions(2)
    const mockOnSubmit = jest.fn()
    const mockOnError = jest.fn()
    const mockSubmitHandler = jest.fn()
    const mockValidationHandler = jest.fn(() => ({}))
    const mockFormValues = {
      foo: 'bar',
      bar: 'baz',
      baz: {
        foo: 'zoink',
        bar: 'derp'
      },
      bing: ['yolo']
    }

    const wrapper = ({ children }) => (
      <FormContextWrapper
        initialFormValues={mockFormValues}
        initialSubmitHandlers={{ myForm: mockSubmitHandler }}
        initialValidationHandlers={{ myForm: mockValidationHandler }}
      >
        {children}
      </FormContextWrapper>
    )

    const { result, rerender } = renderHook(() => useFormikSubmit({
      onSubmit: mockOnSubmit,
      onError: mockOnError
    }), { wrapper })

    act(async () => {
      await result.current()
      rerender()
      expect(mockOnSubmit).toHaveBeenCalledWith(mockFormValues)
      expect(mockOnError).not.toHaveBeenCalled()
      done()
    })
  })

  it('handles custom async submit functions if added via `addCustomSubmitHandlerResult`', (done) => {
    expect.assertions(5)
    const mockOnSubmit = jest.fn()
    const mockOnError = jest.fn()
    const mockSubmitHandler = jest.fn()
    const mockValidationHandler = jest.fn(() => ({}))
    const mockCustomSubmitHandler = jest.fn()
    const mockFormValues = {
      myForm: {
        foo: 'bar',
        bar: 'baz',
        baz: {
          foo: 'zoink',
          bar: 'derp'
        },
        bing: ['yolo']
      }
    }

    const wrapper = ({ children }) => (
      <FormContextWrapper
        initialFormValues={mockFormValues}
        initialSubmitHandlers={{ myForm: mockSubmitHandler }}
        initialValidationHandlers={{ myForm: mockValidationHandler }}
      >
        {children}
      </FormContextWrapper>
    )

    const { result, rerender } = renderHook(() => useFormikSubmit({
      onSubmit: mockOnSubmit,
      onError: mockOnError
    }), { wrapper })

    addCustomSubmitHandlerResult(
      new Promise(resolve =>
        setTimeout(() => {
          mockCustomSubmitHandler()
          resolve({ customKey: 'Frosted-Flakes!' })
        }, 1000)),
      'myForm'
    )

    act(async () => {
      expect(mockCustomSubmitHandler).not.toHaveBeenCalled()
      expect(mockOnSubmit).not.toHaveBeenCalled()
      await result.current()
      rerender()
      // resolved value is added to formValues
      expect(mockOnSubmit).toHaveBeenCalledWith({
        myForm: {
          ...mockFormValues.myForm,
          customKey: 'Frosted-Flakes!'
        }
      })
      expect(mockCustomSubmitHandler).toHaveBeenCalledTimes(1)
      expect(mockOnError).not.toHaveBeenCalled()
      done()
    })
  })

  it('focuses the first errored input if the `focusFirstError` option is set to true', async () => {
    expect.assertions(5)
    const mockOnSubmit = jest.fn()
    const mockOnError = jest.fn()
    const mockSubmitHandler = jest.fn()
    const mockValidationHandler = jest.fn(() => ({ bar: 'woops!' }))
    const mockFormValues = {
      foo: 'bar',
      bar: 'baz'
    }

    // setup document inputs / helper data attributes. Can't render actual jsx to DOM with the renderHook fn
    const randomInput = document.createElement('input')
    randomInput.setAttribute('id', 'random')
    const fooInput = document.createElement('input')
    fooInput.setAttribute('id', 'foo')
    const fooError = document.createElement('span')
    fooError.setAttribute('data-error-message', 'woops!')
    fooError.setAttribute('data-error-for', 'foo')

    jest.spyOn(document, 'querySelector')
    jest.spyOn(document, 'getElementById')

    document.querySelector.mockImplementationOnce(() => {
      // we have an error and are querying for the error message itself
      expect(document.querySelector).toHaveBeenCalledWith('[data-error-message="woops!"]')
      return fooError
    })

    document.getElementById.mockImplementationOnce(() => {
      // we pull the input id from the data-error-for attr, now we query for the actual input associated with the error
      expect(document.getElementById).toHaveBeenCalledWith('foo')
      return fooInput
    })

    document.body.append(randomInput)
    document.body.append(fooInput)
    document.body.append(fooError)

    const wrapper = ({ children }) => (
      <FormContextWrapper
        initialFormValues={mockFormValues}
        initialSubmitHandlers={{ myForm: mockSubmitHandler }}
        initialValidationHandlers={{ myForm: mockValidationHandler }}
      >
        {children}
      </FormContextWrapper>
    )

    const { result, rerender } = renderHook(() => useFormikSubmit({
      onSubmit: mockOnSubmit,
      onError: mockOnError,
      focusFirstError: true
    }), { wrapper })

    await result.current()
    rerender()
    expect(mockOnSubmit).not.toHaveBeenCalled()
    expect(mockOnError).toHaveBeenCalledTimes(1)
    expect(document.activeElement).toBe(fooInput)
  })
})
