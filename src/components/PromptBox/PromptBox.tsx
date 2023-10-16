import {ChangeEvent, KeyboardEvent, useContext, useState} from 'react';
import {Button, TextField} from '@mui/material';
import {LoadingContext} from '@/state/Loading';
import {TransactionsContext} from '@/state/Transactions';

import {
    defaultApiServer,
    EndpointsEnum,
    apiConfigConstructor,
    ApiOptions,
    apiFetch,
    TransactionsResponse,
} from '@/utils/api';

import styles from './PromptBox.module.css';
import {MessagesContext} from "@/state/Messages";
import {TableResponseContext} from "@/state/TableResponse";

const aiApiBaseOptions: ApiOptions = {
    endpointServer: defaultApiServer,
    endpointPath: EndpointsEnum.aiTransactions,
    endpointValue: '',
};

export function PromptBox() {
    const [transactions, setTransactions] = useContext(TransactionsContext);
    const [tableResponse, setTableResponse] = useContext(TableResponseContext);
    const [loading, setLoading] = useContext(LoadingContext);
    const [prompt, setPrompt] = useState<string>('');
    const [messages, setMessages] = useContext(MessagesContext);


    const handleInput = async () => {
        if (!loading) {
            try {
                setLoading(true);
                console.group(`💬 Prompt from input:`);

                const trimmedInput = prompt?.trim() || '';

                console.info(`👤 ${trimmedInput}`);

                const userMessage: Message = {
                    text: trimmedInput,
                    type: 'user',
                };
                let a = [...messages, userMessage];
                setMessages(a);
                setPrompt('');

                const aiApiOptions = {
                    ...aiApiBaseOptions,
                    queryParams: {
                        input: trimmedInput,
                    },
                };
                const aiApiConfig = apiConfigConstructor(aiApiOptions);
                const response = await apiFetch<TransactionsResponse>(
                    aiApiConfig,
                );

                const systemMessage: Message = {
                    text: response.answer,
                    type: 'system',
                };

                setMessages([...a, systemMessage]);

                setTransactions([]);
                setTableResponse(response.tableResponse);

                console.info(`Set transactions to AI request data`);
            } finally {

                console.groupEnd();
                setLoading(false);
            }
        }
    };

    const handleKey = (event: KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            handleInput();
        }
    };

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        setPrompt(event.target.value);
    };

    return (
        <>
            <TextField
                id="prompt-input"
                placeholder="Ask a question"
                hiddenLabel
                multiline
                maxRows={4}
                value={prompt}
                onChange={handleChange}
                onKeyDown={handleKey}
                disabled={loading}
                inputProps={{
                    cols: 100,
                    disableunderline: "true",
                }}
                sx={{
                    "& fieldset": {border: 'none'},
                    '& .MuiInputBase-root': {
                        padding: 0.4,
                        fontSize: 14,
                        color: '#666',
                    },
                }}
            />
            <Button className={styles.sendbutton} onClick={handleInput}>
                SEND
            </Button>
        </>
    );
}
