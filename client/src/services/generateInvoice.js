
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import marineproLogo from "./marinepro-logo.png";

const generateInvoice = (buoy, buyer, selectedServices) => {

  const service = selectedServices[0];

  //create servicedate, date is now
  const serviceDate = new Date();
  const formattedDate = `${String(serviceDate.getDate()).padStart(2, '0')}.${String(serviceDate.getMonth() + 1).padStart(2, '0')}.${serviceDate.getFullYear()}`;

  const pdf = new jsPDF();

  // Add logo
  const logo = new Image();
  logo.src = marineproLogo;
  // Logo needs to be squared but put it in the right corner
  pdf.addImage(logo, 'PNG', 160, 10, 30, 30);

  // Set up the header
  pdf.setFontSize(36);
  pdf.text('Invoice', 20, 20);

  // Company information
  pdf.setFontSize(12);
  pdf.text('Company: MarinePro', 20, 35);
  pdf.text('Mail: marine@pro.com', 20, 40);
  pdf.text(`Date: ${formattedDate}`, 20, 45);

  // Add buyer information
  pdf.text(`Name: ${buyer.name}`, 20, 55);
  pdf.text(`Email: ${buyer.email}`, 20, 60);
  pdf.text(`Personal Identification Number: ${buyer.personalIdentificationNumber}`, 20, 65);
  pdf.text(`Tax Number: ${buyer.taxNumber}`, 20, 70);

  // Add invoice number and date
  // Set random invoice number
  const invoiceNumber = Math.floor(Math.random() * 1000000000);
  pdf.text(`Invoice Number: ${invoiceNumber}`, 150, 55);


  // Add table headers
  const headers = [['Service', 'Date', 'Quantity', 'Price', 'Total']];
  const data = [["Berth", formattedDate, '1', `$${buoy.price}`, `$${buoy.price}`]];

  pdf.autoTable({
    head: headers,
    body: data,
    startY: 85,
    styles: { halign: 'center' },
    headStyles: { fillColor: [217, 217, 217] }
  });

  // Add total price
  pdf.setFontSize(14);
  pdf.text(`Total amount: $${buoy.price}`, 20, pdf.autoTable.previous.finalY + 10);

  // Add notes section
  pdf.text('Notes:', 20, pdf.autoTable.previous.finalY + 50);
  pdf.line(20, pdf.autoTable.previous.finalY + 55, 200, pdf.autoTable.previous.finalY + 55); // Horizontal line

  pdf.text('Signature:', 150, pdf.autoTable.previous.finalY + 70);
  pdf.line(180, pdf.autoTable.previous.finalY + 70, 200, pdf.autoTable.previous.finalY + 70); // Horizontal line for signature

  // Add footer
  pdf.setFontSize(10);
  pdf.text('Thank you!', 20, pdf.autoTable.previous.finalY + 90);
  pdf.text('marine-pro.vercel.app', 20, pdf.autoTable.previous.finalY + 95);

  // Save the PDF
  pdf.save('invoice.pdf');
  const pdfBlob = new Blob([pdf.output('blob')], { type: 'application/pdf' });

  //console.log('Client-side Blob data:', pdfBlob);

  return pdfBlob;
};

export default generateInvoice;
