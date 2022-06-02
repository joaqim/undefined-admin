import React, { useEffect, useState } from "react";
import { Box, Card, CardContent, Grid, Typography } from "@mui/material";
import { Invoice, MetaData, WcOrder, WcOrders } from "findus";
import { useRecordContext } from "react-admin";
import * as Findus from "findus";
import tryFetchPDF from "../utils/fetchPDF";

const WcOrderShow = () => {
  const order: WcOrder = useRecordContext<WcOrder>();

  if (!order) return null;

  //const [pdf, setPdf] = useState<string | null>();

  let invoice: Invoice | null = null;
  let error: string | null = null;
  let pdf: string | null = null;

  useEffect(() => {
    /*
    const fetch = async () => {
      const url = Findus.WcOrders.tryGetDocumentLink(order);
      const binaryPdf = await tryFetchPDF(url);
      setPdf(getDocument(binaryPdf));
    };
    fetch();
    */
  }, []);

  try {
    invoice = Findus.Invoices.tryCreateInvoice(order, 1.04);
    //pdf = Findus.WcOrders.tryGetDocumentLink(order)
    // pdf = Findus.WcOrders.getDocumentSource(order)
    let pdf = order.meta_data.find(
      (entry: MetaData) => entry.key === "pdf_invoice_source"
    )?.value as string;

    console.log({ pdf });
    console.log({meta_data: order.meta_data})
    /*
      const binaryPdf = await tryFetchPDF(url);
      pdf = getDocument(binaryPdf);
      */
  } catch (findusError: unknown) {
    //error = findusError as string;
    error = (findusError as Error).message;
  }

  return InvoiceField({ invoice, error, pdf });
};

const InvoiceField = (content: {
  invoice: Invoice | null;
  error: string | null;
  pdf: string | null;
}) => {
  const { invoice, error, pdf } = content;
  if (!invoice && !error) return null;

  return (
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
  );
};

const getDocument = (pdfBinary: string) => {
  const base64 = Buffer.from(pdfBinary, "base64");
  return "data:application/pdf;base64," + base64;
};

const PdfInvoiceField = (props: { pdfDocument: string | null }) => {
  const { pdfDocument } = props;
  if (!pdfDocument) return null;
  return (
    <embed
      src={pdfDocument}
      id="displayFile"
      width="100%"
      height="99%"
      style={{ borderStyle: "solid" }}
      type="application/pdf"
    />
  );
};

export default WcOrderShow;
