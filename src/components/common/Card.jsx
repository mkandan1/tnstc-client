import { Icon } from "@iconify/react/dist/iconify.js";

export const Card = ({title, value, icon, iconBg}) => {
    const formattedValue = new Intl.NumberFormat("en-IN").format(value);

    return(
        <div className="bg-white border shadow-lg  w-full md:w-80 rounded-md p-3">
            <div className="flex">
                <div className="w-1/2">
                    <div className="mb-4">
                        <p className="text-blueGray-400 font-semibold text-sm mb-1 tracking-tight">{title}</p>
                        <h3 className="text-xl text-blueGray-700 font-bold">{formattedValue}</h3>
                    </div>
                    <div className="w-full">
                        <p className="flex text-xs items-center gap-2 text-blueGray-400"><Icon icon={'fe:calendar'}/> Since app launch</p>
                    </div>
                </div>
                <div className="flex justify-end w-1/2">
                    <div className={"w-12 h-12 shadow-md rounded-full flex justify-center items-center text-lg text-white " + `${iconBg}`}>
                        <Icon icon={icon}/>
                    </div>
                </div>
            </div>
        </div>
    );
}