import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { loginStart, loginSuccess, loginFailure } from "../redux/userSlice";
import { auth, provider } from "../../firebase";
import { signInWithPopup } from "firebase/auth";
import { axiosp as axios } from "../../proxy";
import { FcGoogle } from "react-icons/fc";

export default function Home() {
  const currentUser = useSelector((state) => state.user.currentUser);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authTab, setAuthTab] = useState("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [name, setName] = useState("");

  const handleSignUp = async (e) => {
    e.preventDefault();
    dispatch(loginStart());
    try {
      const res = await axios.post("/api/auth/signup", { name, email, password }, { withCredentials: true });
      dispatch(loginSuccess(res.data));
      navigate("/dashboard");
      setShowAuthModal(false);
    } catch {
      dispatch(loginFailure());
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    dispatch(loginStart());
    try {
      const res = await axios.post("/api/auth/signin", { email, password }, { withCredentials: true });
      dispatch(loginSuccess(res.data));
      navigate("/dashboard");
      setShowAuthModal(false);
    } catch {
      dispatch(loginFailure());
    }
  };

  const handleGoogleLogin = async () => {
    dispatch(loginStart());
    signInWithPopup(auth, provider)
      .then((result) => {
        axios.post("/api/auth/google", {
          name: result.user.displayName,
          email: result.user.email,
          img: result.user.photoURL,
        }, { withCredentials: true }).then((res) => {
          dispatch(loginSuccess(res.data));
          setShowAuthModal(false);
          navigate("/dashboard");
        });
      })
      .catch(() => dispatch(loginFailure()));
  };

  return (
<div className="bg-black text-white min-h-full w-screen flex flex-col items-center justify-center px-4 space-y-12 overflow-hidden m-0 p-0 pt-20">
      <div className="text-center max-w-3xl">
        <span className="text-xs uppercase tracking-widest text-purple-400 font-semibold mb-2 block">
          Collaborative Coding Made Simple
        </span>
        <h1 className="text-4xl sm:text-6xl font-bold mb-4">
          Collaborate on code in <span className="text-purple-500">real-time</span>
        </h1>
        <p className="text-gray-400 text-lg mb-8">
          VisuDocs is a powerful collaborative code editor that allows multiple users to work on the same document simultaneously.
        </p>
        <div className="flex justify-center">
          <button
            className="bg-purple-600 hover:bg-purple-700 px-6 py-3 rounded text-sm font-medium transition-all"
            onClick={() => currentUser ? navigate("/dashboard") : setShowAuthModal(true)}
          >
            Get Started →
          </button>
        </div>
      </div>

      {/* Features Section */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 w-full max-w-5xl px-4">
        <div className="bg-gray-900 p-6 rounded-md border border-gray-800 text-center">
          <div className="text-purple-500 text-2xl mb-2">{"</>"}</div>
          <h3 className="text-lg font-semibold mb-2">Real-time Editing</h3>
          <p className="text-sm text-gray-400">
            See changes as they happen with our real-time collaborative editor.
          </p>
        </div>
        <div className="bg-gray-900 p-6 rounded-md border border-gray-800 text-center">
          <div className="text-purple-500 text-2xl mb-2">👥</div>
          <h3 className="text-lg font-semibold mb-2">Team Collaboration</h3>
          <p className="text-sm text-gray-400">
            Chat with your team while working on code together.
          </p>
        </div>
        <div className="bg-gray-900 p-6 rounded-md border border-gray-800 text-center">
          <div className="text-purple-500 text-2xl mb-2">⚡</div>
          <h3 className="text-lg font-semibold mb-2">Instant Execution</h3>
          <p className="text-sm text-gray-400">
            Run your code and see the output instantly within the editor.
          </p>
        </div>
      </div>

      {/* Auth Modal */}
      {showAuthModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-900 text-white rounded p-6 w-96 relative">
            <div className="flex justify-center gap-4 mb-4 border-b border-gray-700">
              <button
                className={`px-4 py-2 ${authTab === "signin" ? "border-b-2 border-white text-white" : "text-gray-400"}`}
                onClick={() => setAuthTab("signin")}
              >Sign In</button>
              <button
                className={`px-4 py-2 ${authTab === "register" ? "border-b-2 border-white text-white" : "text-gray-400"}`}
                onClick={() => setAuthTab("register")}
              >Register</button>
            </div>

            {authTab === "signin" ? (
              <>
                <input type="text" placeholder="Email" onChange={(e) => setEmail(e.target.value)} className="w-full mb-2 p-2 bg-gray-800 text-white border border-gray-600 rounded" />
                <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} className="w-full mb-4 p-2 bg-gray-800 text-white border border-gray-600 rounded" />
              </>
            ) : (
              <>
                <input type="text" placeholder="Name" onChange={(e) => setName(e.target.value)} className="w-full mb-2 p-2 bg-gray-800 text-white border border-gray-600 rounded" />
                <input type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} className="w-full mb-2 p-2 bg-gray-800 text-white border border-gray-600 rounded" />
                <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} className="w-full mb-2 p-2 bg-gray-800 text-white border border-gray-600 rounded" />
                <input type="password" placeholder="Confirm Password" onChange={(e) => setPasswordConfirm(e.target.value)} className="w-full mb-4 p-2 bg-gray-800 text-white border border-gray-600 rounded" />
              </>
            )}

            <div className="flex justify-between items-center">
              <button className="px-4 py-2 border border-gray-500 text-gray-300 rounded hover:bg-gray-700" onClick={() => setShowAuthModal(false)}>
                Cancel
              </button>
              <div className="flex items-center gap-2">
                <button onClick={handleGoogleLogin} className="h-10 px-4 bg-gray-800 hover:bg-gray-700 text-white rounded flex items-center justify-center">
                  <FcGoogle className="h-5 w-5" />
                </button>
                <button onClick={authTab === "signin" ? handleLogin : handleSignUp} className={`px-4 py-2 rounded ${authTab === "signin" ? "bg-blue-600 hover:bg-blue-700" : "bg-green-600 hover:bg-green-700"} text-white`}>
                  {authTab === "signin" ? "Sign In" : "Register"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}