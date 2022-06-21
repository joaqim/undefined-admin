import React, { useEffect, useState } from 'react';
import {
    Box,
    Card,
    CardContent,
    Button,
    Grid,
    Typography,
    Table,
    TableContainer,
    Paper,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
} from '@mui/material';
import {
    Article,
    Customer,
    Invoice,
    InvoiceRow,
    WcOrder,
    WcOrderMetaData,
    WcOrders,
} from 'findus';
import { useRecordContext } from 'react-admin';
import * as Findus from 'findus';
import CurrencyUtils from '../utils/CurrencyUtils';
import { AppRegistrationOutlined } from '@mui/icons-material';
import Axios from 'axios';
import { loadToken } from '../utils/TokenUtils';
import { fetchUtils } from 'ra-core';
import fetchJson from '../common/fetchJson';

const WcOrderShow = () => {
    const order: WcOrder = useRecordContext<WcOrder>();
    const [currencyRate, setCurrencyRate] = useState<number | undefined>();
    const [invoice, setInvoice] = useState<Invoice | null>(null);
    const [pdf, setPdf] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    if (!order) return null;

    //const [pdf, setPdf] = useState<string | null>();

    useEffect(() => {
        /*
    const fetch = async () => {
      const url = Findus.WcOrders.tryGetDocumentLink(order);
      const binaryPdf = await tryFetchPDF(url);
      setPdf(getDocument(binaryPdf));
    };
    fetch();
    */

        if (invoice) {
            try {
                const customer = Findus.Customers.tryCreateCustomer(invoice);
            } catch (error) {
                console.log({ error });
            }
            return;
        }

        const fetchCurrency = async () => {
            CurrencyUtils.fetchCurrencyRate(
                new Date(order.date_paid),
                order.currency
            ).then((currencyRate) => {
                setCurrencyRate(currencyRate);
            });
        };

        try {
            if (!pdf) {
                setPdf(
                    order.meta_data.find(
                        (entry: WcOrderMetaData) =>
                            entry.key === 'pdf_invoice_source'
                    )?.value as string
                );
            }

            if (!currencyRate) {
                try {
                    setCurrencyRate(Findus.WcOrders.tryGetCurrencyRate(order));
                } catch {
                    fetchCurrency();
                    return;
                }
            }

            /*
            let hasPaymentFee = false;
            const paymentMethod = Findus.WcOrders.getPaymentMethod(order);
            if (paymentMethod)
                hasPaymentFee = Findus.WcOrders.hasPaymentFee(
                    order,
                    paymentMethod
                );
            if (!currencyRate) {
                if (!hasPaymentFee) {
                    fetchCurrency();
                } else {
                    setCurrencyRate(Findus.WcOrders.tryGetCurrencyRate(order));
                }
                return;
            }
            */

            setInvoice(Findus.Invoices.tryCreateInvoice(order, currencyRate));
        } catch (findusError) {
            const message =
                typeof findusError === 'string'
                    ? findusError
                    : (findusError as Error).message;
            setError(`Failed to create Invoice - ${message}`);
        }
    }, [currencyRate, invoice]);

    // invoice = Findus.Invoices.tryCreateInvoice(order, 1.04);
    // pdf = Findus.WcOrders.tryGetDocumentLink(order)
    // pdf = Findus.WcOrders.getDocumentSource(order)

    return InvoiceField({ invoice, error, pdf, order, currencyRate });
};
const apiUrl = 'http://localhost:8080';

const httpClient = (
    url: string,
    options?: {
        headers?: Headers;
        method?: 'POST' | 'GET' | 'PUSH';
        body?: string;
    }
) => {
    if (!options) {
        options = {};
    }
    if (!options.headers) {
        options.headers = new Headers({ Accept: 'application/json' });
    }
    const { accessToken } = JSON.parse(localStorage.getItem('auth') as string);
    options.headers.set('Authorization', `Bearer ${accessToken}`);
    // add your own headers here
    options.headers.set('Access-Control-Expose-Headers', 'Content-Range');
    return fetchUtils.fetchJson(url, options);
};

const createResource = async (
    resources: 'articles' | 'customers' | 'invoices',
    data: Record<string, Article | Customer | Invoice>
) => {
    const token = loadToken();
    if (!token) return;
    const response = await fetchJson(`${apiUrl}/fortnox/${resources}`, {
        method: 'POST',
        body: JSON.stringify({ data, access_token: token.access_token }),
    }).catch((reason) => {
        console.log({ reason });
    });

    console.log({ response });
    return response;
};
const createArticle = async (article: Article) => {
    await createResource('articles', { Article: article });
};
const createCustomer = async (customer: Customer) => {
    await createResource('customers', { Customer: customer });
};

/*
const createCustomer = async (customer: Customer) => {
    const { data } = await sendResource('Customers', customer);
};
*/

