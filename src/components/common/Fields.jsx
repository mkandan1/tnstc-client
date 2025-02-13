import { Icon } from '@iconify/react'
import { useEffect, useRef, useState } from 'react';

const Label = ({ id, label }) => {
    return (
        <label
            htmlFor={id}
            className="text-[14.5px] tracking-tight text-gray-600 font-medium"
        >
            {label}
        </label>
    )
}

const Input = ({ id, type, value, placeholder, onChange, spellCheck }) => {
    return (
        <input
            id={id}
            type={type}
            value={value}
            placeholder={placeholder}
            onChange={(e) => onChange(e.target.value)}
            spellCheck={spellCheck ?? true}
            autoComplete="off"
            className="h-10 w-full md:w-auto text-gray-600 bg-blueGray-50 transition-all text-base border border-blueGray-300 py-2 px-3 
                       focus:outline-none focus:ring-2 focus:border focus:border-purple-400 focus:ring-purple-300 rounded 
                       placeholder:text-blueGray-400 placeholder:text-sm placeholder:tracking-tight 
                        sm:px-4 lg:py-3"
        />
    );
};


export const TextInput = ({ id, type, value, label, placeholder, spellCheck, onChange }) => {
    return (
        <div className="flex flex-col gap-y-2 mt-5">
            <Label id={id} label={label} />
            <Input
                id={id}
                type={type}
                value={value}
                placeholder={placeholder}
                spellCheck={spellCheck}
                onChange={onChange} />
        </div>
    );
}

export const TextArea = ({ id, type, value, label, placeholder, spellCheck, onChange }) => {
    return (
        <div className="flex w-full  flex-col gap-y-2 mt-5">
            <Label
                id={id}
                label={label}
            />
            <textarea
                id={id}
                type={type}
                value={value}
                placeholder={placeholder}
                onChange={(e) => onChange(e.target.value)} spellCheck={spellCheck ? spellCheck : true}
                autoComplete="off"
                className="text-gray-600 bg-blueGray-50 transition-all h-20 text-sm border border-blueGray-300 py-2 pb-2 px-2 focus:outline-none focus:ring-2 focus:border focus:border-purple-400 focus:ring-purple-300 rounded placeholder:text-blueGray-400 placeholder:text-sm placeholder:tracking-tight" />
        </div>
    );
}

export const PriceArea = ({ id, type, label, placeholder, spellCheck, value, onChange }) => {
    const [price, setPrice] = useState(value);

    const handleInputChange = (e) => {
        const inputValue = e.target.value.replace(/,/g, ""); // Remove commas
        if (!isNaN(inputValue) || inputValue === "") {
            setPrice(Intl.NumberFormat("en-IN").format(inputValue));
            onChange(inputValue);
        }
    };
    return (
        <div className="flex w-full md:w-80 flex-col gap-y-2 mt-5">
            <label
                htmlFor={id}
                className="text-[14.5px] tracking-tight text-gray-600 font-medium"
            >
                {label}
            </label>
            <div className="flex items-center border border-blueGray-300 rounded">
                <div className="flex justify-center items-center px-3 border-r">
                    <Icon icon={'lucide:indian-rupee'} className="text-gray-600" />
                </div>
                <input
                    id={id}
                    type={type}
                    placeholder={placeholder}
                    value={price}
                    onChange={handleInputChange}
                    spellCheck={spellCheck ?? true}
                    autoComplete="off"
                    className="flex-1 text-gray-600 transition-all rounded-l border-blueGray-300 text-sm py-2 px-3 focus:outline-none focus:ring-2 focus:border-purple-600 focus:ring-purple-100 placeholder:text-blueGray-400 placeholder:text-sm placeholder:tracking-tight rounded-r"
                />
            </div>
        </div>
    );
};

export const PhotoUploadField = ({ id, label, value, onPhotoSelect, info }) => {
    const [preview, setPreview] = useState(`${value}`);

    const handlePhotoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setPreview(URL.createObjectURL(file));
            onPhotoSelect(file);
        }
    };

    const handleClearPhoto = () => {
        setPreview(null);
        onPhotoSelect(null);
    };

    return (
        <div className="flex flex-col gap-y-2 w-full px-2 md:px-10">
            <FormSection
                title={"Settings"}
                description={"For now, only thumbnail can update"}
            />
            <label
                htmlFor={id}
                className="text-[14.5px] tracking-tight text-gray-600 font-medium"
            >
                {label} <span className='ml-1 text-xs text-blueGray-400'>{info ? info : ''}</span>
            </label>
            <div className="relative w-64 max-h-56 flex flex-col items-center gap-y-2 border border-blueGray-300 rounded p-3">
                {preview ? (
                    <img
                        src={preview}
                        alt="Preview"
                        className="object-cover"
                    />
                ) : (
                    <span className="text-sm text-gray-500">No photo selected</span>
                )}
                <input
                    id={id}
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoChange}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                />
                {preview && (
                    <button
                        type="button"
                        onClick={handleClearPhoto}
                        className="text-sm text-red-500 hover:text-red-700 focus:outline-none"
                    >
                        Change Photo
                    </button>
                )}
            </div>
        </div>
    );
};

