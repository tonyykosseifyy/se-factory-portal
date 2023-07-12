import React, {useState} from 'react';
import {Dialog, Typography} from "@mui/material";
import { Document, Page } from 'react-pdf/dist/esm/entry.webpack5';
import './styles.scss'
import ClearIcon from "@mui/icons-material/Clear";
const PDFDialog = ({pdf, name, onCancel, ...props }) => {

    const [numPages, setNumPages] = useState(null);

    function onDocumentLoadSuccess({ numPages}) {
        setNumPages(numPages);
    }

    return (
        <Dialog {...props}  className={"pdf-modal-dialog"}>
            <div style={{display:'flex',placeContent:'space-between', padding:'5%'}}>
                <Typography variant={"h4"} fontWeight={"bolder"} sx={{fontSize:'30px'}}>
                    {name}'s CV
                </Typography>
                <ClearIcon style={{cursor:'pointer'}} onClick={onCancel} />
            </div>
            <Document
                file={pdf}
                onLoadSuccess={onDocumentLoadSuccess}
            >
                {Array.from(new Array(numPages), (el, index) => (
                    <Page key={`page_${index + 1}`} pageNumber={index + 1} />
                ))}
            </Document>
        </Dialog>
        );

};

export default PDFDialog;