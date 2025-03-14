import './Project.css'

export default function Project({ name, author, updated, language='javascript' }) {
    return (
        <div className='project-pane'>
            <div className='project-info'>
                <div className='project-title'>{name}</div>
                <div className='project-subtitle'>Author: {author}</div>
                <div className='project-subtitle'>Last Updated: {updated}</div>
                
            </div>
            <img src={`/icons/${language}.png`} alt={`${language} icon`} className='project-icon' />
        </div>
    )
}