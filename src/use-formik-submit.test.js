/* eslint-disable react/prop-types,no-console */
import React from 'react'
import { renderHook, act } from '@testing-library/react-hooks'

import useFormikSubmit, { addCustomSubmitHandlerResult } from './use-formik-submit'
import FormContextWrapper from './form-context-wrapper'

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
        bar: 'derp',
      },
      bing: ['yolo'],
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
      onError: mockOnError,
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
        bar: 'derp',
      },
      bing: ['yolo'],
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
        bar: 'derp',
      },
      bing: ['yolo'],
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
      onError: mockOnError,
    }), { wrapper })

    act(async () => {
      await result.current()
      rerender()
      expect(mockOnSubmit).toHaveBeenCalledWith(mockFormValues, {})
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
      foo: 'bar',
      bar: 'baz',
      baz: {
        foo: 'zoink',
        bar: 'derp',
      },
      bing: ['yolo'],
    }

    const wrapper = ({ children }) => (
      <FormContextWrapper
        initialFormValues={mockFormValues}
        initialFormNameValues={{ customFormName: mockFormValues }}
        initialSubmitHandlers={{ myForm: mockSubmitHandler }}
        initialValidationHandlers={{ myForm: mockValidationHandler }}
      >
        {children}
      </FormContextWrapper>
    )

    const { result, rerender } = renderHook(() => useFormikSubmit({
      onSubmit: mockOnSubmit,
      onError: mockOnError,
    }), { wrapper })

    addCustomSubmitHandlerResult('customFormName', new Promise(resolve =>
      setTimeout(() => {
        mockCustomSubmitHandler()
        resolve({ customKey: 'Frosted-Flakes!' })
      }, 1000)),
    )

    act(async () => {
      expect(mockCustomSubmitHandler).not.toHaveBeenCalled()
      expect(mockOnSubmit).not.toHaveBeenCalled()
      await result.current()
      rerender()
      // resolved value is added to formValues
      expect(mockOnSubmit).toHaveBeenCalledWith({
        ...mockFormValues,
        customKey: 'Frosted-Flakes!',
      }, {
        customFormName: {
          ...mockFormValues,
          customKey: 'Frosted-Flakes!',
        }
      })
      expect(mockCustomSubmitHandler).toHaveBeenCalledTimes(1)
      expect(mockOnError).not.toHaveBeenCalled()
      done()
    })
  })
})
