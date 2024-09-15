import * as React from "react";
import { styled } from "styled-components";

function About() {
  return (
    <Wrapper>
      <section>
        <div>
          <p>
            This project started when I realized that most metal/rock band that
            I usually listened all had men as lead vocalist. And this
            realization lead me to search for bands with women as lead
            vocalists, and specially where said vocalist isn’t just doing the
            melodic parts but doing lots of growling.{" "}
          </p>
          <p>
            So I decided to make this page to compile the bands that I found and
            also pratice my frontend skills. You can filter bands by how much
            growling the singer is capable of doing.
          </p>

          <small>
            Note: This is an ongoing project. To see from where these data has
            been collected{" "}
            <a
              href="https://github.com/esteves-esta/women-fronted-metal-bands#sources"
              target="_blank"
            >
              {" "}
              click here
            </a>
          </small>
        </div>
      </section>
    </Wrapper>
  );
}

const Wrapper = styled.article`
  padding: 10px 10%;
  font-size: 1rem;
  line-height: 1.6;
  letter-spacing: 0.5px;
  max-width: 1500px;
  color: var(--text-color-alpha-9);
  p {
    margin-bottom: 2.2rem;
  }

  @media ${(p) => p.theme.queries.tabletAndUp} {
    padding: 30px 10%;
    margin: 0px auto;
    font-size: calc(20rem / 16);
  }

  a {
    color: var(--color-primary);
    text-decoration: none;
    gap: 10px;
    cursor: pointer;
  }

  @media (hover: hover) and (pointer: fine) {
    a:hover {
      text-decoration: underline;
      text-underline-offset: 4px;
      text-decoration-thickness: 2px;
    }
  }
`;

export default About;
