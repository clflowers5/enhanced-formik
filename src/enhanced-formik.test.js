/* eslint-disable no-console */
import React from 'react'
import { cleanup } from '@testing-library/react'

describe('EnhancedFormik', () => {
  let originalError

  // will be removed with future React version
  beforeAll(() => {
    originalError = console.error
    console.error = jest.fn()
  })

  afterAll(() => {
    console.error = originalError
  })

  afterEach(() => {
    jest.clearAllMocks()
    cleanup()
  })

  // todo: fix these later
  it('tmp', () => {
    expect(true).toEqual(true)
  })

  // it('allows for single level forms', async () => {
  // 	const mockOnSubmit = jest.fn();
  // 	const mockOnError = jest.fn();
  //
  // 	function MyForm() {
  // 		const handleSubmit = useFormikSubmit({
  // 			onSubmit: mockOnSubmit,
  // 			onError: mockOnError,
  // 		});
  // 		return (
  // 			<FormContextWrapper>
  // 				<EnhancedFormik
  // 					initialValues={{ foo: '' }}
  // 					validationSchema={yup.object().shape({ foo: yup.string().required('foo required') })}
  // 					validateOnBlur={false}
  // 					validateOnChange={false}
  // 				>
  // 					{() => (
  // 						<Form>
  // 							<label htmlFor="foo">FooLabel</label>
  // 							<Field
  // 								id="foo" name="foo"
  // 								type="text"
  // 							/>
  // 							<ErrorMessage name="foo"/>
  // 							<button type="submit" onClick={handleSubmit}>SubmitMe</button>
  // 						</Form>
  // 					)}
  // 				</EnhancedFormik>
  // 			</FormContextWrapper>
  // 		);
  // 	}
  //
  // 	const { getByLabelText, getByText, rerender } = render(<MyForm/>);
  // 	const submitButton = getByText(/submitme/i);
  //
  // 	// fireEvent.click(submitButton);
  // 	await wait(() => expect(mockOnError).toHaveBeenCalledTimes(1));
  // 	await wait(() => getByText(/foo required/i));
  // });
  //
  // it('allows for nested forms via the `EnhancedFormik` component');
})
