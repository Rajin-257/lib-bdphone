import * as React from "react";
import type {
  BdPhoneFormat,
  BdPhoneOptions,
  BdPhoneParseResult,
  BdPhoneReasonCode,
  BdPhoneValidationResult
} from "../index";

export type BdPhoneChangeValue =
  | string
  | number
  | null
  | undefined
  | React.ChangeEvent<HTMLInputElement>;

export interface UseBdPhoneConfig {
  initialValue?: string | number | null;
  validationOptions?: BdPhoneOptions;
  normalizeOnBlur?: boolean;
  normalizeFormat?: BdPhoneFormat;
}

export interface UseBdPhoneResult {
  value: string;
  setValue: (eventOrValue: BdPhoneChangeValue) => void;
  onChange: (eventOrValue: BdPhoneChangeValue) => void;
  onBlur: () => void;
  reset: (nextValue?: string | number | null) => void;
  parsed: BdPhoneParseResult;
  validation: BdPhoneValidationResult;
  isValid: boolean;
  error: string | null;
  reasonCode: BdPhoneReasonCode | null;
  e164: string | null;
  national: string | null;
  carrierGuess: BdPhoneParseResult["carrierGuess"];
  normalize: (format?: BdPhoneFormat) => string | null;
  format: (format: BdPhoneFormat) => string | null;
}

export function useBdPhone(config?: UseBdPhoneConfig): UseBdPhoneResult;

export interface BdPhoneInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "value" | "defaultValue" | "onChange"> {
  value?: string | number;
  defaultValue?: string | number;
  validationOptions?: BdPhoneOptions;
  normalizeOnBlur?: boolean;
  normalizeFormat?: BdPhoneFormat;
  onValueChange?: (value: string, parsed: BdPhoneParseResult) => void;
  onValidationChange?: (parsed: BdPhoneParseResult) => void;
}

export const BdPhoneInput: React.ForwardRefExoticComponent<
  BdPhoneInputProps & React.RefAttributes<HTMLInputElement>
>;
