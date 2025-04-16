import React from 'react';
import { FaEdit, FaTrash } from 'react-icons/fa';

interface Column {
    key: string;
    title: string;
    render?: (value: any) => React.ReactNode;
}

interface DataTableProps {
    columns: Column[];
    data: any[];
    onEdit?: (item: any) => void;
    onDelete?: (item: any) => void;
}

const DataTable: React.FC<DataTableProps> = ({
    columns,
    data,
    onEdit,
    onDelete,
}) => {
    return (
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        {columns.map((column) => (
                            <th
                                key={column.key}
                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                                {column.title}
                            </th>
                        ))}
                        {(onEdit || onDelete) && (
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Actions
                            </th>
                        )}
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {data.map((item, index) => (
                        <tr
                            key={index}
                            className="hover:bg-gray-50 transition-colors duration-200"
                        >
                            {columns.map((column) => (
                                <td
                                    key={column.key}
                                    className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                                >
                                    {column.render
                                        ? column.render(item[column.key])
                                        : item[column.key]}
                                </td>
                            ))}
                            {(onEdit || onDelete) && (
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    {onEdit && (
                                        <button
                                            onClick={() => onEdit(item)}
                                            className="text-cyan-600 hover:text-cyan-900 mr-4 transition-colors duration-200"
                                        >
                                            <FaEdit className="h-5 w-5" />
                                        </button>
                                    )}
                                    {onDelete && (
                                        <button
                                            onClick={() => onDelete(item)}
                                            className="text-red-600 hover:text-red-900 transition-colors duration-200"
                                        >
                                            <FaTrash className="h-5 w-5" />
                                        </button>
                                    )}
                                </td>
                            )}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default DataTable; 