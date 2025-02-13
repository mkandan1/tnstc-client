import { CenterContainer } from "../../components/Layouts/Container";
import { Footer } from "../../components/Layouts/LoginFooter";
import { LoginForm } from "../../components/common/Form";
import { Header } from "../../components/Layouts/LoginHeader";

const Login = () => {
    return (
        <CenterContainer>
            {/* login header */}
            <Header title={'Sign-In'} description={'Access the Admin Panel using your email and password.'} />

            {/* login form */}
            <div className="w-full max-w-xs sm:max-w-md lg:max-w-lg mx-auto">
                <LoginForm />
            </div>

            {/* login footer */}
            <Footer />
        </CenterContainer>
    );
};

export default Login