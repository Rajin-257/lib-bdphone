"use strict";

const React = require("react");
const core = require("../index.js");

function readInputValue(eventOrValue) {
  if (
    eventOrValue &&
    typeof eventOrValue === "object" &&
    eventOrValue.target &&
    Object.prototype.hasOwnProperty.call(eventOrValue.target, "value")
  ) {
    return eventOrValue.target.value == null ? "" : String(eventOrValue.target.value);
  }

  if (eventOrValue == null) {
    return "";
  }

  return String(eventOrValue);
}

function useBdPhone(config = {}) {
  const validationOptions = config.validationOptions || {};
  const normalizeOnBlur = config.normalizeOnBlur === true;
  const normalizeFormat = config.normalizeFormat || "e164";
  const initialValue = config.initialValue == null ? "" : String(config.initialValue);

  const [value, setValue] = React.useState(initialValue);

  const parsed = React.useMemo(
    () => core.parseBdPhoneNumber(value, validationOptions),
    [value, validationOptions]
  );

  const validation = React.useMemo(
    () => core.validateBdPhoneNumber(value, validationOptions),
    [value, validationOptions]
  );

  const onChange = React.useCallback((eventOrValue) => {
    setValue(readInputValue(eventOrValue));
  }, []);

  const onBlur = React.useCallback(() => {
    if (!normalizeOnBlur) {
      return;
    }

    const normalized = core.normalizeBdPhoneNumber(value, {
      ...validationOptions,
      format: normalizeFormat
    });

    if (normalized) {
      setValue(normalized);
    }
  }, [normalizeOnBlur, normalizeFormat, validationOptions, value]);

  const reset = React.useCallback((nextValue = "") => {
    setValue(nextValue == null ? "" : String(nextValue));
  }, []);

  const normalize = React.useCallback(
    (format = normalizeFormat) =>
      core.normalizeBdPhoneNumber(value, {
        ...validationOptions,
        format
      }),
    [normalizeFormat, validationOptions, value]
  );

  const format = React.useCallback(
    (targetFormat) => core.formatBdPhoneNumber(value, targetFormat, validationOptions),
    [validationOptions, value]
  );

  return {
    value,
    setValue: onChange,
    onChange,
    onBlur,
    reset,
    parsed,
    validation,
    isValid: parsed.isValid,
    error: parsed.reason,
    reasonCode: parsed.reasonCode,
    e164: parsed.e164,
    national: parsed.national,
    carrierGuess: parsed.carrierGuess,
    normalize,
    format
  };
}

const BdPhoneInput = React.forwardRef(function BdPhoneInput(props, ref) {
  const {
    value,
    defaultValue = "",
    onChange,
    onBlur,
    onValueChange,
    onValidationChange,
    validationOptions,
    normalizeOnBlur = false,
    normalizeFormat = "e164",
    type = "tel",
    inputMode = "tel",
    ...restProps
  } = props || {};

  const isControlled = value != null;
  const [internalValue, setInternalValue] = React.useState(
    defaultValue == null ? "" : String(defaultValue)
  );

  const currentValue = isControlled ? String(value) : internalValue;

  const parsed = React.useMemo(
    () => core.parseBdPhoneNumber(currentValue, validationOptions || {}),
    [currentValue, validationOptions]
  );

  React.useEffect(() => {
    if (typeof onValidationChange === "function") {
      onValidationChange(parsed);
    }
  }, [onValidationChange, parsed]);

  const commitValue = React.useCallback(
    (nextValue) => {
      if (!isControlled) {
        setInternalValue(nextValue);
      }

      if (typeof onValueChange === "function") {
        onValueChange(nextValue, core.parseBdPhoneNumber(nextValue, validationOptions || {}));
      }
    },
    [isControlled, onValueChange, validationOptions]
  );

  const handleChange = React.useCallback(
    (event) => {
      const nextValue = readInputValue(event);
      commitValue(nextValue);

      if (typeof onChange === "function") {
        onChange(event);
      }
    },
    [commitValue, onChange]
  );

  const handleBlur = React.useCallback(
    (event) => {
      if (normalizeOnBlur) {
        const normalized = core.normalizeBdPhoneNumber(currentValue, {
          ...(validationOptions || {}),
          format: normalizeFormat
        });

        if (normalized) {
          commitValue(normalized);
        }
      }

      if (typeof onBlur === "function") {
        onBlur(event);
      }
    },
    [commitValue, currentValue, normalizeFormat, normalizeOnBlur, onBlur, validationOptions]
  );

  return React.createElement("input", {
    ...restProps,
    ref,
    type,
    inputMode,
    value: currentValue,
    onChange: handleChange,
    onBlur: handleBlur,
    "aria-invalid": !parsed.isValid
  });
});

BdPhoneInput.displayName = "BdPhoneInput";

module.exports = {
  useBdPhone,
  BdPhoneInput
};
