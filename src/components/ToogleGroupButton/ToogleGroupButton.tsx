import * as React from 'react';
import * as classes from './ToogleGroupButton.module.css';
import * as ToggleGroup from '@radix-ui/react-toggle-group';

function ToogleGroupButton({ list, currentValue, onChange }: {
  list: { value: any, text: string }[],
  currentValue: any,
  onChange: (val) => void
}) {
  return <ToggleGroup.Root className={classes.group} type="single" defaultValue={currentValue} onValueChange={onChange}>
    {list.map(({ text, value }) => (
      <ToggleGroup.Item
        key={value}
        className={currentValue === value.toString() ? `${classes.groupItemActive } ${classes.groupItem}`: classes.groupItem}
        value={value.toString()}
        aria-label={text}
      >
        {text}
      </ToggleGroup.Item>
    ))}
  </ToggleGroup.Root>;
}

export default ToogleGroupButton;
