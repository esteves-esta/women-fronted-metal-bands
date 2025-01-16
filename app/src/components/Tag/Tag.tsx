// @ts-nocheck 
import * as React from 'react';
import { Tntensity } from "../../models/Band";
import { styled } from "styled-components";
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
// -------------------
type TagHues = "purple" | "green" | "blue" | "yellow" | "red" | "cyan" | "black";

type Props = React.ComponentProps<"div"> & {
  $hue: TagHues;
  $intensity: Tntensity;
  children?: any;
  $circle?: boolean;
};

function Tag({ children, ...props }: Props) {
  return <TagWrapper {...props}>

    <VisuallyHidden>{children}</VisuallyHidden>
    <Content  {...props}>{children}</Content>

  </TagWrapper>;
}

const Content = styled.span`
@media (hover: hover) and (pointer: fine) { 
  opacity: ${(p) => p.$circle ? 0 : 1};
  user-select: none;
  transition: opacity 450ms ease-in 0s;
  }
`;

const TagWrapper = styled.div.attrs<Props>((p) => ({
  $hue: p.$hue,
  $intensity: p.$intensity,
  $circle: p.$circle
}))`
  background: ${(p) => {
    if (p.$hue === 'black') return `var(--color-grey-500)`;

    return `hsl(var(--${p.$hue}) var(--intensity-${p.$intensity}))`
  }};
  text-align: center;
  border-radius: 1rem;
  font-size: calc(11rem / 16);
  letter-spacing: 0.05rem;
  text-transform: uppercase;
  font-weight: bold;
  
  overflow: hidden;
  padding: 2px 12px;
  
  min-height: 20px;
  height: fit-content;
  transition: width 350ms ease-in 0s;
  box-shadow: inset 0px 0px 8px -4px #06052768;
  /* border: .05rem solid var(--color-secondary-dark); */
@media (hover: hover) and (pointer: fine) { 
  & {
    width: ${(p) => p.$circle ? '28px' : 'fit-content'};
  }
  tr:hover & {
    transition: width 400ms ease-in .6s;
    width: 100%;
    max-width: 100px;
    ${Content} {
      opacity: 1;
      transition: opacity 450ms ease-in 1s;
    }
  }
} 


`;

export default Tag;
