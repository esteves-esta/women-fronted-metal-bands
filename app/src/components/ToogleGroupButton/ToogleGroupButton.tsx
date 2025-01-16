import * as ToggleGroup from '@radix-ui/react-toggle-group';
import { LucideIcon, X } from 'lucide-react';
import { styled } from "styled-components";

function ToogleGroupButton({ list, currentValue, onChange, wrap }: {
  list: { value: any, text: string, icon?: LucideIcon, iconOnly?: boolean }[],
  currentValue: any,
  onChange: (val) => void,
  wrap?: boolean
}) {
  return <Group type="single" defaultValue={currentValue} onValueChange={onChange} className={wrap ? 'wrap' : ''}>
    {list.map(({ text, value, icon, iconOnly }) => {
      const Icon = icon
      return (
        <Span key={value} >
          <GroupItem
            className={currentValue === value.toString() ? 'active' : ''}
            value={value.toString()}
            aria-label={text}
          >
            {!iconOnly && text}
            {!!icon && <Icon size={18} />}
            {currentValue === value.toString() && <X size={14}/>}
          </GroupItem>
        </Span>
      )
    })}
  </Group>;
}

const Span = styled.div`
display: flex;
align-items: center;
&:not(:last-of-type):after {
  content: '';
  display: inline-block;
  vertical-align: baseline;
  border-right: 2px solid  var(--color-grey-300);
  margin: 0 -2px;
  height: 1em;
}

`;

const GroupItem = styled(ToggleGroup.Item)`
display: flex;
align-items: center;
gap: 5px;
white-space: nowrap;
border: none;
border-radius: 5px;
background: transparent;
color: var(--text-color);
padding: 4px 10px;
font-size: calc(12rem /16);
letter-spacing: .05rem;
transition: background 150ms ease-in;
cursor: pointer;
svg {
  flex: 1 0 fit-content;
}
&:focus {
  box-shadow: var(--box-shadow-focus);
}

&.active {
  color: var(--color-secondary-dark);
  background: var(--color-grey-300);
}
`;

const Group = styled(ToggleGroup.Root)`
display: flex;
background: var(--color-secondary-dark);
border-radius: 9px;
border: 1px solid var(--color-grey-500);
@media ${(p) => p.theme.queries.tabletAndUp} {
}
&.wrap {
  flex-wrap: wrap;
  justify-content: center;
}
`;



export default ToogleGroupButton;
