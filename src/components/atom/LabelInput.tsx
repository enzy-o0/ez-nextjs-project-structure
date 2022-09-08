import React from 'react';
import styled from 'styled-components';

interface IProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  labelFor: string;
  isReadOnly: boolean;
  isValid?: boolean;
  isRequired?: boolean;
  errorMessage?: string;
  unit?: string;
}

const LabelInput: React.FC<IProps> = ({
  labelFor,
  label,
  isRequired,
  errorMessage,
  unit,
  isReadOnly = true,
  isValid = false,
  ...props
}) => {
  return (
    <ModiInfoWrapper>
      <label htmlFor={labelFor}>
        {label}
        {isRequired && <RequiredStar>*</RequiredStar>}
      </label>
      <div>
        <ModiInput id={labelFor} {...props} readOnly={isReadOnly} readOnlyBg={isReadOnly} autoComplete="off" />
        <span>{unit}</span>
      </div>
      {!isReadOnly && !isValid && errorMessage && <p className="input-error-message">{errorMessage}</p>}
    </ModiInfoWrapper>
  );
};

export default React.memo(LabelInput);

export const ModiInfoWrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin-right: 16px;

  label {
    font-size: 13px;
    margin-bottom: 8px;
    color: gray;
    margin-top: 15px;
  }

  .input-error-message {
    padding-left: 1rem;
    margin-top: 8px;
    font-weight: 600;
    font-size: 12px;
    color: red;
  }
`;

const ModiInput = styled.input<{ readOnlyBg: boolean }>`
  padding: 0.5rem;
  font-size: 16px;
  outline: none;
  background: ${(props) => (props.readOnlyBg ? '#ffffff' : 'aliceblue')};
  border: none;
  border-bottom: 1px solid #cccccc;
`;

export const RequiredStar = styled.span`
  color: red;
`;
