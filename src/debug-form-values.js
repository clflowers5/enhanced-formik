/* istanbul ignore file */
import React from "react";
import PropTypes from "prop-types";
import { useFormValues } from "./state/form-values";

/**
 * Simple output of formatted form values. Useful for dev-time testing and debugging.
 */
const DebugFormValues = ({ title, values }) => {
  const { snapshot: formValuesSnapshot } = useFormValues();
  return (
    <div style={{ marginTop: "2rem" }}>
      <p>
        <b>{title}</b>
      </p>
      <pre data-testid="rtl-debug-form-values">
        {JSON.stringify(values || formValuesSnapshot, null, 2)}
      </pre>
    </div>
  );
};

DebugFormValues.propTypes = {
  title: PropTypes.string,
  values: PropTypes.object,
};

DebugFormValues.defaultProps = {
  title: "Debug Form Values",
};

export default DebugFormValues;
