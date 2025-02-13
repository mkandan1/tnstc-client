import { CenterContainer } from "../../components/Layouts/Container";
import { ForgotPwd } from "../../components/common/Form";
import { Header } from "../../components/Layouts/LoginHeader";

const ForgotPassword = () => {
    return(
       <CenterContainer>

            <Header title={'Forgot Password'} description={'Enter your registered email address to send reset link'}/>
            <ForgotPwd/>
       </CenterContainer> 
    );
}

export default ForgotPassword;