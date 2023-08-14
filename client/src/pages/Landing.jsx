import React from "react";
import Wrapper from "../assets/wrappers/LandingPage";
import main from "../assets/images/main.svg";
import { Link } from "react-router-dom";
import Logo from "../components/Logo";

const Landing = () => {
  return (
    <Wrapper>
      <nav>
        <Logo />
      </nav>
      <div className="container page">
        <div className="info">
          <h1>
            job <span>tracking</span> app
          </h1>
          <p>
            Lorem ipsum dolor, sit amet consectetur adipisicing elit. Illum
            voluptatum pariatur dolorem delectus deleniti consequuntur ipsa
            deserunt expedita! Placeat nihil, facere, consequuntur tempora quae
            quisquam voluptatem eveniet ipsa voluptas dolorem velit molestias
            porro itaque! Dolore nulla illum ea assumenda quisquam culpa
            voluptate ad laboriosam quibusdam perspiciatis tempora, incidunt hic
            doloribus.
          </p>
          <Link to="/register" className="btn register-link">
            Register
          </Link>
          <Link to="/login" className="btn ">
            Login
          </Link>
        </div>
        <img src={main} alt="job hunt" className="img main-img" />
      </div>
    </Wrapper>
  );
};

export default Landing;
