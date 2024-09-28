import React, { useState, useCallback, useEffect, useRef } from "react";
import Select, { components, GroupBase, InputActionMeta, MenuListProps, MenuPlacement } from "react-select";
import classNames from "classnames";

import { useMenuPlacement } from "../../hooks/useMenuPlacement";

interface INumberSelectInputField {
  className?: string;
  options: Array<any>;
  value: any;
  onChange: any;
  menuPlacement?: MenuPlacement;
  setLabel: any;
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
  singleValue: (styles: any) => {
    return {
      ...styles,
      ...{
        color: 'transparent',
        cursor: 'pointer'
      },
    };
  },
  option: (styles: any) => {
    return {
      ...styles,
      ...{
        fontSize: '0.6rem',
        padding: '3px 12px'
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

interface CustomMenuListProps<G extends GroupBase<unknown>> extends MenuListProps<unknown, boolean, G> {
  onMenuInputFocus: () => void;
}

const { MenuList } = components;
const CustomMenuList = (props: CustomMenuListProps<GroupBase<unknown>>) => {
  const { selectProps, onMenuInputFocus, ...rest } = props;
  const inputRef = useRef<any>();
  const {
    onInputChange,
    inputValue,
  } = selectProps;
  const actionMeta: InputActionMeta = { action: "input-change", prevInputValue: '' };

  return (
    <div className="">
      <MenuList {...rest} selectProps={selectProps} />
      <input
        autoFocus
        ref={inputRef}
        type="number"
        className="m-1 text-2xs border border-solid border-gray-400 w-9/12 h-4 text-center p-0.5 focus:border focus:border-solid focus:border-brand-500" style={{boxShadow: 'none'}}
        value={inputValue}
        onChange={(e) => {
          onInputChange(e.currentTarget.value, actionMeta);
          inputRef.current.focus();
        }}
        onMouseDown={(e) => {
          e.stopPropagation();
          e.currentTarget.focus();
        }}
        onTouchEnd={(e) => {
          e.stopPropagation();
          e.currentTarget.focus();
        }}
        onFocus={onMenuInputFocus}  
      />
    </div>
  )
}

export function NumberSelectInputField(props: INumberSelectInputField) {
  const { className, onChange, setLabel, menuPlacement = "auto", ...rest} = props;
  const selectRef: any = useRef();
  const containerRef: any = useRef();
  const [inputValue, setInputValue] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const { onMenuOpen, onMenuClose, placement } = useMenuPlacement({
    selectRef,
    menuPlacement,
  });

  const onDomClick = (e: any) => {
    let menu = containerRef.current.querySelector(".select__menu");
    if (
      !containerRef.current.contains(e.target) ||
      !menu ||
      !menu.contains(e.target)
    ) {
      setIsFocused(false);
      setInputValue("");
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", onDomClick);

    return () => {
      document.removeEventListener("mousedown", onDomClick);
    };
  }, []);

  const handleDropdownSelect = useCallback(
    (item) => {
      onChange(item);
      setLabel(item?.value || "");
      setIsFocused(false);
    },
    [onChange, setLabel]
  );

  const handleInputChange = useCallback(
    (value) => {
      setInputValue(value);
      setIsFocused(true);
      if(value)
        setLabel(value.toString());
    },
    [setLabel]
  );
  
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
          DropdownIndicator: () => null, IndicatorSeparator: () => null,
          MenuList: (props: MenuListProps) => <CustomMenuList onMenuInputFocus={() => setIsFocused(true)} {...props} /> }}
        isSearchable={false}
        hideSelectedOptions={true}
        isClearable={false}
        onMenuOpen={onMenuOpen}
        onMenuClose={onMenuClose}
        onInputChange={handleInputChange}
        inputValue={inputValue}
        menuPlacement={placement}
        {...{
          menuIsOpen: isFocused || undefined,
          isFocused: isFocused || undefined,
        }}
        onChange={handleDropdownSelect}
        {...rest}
      />
    </div>
  );
}