const InvoiceField = (content: {
    invoice: Invoice | null;
    error: string | null;
    pdf: string | null;
    order: WcOrder;
    currencyRate: number | undefined;
}) => {
    let { invoice, pdf, order, currencyRate } = content;
    let error: string | null = content.error;
    if (!invoice && (!error || error === '')) {
        try {
            invoice = Findus.Invoices.tryCreateInvoice(order, currencyRate);
        } catch (findusError) {
            const message =
                typeof findusError === 'string'
                    ? findusError
                    : (findusError as Error).message;
            if (message !== 'Order was created manually.') {
                error = message;
            } else {
                error = message ?? 'Missing error message';
                if (!content.currencyRate)
                    error += ' Also missing Currency Rate.';
            }
        }
    }

    const calculateVAT = (price: number, priceWithVAT: number): number => {
        if (price === priceWithVAT) return 0;
        return (priceWithVAT - price) / price;
    };

    let customer: Customer | undefined;
    try {
        customer = Findus.Customers.tryCreateCustomer(invoice as Invoice);
    } catch (error) {
        error = (error as Error).message;
    }

    return (
        <TableContainer component={Paper}>
            {error && (
                <>
                    <Typography sx={{ color: 'error' }}>{error}</Typography>
                    <Button
                        onClick={() => {
                            console.log(JSON.stringify(order));
                        }}
                    >
                        Print JSON
                    </Button>
                </>
            )}
            {invoice && (
                <>
                    <Grid container rowSpacing={6}>
                        <Grid item>
                            <Table size="small">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Currency</TableCell>
                                        <TableCell>Currency Rate</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    <TableRow>
                                        <TableCell>
                                            {invoice.Currency}
                                        </TableCell>
                                        <TableCell>
                                            {invoice.CurrencyRate?.toFixed(2)}
                                        </TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                            {customer && (
                                <Button
                                    onClick={async () =>
                                        await createCustomer(
                                            customer as Customer
                                        )
                                    }
                                >
                                    Create Customer
                                </Button>
                            )}
                            {!error && (
                                <Button
                                    onClick={() => {
                                        console.log(JSON.stringify(order));
                                    }}
                                >
                                    Print JSON
                                </Button>
                            )}
                        </Grid>
                        <Grid item>
                            <Table sx={{ maxWidth: 150 }} size="small">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Produkt</TableCell>
                                        <TableCell align="right">
                                            Price
                                        </TableCell>
                                        <TableCell align="right">
                                            Quantity
                                        </TableCell>
                                        <TableCell align="right">
                                            VAT %
                                        </TableCell>
                                        <TableCell align="right">
                                            Account
                                        </TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {invoice.InvoiceRows.map(
                                        (row: InvoiceRow, index: number) => (
                                            <TableRow
                                                key={`${row.ArticleNumber}-${index}`}
                                                sx={{
                                                    '&:last-child td, &:last-child th':
                                                        { border: 0 },
                                                }}
                                            >
                                                <TableCell
                                                    component="th"
                                                    scope="row"
                                                >
                                                    {row.ArticleNumber}
                                                </TableCell>
                                                <TableCell align="right">
                                                    {row.Price.toFixed(2)}
                                                </TableCell>
                                                <TableCell align="right">
                                                    {row.DeliveredQuantity}
                                                </TableCell>
                                                <TableCell align="right">
                                                    {row.VAT
                                                        ? (
                                                              row.VAT * 100
                                                          ).toFixed(2)
                                                        : 0}
                                                </TableCell>
                                                <TableCell align="right">
                                                    {row.AccountNumber}
                                                </TableCell>
                                                <TableCell
                                                    component="th"
                                                    scope="row"
                                                >
                                                    <Button
                                                        onClick={() =>
                                                            createArticle({
                                                                ArticleNumber:
                                                                    row.ArticleNumber +
                                                                    `.Test.${0}`,
                                                                Description:
                                                                    'Test - Delete Me',
                                                            })
                                                        }
                                                    >
                                                        Create Article
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        )
                                    )}
                                </TableBody>
                            </Table>
                        </Grid>
                        <Grid item>
                            <Table sx={{ maxWidth: 150 }} size="small">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>
                                            Total Shipping Cost
                                        </TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    <TableRow>
                                        <TableCell component="th" scope="row">
                                            {invoice.Freight}
                                        </TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </Grid>
                    </Grid>
                </>
            )}
        </TableContainer>
    );
    /*
    <Card sx={{ width: "100%", margin: "auto" }}>
      <CardContent>
        <Grid container spacing={2}>
          <Grid item>{error ? <Typography>{error}</Typography> : null}</Grid>
          <Grid item>
            {invoice ? <Typography>{invoice.City}</Typography> : null}
          </Grid>
          <Grid item>
            <PdfInvoiceField pdfDocument={pdf} />
          </Grid>
        </Grid>
      </CardContent>
    </Card>
    */
};

const getDocument = (pdfBinary: string) => {
    const base64 = Buffer.from(pdfBinary, 'base64');
    return 'data:application/pdf;base64,' + base64;
};

const PdfInvoiceField = (props: { pdfDocument: string | null }) => {
    const { pdfDocument } = props;
    if (!pdfDocument) return null;
    return (
        <>
            <iframe
                src={'data:application/pdf;base64,' + pdfDocument}
                id="displayFile"
                width="100%"
                height="99%"
                style={{ borderStyle: 'solid' }}
            />
            {/* <embed
      src={"data:application/pdf;base64," + pdfDocument}
      id="displayFile"
      width="100%"
      height="99%"
      style={{ borderStyle: "solid" }}
      type="application/pdf"
    /> */}
        </>
    );
};

export default WcOrderShow;
