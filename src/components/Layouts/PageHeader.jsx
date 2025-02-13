import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button/Button";
import ButtonList from "../ui/button/ButtonList";
import { cva } from "class-variance-authority";

const pageTitleVariant = cva("text-[1.6rem] font-bold tracking-tight mb-0.5", {
    variants: {
        intent: {
            primary: "text-blueGray-700",
            secondary: "text-white"
        }
    },
    defaultVariants: {
        intent: "primary"
    }
})
const pageDescriptionVariant = cva("text-sm", {
    variants: {
        intent: {
            primary: "text-blueGray-500",
            secondary: "text-white"
        }
    },
    defaultVariants: {
        intent: "primary"
    }
})
const PageTitle = ({ title, intent }) => {
    return (
        <h1 className={pageTitleVariant({ intent })}>{title}</h1>
    );
}

const PageDescription = ({ text, intent }) => {
    return (
        <p className={pageDescriptionVariant({ intent })}>{text}</p>
    );
}

const pageHeaderVariant = cva("flex flex-wrap gap-y-8 md:gap-y-4 py-5 md:mt-0 md:gap-y-0 justify-between", {
    variants: {
        intent: {
            primary: "",
            secondary: "bg-indigo-600"
        }
    },
    defaultVariants: {
        intent: "primary"
    }
})


const PageHeader = ({
    title,
    description,
    buttons,
    goBack = false,
    onButtonClick,
    intent = "primary",
}) => {

    const navigate = useNavigate();
    return (
        <div className={pageHeaderVariant({ intent })}>
            <div>
                <PageTitle title={title} intent={intent} />
                <PageDescription text={description} intent={intent} />
            </div>
            <div className="button-group flex justify-end items-center md:gap-x-2">
                {buttons ?
                    (<ButtonList buttons={buttons} onClick={(id) => onButtonClick(id)} goBack={goBack} />) : null
                }
            </div>
        </div>
    )
}

export default PageHeader;