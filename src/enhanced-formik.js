import React, { useContext, useEffect, useLayoutEffect, useState } from "react";
import PropTypes from "prop-types";
import { withFormik } from "formik";

import { FormSubmitContext, FormValidationContext } from "./form-contexts";
import { addCustomSubmitHandlerResult } from "./use-formik-submit";
import formValues from "./state/form-values";

function FormWrapper({ values, name, submitForm, validateForm, children }) {
  const submitHandlers = useContext(FormSubmitContext);
  const validationHandlers = useContext(FormValidationContext);

  useEffect(() => {
    // todo: cf - capture these mutations in actions
    formValues[name] = values;
    return () => {
      delete formValues[name];
    };
  }, [name, values]);

  useEffect(() => {
    submitHandlers[name] = submitForm;
    validationHandlers[name] = validateForm;
    return () => {
      delete submitHandlers[name];
      delete validationHandlers[name];
    };
  }, [name, submitForm, submitHandlers, validateForm, validationHandlers]);

  return children;
}

function FormikWrapper({ children, name, render, ...props }) {
  return (
    <FormWrapper
      values={props.values}
      name={name}
      submitForm={props.submitForm}
      validateForm={props.validateForm}
    >
      {
        // honor render first, then fallback to children
        typeof render === "function"
          ? render(props)
          : typeof children === "function"
          ? children(props)
          : children
      }
    </FormWrapper>
  );
}

FormikWrapper.propTypes = {
  children: PropTypes.oneOfType([PropTypes.node, PropTypes.func]),
  render: PropTypes.func,
  name: PropTypes.string.isRequired,
  submitForm: PropTypes.func.isRequired,
  validateForm: PropTypes.func.isRequired,
  values: PropTypes.object,
};

/**
 * EnhancedFormik - Component
 * @param name - String name/identifier for the form. Required for multi-form management.
 * @param initialValues - Formik equivalent
 * @param isInitialValid - Formik equivalent
 * @param validationSchema - Formik equivalent
 * @param validateOnBlur - Formik equivalent
 * @param validateOnChange - Formik equivalent
 * @param handleSubmit - Custom handleSubmit function. If provided, the return/resolve value should be an object that
 * will be added to the `formValues` on submit. These Values will _not_ currently be validated - take care when using
 * this that the return values are valid.
 * @param rest - withFormik HOC props
 * @returns {null || EnhancedFormik}
 * @constructor
 */
function EnhancedFormik({
  name,
  initialValues,
  isInitialValid,
  validationSchema,
  validateOnBlur,
  validateOnChange,
  handleSubmit,
  ...rest
}) {
  const [isReady, setIsReady] = useState(false);
  const [EnhancedComponent, setEnhancedComponent] = useState(null);

  useLayoutEffect(() => {
    const EnhancedFormikComponent = withFormik({
      mapPropsToValues: () => initialValues,
      isInitialValid,
      validationSchema,
      validateOnBlur,
      validateOnChange,
      handleSubmit: (values, formikBag) => {
        if (typeof handleSubmit === "function") {
          addCustomSubmitHandlerResult(handleSubmit(values, formikBag), name);
        }
      },
    })(FormikWrapper);
    setIsReady(true);
    setEnhancedComponent(() => EnhancedFormikComponent);
    // we only ever want this to be created once per mount of a 'formik' form
    // todo: This disables usage of `enableReinitialize` - may want to examine this in the future.
    // eslint-disable-next-line
  }, []);

  return isReady ? <EnhancedComponent name={name} {...rest} /> : null;
}

EnhancedFormik.propTypes = {
  initialValues: PropTypes.object.isRequired,
  isInitialValid: PropTypes.bool,
  name: PropTypes.string.isRequired,
  validationSchema: PropTypes.object,
  validateOnBlur: PropTypes.bool,
  validateOnChange: PropTypes.bool,
  handleSubmit: PropTypes.func,
};

export default EnhancedFormik;
