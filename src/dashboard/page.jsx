import Card from "../components/Card/Card.jsx";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { axiosp as axios } from "../../proxy.js";
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {

    const currentUser = useSelector(state=>state.user.currentUser);
    const navigate = useNavigate();
    const [projects, setProjects] = useState([])
    const [showShare, setShowShare] = useState(false);

    useEffect(() => {
        const fetchProjects = async () => {
            if (!currentUser?._id) return;
            try {
                const userRes = await axios.get(`/api/users/find/${currentUser._id}`);
                const projectIds = userRes.data.projects || [];
                const projectPromises = projectIds.map(id => axios.get(`/api/projects/${id}`));
                const projectResults = await Promise.all(projectPromises);
                console.log(projectResults)
                const formattedProjects = projectResults.map(res => ({
                    title: res.data.title,
                    lastUpdated: `Last edited ${new Date(res.data.lastupdated).toLocaleString()}`,
                    imageSrc: `/icons/${res.data.language?.toLowerCase() || "icon"}.png`,
                    url: `/editor/${res.data.ownerId}`
                  })
                );
                setProjects(prev => [...prev, ...formattedProjects]);
            } catch (error) {
                console.error("Error fetching projects:", error);
            }
        };
        fetchProjects();
    }, [currentUser]);


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
                        <button className="bg-gray-800 text-white px-3 py-1.5 text-sm rounded hover:bg-gray-700 transition-colors h-[38px]">
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
                            url={project.url}
                        />
                    ))}
                    <div className="bg-gray-800 border border-gray-800 rounded-lg shadow-md p-6 text-white max-w-md w-full h-full flex flex-col items-center justify-center cursor-pointer hover:border-gray-400 transition-colors border-2 border-dashed border-gray-600">
                        <div className="text-3xl mb-2 text-purple-400">+</div>
                        <div className="text-sm text-gray-300">Create New Project</div>
                    </div>
                </div>
                {showShare && (
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
                )}
            </div>
        </div>
    );
}