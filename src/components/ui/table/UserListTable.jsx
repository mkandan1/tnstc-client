import { Icon } from "@iconify/react/dist/iconify.js";
import { Table } from "./Table";
import { Button } from '../button/Button'

const UserListTable = ({ headers, data = [], actions = [], renderCustomCell, isLoading, ...tableProps }) => {
    return (
        <Table>
            <Table.Header>
                <Table.Row>
                    {headers.map((header, i) => (
                        <Table.ColumnTitle key={i}>
                            {header.label}
                        </Table.ColumnTitle>
                    ))}
                    {actions.length > 0 && (
                        <Table.ColumnTitle>Actions</Table.ColumnTitle>
                    )}
                </Table.Row>
            </Table.Header>
            <Table.Body>
                {/* Replace the loading indicator with a prop or context-based condition if needed */}
                {isLoading && <Table.DataLoading headers={headers.length} />}
                {data.length > 0 && !isLoading ? (
                    <>
                        {data.map((row, rowIndex) => (
                            <Table.Row key={rowIndex}>
                                {headers.map((header, index) => (
                                    <Table.Cell key={index}>
                                        {row[header.field] || '-'}
                                    </Table.Cell>
                                ))}
                                {actions.length > 0 && (
                                    <Table.Cell>
                                        <div className="flex gap-2">
                                            {actions.map((action, actionIndex) => (
                                                <Button
                                                    intent={action.label != "Delete" && action.label != "Suspend" ? "primary" : "destructive"}
                                                    startIcon={action.icon}
                                                    size="small"
                                                    key={actionIndex}
                                                    onClick={() => action.callback(row)}
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
                    <>
                        {!isLoading &&
                            <Table.Row>
                                <Table.NoData headers={headers} />
                            </Table.Row>}
                    </>
                )}
            </Table.Body>
        </Table>
    );
};

export default UserListTable;
