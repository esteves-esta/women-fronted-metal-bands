import * as React from 'react';
import { Github } from "lucide-react";
import { styled } from "styled-components";
import { MEDIA_QUERIES } from '../../constants';

function Footer() {
  const year = new Date().getFullYear();

  return (
    <Wrapper>

      <a
        href="https://github.com/esteves-esta/women-fronted-metal-bands"
        target="_blank"
      >
        <Github size={15} />
        <small>designed & developed by esteves-esta © {year}</small>
      </a>

      <small>built with: React / RadixUI / Vite / LucideIcons</small>
    </Wrapper>
  );
}

const Wrapper = styled.footer`
margin: 20px auto;
padding: 0px 15px;
max-width: 1500px;
display: flex;
flex-direction: column;
align-items: center;
gap: 10px;
a {
  color: white;
  text-decoration: none;
  gap: 10px;
  display: flex;
 
  align-items: center;
}

 @media (hover: hover) and (pointer: fine) {
    &:hover {
      color:  var(--color-primary);
    }
  }
  
@media (${MEDIA_QUERIES.tabletAndUp}) {
  padding: 0px 10%;
  gap: 40px;
  margin: 30px auto;

  a{
     margin-right: auto;
  }
}
` ;


export default Footer;
