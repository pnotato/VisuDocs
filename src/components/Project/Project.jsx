import './Project.css'

export default function Project({ name, author, updated, language }) {
    return (
        <div className='project-pane'>
            <div className='project-info'>
                <div className='project-title'>{name}</div>
                <div className='project-subtitle'>Author:</div>
                <div className='project-subtitle'>Last Updated:</div>
                
            </div>
            <div className='project-icon'></div>
        </div>
    )
}