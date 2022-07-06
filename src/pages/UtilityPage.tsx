import {
    Grid,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Card,
    Box,
    Button,
} from '@mui/material';
import {
    Check,
    CheckBox,
    CheckBoxOutlineBlank,
    Close,
    Error as ErrorComponent,
    ViewCarousel,
} from '@mui/icons-material';
import {
    Invoices,
    Customers,
    WcOrders,
    Verification,
    Customer,
    Invoice,
    Expense,
    Articles,
    SupplierInvoices,
} from 'findus';
import type { WcOrder } from 'findus';
import React, { useEffect, useState } from 'react';
import dataProvider from '../dataProvider/dataProvider';
import { Typography } from '@material-ui/core';
import { collapseTextChangeRangesAcrossMultipleVersions } from 'typescript';
import CurrencyUtils from '../utils/CurrencyUtils';
import tryFetchPDF from '../utils/tryFetchPDF';
import FortnoxUtils from '../utils/FortnoxUtils';
import fetchJson from '../common/fetchJson';
import { loadToken } from '../utils/TokenUtils';
import { SimpleListLoadingClasses, StringMap } from 'react-admin';
import { isArray } from 'util';

const VerificationTableHeadCells = () => (
    <>
        <TableCell>Account</TableCell>
        <TableCell>Debit</TableCell>
        <TableCell>Credit</TableCell>
        <TableCell>Transaction Info</TableCell>
    </>
);

const truncate = (str: string | undefined, n = 16): string => {
    if (str === undefined || str == '') return '';
    return str.length > n ? str.substr(0, n - 1) + '&hellip;' : str;
};

const VerificationTable = (props: { children?: never[]; items: any[] }) => (
    <Table size="small">
        <TableHead>
            <TableRow>
                <VerificationTableHeadCells />
            </TableRow>
        </TableHead>
        <TableBody>
            {props.items.map((row) => {
                return (
                    <TableRow key={row.Account}>
                        <TableCell>{row.Account}</TableCell>
                        <TableCell>{row.Debit}</TableCell>
                        <TableCell>{row.Credit}</TableCell>
                        <TableCell
                            sx={{
                                whiteSpace: 'nowrap',
                                width: '100%',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                msTextOverflow: 'ellipsis',
                            }}
                        >
                            {row.TransactionInformation}
                        </TableCell>
                    </TableRow>
                );
            })}
        </TableBody>
    </Table>
);
const formatError = (message: unknown): string =>
    typeof message === 'string' ? message : (message as Error).message;

const BooleanCheckMark = (props: { value: boolean }) => {
    if (props.value) {
        return <CheckBox />;
    }
    return <CheckBoxOutlineBlank />;
};
const ConditionalSuccess = (props: {
    error: string | undefined;
    order?: WcOrder;
}) => {
    if (props.error || props.order) {
        return (
            <>
                {props.error && <Typography>{props.error}</Typography>}
                {props.order && (
                    <Button
                        onClick={() => {
                            console.log(JSON.stringify(props.order));
                        }}
                    >
                        Print JSON
                    </Button>
                )}
            </>
        );
    }
    return <CheckBox />;
};

