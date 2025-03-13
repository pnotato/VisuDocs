import './Home.css'
import { io } from "socket.io-client";
import Button from '../Button/Button';
import { useSelector } from 'react-redux';
import SignInModal from '../Modal/SignIn';
import SignOutModal from '../Modal/SignOut';
import { useState } from 'react';
import Project from '../Project/Project';

// axios

const socket = io("ws://localhost:3000")

export default function Home() {

    const currentUser = useSelector(state=>state.user.currentUser);
    const [SignInMenu, SignInMenuOpen] = useState(false);
    const [SignOutMenu, SignOutMenuOpen] = useState(false);

    return (

        <div className='interface'>
            <SignInModal open={SignInMenu} setOpen={SignInMenuOpen} />
            <SignOutModal open={SignOutMenu} setOpen={SignOutMenuOpen} />
            <div className='user-projects-list'>
                <Project name="Project Title"/>
                <Project name="Project Title"/>
                <Project name="Project Title"/>
                <Project name="Project Title"/>
                <Project name="Project Title"/>
            </div>
            <div className='user-info'>
                <div className='user-options'>
                    <Button Icon={currentUser ? <img style={{ height: '3vh', borderRadius: '20px' }} src={currentUser.img} /> : 'Sign In'} onClick={currentUser ? () => SignOutMenuOpen(true) : () => SignInMenuOpen(true)} />
                </div>
                <div className='user-new-project'>
                    <h1>Create a new Project</h1>
                    <br></br>
                    <label>Project Name</label>
                    <br></br>
                    <input type='text' className={'modal-editor-settings-input'} onChange={()=>{}}/>
                </div>
                <div className='user-join-project'>
                    <h1>or join an existing Project</h1>
                    <br></br>
                    <input type='text' className={'modal-editor-settings-input'} onChange={()=>{}}/>
                </div>
            </div>
        </div>

    )
}