export const Select = ({ id, label, value, options, onOptionSelect }) => {
    return (
        <div className="flex w-full md:w-80 flex-col gap-y-2 mt-5">
            <Label
                id={id}
                label={label}
            />
            <div className="relative w-full">
                <select
                    id={id}
                    value={value}
                    onChange={(e) => onOptionSelect(e.target.value)}
                    className="h-9 w-full bg-blueGray-100 text-gray-600 transition-all capitalize border border-blueGray-300 py-2 text-sm px-2 focus:outline-none focus:ring-2 focus:border focus:border-purple-400 focus:ring-purple-300 rounded placeholder:text-blueGray-400 placeholder:text-sm placeholder:tracking-tight"
                >
                    <option value="null">Select an option</option>
                    {options.map((option, index) => (
                        <option key={index} value={option}>
                            {option}
                        </option>
                    ))}
                </select>
            </div>
        </div>
    );
};

export const Dropdown = ({ id, label, value, options, placeholder, onOptionSelect }) => {
    const [searchTerm, setSearchTerm] = useState(value);
    const [filteredOptions, setFilteredOptions] = useState(options || []);
    const [selectedOption, setSelectedOption] = useState(null);
    const [isFocused, setIsFocused] = useState(false);

    const handleSearch = (value) => {
        setSearchTerm(value);
        const filteredOptions = (options || []).filter((option) =>
            option.toLowerCase().includes(value.toLowerCase())
        )
        setFilteredOptions(filteredOptions)
    }
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsFocused(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div className="flex w-full md:w-80 flex-col gap-y-2 mt-5">
            <Label
                id={id}
                label={label}
            />
            <div className="relative w-full">
                <button
                    className='w-full bg-blueGray-50 h-9 relative flex rounded-b-none justify-start text-sm text-gray-400 transition-all border border-blueGray-300 py-2 pb-2 px-2 focus:outline-none focus:border rounded'
                    onClick={() => setIsFocused(prev => !prev)}
                >
                    {selectedOption ? <span className='text-blueGray-600'>{selectedOption}</span> : value ? value : <span>{placeholder}</span>}
                    <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                        <Icon icon={`${isFocused ? 'iconamoon:arrow-up-2-light' : 'iconamoon:arrow-down-2-light'}`} />
                    </div>
                </button>
                {isFocused && (
                    <div ref={dropdownRef} className='bg-white w-full max-h-52 overflow-x-hidden overflow-y-auto md:w-80 border-t-0 pt-2 px-3 absolute shadow-md rounded-b rounded-t-none p-1 border z-10'>
                        <input
                            id={id}
                            type="text"
                            value={searchTerm}
                            onFocus={() => setIsFocused(true)}
                            onBlur={() => setTimeout(() => setIsFocused(false), 100)}
                            onChange={(e) => handleSearch(e.target.value)}
                            autoComplete="off"
                            className="h-7 w-full me-4 text-sm text-gray-600 transition-all border border-blueGray-300 py-2 pb-2 px-2 focus:outline-none focus:ring-2 focus:border focus:border-purple-400 focus:ring-purple-300 rounded placeholder:text-blueGray-400 placeholder:text-sm placeholder:tracking-tight"
                        />
                        <ul className='cursor-pointer bg-white mt-1 opacity-100'>
                            {
                                filteredOptions.length > 0 ? (
                                    filteredOptions.map((option, i) => (
                                        <li className='text-xs hover:bg-blueGray-100 rounded text-blueGray-600 p-3 py-2'
                                            key={i}
                                            onMouseDown={(e) => e.preventDefault()}
                                            onClick={() => {
                                                onOptionSelect(option);
                                                setSelectedOption(option);
                                                setIsFocused(false)
                                                setSearchTerm("")
                                                setFilteredOptions(options)
                                            }}>
                                            {option}
                                        </li>
                                    ))
                                ) : (
                                    <li className='text-xs hover:bg-blueGray-100 rounded text-blueGray-600 p-3 py-2'
                                        onMouseDown={(e) => e.preventDefault()}
                                        onClick={() => {
                                            onOptionSelect(searchTerm);
                                            setSelectedOption(searchTerm);
                                            setIsFocused(false)
                                            setSearchTerm("")
                                            setFilteredOptions(options)
                                        }}>
                                        + {searchTerm}
                                    </li>
                                )
                            }
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
};


export const FormSection = ({ icon, title, description }) => {
    return (
        <>
            <div className="flex items-center">
                <Icon icon={icon} className="text-blueGray-700 text-xl" />
                <h3 className="font-semibold tracking-tighter text-blueGray-700 text-lg">{title}</h3>
            </div>
            <p className='text-[13px] text-blueGray-400 block'>{description}</p>
            <div className="my-2 w-full h-[1px] bg-blueGray-200"></div>
        </>
    );
}

