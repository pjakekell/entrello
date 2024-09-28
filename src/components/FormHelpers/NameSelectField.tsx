import React, { useRef } from "react";
import Select, { MenuPlacement } from "react-select";
import classNames from "classnames";

import { useMenuPlacement } from "../../hooks/useMenuPlacement";

interface INameSelectInputField {
  className?: string;
  options: Array<any>;
  value: any;
  onChange: any;
  isDisabled: boolean;
  menuPlacement?: MenuPlacement;
}

const styles = {
  control: (styles: any) => ({
    ...styles,
    backgroundColor: 'transparent',
    minHeight: '1rem',
    height: '1rem',
    border: 'none',
    boxShadow: 'none'
  }),
  valueContainer: (styles: any) => ({
    ...styles,
    padding: '0px'
  }),
  singleValue: (styles: any) => {
    return {
      ...styles,
      ...{
        color: '#6b0acb',
        cursor: 'pointer'
      },
    };
  },
  option: (styles: any) => {
    return {
      ...styles,
      ...{
        fontSize: '0.6rem',
        padding: '3px 12px',
        color: 'black'
      },
    };
  },
  noOptionsMessage: (styles: any) => {
    return {
      ...styles,
      ...{
        display: 'none'
      }
    }
  }
};

export function NameSelectInputField(props: INameSelectInputField) {
  const { className, onChange, menuPlacement = "auto", ...rest} = props;
  const selectRef: any = useRef();
  const containerRef: any = useRef();
  const { onMenuOpen, onMenuClose, placement } = useMenuPlacement({
    selectRef,
    menuPlacement,
  });

  return (
    <div
      ref={containerRef}
    >
      <Select
        ref={selectRef}
        className={classNames(
          "select__menu",
          className
        )}
        styles={styles}
        components={{
          DropdownIndicator: () => null, IndicatorSeparator: () => null
        }}
        isSearchable={false}
        hideSelectedOptions={true}
        isClearable={false}
        onMenuOpen={onMenuOpen}
        onMenuClose={onMenuClose}
        menuPlacement={placement}
        onChange={onChange}
        {...rest}
      />
    </div>
  );
}