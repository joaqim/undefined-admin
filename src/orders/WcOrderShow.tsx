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
    Expense,
    Invoice,
    InvoiceRow,
    WcOrder,
    WcOrderMetaData,
    WcOrders,
} from 'findus';
import { SimpleListLoadingClasses, useRecordContext } from 'react-admin';
import * as Findus from 'findus';
import CurrencyUtils from '../utils/CurrencyUtils';
import { AppRegistrationOutlined } from '@mui/icons-material';
import Axios from 'axios';
import { loadToken } from '../utils/TokenUtils';
import { fetchUtils } from 'ra-core';
import fetchJson from '../common/fetchJson';
import FortnoxUtils from '../utils/FortnoxUtils';

const WcOrderShow = () => {
    const order: WcOrder = useRecordContext<WcOrder>();

    if (WcOrders.hasInvoiceReference(order)) {
        return <Typography>Order has been added to Fortnox.</Typography>;
    }

    const [currencyRate, setCurrencyRate] = useState<number | undefined>(-1);
    const [invoice, setInvoice] = useState<Invoice | null>(null);
    const [pdf, setPdf] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const [loading, setLoading] = useState(false);

    if (!order) return null;

    //const [pdf, setPdf] = useState<string | null>();

    useEffect(() => {
        if (loading) return;
        /*
    const fetch = async () => {
      const url = Findus.WcOrders.tryGetDocumentLink(order);
      const binaryPdf = await tryFetchPDF(url);
      setPdf(getDocument(binaryPdf));
    };
    fetch();
    */

        const fetchCurrency = async () => {
            setLoading(true);
            CurrencyUtils.fetchCurrencyRate(
                new Date(order.date_paid),
                order.currency
            )
                .then((currencyRate) => {
                    setCurrencyRate(currencyRate);
                })
                .finally(() => {
                    setLoading(false);
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

            if (currencyRate === -1) {
                try {
                    let paymentMethod =
                        Findus.WcOrders.tryGetPaymentMethod(order);
                    if (paymentMethod === 'Stripe') {
                        setCurrencyRate(
                            Findus.WcOrders.tryGetCurrencyRate(order)
                        );
                    } else {
                        fetchCurrency();
                    }
                } catch {
                    fetchCurrency();
                }
                return;
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

            const timezoneOffset = new Date(
                order.date_completed!
            ).getTimezoneOffset();

            setInvoice(
                Findus.Invoices.tryCreateInvoice(
                    order,
                    currencyRate
                    /* timezoneOffset */
                )
            );
        } catch (findusError) {
            const message =
                typeof findusError === 'string'
                    ? findusError
                    : (findusError as Error).message;
            setError(`Failed to create Invoice - ${message}`);
        }
    }, [currencyRate, loading]);

    if (loading) {
        <Typography>Loading Currency...</Typography>;
    }

    // invoice = Findus.Invoices.tryCreateInvoice(order, 1.04);
    // pdf = Findus.WcOrders.tryGetDocumentLink(order)
    // pdf = Findus.WcOrders.getDocumentSource(order)

    return InvoiceField({ invoice, error, pdf, order, currencyRate });
};

const InvoiceField = (content: {
    invoice: Invoice | null;
    error: string | null;
    pdf: string | null;
    order: WcOrder;
    currencyRate: number | undefined;
}) => {
    const [customerNumber, setCustomerNumber] = useState<string | undefined>();

    let { invoice, pdf, order, currencyRate } = content;
    let error: string | null = content.error;
    /* if (!invoice && (!error || error === '')) {
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
                if (!content.currencyRate) error += '\nMissing Currency Rate.';
            }
        }
    } */

    const calculateVAT = (price: number, priceWithVAT: number): number => {
        if (price === priceWithVAT) return 0;
        return (priceWithVAT - price) / price;
    };

    let customer: Customer | undefined;
    try {
        customer = Findus.Customers.tryCreateCustomer(order);
    } catch (error) {
        error = (error as Error).message;
    }

    const paymentMethod: string | undefined =
        WcOrders.tryGetPaymentMethod(order);

    const expense: Expense | undefined =
        paymentMethod && WcOrders.hasPaymentFee(order, paymentMethod)
            ? WcOrders.tryCreatePaymentFeeExpense(order)
            : undefined;

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
                                                        ? row.VAT.toFixed(2)
                                                        : 0}
                                                </TableCell>
                                                <TableCell align="right">
                                                    {row.AccountNumber}
                                                </TableCell>
                                            </TableRow>
                                        )
                                    )}
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
