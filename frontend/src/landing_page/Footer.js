import React from "react";

function Footer() {
  return (
    <footer style={{ backgroundColor: "rgb(250, 250, 250)" }}>
      <div className="container border-top mt-5">
        <div className="row mt-5">
          <div className="col-3">
            <img 
              src="media/images/tradenova_logo.png" 
              style={{ width: "50%" }} 
              alt="TradeNova Logo"
            />
            <p style={{ fontSize: "14px", color: "#666", marginTop: "15px" }}>
              &copy; 2010 - 2024, TradeNova Broking Ltd. All rights reserved.
            </p>
          </div>
          
          <div className="col-9">
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(3, 1fr)', 
              gap: '2rem',
              padding: '1rem 0'
            }}>
              {/* Company Column */}
              <div>
                <p style={{ 
                  color: '#333', 
                  fontSize: '1.2rem', 
                  fontWeight: 'bold',
                  marginBottom: '1rem'
                }}>Company</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <a href="" style={{ color: '#666', textDecoration: 'none', fontSize: '0.95rem' }}>About</a>
                  <a href="" style={{ color: '#666', textDecoration: 'none', fontSize: '0.95rem' }}>Products</a>
                  <a href="" style={{ color: '#666', textDecoration: 'none', fontSize: '0.95rem' }}>Pricing</a>
                  <a href="" style={{ color: '#666', textDecoration: 'none', fontSize: '0.95rem' }}>Referral programme</a>
                  <a href="" style={{ color: '#666', textDecoration: 'none', fontSize: '0.95rem' }}>Careers</a>
                  <a href="" style={{ color: '#666', textDecoration: 'none', fontSize: '0.95rem' }}>TradeNova.tech</a>
                  <a href="" style={{ color: '#666', textDecoration: 'none', fontSize: '0.95rem' }}>Press & media</a>
                  <a href="" style={{ color: '#666', textDecoration: 'none', fontSize: '0.95rem' }}>TradeNova cares (CSR)</a>
                </div>
              </div>
              
              {/* Support Column */}
              <div>
                <p style={{ 
                  color: '#333', 
                  fontSize: '1.2rem', 
                  fontWeight: 'bold',
                  marginBottom: '1rem'
                }}>Support</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <a href="" style={{ color: '#666', textDecoration: 'none', fontSize: '0.95rem' }}>Contact</a>
                  <a href="" style={{ color: '#666', textDecoration: 'none', fontSize: '0.95rem' }}>Support portal</a>
                  <a href="" style={{ color: '#666', textDecoration: 'none', fontSize: '0.95rem' }}>Z-Connect blog</a>
                  <a href="" style={{ color: '#666', textDecoration: 'none', fontSize: '0.95rem' }}>List of charges</a>
                  <a href="" style={{ color: '#666', textDecoration: 'none', fontSize: '0.95rem' }}>Downloads & resources</a>
                </div>
              </div>
              
              {/* Account Column */}
              <div>
                <p style={{ 
                  color: '#333', 
                  fontSize: '1.2rem', 
                  fontWeight: 'bold',
                  marginBottom: '1rem'
                }}>Account</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <a href="" style={{ color: '#666', textDecoration: 'none', fontSize: '0.95rem' }}>Open an account</a>
                  <a href="" style={{ color: '#666', textDecoration: 'none', fontSize: '0.95rem' }}>Fund transfer</a>
                  <a href="" style={{ color: '#666', textDecoration: 'none', fontSize: '0.95rem' }}>60 day challenge</a>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Legal Text Section */}
        <div className="mt-5" style={{ fontSize: "12px", color: "#999", lineHeight: "1.6" }}>
          <p>
            TradeNova Broking Ltd.: Member of NSE & BSE – SEBI Registration no.:
            INZ000031633 CDSL: Depository services through TradeNova Securities
            Pvt. Ltd. – SEBI Registration no.: IN-DP-100-2015 Commodity Trading
            through TradeNova Commodities Pvt. Ltd. MCX: 46025 – SEBI Registration
            no.: INZ000038238 Registered Address: TradeNova Broking Ltd.,
            #153/154, 4th Cross, Dollars Colony, Opp. Clarence Public School,
            J.P Nagar 4th Phase, Bengaluru - 560078, Karnataka, India. For any
            complaints pertaining to securities broking please write to
            complaints@tradenova.com, for DP related to dp@tradenova.com. Please
            ensure you carefully read the Risk Disclosure Document as prescribed
            by SEBI | ICF
          </p>

          <p>
            Procedure to file a complaint on SEBI SCORES: Register on SCORES
            portal. Mandatory details for filing complaints on SCORES: Name,
            PAN, Address, Mobile Number, E-mail ID. Benefits: Effective
            Communication, Speedy redressal of the grievances
          </p>

          <p>
            Investments in securities market are subject to market risks; read
            all the related documents carefully before investing.
          </p>

          <p>
            "Prevent unauthorised transactions in your account. Update your
            mobile numbers/email IDs with your stock brokers. Receive
            information of your transactions directly from Exchange on your
            mobile/email at the end of the day. Issued in the interest of
            investors. KYC is one time exercise while dealing in securities
            markets - once KYC is done through a SEBI registered intermediary
            (broker, DP, Mutual Fund etc.), you need not undergo the same
            process again when you approach another intermediary." Dear
            Investor, if you are subscribing to an IPO, there is no need to
            issue a cheque. Please write the Bank account number and sign the
            IPO application form to authorize your bank to make payment in case
            of allotment. In case of non allotment the funds will remain in your
            bank account. As a business we don't give stock tips, and have not
            authorized anyone to trade on behalf of others. If you find anyone
            claiming to be part of TradeNova and offering such services, please
            create a ticket here.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;