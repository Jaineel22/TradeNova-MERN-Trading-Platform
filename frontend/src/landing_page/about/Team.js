import React from "react";

function Team() {
  return (
    <div className="container">
      <div className="row py-5 border-top text-center">
        <h1 className="fw-bold">Founder & Vision</h1>
        <p className="text-muted">
          The leadership driving TRADENOVA forward.
        </p>
      </div>

      <div
        className="row align-items-center text-muted"
        style={{ lineHeight: "1.9", fontSize: "1.1em" }}
      >
        <div className="col-md-6 text-center py-4">
          <img
            src="media/images/jaineel_founder.jpeg"
            alt="Founder"
            style={{
              borderRadius: "50%",
              width: "55%",
              boxShadow: "0px 10px 30px rgba(0,0,0,0.15)",
            }}
          />
          <h4 className="mt-4 fw-bold">Jaineel Hemnani</h4>
          <h6 className="text-muted">Founder & CEO, TRADENOVA</h6>
        </div>

        <div className="col-md-6 py-4 px-4">
          <p>
            Jaineel Hemnani founded TRADENOVA with the ambition of building a
            next-generation trading ecosystem powered by modern technology.
          </p>
          <p>
            With a passion for finance and innovation, he focuses on creating
            tools that simplify complex market operations.
          </p>
          <p>
            His vision is to democratize trading and provide smart investors
            with the infrastructure to grow confidently.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Team;