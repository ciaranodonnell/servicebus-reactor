
import { Box, Button, FormControl, FormControlLabel, FormLabel, Modal, Radio, RadioGroup, TextField } from '@mui/material';
import React from 'react';
import { Topic, Queue } from './AzureServiceBus/AzureServiceBusManager';


export interface MessageInputDialogProps {
    destination: Queue | Topic;
}

export function MessageInputDialog(props: MessageInputDialogProps) {
    const destination = props.destination;
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const [messageText, setMessageText] = React.useState("");
    const [msgFormat, setMsgFormat] = React.useState("json");

    const [headers, setHeaders] = React.useState<{ [key: string]: string | number | boolean | Date | null }>({});

    const handleMessageTextChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setMessageText(event.target.value);
    };

    const handleMessageFormatChange = (event: React.FormEvent<HTMLInputElement>) => {
        setMsgFormat(event.currentTarget.value);
    };

    function sendTheMessage() {
        const contentType = (() => {
            switch (msgFormat) {
                case "json": return "application/json";
                case "xml": return "application/xml";
                case "text": return "text/plain";
                case "base64": return "application/octet-stream";
            }
            return "text/plain";
        })();

        destination.sendMessage(messageText, msgFormat, headers);
    }

    return (
        <>
            <Button
                variant="contained"
                onClick={handleOpen}
            >Send Message</Button>

            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="parent-modal-title"
                aria-describedby="parent-modal-description">
                <Box>
                    <h2>Send a Message to {destination.name}</h2>
                    <p>Message Format</p>
                    <FormControl>
                        <FormLabel id="demo-radio-buttons-group-label">Format</FormLabel>
                        <RadioGroup
                            aria-labelledby="demo-radio-buttons-group-label"
                            defaultValue={msgFormat} onChange={handleMessageFormatChange}
                            name="radio-buttons-group"
                        >
                            <FormControlLabel value="text" control={<Radio />} label="Text" />
                            <FormControlLabel value="base64" control={<Radio />} label="Base64" />
                            <FormControlLabel value="json" control={<Radio />} label="Json" />
                        </RadioGroup>
                    </FormControl>
                    <TextField
                        id="outlined-multiline-flexible"
                        label="Multiline"
                        multiline
                        maxRows={4}
                        value={messageText}
                        onChange={handleMessageTextChange}
                    />
                    <Button >Send</Button>
                </Box>
            </Modal>
        </>
    );
}