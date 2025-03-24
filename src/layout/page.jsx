import { Outlet, useLocation } from "react-router-dom";
import { useState } from "react";
import Navbar from "../components/Navbar/navbar";
import { axiosp as axios } from "../../proxy";
import { FcGoogle } from "react-icons/fc";
import { useDispatch } from 'react-redux';
import { useNavigate } from "react-router-dom";
import { loginStart, loginSuccess, loginFailure } from "../redux/userSlice";
import { auth, provider } from "../../firebase";
import { signInWithPopup } from "firebase/auth";

export default function BaseLayout({ children }) {
    const location = useLocation();
    const currentPage = location.pathname;
    const [showAuthModal, setShowAuthModal] = useState(false);
    const [authTab, setAuthTab] = useState('signin'); // 'signin' or 'register'

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirm, setPasswordConfirm] = useState('');
    const [name, setName] = useState('');

    const handleSignUp = async (e) => {
    e.preventDefault();
    dispatch(loginStart());
    try {
        const res = await axios.post("/api/auth/signup", { name, email, password }, { withCredentials: true });
        dispatch(loginSuccess(res.data));
        navigate('/');
        setShowAuthModal(false);
    } catch (error) {
        dispatch(loginFailure());
    }
    };

    const handleLogin = async (e) => {
        e.preventDefault(); // prevents page from reloading on blank sign ins.
        dispatch(loginStart())
        try {
            const res = await axios.post("/api/auth/signin", {email, password}, { withCredentials: true })
            dispatch(loginSuccess(res.data))
            navigate('/dashboard')
            setShowAuthModal(false);
        } catch(error) {
            dispatch(loginFailure());
        }
    }

    const handleGoogleLogin = async () => {
        dispatch(loginStart())
        signInWithPopup(auth, provider).then((result) => {
        axios.post("/api/auth/google", {
            name: result.user.displayName,
            email: result.user.email,
            img: result.user.photoURL
        }, { withCredentials: true }).then((res)=>{
            navigate('/dashboard')
            dispatch(loginSuccess(res.data))
            setShowAuthModal(false);
        })

        }).catch((error) => {
        dispatch(loginFailure());
        });
    };

    return (
        <div className="bg-black min-h-screen text-white">
            <Navbar
                currentPage={currentPage}
                showAuthModal={showAuthModal}
                setShowAuthModal={setShowAuthModal}
                authTab={authTab}
                setAuthTab={setAuthTab}
            />

            {/* Unified Auth Modal */}
            {showAuthModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-gray-900 text-white rounded p-6 w-96 relative">
                        <div className="flex justify-center gap-4 mb-4 border-b border-gray-700">
                            <button
                                className={`px-4 py-2 ${authTab === 'signin' ? 'border-b-2 border-white text-white' : 'text-gray-400'}`}
                                onClick={() => setAuthTab('signin')}
                            >
                                Sign In
                            </button>
                            <button
                                className={`px-4 py-2 ${authTab === 'register' ? 'border-b-2 border-white text-white' : 'text-gray-400'}`}
                                onClick={() => setAuthTab('register')}
                            >
                                Register
                            </button>
                        </div>

                        {/* Shared form structure */}
                        {authTab === 'signin' ? (
                            <>
                                <input type="text" placeholder="Email" onChange={e=>setEmail(e.target.value)} className="w-full mb-2 p-2 bg-gray-800 text-white border border-gray-600 rounded" />
                                <input type="password" placeholder="Password" onChange={e=>setPassword(e.target.value)} className="w-full mb-4 p-2 bg-gray-800 text-white border border-gray-600 rounded" />
                            </>
                        ) : (
                            <>
                                <input type="text" placeholder="Name" onChange={e=>setName(e.target.value)} className="w-full mb-2 p-2 bg-gray-800 text-white border border-gray-600 rounded" />
                                <input type="email" placeholder="Email" onChange={e=>setEmail(e.target.value)} className="w-full mb-2 p-2 bg-gray-800 text-white border border-gray-600 rounded" />
                                <input type="password" placeholder="Password" onChange={e=>setPassword(e.target.value)} className="w-full mb-2 p-2 bg-gray-800 text-white border border-gray-600 rounded" />
                                <input type="password" placeholder="Confirm Password" onChange={e=>setPasswordConfirm(e.target.value)} className="w-full mb-4 p-2 bg-gray-800 text-white border border-gray-600 rounded" />
                            </>
                        )}

                        <div className="flex justify-between items-center">
                            <div>
                                <button className="px-4 py-2 border border-gray-500 text-gray-300 rounded hover:bg-gray-700" onClick={() => setShowAuthModal(false)}>Cancel</button>
                            </div>
                            <div className="flex items-center gap-2">
                                <button title="Sign in with Google" onClick={handleGoogleLogin} className="h-10 px-4 bg-gray-800 hover:bg-gray-700 text-white rounded flex items-center justify-center">
                                    <FcGoogle className="h-5 w-5" />
                                </button>
                                <button onClick={authTab === 'signin' ? handleLogin : handleSignUp} className={`px-4 py-2 rounded ${authTab === 'signin' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-green-600 hover:bg-green-700'} text-white`}>
                                    {authTab === 'signin' ? 'Sign In' : 'Register'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <Outlet />
        </div>
    );
}