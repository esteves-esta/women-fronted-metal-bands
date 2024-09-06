import * as React from "react";

function About() {
  return (
    <article>
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
    </article>
  );
}

export default About;
