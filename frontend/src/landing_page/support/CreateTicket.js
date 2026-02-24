import React from "react";

function CreateTicket() {
  const linkStyle = {
    textDecoration: "none",
    lineHeight: "2.3",
    display: "block",
    color: "#387ed1",
  };

  return (
    <div className="container">
      <div className="row p-5 mt-5 mb-5">
        <h1 className="fs-3 mb-4">
          To create a ticket, select a relevant topic
        </h1>

        {/* Column 1 */}
        <div className="col-md-4 mb-4">
          <h5>
            <i className="fa fa-plus-circle me-2"></i> Account Opening
          </h5>

          <a href="#" style={linkStyle}>Online Account Opening</a>
          <a href="#" style={linkStyle}>Offline Account Opening</a>
          <a href="#" style={linkStyle}>
            Company, Partnership and HUF Account Opening
          </a>
          <a href="#" style={linkStyle}>NRI Account Opening</a>
          <a href="#" style={linkStyle}>Charges at Zerodha</a>
          <a href="#" style={linkStyle}>
            Zerodha IDFC FIRST Bank 3-in-1 Account
          </a>
          <a href="#" style={linkStyle}>Getting Started</a>
        </div>

        {/* Column 2 */}
        <div className="col-md-4 mb-4">
          <h5>
            <i className="fa fa-user me-2"></i> Your Zerodha Account
          </h5>

          <a href="#" style={linkStyle}>Login Credentials</a>
          <a href="#" style={linkStyle}>
            Account Modification and Segment Addition
          </a>
          <a href="#" style={linkStyle}>DP ID and Bank details</a>
          <a href="#" style={linkStyle}>Your Profile</a>
          <a href="#" style={linkStyle}>
            Transfer and conversion of shares
          </a>
        </div>

        {/* Column 3 */}
        <div className="col-md-4 mb-4">
          <h5>
            <i className="fa fa-bar-chart me-2"></i> Your Zerodha Account
          </h5>

          <a href="#" style={linkStyle}>
            Margin/leverage, Product and Order types
          </a>
          <a href="#" style={linkStyle}>Kite Web and Mobile</a>
          <a href="#" style={linkStyle}>Trading FAQs</a>
          <a href="#" style={linkStyle}>Corporate Actions</a>
          <a href="#" style={linkStyle}>Sentinel</a>
          <a href="#" style={linkStyle}>Kite API</a>
          <a href="#" style={linkStyle}>Pi and other platforms</a>
          <a href="#" style={linkStyle}>Stockreports+</a>
          <a href="#" style={linkStyle}>GTT</a>
        </div>

        {/* Second Row */}

        <div className="col-md-4 mt-4">
          <h5>
            <i className="fa fa-credit-card me-2"></i> Funds
          </h5>

          <a href="#" style={linkStyle}>Adding Funds</a>
          <a href="#" style={linkStyle}>Fund Withdrawal</a>
          <a href="#" style={linkStyle}>eMandates</a>
          <a href="#" style={linkStyle}>Adding Bank Accounts</a>
        </div>

        <div className="col-md-4 mt-4">
          <h5>
            <i className="fa fa-terminal me-2"></i> Console
          </h5>

          <a href="#" style={linkStyle}>Reports</a>
          <a href="#" style={linkStyle}>Ledger</a>
          <a href="#" style={linkStyle}>Portfolio</a>
          <a href="#" style={linkStyle}>60 Day Challenge</a>
          <a href="#" style={linkStyle}>IPO</a>
          <a href="#" style={linkStyle}>Referral Program</a>
        </div>

        <div className="col-md-4 mt-4">
          <h5>
            <i className="fa fa-circle-o me-2"></i> Coin
          </h5>

          <a href="#" style={linkStyle}>Understanding Mutual Funds</a>
          <a href="#" style={linkStyle}>About Coin</a>
          <a href="#" style={linkStyle}>Buying and Selling through Coin</a>
          <a href="#" style={linkStyle}>Starting an SIP</a>
          <a href="#" style={linkStyle}>Managing your Portfolio</a>
          <a href="#" style={linkStyle}>Coin App</a>
          <a href="#" style={linkStyle}>Moving to Coin</a>
          <a href="#" style={linkStyle}>Government Securities</a>
        </div>
      </div>
    </div>
  );
}

export default CreateTicket;
