// @ts-nocheck
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { styled, css } from "styled-components";

interface Props {
  children: any,
  radioOptions?: any[]
  radioValue?: any
  handleChange: any;
  labelName: string,
  keyName: string,
  background?: boolean
}

function Drowdown({
  children,
  radioOptions,
  radioValue,
  handleChange,
  labelName,
  keyName,
  background = false
}: Props) {

  if (radioOptions && !radioValue) {
    throw new Error(
      'Radio dropdown must have prop: "radioValue"',
    );
  }

  return (<DropdownMenu.Root>
    <DropdownMenu.Trigger asChild>
      <DropdownBtn
        background={background}
        aria-label="Choose type of search">
        {children}

      </DropdownBtn>
    </DropdownMenu.Trigger>

    <DropdownMenu.Portal>
      <DropdownMenuContent sideOffset={1}>
        {radioOptions && <RadioItens
          options={radioOptions}
          handleChange={handleChange}
          radioValue={radioValue}
          labelName={labelName}
          keyName={keyName} />}
      </DropdownMenuContent>
    </DropdownMenu.Portal>
  </DropdownMenu.Root >)
}

const DropdownMenuContent = styled(DropdownMenu.Content)`
  min-width: 180px;
  max-width: fit-content;
  background-color: var(--color-secondary-dark);
  border-radius: 6px;
  min-height: fit-content;
  max-height: 50vh;
  isolation: isolate;
  z-index: 2;

  overflow-y: scroll;
  overflow-x: hidden;
  scrollbar-color: var(--color-primary-lighten1) var(--bg-primary-opaque);
  scrollbar-width: thin;

&::-webkit-scrollbar {
  background-color: var(--bg-primary-opaque);
  width: 10px;
}

&::-webkit-scrollbar-thumb {
  background-color: var(--color-primary-lighten1);
}
`;

const DropdownBtn = styled.button`
  border: none;
  /* height: 48px; */
  padding: 5px 10px;

  color: var(--text-color);
  /* min-width: 180px; */
  display: flex;
  flex-direction: row;
  gap: 10px;
  align-items: center;
  width: 100%;
  justify-content: space-between;
  color: var(--text-color);
  background-color: transparent;
  &:focus {
    outline: none;
  }
   ${(p) => !p.background && css`
    border-bottom: 1px solid transparent;
    &:focus {
      border-color: var(--color-grey-300);
    }
  `};

  ${(p) => p.background && css`
    border-radius: 10px;
    flex: 0 1 fit-content;
    font-size: calc(12rem /16);
    background-color: var(--color-secondary-dark);
    border: 1px solid var(--color-grey-500);
    &:focus {
      border-color: var(--color-grey-300);
    }
  `}


`;


function RadioItens({
  options,
  handleChange,
  labelName,
  radioValue,
  keyName,
}) {

  return options.map((item) => item[keyName] && (
    <DropdownMenu.RadioGroup key={item[keyName]} value={radioValue} onValueChange={handleChange}>
      <DropdownCheckItem
        value={item[keyName]}>
        {item[labelName]}
      </DropdownCheckItem>
    </DropdownMenu.RadioGroup>
  ))
}

const DropdownCheckItem = styled(DropdownMenu.RadioItem)`
padding: 8px 14px;
letter - spacing: .8px;
font - size: calc(15rem / 16);
display: flex;
flex - direction: row;
gap: 10px;
align - items: center;
& [aria - checked="true"] {
  background - color: var(--color - primary - dark);
}

&:focus {
  outline: none;
  background - color: var(--color - secondary);
}
`;
export default Drowdown;
