import { Github } from "lucide-react";
import { styled } from "styled-components";

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

      <small>
        built with: react / radixui / vite / lucideicons / styled-components
      </small>
    </Wrapper>
  );
}

const Wrapper = styled.footer`
  margin: 0px auto;
  margin-top: 20px;
  padding: 0px 15px;
  max-width: 1500px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  font-style: italic;

  a {
    color: white;
    text-decoration: none;
    gap: 10px;
    display: flex;
    align-items: center;
    cursor: pointer;
  }

  @media (hover: hover) and (pointer: fine) {
    a:hover {
      color: var(--color-primary);
    }
  }

  @media ${(p) => p.theme.queries.tabletAndUp} {
    padding: 0px 10%;
    gap: 40px;
    margin: 0px auto;
    margin-top: 30px;
    flex-direction: row;
    a {
      margin-right: auto;
    }
  }
`;

export default Footer;
