import {
    Article,
    Customer,
    Invoice,
    Expense,
    WcOrder,
    WcOrders,
    SupplierInvoice,
} from 'findus';
import fetchJson from '../common/fetchJson';
import { loadToken } from './TokenUtils';

export type ArchiveFile = {
    Comments?: string;
    Id: string;
    ArchiveFileId: string;
    Name: string;
    Path: string;
    Size: number;
};

interface InvoiceData {
    Invoice: Invoice;
    Expenses?: Expense[];
    DocumentLink?: string;
    OrderKey?: string;
    SupplierInvoice?: SupplierInvoice;
}

abstract class FortnoxUtils {
    public static readonly apiUrl = 'http://localhost:8080';

    public static tryCreateExpense = (order: WcOrder): Expense | undefined => {
        const paymentMethod: string | undefined =
            WcOrders.tryGetPaymentMethod(order);

        return paymentMethod && WcOrders.hasPaymentFee(order, paymentMethod)
            ? WcOrders.tryCreatePaymentFeeExpense(order)
            : undefined;
    };

    public static createResource = async (
        resources: 'articles' | 'customers' | 'invoices' | 'inbox',
        data:
            | Record<'Article', Article>
            | Record<'Customer', Customer>
            | InvoiceData
            | string
    ): Promise<
        | (Record<'Article', Article> &
              Record<'Customer', Customer> &
              Record<'Expense', Expense>)
        | InvoiceData
        | ArchiveFile
        | undefined
    > => {
        const token = loadToken();
        if (!token) return;

        console.log({ data });
        const response = await fetchJson(
            `${FortnoxUtils.apiUrl}/fortnox/${resources}`,
            {
                method: 'POST',
                body: JSON.stringify({
                    data,
                    access_token: token.access_token,
                }),
            }
        ).catch((reason) => {
            console.log({ reason });
        });
        console.log({ response });
        if (!response) return;
        if (!response.json || !response.json.data) return response as any;

        if (resources == 'inbox') {
            return response.json.data as ArchiveFile;
        }
        return response.json.data;
    };

    public static async createArticle(article: Article) {
        await FortnoxUtils.createResource('articles', { Article: article });
    }

    public static createCustomer = async (
        customer: Customer
    ): Promise<Customer | undefined> => {
        const data = (await FortnoxUtils.createResource('customers', {
            Customer: customer,
        })) as Record<'Customer', Customer>;
        return data?.Customer as Customer;
    };
    public static createInvoice = async (
        invoice: Invoice | Partial<Invoice>,
        customerNumber: string,
        expenses: Expense[],
        documentLink?: string,
        orderKey?: string,
        supplierInvoice?: SupplierInvoice
    ): Promise<Invoice> => {
        invoice.CustomerNumber = customerNumber;
        invoice.EmailInformation = undefined;
        const data = (await FortnoxUtils.createResource('invoices', {
            Invoice: invoice as Invoice,
            Expenses: expenses,
            DocumentLink: documentLink,
            OrderKey: orderKey,
            SupplierInvoice: supplierInvoice,
        })) as InvoiceData;
        return data?.Invoice;
    };

    public static uploadDocument = async (
        binaryData: string
    ): Promise<ArchiveFile> =>
        (await FortnoxUtils.createResource('inbox', binaryData)) as ArchiveFile;
    /*
        let file = await FortnoxUtils.createResource('inbox', binaryData) as {
            Id: string,
            ArchiveFileId: string,
        };

        return file.ArchiveFileId;
        }
        */
}

export default FortnoxUtils;
