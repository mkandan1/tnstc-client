import { Icon } from "@iconify/react/dist/iconify.js";
import { Checkbox, Table } from "flowbite-react";
import { Button } from '../button/Button';
import { useState } from 'react';
import { useNavigate } from "react-router-dom";

const NormalTable = ({ headers, data = [], actions = [], renderCustomCell, isLoading, ...tableProps }) => {
    const [selectedRows, setSelectedRows] = useState([]);
    const navigate = useNavigate();

    const handleSelectAll = () => {
        if (selectedRows.length === data.length) {
            setSelectedRows([]);
        } else {
            setSelectedRows(data.map((_, index) => index));
        }
    };

    const handleSelectRow = (index) => {
        setSelectedRows((prevSelected) =>
            prevSelected.includes(index)
                ? prevSelected.filter((i) => i !== index)
                : [...prevSelected, index]
        );
    };

    const isAllSelected = selectedRows.length === data.length;

    // Function to safely retrieve nested values
    const getNestedValue = (obj, path) => {
        return path.split('.').reduce((acc, key) => (acc && acc[key] !== undefined ? acc[key] : '-'), obj);
    };

    // Function to format the createdAt field to IST
    const formatDateToIST = (dateString) => {
        if (!dateString) return '-';
        const date = new Date(dateString);
        return date.toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });
    };

    return (
        <Table hoverable className="bg-white rounded-md">
            <Table.Head className="shadow capitalize">
                <Table.HeadCell className="p-4 bg-white">
                    <Checkbox
                        checked={isAllSelected}
                        onChange={handleSelectAll}
                    />
                </Table.HeadCell>
                {headers.map((header, i) => (
                    <Table.HeadCell key={i} className="bg-white">
                        {header.label}
                    </Table.HeadCell>
                ))}
                {actions.length > 0 && <Table.HeadCell>Actions</Table.HeadCell>}
            </Table.Head>
            <Table.Body className="divide-y">
                {isLoading && (
                    <Table.Row>
                        <Table.Cell colSpan={headers.length + (actions.length > 0 ? 1 : 0)} className="text-center">
                            Loading...
                        </Table.Cell>
                    </Table.Row>
                )}
                {data.length > 0 && !isLoading ? (
                    <>
                        {data.map((row, rowIndex) => (
                            <Table.Row
                                key={rowIndex}
                                onClick={() => navigate(`${row._id}`)}
                                className="cursor-pointer"
                            >
                                <Table.Cell className="p-4">
                                    <Checkbox
                                        checked={selectedRows.includes(rowIndex)}
                                        onChange={() => handleSelectRow(rowIndex)}
                                    />
                                </Table.Cell>
                                {headers.map((header, index) => (
                                    <Table.Cell key={index}>
                                        {header.field === 'createdAt'
                                            ? formatDateToIST(row[header.field])
                                            : getNestedValue(row, header.field)}
                                    </Table.Cell>
                                ))}
                                {actions.length > 0 && (
                                    <Table.Cell>
                                        <div className="flex w-20 space-x-2">
                                            {actions.map((action, actionIndex) => (
                                                <Button
                                                    intent={action.label !== "Delete" && action.label !== "Suspend" ? "primary" : "destructive"}
                                                    startIcon={action.icon}
                                                    size="small"
                                                    key={actionIndex}
                                                    className={'inline-flex'}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        action.callback(row);
                                                    }}
                                                >
                                                </Button>
                                            ))}
                                        </div>
                                    </Table.Cell>
                                )}
                            </Table.Row>
                        ))}
                    </>
                ) : (
                    !isLoading && (
                        <Table.Row>
                            <Table.Cell colSpan={headers.length + (actions.length > 0 ? 1 : 0)} className="text-center">
                                No data available.
                            </Table.Cell>
                        </Table.Row>
                    )
                )}
            </Table.Body>
        </Table>
    );
};

export default NormalTable;
