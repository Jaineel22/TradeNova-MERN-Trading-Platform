import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function SignUp() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async () => {
    try {
      const res = await axios.post("https://tradenova-mern-trading-platform.onrender.com/register", {
        username,
        email,
        password,
      });

      alert(res.data.message);
      navigate("/login");
    } catch (err) {
      alert(err.response?.data?.message || "Signup failed");
    }
  };

  return (
    <div className="container" style={{ maxWidth: "420px", marginTop: "60px", marginBottom: "60px" }}>
      <div className="text-center mb-4">
        <img 
          src="media/images/tradenova_logo.png" 
          alt="TradeNova" 
          style={{ width: "160px", marginBottom: "10px" }}
        />
      </div>

      <div className="card p-4" style={{ 
        border: "none", 
        borderRadius: "12px", 
        boxShadow: "0 5px 20px rgba(0,0,0,0.08)" 
      }}>
        <h4 className="mb-4 text-center" style={{ color: "#1e3c72", fontWeight: "600" }}>
          Create Account
        </h4>

        <div className="mb-3">
          <label className="form-label fw500" style={{ fontSize: "0.9rem", color: "#555" }}>
            Username
          </label>
          <input
            type="text"
            className="form-control"
            placeholder="Choose a username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={{ 
              padding: "10px 12px",
              borderRadius: "8px",
              border: "1px solid #e2e8f0"
            }}
          />
        </div>

        <div className="mb-3">
          <label className="form-label fw500" style={{ fontSize: "0.9rem", color: "#555" }}>
            Email
          </label>
          <input
            type="email"
            className="form-control"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ 
              padding: "10px 12px",
              borderRadius: "8px",
              border: "1px solid #e2e8f0"
            }}
          />
        </div>

        <div className="mb-4">
          <label className="form-label fw500" style={{ fontSize: "0.9rem", color: "#555" }}>
            Password
          </label>
          <div style={{ position: "relative" }}>
            <input
              type={showPassword ? "text" : "password"}
              className="form-control"
              placeholder="Create a password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ 
                padding: "10px 12px",
                borderRadius: "8px",
                border: "1px solid #e2e8f0",
                paddingRight: "40px"
              }}
            />
            <span
              onClick={() => setShowPassword(!showPassword)}
              style={{
                position: "absolute",
                right: "12px",
                top: "50%",
                transform: "translateY(-50%)",
                cursor: "pointer",
                color: "#999"
              }}
            >
              <i className={`fa ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
            </span>
          </div>
          <small className="text-muted" style={{ fontSize: "12px" }}>
            Minimum 6 characters
          </small>
        </div>

        <button
          className="btn w-100 mb-3"
          onClick={handleSignup}
          style={{ 
            padding: "12px",
            borderRadius: "8px",
            background: "#1e3c72",
            color: "white",
            border: "none",
            fontWeight: "500",
            transition: "background 0.3s ease"
          }}
          onMouseEnter={(e) => e.target.style.background = "#2a5298"}
          onMouseLeave={(e) => e.target.style.background = "#1e3c72"}
        >
          Sign Up
        </button>

        <p className="text-center mb-0" style={{ fontSize: "14px", color: "#666" }}>
          Already have an account?{" "}
          <span
            style={{ 
              color: "#1e3c72", 
              cursor: "pointer",
              fontWeight: "500"
            }}
            onClick={() => navigate("/login")}
          >
            Login
          </span>
        </p>
      </div>

      <p className="text-center mt-4" style={{ fontSize: "12px", color: "#999" }}>
        By signing up, you agree to our Terms & Privacy Policy
      </p>
    </div>
  );
}

export default SignUp;