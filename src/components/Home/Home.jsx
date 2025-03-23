import './Home.css'
import { io } from "socket.io-client";
import Button from '../Button/Button';
import { useSelector } from 'react-redux';
import SignInModal from '../Modal/SignIn';
import SignOutModal from '../Modal/SignOut';
import { useState, useEffect } from 'react';
import Project from '../Project/Project';
import { axiosp as axios } from '../../../proxy'; // import axios from 'axios'
import { current } from '@reduxjs/toolkit';
import { useNavigate } from 'react-router-dom';

// axios

const socket = io("ws://localhost:3000")

export default function Home() {

    const currentUser = useSelector(state=>state.user.currentUser);
    const [SignInMenu, SignInMenuOpen] = useState(false);
    const [SignOutMenu, SignOutMenuOpen] = useState(false);
    const [ProjectName, SetProjectName] = useState('New Project')
    const [ProjectLang, SetProjectLang] = useState('javascript')
    const navigate = useNavigate();
    const [projects, setProjects] = useState([]); // Store projects

    useEffect(() => {
        const fetchProjects = async () => {
            if (!currentUser?._id) return;
            try {
                const userRes = await axios.get(`/api/users/find/${currentUser._id}`);
                const projectIds = userRes.data.projects || [];

                const projectPromises = projectIds.map(id => axios.get(`/api/projects/${id}`));
                const projectResults = await Promise.all(projectPromises);

                setProjects(projectResults.map(res => res.data));
            } catch (error) {
                console.error("Error fetching projects:", error);
            }
        };
        fetchProjects();
    }, [currentUser]);

    const createProject = async (e) => {
        e.preventDefault();
        
        try {
            const res = await axios.post("/api/projects/", {
                ownerId: currentUser._id,
                title: ProjectName, 
                language: ProjectLang
            }, { withCredentials: true });
    
            if (res.data && res.data._id) {
                navigate(`/editor/${res.data._id}`);
            }
        } catch (error) {
            console.error("Error creating project:", error);
        }
    };

    return (
        <div className="w-full max-w-screen-xl mx-auto">
            <SignInModal open={SignInMenu} setOpen={SignInMenuOpen} />
            <SignOutModal open={SignOutMenu} setOpen={SignOutMenuOpen} />
            <div className='user-projects-list'>
                {projects.length > 0 ? (
                    projects.map(project => (
                <div 
                    key={project._id}
                    className="project-container"
                    onClick={() => navigate(`/editor/${project._id}`)}
                    style={{ cursor: 'pointer' }}
                >
                    <Project
                        name={project.title}
                        author={project.ownerId}
                        updated={new Date(project.lastupdated).toLocaleString()}
                        language={project.language}
                    />
                </div>
                    ))
                ) : (
                    <p>No projects found.</p>
                )}
            </div>
            <div className='user-info'>
                <div className='user-options'>
                    <Button Icon={currentUser ? <img style={{ height: '3vh', borderRadius: '20px' }} src={currentUser.img} /> : 'Sign In'} onClick={currentUser ? () => SignOutMenuOpen(true) : () => SignInMenuOpen(true)} />
                </div>
                <div className='user-new-project'>
                    <h1>Create a new Project</h1>
                    <br></br>
                    <label>Project Name</label>
                    <input type='text' className={'modal-editor-settings-input'} onChange={(e)=>SetProjectName(e.target.value)}/>
                    <label>Language</label>
                    <input type='text' className={'modal-editor-settings-input'} onChange={(e)=>SetProjectLang(e.target.value)}/>
                    <Button Label='Create' onClick={createProject} />
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