const tryUpload = async (order: WcOrder): Promise<Invoice | undefined> => {
    try {
        let paymentMethod: 'Stripe' | 'PayPal' | undefined;
        try {
            paymentMethod = WcOrders.tryGetPaymentMethod(order);
        } catch {}

        const currency = WcOrders.tryGetCurrency(order);
        let currencyRate: number | undefined;
        if (paymentMethod !== 'Stripe') {
            currencyRate = await CurrencyUtils.fetchCurrencyRate(
                new Date(order.date_paid),
                order.currency
            );
        } else {
            currencyRate = WcOrders.tryGetCurrencyRate(order);
        }
        const supplierInvoice = SupplierInvoices.tryCreatePaymentFeeInvoice(
            order,
            currencyRate
        );
        if (paymentMethod && !supplierInvoice) {
            throw new Error(
                `Missing expected Supplier Invoice for Payment Fee ${paymentMethod}`
            );
        }

        const invoice = Invoices.tryCreateInvoice(order, currencyRate);

        const customer = Customers.tryCreateCustomer(order);
        const newCustomer = await FortnoxUtils.createCustomer(customer);
        const customerNumber = newCustomer?.CustomerNumber;
        if (!customerNumber) {
            throw new Error('Failed to upload Customer');
        }

        const expense = WcOrders.tryCreatePaymentFeeExpense(
            order,
            currencyRate
        );

        const articles = Articles.createArticles(order);
        for (const article of articles) {
            await FortnoxUtils.createArticle(article);
        }
        const documentLink = WcOrders.tryGetDocumentLink(order);
        const uploadedInvoice = await FortnoxUtils.createInvoice(
            invoice,
            customerNumber,
            [expense],
            documentLink,
            order.order_key,
            supplierInvoice
        );

        return Promise.resolve(uploadedInvoice);
    } catch (message) {
        const error = formatError(message);
        if (
            !/Unexpected Payment Method|Order was created manually/.test(error)
        ) {
            throw new Error(error);
        }
    }
};

const OrderView = (props: { order: WcOrder; brief?: boolean }) => {
    const [loading, setLoading] = useState(true);

    const { order, brief } = props;
    const [isUploaded, setUploaded] = useState<boolean>(
        WcOrders.hasInvoiceReference(order)
    );

    const [currencyRate, setCurrencyRate] = useState<number | undefined>();
    const [pdf, setPdf] = useState<string | null>(null);

    const [invoice, setInvoice] = useState<Invoice | undefined>();
    const [customer, setCustomer] = useState<Customer | undefined>();
    const [expense, setExpense] = useState<Expense | undefined>();
    const [vcs, setVcs] = useState<any[] | undefined>();

    const [error, setError] = useState<string | undefined>();

    const uploadAll = async () => {
        if (!customer || !invoice) {
            console.log('Missing customer or invoice');
            return;
        }

        setLoading(true);
        try {
            tryUpload(order);
            setUploaded(true);
        } catch (message) {
            setError(`Upload Failed - ` + formatError(message));
        } finally {
            setLoading(false);
        }
    };

    const fetchCurrency = async () => {
        setLoading(true);
        CurrencyUtils.fetchCurrencyRate(
            new Date(order.date_paid),
            order.currency
        )
            .then((currencyRate) => {
                setCurrencyRate(currencyRate);
            })
            .catch((reason) => console.log({ reason }))
            .finally(() => {
                setLoading(false);
            });
    };

    const fetchPdf = async () => {
        try {
            const url = WcOrders.tryGetDocumentLink(order);
            console.log({ url });
            const binary = await tryFetchPDF(url);
            console.log({ binary });
            setPdf(binary);
        } catch (message) {
            setError(formatError(message));
        } finally {
            setLoading(false);
        }
        //setPdf(binaryPdf)
    };

    useEffect(() => {
        if (error) {
            setLoading(false);
            return;
        }
        if (!loading) {
            if (!currencyRate) {
                try {
                    setCurrencyRate(WcOrders.tryGetCurrencyRate(order));
                } catch {
                    fetchCurrency();
                    return;
                }
            }
        }

        if (!invoice) {
            try {
                const inv = Invoices.tryCreateInvoice(order, currencyRate);
                setInvoice(inv);
                setCustomer(Customers.tryCreateCustomer(order));
                const expense = FortnoxUtils.tryCreateExpense(order);
                setExpense(expense);
                setUploaded(WcOrders.getInvoiceReference(order) !== undefined);
                setVcs(
                    Verification.tryCreateVerification(
                        inv,
                        order,
                        true,
                        expense
                    )
                );
                WcOrders.tryGetDocumentLink(order);
            } catch (message) {
                setError(formatError(message));
            } finally {
                setLoading(false);
            }
        }
    }, [currencyRate, loading]);

    if (loading)
        return (
            <TableRow key={order.id}>
                <TableCell>Loading...</TableCell>
            </TableRow>
        );

    if (brief) {
        const payDate = new Date(order.date_paid as unknown as string);
        const addPadding = (v: number): string | number =>
            v < 10 ? `0${v}` : v;
        const getTime = (date: Date): string =>
            `${addPadding(date.getHours())}:${addPadding(date.getMinutes())}`;

        return (
            <TableRow key={order.id}>
                <TableCell>{order.id}</TableCell>
                <TableCell>
                    {payDate.toLocaleDateString('sv-SE')} {getTime(payDate)}
                </TableCell>
                <TableCell>
                    <ConditionalSuccess error={error} order={order} />
                </TableCell>
                <TableCell>
                    {(!invoice && (error ? '' : 'Missing Invoice')) ||
                        (isUploaded ? (
                            <>
                                <BooleanCheckMark value={isUploaded} />
                                <Button onClick={() => uploadAll()}>
                                    Upload
                                </Button>
                            </>
                        ) : (
                            !error && (
                                <Button onClick={() => uploadAll()}>
                                    Upload
                                </Button>
                            )
                        ))}
                </TableCell>

                <TableCell></TableCell>
                <TableCell>
                    <Close />
                </TableCell>
            </TableRow>
        );
    }

    return (
        <TableRow key={order.id}>
            <TableCell>{order.id}</TableCell>
            <TableCell>
                <ConditionalSuccess error={error} order={order} />
            </TableCell>
            <TableCell>
                <BooleanCheckMark value={isUploaded} />
            </TableCell>
            <TableCell>
                {<Button onClick={() => uploadAll()}>Upload</Button>}
            </TableCell>
            <TableCell>
                <Close />
            </TableCell>
            <TableCell>{vcs && <VerificationTable items={vcs} />}</TableCell>
        </TableRow>
    );
};

