import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await axios.post(
        "https://tradenova-mern-trading-platform.onrender.com/login",
        {
          email,
          password,
        },
      );

      localStorage.setItem("token", res.data.token);
      if (rememberMe) {
        localStorage.setItem("rememberedEmail", email);
      }
      window.location.href =
        "https://trade-nova-mern-trading-platform-re.vercel.app/";
      } catch (err) {
      alert(err.response?.data?.message || "Login failed");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleLogin();
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
          Welcome Back
        </h4>

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
            onKeyPress={handleKeyPress}
            style={{ 
              padding: "10px 12px",
              borderRadius: "8px",
              border: "1px solid #e2e8f0"
            }}
          />
        </div>

        <div className="mb-3">
          <label className="form-label fw500" style={{ fontSize: "0.9rem", color: "#555" }}>
            Password
          </label>
          <div style={{ position: "relative" }}>
            <input
              type={showPassword ? "text" : "password"}
              className="form-control"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyPress={handleKeyPress}
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
        </div>

        <div className="d-flex justify-content-between align-items-center mb-4">
          <div className="form-check">
            <input
              type="checkbox"
              className="form-check-input"
              id="rememberMe"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
            />
            <label className="form-check-label" htmlFor="rememberMe" style={{ fontSize: "0.9rem", color: "#666" }}>
              Remember me
            </label>
          </div>
          <a href="#" style={{ fontSize: "0.9rem", color: "#1e3c72", textDecoration: "none" }}>
            Forgot password?
          </a>
        </div>

        <button
          className="btn w-100 mb-3"
          onClick={handleLogin}
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
          Login
        </button>

        <p className="text-center mb-0" style={{ fontSize: "14px", color: "#666" }}>
          Don't have an account?{" "}
          <span
            style={{ 
              color: "#1e3c72", 
              cursor: "pointer",
              fontWeight: "500"
            }}
            onClick={() => navigate("/signup")}
          >
            Sign up
          </span>
        </p>
      </div>

      <div className="text-center mt-4">
        <a href="#" style={{ fontSize: "12px", color: "#999", textDecoration: "none", marginRight: "15px" }}>
          Terms
        </a>
        <a href="#" style={{ fontSize: "12px", color: "#999", textDecoration: "none", marginRight: "15px" }}>
          Privacy
        </a>
        <a href="#" style={{ fontSize: "12px", color: "#999", textDecoration: "none" }}>
          Contact
        </a>
      </div>
    </div>
  );
}

export default Login;