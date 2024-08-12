import React from "react";
import TableCell from "@mui/material/TableCell";

interface CustomTableCellProps {
  label: string;
  noWrap?: boolean;
}

const CustomTableCell: React.FC<CustomTableCellProps> = ({
  label,
  noWrap = false,
}) => {
  return (
    <TableCell
      sx={{
        fontWeight: "bold",
        padding: "12px 16px",
        textAlign: "center",
        whiteSpace: noWrap ? "nowrap" : "normal",
      }}
    >
      {label}
    </TableCell>
  );
};

export default CustomTableCell;
