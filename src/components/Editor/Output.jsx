const Output = ({output}) => {

    return (
        <div className={'code-output-box'}>
            <div className={'code-output'}>
                <a className={'code-output-text'}>{output ? output : 'Click "Run Code" to see the output here'}</a>
            </div>
        </div>
    )
}

export default Output