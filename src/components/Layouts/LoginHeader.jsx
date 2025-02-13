
export const Header = ({ title, description }) => {
    return (
        <div className="login-header py-3 flex flex-col gap-y-10">
            <div className="flex">
                <img src="https://www.tnstc.in/OTRSOnline/newHSite/images/logo.png" className="" alt="TNSTC" />
            </div>
            <div className="text-center">
                <h1 className="text-lg font-bold text-gray-700">{title}</h1>
                <p className="text-sm text-gray-500">{description}</p>
            </div>
        </div>
    );
}