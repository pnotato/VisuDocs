import { useNavigate } from 'react-router-dom';
import './Modal.css'
import Button from '../Button/Button.jsx'
import { axiosp as axios } from '../../../proxy.js'; // import axios from 'axios'
import { FcGoogle } from "react-icons/fc";
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react'
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { loginStart, loginSuccess, loginFailure } from '../../redux/userSlice.js';
import { auth, provider } from '../../../firebase.js';
import { signInWithPopup } from 'firebase/auth';

const blank = () => {}

export default function SignInModal({ open, setOpen=blank, overlay=true }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleRedirect = () => {
    navigate('/signup')
  }

  const handleLogin = async (e) => {
    e.preventDefault(); // prevents page from reloading on blank sign ins.
    dispatch(loginStart())
    try {
      const res = await axios.post("/api/auth/signin", {email, password})
      console.log(res.data);
      if (setOpen != blank ) {
        await setOpen(false)
      } else {
        navigate('/editor')
      }
      dispatch(loginSuccess(res.data))
    }catch(error) {
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
      }).then((res)=>{
        if (setOpen != blank ) {
          setOpen(false)
        } else {
          navigate('/editor')
        }
        dispatch(loginSuccess(res.data))
      })

    }).catch((error) => {
      dispatch(loginFailure());
    });
  };

  return (
    <Dialog open={open} onClose={setOpen} className="relative z-10">
      {overlay && <DialogBackdrop
        transition
        className="fixed inset-0 bg-gray-800/75 transition-opacity data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in"
      /> }

      <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <DialogPanel
            transition
            className="relative transform overflow-hidden rounded-lg text-left shadow-xl transition-all data-closed:translate-y-4 data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in sm:my-8 sm:w-full sm:max-w-lg data-closed:sm:translate-y-0 data-closed:sm:scale-95"
            style={overlay ? undefined : { boxShadow: '0 0 15px rgba(255, 255, 255, 0.5)' }}
          >
            <div className="modal-menu px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <div className="test1">

                <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <div className='modal-title '>
                        <DialogTitle className="modal-text text-base font-semibold text-white-900 ">
                        Sign In
                    </DialogTitle>
                    {overlay && <button type="button" onClick={()=>setOpen(false)} className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-hide="default-modal">
                    <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
                    </svg>
                    <span className="sr-only">Close modal</span>
                </button>}
                    </div>

                  <div className="mt-2">
                    <br></br>
                    <form className='modal-editor-settings'>
                        <label>Email</label>
                        <input type='text' className={'modal-editor-settings-input'} onChange={e=>setEmail(e.target.value)}/>
                        <label>Password</label>
                        <input type='password' className={'modal-editor-settings-input'} onChange={e=>setPassword(e.target.value)}/>
                    </form>
                    
                    <div className='sign-in-form-buttons'>
                    <Button Label='Sign Up' onClick={handleRedirect}/>
                      <div className='sign-in-buttons'>
                      <Button Icon={<FcGoogle />} className="h-10 px-4 bg-gray-800 hover:bg-gray-700 text-white rounded flex items-center justify-center" onClick={handleGoogleLogin}/>
                      <Button Label='Sign In' onClick={handleLogin}/>
                      </div>
                    
                    
                    
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  )
}
