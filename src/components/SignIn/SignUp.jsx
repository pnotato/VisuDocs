import './SignIn.css'
import SignUpModal from '../Modal/SignUp.jsx'


export default function SignIn() {
    return (

        <div className='signin-interface'>
            <SignUpModal open={true} overlay={false}/>
        </div>

    )
}