import * as React from 'react';
import * as classes from './ToogleGroupButton.module.css';
import * as ToggleGroup from '@radix-ui/react-toggle-group';
import { LucideIcon } from 'lucide-react';

function ToogleGroupButton({ list, currentValue, onChange }: {
  list: { value: any, text: string, icon?: LucideIcon, iconOnly?: boolean }[],
  currentValue: any,
  onChange: (val) => void
}) {
  return <ToggleGroup.Root className={classes.group} type="single" defaultValue={currentValue} onValueChange={onChange}>
    {list.map(({ text, value, icon, iconOnly }) => {
      const Icon = icon
      return (
        <ToggleGroup.Item
          key={value}
          className={currentValue === value.toString() ? `${classes.groupItemActive} ${classes.groupItem}` : classes.groupItem}
          value={value.toString()}
          aria-label={text}
        >
          {!iconOnly && text}
          {!!icon && <Icon size={20} />}
        </ToggleGroup.Item>
      )
    })}
  </ToggleGroup.Root>;
}

export default ToogleGroupButton;
