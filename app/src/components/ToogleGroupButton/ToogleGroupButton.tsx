import * as ToggleGroup from '@radix-ui/react-toggle-group';
import { LucideIcon } from 'lucide-react';
import { styled } from "styled-components";

function ToogleGroupButton({ list, currentValue, onChange }: {
  list: { value: any, text: string, icon?: LucideIcon, iconOnly?: boolean }[],
  currentValue: any,
  onChange: (val) => void
}) {
  return <Group type="single" defaultValue={currentValue} onValueChange={onChange}>
    {list.map(({ text, value, icon, iconOnly }) => {
      const Icon = icon
      return (
        <GroupItem
          key={value}
          className={currentValue === value.toString() ? 'active' : ''}
          value={value.toString()}
          aria-label={text}
        >
          {!iconOnly && text}
          {!!icon && <Icon size={18} />}
        </GroupItem>
      )
    })}
  </Group>;
}

const GroupItem = styled(ToggleGroup.Item)`
border: none;
border-radius: 4rem;
background-color: var(--color-secondary);
color: var(--text-color);
padding: 4px 16px;
font-weight: bold;
letter-spacing: .05rem;
cursor: pointer;
display: flex;
gap: 10px;
&:focus {
  box-shadow: var(--box-shadow-focus);
}

&.active {
  background: var(--color-primary-dark);
}
`;

const Group = styled(ToggleGroup.Root)`
gap: 1em;
display: flex;
flex-wrap: wrap;

@media ${(p) => p.theme.queries.tabletAndUp} {
}
`;



export default ToogleGroupButton;
