import './SignIn.css'
import SignInModal from '../Modal/SignIn'


export default function SignIn() {
    return (

        <div className='signin-interface'>
            <SignInModal open={true} overlay={false}/>
        </div>

    )
}