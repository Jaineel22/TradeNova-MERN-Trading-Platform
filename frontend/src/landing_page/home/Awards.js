import React from "react";

function Awards() {
  return (
    <div className="container mt-5">
      <div className="row align-items-center">
        <div className="col-md-6 p-5">
          <img src="media/images/largestBroker.svg" alt="Achievement" />
        </div>

        <div className="col-md-6 p-5">
          <h1>Built for Modern Traders</h1>

          <p className="mb-4 text-muted">
            TRADENOVA provides a complete investment ecosystem for:
          </p>

          <div className="row text-muted">
            <div className="col-6">
              <ul>
                <li>Futures & Options</li>
                <li>Commodity Derivatives</li>
                <li>Currency Trading</li>
              </ul>
            </div>
            <div className="col-6">
              <ul>
                <li>Stocks & IPOs</li>
                <li>Direct Mutual Funds</li>
                <li>Bonds & Government Securities</li>
              </ul>
            </div>
          </div>

          <img
            src="media/images/pressLogos.png"
            style={{ width: "85%" }}
            alt="Press"
          />
        </div>
      </div>
    </div>
  );
}

export default Awards;