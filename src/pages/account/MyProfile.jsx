import { Inprogress } from "../../components/common/Inprogress";
import { PanelContainer } from "../../components/Layouts/Container";
import PageHeader from "../../components/Layouts/PageHeader";

const MyProfile = () => {
    return (
        <PanelContainer>
            <PageHeader 
                title={"My Profile"}
            />
            <Inprogress />
        </PanelContainer>
    );
}

export default MyProfile;