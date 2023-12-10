import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { ChevronDown, Check, Dot } from 'lucide-react';
import classes from './Dropdown.module.css';

interface Props {
  children: any,
  checkOptions?: any[]
  radioOptions?: any[]
  radioValue?: any
  handleChange: any;
  checkName?: string,
  labelName: string,
  keyName: string,
}

function Drowdown({
  children,
  checkOptions,
  radioOptions,
  radioValue,
  handleChange,
  checkName,
  labelName,
  keyName,
}: Props) {

  return (<DropdownMenu.Root>
    <DropdownMenu.Trigger asChild>
      <button className={classes.dropdownBtn} aria-label="Customise options">
        {children}
        <ChevronDown size={15} />
      </button>
    </DropdownMenu.Trigger>

    <DropdownMenu.Portal>
      <DropdownMenu.Content className={classes.dropdownMenuContent} sideOffset={5}>
        {checkOptions && <CheckBoxItens
          options={checkOptions}
          handleChange={handleChange}
          checkName={checkName}
          labelName={labelName}
          keyName={keyName} />}

        {radioOptions && <RadioItens
          options={radioOptions}
          handleChange={handleChange}
          radioValue={radioValue}
          labelName={labelName}
          keyName={keyName} />}
      </DropdownMenu.Content>
    </DropdownMenu.Portal>
  </DropdownMenu.Root >)
}


function RadioItens({
  options,
  handleChange,
  labelName,
  radioValue,
  keyName,
}) {

  return options.map((item) => item[keyName] && (
    <DropdownMenu.RadioGroup key={item[keyName]} value={radioValue} onValueChange={handleChange}>
      <DropdownMenu.RadioItem
        className={classes.dropdownCheckItem}
        value={item[keyName]}>
        <DropdownMenu.ItemIndicator >
          <Dot size={15} />
        </DropdownMenu.ItemIndicator>
        {item[labelName]}
      </DropdownMenu.RadioItem>
    </DropdownMenu.RadioGroup>
  ))
}

function CheckBoxItens({
  options,
  handleChange,
  checkName,
  labelName,
  keyName,
}) {

  return options.map((item) => item[keyName] && (
    <DropdownMenu.CheckboxItem
      key={item[keyName]}
      className={`${classes.dropdownCheckItem} ${item[checkName] ? classes.dropdownCheckItemActive : ''}`}
      checked={item[checkName]}
      onCheckedChange={(checked) => {

        handleChange(checked, item[keyName])
      }}>
      <DropdownMenu.ItemIndicator>
        <Check size={15} />
      </DropdownMenu.ItemIndicator>
      {item[labelName]}
    </DropdownMenu.CheckboxItem>
  ))
}


export default Drowdown;
