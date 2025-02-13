import { Icon } from "@iconify/react";

export const Confirmation = ({ id, show, onDelete, onCancel }) => {
    return (
        <div
            className={`fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center transition-all duration-300 ${
                show ? "opacity-100 z-50" : "opacity-0 -z-50 pointer-events-none"
            }`}
        >
            <div
                id={id}
                tabIndex="-1"
                className="relative bg-white rounded-lg shadow dark:bg-gray-700 w-full max-w-md p-6 mx-4 sm:mx-0"
            >
                <button
                    type="button"
                    onClick={onCancel}
                    className="absolute top-3 right-3 text-gray-400 hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                >
                    <Icon icon="icon-park-outline:close" />
                </button>
                <div className="text-center">
                    <Icon
                        icon="jam:info"
                        className="mx-auto mb-4 text-gray-400 w-12 h-12 dark:text-gray-200"
                    />
                    <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
                        Are you sure you want to delete this?
                    </h3>
                    <div className="flex flex-col sm:flex-row justify-center sm:space-x-3 space-y-3 sm:space-y-0">
                        <button
                            onClick={onDelete}
                            type="button"
                            className="w-full sm:w-auto text-white bg-red-600 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm px-5 py-2.5"
                        >
                            Yes, I'm sure
                        </button>
                        <button
                            onClick={onCancel}
                            type="button"
                            className="w-full sm:w-auto py-2.5 px-5 text-sm font-medium text-gray-900 bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
                        >
                            No, cancel
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
