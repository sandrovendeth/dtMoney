import { createContext, useEffect, useState, ReactNode, useContext } from 'react'
import { api } from '../services/api';

interface Transaction {
    id: number;
    title: string;
    amount: number;
    type: string;
    category: string;
    createData: string;

}

type TransactionInput = Omit<Transaction, 'id' | 'createData'>;

interface TransactionsProviderProps {
    children: ReactNode;
}

interface TransactionsContextData {
    transactions: Transaction[];
    createTransaction: (transaction: TransactionInput) => Promise<void>;
}

const TransactionsContext = createContext<TransactionsContextData>({} as TransactionsContextData);

export function TransactionsProvider({ children }: TransactionsProviderProps){
    const [transactions, setTransactions] = useState<Transaction[]>([]);


    useEffect(() =>{
        api.get('transactions')
        .then(responde => setTransactions(responde.data.transactions))
    }, []);


    async function createTransaction(transactionInput: TransactionInput) {
        const response = await api.post('/transactions', {
            ...transactionInput,
            createData: new Date(),

        })
        const { transaction } = response.data;

        setTransactions([ ///imutabilidade
            ...transactions,
        transaction,
        ]);
        
    }


    return (
        <TransactionsContext.Provider value={{ transactions, createTransaction }}>
            {children}
        </TransactionsContext.Provider>
    )
}


export function useTransactions(){
    const context = useContext(TransactionsContext)

    return context;
}