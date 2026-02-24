import React from "react";

function Stats() {
  return (
    <div className="container py-5">
      <div className="row align-items-center">
        <div className="col-md-6">
          <h1>Why Choose TRADENOVA?</h1>

          <h5>Technology First</h5>
          <p className="text-muted">
            Built with scalable fintech architecture for speed and reliability.
          </p>

          <h5>Secure & Transparent</h5>
          <p className="text-muted">
            Advanced encryption and transparent fee structures.
          </p>

          <h5>Data Driven</h5>
          <p className="text-muted">
            Real-time insights, analytics, and performance tracking tools.
          </p>

          <h5>Investor Focused</h5>
          <p className="text-muted">
            Designed for beginners and professionals alike.
          </p>
        </div>

        <div className="col-md-6 text-center">
          <img
            src="media/images/ecosystem.png"
            style={{ width: "90%" }}
            alt="Ecosystem"
          />
        </div>
      </div>
    </div>
  );
}

export default Stats;