const UtilityPage = () => {
    const [orders, setOrders] = useState<WcOrder[] | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | undefined>();

    useEffect(() => {
        if (loading || orders || error) return;
        setLoading(true);
        dataProvider
            .getList('orders', {
                pagination: { page: 1, perPage: 100 },
                sort: { field: 'date_completed', order: 'ASC' },
                filter: {
                    date_completed: { '<': '2022-03-01', '>': '2022-03-01' },
                    /* storefront_prefix: 'GB', */
                },
            })
            .then(({ data }) => {
                if (data) {
                    setOrders((data as WcOrder[]).reverse());
                }
            })
            .catch((reason) => {
                setError(reason);
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    if (error) {
        return <div>Failed to load orders: {error}</div>;
    }

    if (loading || !orders) {
        return <div>Loading orders...</div>;
    }

    const uploadAll = async () => {
        setLoading(true);
        let currentOrderId: string | number = -1;
        try {
            for (const order of orders) {
                currentOrderId = order.id;
                await tryUpload(order);
            }
        } catch (message: any) {
            setError(
                `Failed to upload order: ${currentOrderId} - ${
                    message.message ?? message.Error ?? message
                }`
            );
        }
        setLoading(false);
    };

    return (
        <>
            <Button onClick={() => uploadAll()}>Upload All</Button>
            <TableContainer component={Paper} sx={{ paddingTop: '10vh' }}>
                <Grid container rowSpacing={6}>
                    <Grid item>
                        <Table size="small">
                            <TableHead>
                                <TableRow>
                                    <TableCell>Order Id</TableCell>
                                    <TableCell>Payment Date</TableCell>
                                    <TableCell>Success</TableCell>
                                    <TableCell>Uploaded</TableCell>
                                    <TableCell></TableCell>
                                    <TableCell>Refunded</TableCell>
                                    <TableCell>Verification</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {orders.map((order) => {
                                    return (
                                        <OrderView
                                            order={order}
                                            key={order.id}
                                            brief={true}
                                        />
                                    );
                                })}
                            </TableBody>
                        </Table>
                    </Grid>
                </Grid>
            </TableContainer>
        </>
    );
};

export default UtilityPage;
