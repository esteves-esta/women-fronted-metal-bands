// @ts-nocheck 
import * as React from "react";
import { styled } from "styled-components";
import { BandContext } from "../BandsProvider";
import MediaPlayer from "../MediaPlayer";
import { NavLink } from "react-router-dom";
import { ArrowUp, Download } from "lucide-react";
import useIsOnscreen from "../../helpers/useIsOnScreen";
import ErrorBoundary from '../ErrorBoundary';

function Header() {
  const { total, databaseChecked, downloadAll, searchParams, downloadFiltered } = React.useContext(BandContext);
  function scrollTop() {
    window.scrollTo({
      top: 0,
      left: 0,
    });
  }

  const [isOnscreen, elementRef] = useIsOnscreen();

  return (
    <>

      <ErrorBoundary
        fallback={
          <div className="error">
            
          </div>
        }
      >
        <MediaPlayer />
      </ErrorBoundary>

      {/* <MediaPlayer /> */}
      <Head ref={elementRef}>
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
            {total} band{total > 1 && "s"}
          </TotalSpan>

          <DownloadBtn onClick={downloadAll}>
            Download list<Download size={16} />
          </DownloadBtn>
          {searchParams.filter || searchParams.growling &&
          <DownloadBtn onClick={downloadFiltered}>
            Download filtered <Download size={16} />
          </DownloadBtn>}
        </Nav>

        <TitleContainer>
          <h1>
            Women Fronted <span>metal bands</span>
          </h1>
          <p>
            This is a project to compile a list of metal bands that have women
            as lead vocalists.
          </p>
        </TitleContainer>
      </Head>

      {!isOnscreen && <BackToTop onClick={scrollTop}>
        <ArrowUp size={26} />
      </BackToTop>}
    </>
  );
}

function HeaderLink({ children, to }) {
  return (
    <Link
      className={({ isActive, isPending }) =>
        isActive ? "active" : isPending ? "pending" : ""
      }
      to={to}
    >
      {children}
    </Link>
  );
}

const DownloadBtn = styled.button`
color: inherit;
cursor: pointer;
border:none;
background-color: var(--color-secondary);
padding: 5px 20px 6px 20px;
border-radius: 100rem;
display: flex;
align-items: center;
gap: 5px;
font-weight: bold;
letter-spacing: .05rem;
`;

const BackToTop = styled.button`
color: inherit;
cursor: pointer;
border:none;
background-color: var(--color-secondary);
padding: 18px;
border-radius: 100rem;
position: fixed;
bottom: 20px;
right: 20px;
z-index: 1;
transition: all 400ms ease;
@media (hover: hover) and (pointer: fine) {
    &:hover {
       background-color: var(--color-secondary-dark);
    }
}
`;
const TotalSpan = styled.span`
  text-transform: uppercase;
  font-family: var(--secondary-font-family);
  @media ${(p) => p.theme.queries.tabletAndUp} {
    margin-left: auto;
  }
`;

const Link = styled(NavLink)`
  display: block;
  text-decoration: none;
  color: var(--color-grey-500);
  transition: color 500ms ease-in-out;

  @media (hover: hover) and (pointer: fine) {
    &:hover {
      color: var(--color-primary);
    }
  }

  &.active {
    color: var(--color-primary);
    text-decoration: underline;
    text-decoration-thickness: 2px;
    text-underline-offset: 5px;
  }
`;

const Nav = styled.nav`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  letter-spacing: 0.05rem;
  font-size: 0.8rem;
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

  @media ${(p) => p.theme.queries.tabletAndUp} {
    flex-direction: row;

    ul {
      width: revert;
      flex-direction: row;
      gap: 10px;
      li {
        width: revert;
      }
    }
  }
`;

const Head = styled.header.attrs(({ ref }) => ({
  ref: ref,
}))`
  margin: 0px auto;
  max-width: 1500px;
  margin-bottom: 15px;
  padding: 20px 15px;
  display: flex;
  flex-direction: column;
  gap: 25px;

  @media ${(p) => p.theme.queries.tabletAndUp} {
    padding: 30px 10%;
    gap: 40px;
    margin: 0px auto;
  }
`;

const TitleContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
  text-align: center;

  p {
    font-weight: bold;
    letter-spacing: 0.5px;
    padding: 0 25px;
  }

  @media ${(p) => p.theme.queries.tabletAndUp} {
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
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.2rem;
    line-height: 1.8rem;
    font-family: var(--primary-font-family);
    font-size: 2rem;
    span {
      font-family: var(--secondary-font-family);
      text-transform: uppercase;
      font-size: 0.5em;
    }
  }
`;

export default Header;
