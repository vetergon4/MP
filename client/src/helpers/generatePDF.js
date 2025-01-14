import React from 'react';
import { PDFDownloadLink, Document, Page, Text, View } from '@react-pdf/renderer';

const InvoiceDocument = ({ receipt, user, vessel }) => (
  <Document>
    <Page>
      <View>
        <Text>Berth: {receipt.totalPrice}</Text>
        <Text>Date: {receipt.date}</Text>
        <Text>Name: {user.name} {user.surname}</Text>
        <Text>Vessel: {vessel.nameOfVessel}, {vessel.registernumber}</Text>
      </View>
    </Page>
  </Document>
);

export const generatePDF = (receipt, user, vessel) => {
  // Render the PDF document using react-pdf
  const pdfContent = (
    <InvoiceDocument receipt={receipt} user={user} vessel={vessel} />
  );

  // Render the PDF document to a blob
  const pdfBlob = new Blob([pdfContent], { type: 'application/pdf' });

  // Create a download link
  const downloadLink = document.createElement('a');
  downloadLink.href = URL.createObjectURL(pdfBlob);
  downloadLink.download = 'invoice.pdf';

  // Append the download link to the body and trigger the download
  document.body.appendChild(downloadLink);
  downloadLink.click();

  // Clean up: remove the download link from the body
  document.body.removeChild(downloadLink);
};
