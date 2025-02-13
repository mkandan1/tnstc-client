import { Inprogress } from "../../components/common/Inprogress";
import { PanelContainer } from "../../components/Layouts/Container";
import PageHeader from "../../components/Layouts/PageHeader";

const Settings = () => {
    return (
        <PanelContainer>
            <PageHeader
                title={"Settings"}
            />
            <Inprogress/>
        </PanelContainer>
    );
}

export default Settings