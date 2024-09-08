import * as React from 'react';
import { styled } from "styled-components";
import { MEDIA_QUERIES } from "../../constants";
import { BandContext } from "../BandsProvider";
import MediaPlayer from "../MediaPlayer";
import { NavLink } from "react-router-dom";

function Header() {
  const { total, databaseChecked } = React.useContext(BandContext);


  return <Head>
    {/* {databaseChecked && <MediaPlayer />} */}
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
 @media (${MEDIA_QUERIES.tabletAndUp}) {
  margin-left: auto
 }
`;

const Link = styled(NavLink)`
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
  padding: 20px 0px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  letter-spacing: .05rem;

  ul {
    margin: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 0;
    gap: 20px;
    text-transform: uppercase;
    font-family: var(--secondary-font-family);
    
    li {
      list-style: none;
    }
  }

  @media (${MEDIA_QUERIES.tabletAndUp}) {
    flex-direction: row;

    ul {
      flex-direction: row;
    }
    
  }  
`

const Head = styled.header`
  margin: 0 auto;
  max-width: 1500px;
  margin-bottom: 15px;
  padding: 0px 15px;
  display: flex;
  flex-direction: column;
  gap: 20px;

  @media (${MEDIA_QUERIES.tabletAndUp}) {
    padding: 0px 10%;
  }
`

const TitleContainer = styled.div`
  padding: 20px 0px;
  display: flex;
  flex-direction: column;
  gap: 15px;
  text-align: center;

  p {
    font-weight: bold;
    letter-spacing: .5px;
  }

 @media (${MEDIA_QUERIES.tabletAndUp}) {
    flex-direction: row;
    gap: 10px;
    justify-content: space-between;
    h1 {
      margin-right: auto;
    }
    p {
      flex: 0 1 300px;
      text-align: right;
    }
    
  }  

 h1 {
  display:flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
  line-height: 1rem;
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
