import Card from "../components/Card/Card.jsx";
import { useSelector } from "react-redux";
import { useEffect, useState, useCallback } from "react";
import { axiosp as axios } from "../../proxy.js";
import { useNavigate } from 'react-router-dom';
import { LANGUAGE_VERSIONS, FILE_EXTENSIONS } from "../constants.js";

export default function Dashboard() {

    const currentUser = useSelector(state=>state.user.currentUser);
    const navigate = useNavigate();
    const [projects, setProjects] = useState([])
    const [showShare, setShowShare] = useState(false);
    const [showNewProject, setShowNewProject] = useState(false);
    const [newProjectTitle, setNewProjectTitle] = useState("");
    const [newProjectLanguage, setNewProjectLanguage] = useState("JavaScript");

    const languageOptions = ["javascript", "typescript", "python", "java", "csharp",  "php"];

    const fetchProjects = useCallback(async () => {
        if (!currentUser?._id) return;
        try {
            const userRes = await axios.get(`/api/users/find/${currentUser._id}`);
            const projectIds = userRes.data.projects || [];
            const projectPromises = projectIds.map(id => axios.get(`/api/projects/${id}`));
            const projectResults = await Promise.all(projectPromises);
            const formattedProjects = projectResults
              .filter(res => res.data)
              .map(res => ({
                title: res.data.title,
                lastUpdated: `Last edited ${new Date(res.data.lastupdated).toLocaleString()}`,
                imageSrc: `/icons/${res.data.language?.toLowerCase() || "icon"}.png`,
                url: `/editor/${res.data.ownerId}`,
                OwnerId: res.data.ownerId,
                id: res.data._id
              }));
            setProjects(formattedProjects);
        } catch (error) {
            console.error("Error fetching projects:", error);
        }
    }, [currentUser]);

    useEffect(() => {
        fetchProjects();
    }, [fetchProjects]);

    const createProject = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post("/api/projects/", {
                ownerId: currentUser._id,
                title: newProjectTitle,
                language: newProjectLanguage
            }, { withCredentials: true });
    
            if (res.data && res.data._id) {
                navigate(`/editor/${res.data._id}`);
            }
        } catch (error) {
            console.error("Error creating project:", error);
        }
    };

    const deleteProject = async (id) => {
        try {
            await axios.delete(`/api/projects/${id}`, { withCredentials: true });
            await fetchProjects();
        } catch(error) {
            console.error("Error Deleting Project", error)
        }
    }

    return (
        <div className="flex-1 p-8 bg-black text-white">
            <div className="w-full max-w-screen-xl mx-auto">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
                    <h1 className="text-3xl font-bold">
                        Your <span className="font-bold text-transparent bg-clip-text bg-[linear-gradient(to_right,_#7f6ff3,_#c79cfc)]">Projects</span>
                    </h1>
                    <div className="flex flex-col sm:flex-row items-center gap-4">
                        <input
                            type="text"
                            placeholder="Join with code..."
                            className="px-4 py-2 rounded bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-400 w-full sm:w-auto"
                        />
                        <button className="bg-gray-800 text-white px-3 py-1.5 text-sm rounded hover:bg-gray-700 transition-colors h-[38px]">
                            Join
                        </button>
                        <button
                            className="bg-gray-800 text-white px-3 py-1.5 text-sm rounded hover:bg-gray-700 transition-colors h-[38px]"
                            onClick={() => setShowNewProject(true)}
                        >
                            + New Project
                        </button>
                    </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-12 content-center">
                    {projects.map((project, index) => (
                        <Card
                            key={index}
                            title={project.title}
                            author={project.author}
                            lastUpdated={project.lastUpdated}
                            imageSrc={project.imageSrc}
                            onClick={() => navigate(project.url)}
                            onDelete={() => deleteProject(project.id)}
                            url={project}
                        />
                    ))}
                    <div className="bg-gray-800 border border-gray-800 rounded-lg shadow-md p-6 text-white max-w-md w-full h-full flex flex-col items-center justify-center cursor-pointer hover:border-gray-400 transition-colors border-2 border-dashed border-gray-600">
                        <div className="text-3xl mb-2 text-purple-400">+</div>
                        <button onClick={() => setShowNewProject(true)} className="text-sm text-gray-300">
                          Create New Project
                        </button>
                    </div>
                </div>
                {/* {showShare && (
                    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                        <div className="bg-gray-900 text-white p-6 rounded-lg shadow-lg w-[300px]">
                            <h3 className="text-lg font-semibold mb-4">Share Project</h3>
                            <input
                                type="text"
                                className="w-full px-3 py-2 rounded bg-gray-800 text-white mb-4"
                                value={project.url}
                                readOnly
                                onClick={(e) => e.target.select()}
                            />
                            <div className="flex justify-end gap-2">
                                <button
                                    className="bg-gray-700 px-3 py-1.5 rounded hover:bg-gray-600 transition-colors"
                                    onClick={() => setShowShare(false)}
                                >
                                    Close
                                </button>
                                <button
                                    className="bg-purple-600 px-3 py-1.5 rounded hover:bg-purple-500 transition-colors"
                                    onClick={() => {
                                        navigator.clipboard.writeText(project.url);
                                        setShowShare(false);
                                    }}
                                >
                                    Copy
                                </button>
                            </div>
                        </div>
                    </div>
                )} */}
                {showNewProject && (
                    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                        <div className="bg-gray-900 text-white p-6 rounded-lg shadow-lg w-[300px]">
                            <h3 className="text-lg font-semibold mb-4">Create New Project</h3>
                            <input
                                type="text"
                                placeholder="Project Title"
                                className="w-full px-3 py-2 rounded bg-gray-800 text-white mb-4"
                                value={newProjectTitle}
                                onChange={(e) => setNewProjectTitle(e.target.value)}
                            />
                            <select
                                className="w-full px-3 py-2 rounded bg-gray-800 text-white mb-4"
                                value={newProjectLanguage}
                                onChange={(e) => setNewProjectLanguage(e.target.value)}
                            >
                                {languageOptions.map((lang) => (
                                    <option key={lang} value={lang}>{lang + " " + LANGUAGE_VERSIONS[lang]}</option>
                                ))}
                            </select>
                            <div className="flex items-center gap-3 mb-4">
                                <img
                                    src={`/icons/${newProjectLanguage.toLowerCase()}.png`}
                                    alt={newProjectLanguage}
                                    className="w-8 h-8 object-contain rounded"
                                />
                                <span className="text-sm">{newProjectLanguage.charAt(0).toUpperCase() + newProjectLanguage.slice(1) + " (." + FILE_EXTENSIONS[newProjectLanguage] + ")"}</span>
                            </div>
                            <div className="flex justify-end gap-2">
                                <button
                                    className="bg-gray-700 px-3 py-1.5 rounded hover:bg-gray-600 transition-colors"
                                    onClick={() => setShowNewProject(false)}
                                >
                                    Cancel
                                </button>
                                <button
                                    className="bg-purple-600 px-3 py-1.5 rounded hover:bg-purple-500 transition-colors"
                                    onClick={(e) => {
                                        createProject(e);
                                        setShowNewProject(false);
                                    }}
                                >
                                    Create
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}