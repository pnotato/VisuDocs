import { LuShare2, LuTrash2 } from "react-icons/lu";
import { useState } from "react";

export default function Card({ title, lastUpdated, imageSrc, onClick, onDelete, url }) {
    const [showConfirm, setShowConfirm] = useState(false);
    const [showShare, setShowShare] = useState(false);

    const handleDelete = () => {
        onDelete();
        setShowConfirm(false);
    };

    return (
        <>
            <div className="bg-black border border-gray-800 rounded-lg shadow-md p-6 text-white max-w-md w-full flex flex-col justify-between h-full">
                <div className="flex items-start justify-between mb-4">
                    <div>
                        <h2 className="text-xl font-semibold">{title}</h2>
                        <p className="text-xs text-gray-400 mt-1">Last updated: {lastUpdated}</p>
                    </div>
                    <img
                        src={imageSrc}
                        alt={title}
                        className="w-[64px] h-[64px] object-contain rounded-md ml-4 flex-shrink-0"
                    />
                </div>
                <div className="mt-auto pt-2 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <button
                            onClick={onClick}
                            className="bg-gray-800 text-white px-3 py-1.5 text-sm rounded hover:bg-gray-700 transition-colors h-[38px]"
                        >
                            View Project
                        </button>
                        <button className="bg-gray-800 text-white px-3 py-1.5 text-sm rounded hover:bg-gray-700 transition-colors flex items-center justify-center h-[38px]" onClick={() => setShowConfirm(true)}>
                            <LuTrash2 />
                        </button>
                    </div>
                    <button className="bg-transparent text-white text-sm px-3 py-1.5 rounded hover:bg-gray-700 transition-colors cursor-pointer flex items-center justify-center h-[38px]" onClick={() => setShowShare(true)}>
                        <LuShare2 />
                    </button>
                </div>
            </div>
            {showConfirm && (
                <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                    <div className="bg-gray-900 text-white p-6 rounded-lg shadow-lg w-[300px]">
                        <h3 className="text-lg font-semibold mb-4">Delete Project?</h3>
                        <p className="text-sm mb-6">Are you sure you want to delete <strong>{title}</strong>? This action cannot be undone.</p>
                        <div className="flex justify-end gap-2">
                            <button
                                className="bg-gray-700 px-3 py-1.5 rounded hover:bg-gray-600 transition-colors"
                                onClick={() => setShowConfirm(false)}
                            >
                                Cancel
                            </button>
                            <button
                                className="bg-red-600 px-3 py-1.5 rounded hover:bg-red-500 transition-colors"
                                onClick={handleDelete}
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {showShare && (
                <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                    <div className="bg-gray-900 text-white p-6 rounded-lg shadow-lg w-[300px]">
                        <h3 className="text-lg font-semibold mb-4">Share Project</h3>
                        <input
                            type="text"
                            className="w-full px-3 py-2 rounded bg-gray-800 text-white mb-4"
                            value={window.location.origin + url}
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
                                    navigator.clipboard.writeText(window.location.origin + url);
                                    setShowShare(false);
                                }}
                            >
                                Copy
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}