import * as React from 'react';
import { styled } from "styled-components";
import { BandContext } from "../BandsProvider";
import MediaPlayer from "../MediaPlayer";
import { NavLink } from "react-router-dom";

function Header() {
  const { total, databaseChecked } = React.useContext(BandContext);


  return <>
    {databaseChecked && <MediaPlayer />}
    <Head>

      <Nav>
        <ul>
          <li>
            <HeaderLink to="/">Bands</HeaderLink>
          </li>
          <li>
            <HeaderLink to="/table">table view</HeaderLink>
          </li>
          <li>
            <HeaderLink to="/graphs">graphs</HeaderLink>
          </li>
          <li>
            <HeaderLink to="/about">About</HeaderLink>
          </li>
        </ul>

        <TotalSpan>
          {total} band{total > 1 && 's'}
        </TotalSpan>
      </Nav>

      <TitleContainer>
        <h1>
          Women Fronted <span>metal bands</span>
        </h1>
        <p>
          This is a project to compile a list of metal bands that have
          women as lead vocalists.
        </p>
      </TitleContainer>
    </Head>
  </>
    ;
}


function HeaderLink({ children, to }) {
  return (
    <Link
      className={({ isActive, isPending }) =>
        isActive
          ? "active"
          : isPending
            ? "pending"
            : ""
      }
      to={to}
    >{children}</Link>
  )
}

const TotalSpan = styled.span`
text-transform: uppercase;
font-family: var(--secondary-font-family);
 @media ${p => p.theme.queries.tabletAndUp} {
  margin-left: auto
 }
`;

const Link = styled(NavLink)`
  display: block;
  text-decoration: none;
  color: grey;
  transition: color 500ms ease-in-out;

  @media (hover: hover) and (pointer: fine) {
    &:hover {
      color:  var(--color-primary);
    }
  }

  &.active {
    color: var(--color-primary-lighten1);
    text-decoration: underline;
    text-decoration-thickness: 2px;
    text-underline-offset: 5px;
  }


`

const Nav = styled.nav`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  letter-spacing: .05rem;
  font-size: .8rem;
  ul {
    margin: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 0;
    width: 100%;
    gap: 5px;
    text-transform: uppercase;
    font-family: var(--secondary-font-family);
    
    li {
      list-style: none;
      width: 100%;
      text-align: center;
      padding: 5px;
    }
  }

  @media ${p => p.theme.queries.tabletAndUp} {
    flex-direction: row;

    ul {
      flex-direction: row;
      gap: 10px;
      li {
        width: revert;
      }
    }
    
  }  
`

const Head = styled.header`
  margin: 20px auto;
  max-width: 1500px;
  margin-bottom: 15px;
  padding: 0px 15px;
  display: flex;
  flex-direction: column;
  gap: 25px;
  
  @media ${p => p.theme.queries.tabletAndUp} {
    padding: 0px 10%;
    gap: 40px;
    margin: 30px auto;
  }
`

const TitleContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
  text-align: center;

  p {
    font-weight: bold;
    letter-spacing: .5px;
    padding: 0 25px;
  }

 @media ${p => p.theme.queries.tabletAndUp} {
    flex-direction: row;
    gap: 10px;
    justify-content: space-between;
    h1 {
      margin-right: auto;
    }
    p {
      flex: 0 1 300px;
      padding: 0px;
      text-align: right;
    }
    
  }  

 h1 {
  display:flex;
  flex-direction: column;
  align-items: center;
  gap: .2rem;
  line-height: 1.8rem;
  font-family: var(--primary-font-family);
  font-size: 2rem;
  span {
    font-family: var(--secondary-font-family);
    text-transform: uppercase;
    font-size: .5em;
  }
 }
`




export default Header;
