/**
 * PDF Generator for Production Planning Plugin
 * Generates printable order sheets in PDF format
 */

import type { PrintableOrder } from './types';

/**
 * Generate HTML for order sheet
 * This HTML can be converted to PDF using a PDF library
 */
export function generateOrderSheetHTML(order: PrintableOrder): string {
  const itemsHTML = order.items
    .map(
      (item) => `
    <tr>
      <td style="padding: 8px; border-bottom: 1px solid #ddd;">${item.articleNumber}</td>
      <td style="padding: 8px; border-bottom: 1px solid #ddd;">${item.productName}</td>
      <td style="padding: 8px; border-bottom: 1px solid #ddd; text-align: right;">${item.quantity}</td>
      <td style="padding: 8px; border-bottom: 1px solid #ddd; text-align: right;">${item.unitPrice.toFixed(2)}</td>
      <td style="padding: 8px; border-bottom: 1px solid #ddd; text-align: right; font-weight: bold;">${item.totalPrice.toFixed(2)}</td>
    </tr>
  `
    )
    .join('');

  const html = `
<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Order Sheet - ${order.orderNumber}</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      margin: 0;
      padding: 20px;
      background-color: #fff;
    }
    
    .container {
      max-width: 800px;
      margin: 0 auto;
      background-color: #fff;
      border: 1px solid #ddd;
      padding: 30px;
    }
    
    .header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 30px;
      border-bottom: 2px solid #333;
      padding-bottom: 15px;
    }
    
    .company-info h1 {
      margin: 0;
      font-size: 28px;
      color: #333;
    }
    
    .company-info p {
      margin: 5px 0;
      color: #666;
      font-size: 12px;
    }
    
    .order-info {
      text-align: right;
    }
    
    .order-info h2 {
      margin: 0 0 10px 0;
      font-size: 18px;
      color: #333;
    }
    
    .order-info p {
      margin: 3px 0;
      color: #666;
      font-size: 12px;
    }
    
    .status-badge {
      display: inline-block;
      padding: 5px 10px;
      border-radius: 4px;
      font-weight: bold;
      font-size: 12px;
      margin-top: 5px;
    }
    
    .status-neu {
      background-color: #FFC107;
      color: #333;
    }
    
    .status-in-bearbeitung {
      background-color: #2196F3;
      color: white;
    }
    
    .status-fertig {
      background-color: #4CAF50;
      color: white;
    }
    
    .customer-section {
      margin-bottom: 30px;
    }
    
    .customer-section h3 {
      margin: 0 0 10px 0;
      font-size: 14px;
      font-weight: bold;
      color: #333;
      text-transform: uppercase;
      border-bottom: 1px solid #ddd;
      padding-bottom: 5px;
    }
    
    .customer-info {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
      font-size: 12px;
    }
    
    .customer-info p {
      margin: 3px 0;
    }
    
    .customer-info strong {
      display: block;
      font-weight: bold;
      margin-bottom: 5px;
    }
    
    .items-section {
      margin-bottom: 30px;
    }
    
    .items-section h3 {
      margin: 0 0 10px 0;
      font-size: 14px;
      font-weight: bold;
      color: #333;
      text-transform: uppercase;
      border-bottom: 1px solid #ddd;
      padding-bottom: 5px;
    }
    
    table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 20px;
    }
    
    table thead {
      background-color: #f5f5f5;
    }
    
    table th {
      padding: 10px 8px;
      text-align: left;
      font-weight: bold;
      font-size: 12px;
      border-bottom: 2px solid #333;
    }
    
    table td {
      padding: 8px;
      font-size: 12px;
    }
    
    .totals {
      display: flex;
      justify-content: flex-end;
      margin-bottom: 30px;
    }
    
    .totals-box {
      width: 250px;
      border: 2px solid #333;
      padding: 15px;
      text-align: right;
    }
    
    .totals-box p {
      margin: 5px 0;
      font-size: 12px;
    }
    
    .totals-box .total-amount {
      font-size: 18px;
      font-weight: bold;
      color: #4CAF50;
      margin-top: 10px;
      padding-top: 10px;
      border-top: 1px solid #ddd;
    }
    
    .footer {
      margin-top: 30px;
      padding-top: 15px;
      border-top: 1px solid #ddd;
      font-size: 10px;
      color: #999;
      text-align: center;
    }
    
    .footer p {
      margin: 3px 0;
    }
    
    @media print {
      body {
        margin: 0;
        padding: 0;
      }
      
      .container {
        border: none;
        box-shadow: none;
      }
    }
  </style>
</head>
<body>
  <div class="container">
    <!-- Header -->
    <div class="header">
      <div class="company-info">
        <h1>${order.companyInfo.name}</h1>
        <p>${order.companyInfo.address}</p>
        <p>Tel: ${order.companyInfo.phone}</p>
        <p>Email: ${order.companyInfo.email}</p>
      </div>
      <div class="order-info">
        <h2>AUFTRAGSBLATT</h2>
        <p><strong>Auftragsnummer:</strong> ${order.orderNumber}</p>
        <p><strong>Datum:</strong> ${order.orderDate}</p>
        <div class="status-badge status-${order.status.toLowerCase().replace(/\\s+/g, '-')}">
          ${order.status}
        </div>
      </div>
    </div>
    
    <!-- Customer Information -->
    <div class="customer-section">
      <h3>Kundendaten</h3>
      <div class="customer-info">
        <div>
          <strong>Kunde:</strong>
          <p>${order.customer.name}</p>
          ${order.customer.contactPerson ? `<p><strong>Ansprechpartner:</strong> ${order.customer.contactPerson}</p>` : ''}
          ${order.customer.address ? `<p><strong>Adresse:</strong> ${order.customer.address}</p>` : ''}
        </div>
        <div>
          ${order.customer.email ? `<p><strong>Email:</strong> ${order.customer.email}</p>` : ''}
          ${order.customer.phone ? `<p><strong>Telefon:</strong> ${order.customer.phone}</p>` : ''}
        </div>
      </div>
    </div>
    
    <!-- Order Items -->
    <div class="items-section">
      <h3>Auftragspositionen</h3>
      <table>
        <thead>
          <tr>
            <th>Artikelnummer</th>
            <th>Produktname</th>
            <th style="text-align: right;">Menge</th>
            <th style="text-align: right;">Einzelpreis</th>
            <th style="text-align: right;">Gesamtpreis</th>
          </tr>
        </thead>
        <tbody>
          ${itemsHTML}
        </tbody>
      </table>
    </div>
    
    <!-- Totals -->
    <div class="totals">
      <div class="totals-box">
        <p><strong>Gesamtsumme:</strong></p>
        <p class="total-amount">${order.totalAmount.toFixed(2)} €</p>
      </div>
    </div>
    
    <!-- Footer -->
    <div class="footer">
      <p>Dieses Auftragsblatt wurde automatisch generiert.</p>
      <p>Generiert am: ${new Date().toLocaleString('de-DE')}</p>
    </div>
  </div>
</body>
</html>
  `;

  return html;
}

/**
 * Generate plain text version of order sheet
 * Useful for email or text-based output
 */
export function generateOrderSheetText(order: PrintableOrder): string {
  const lines: string[] = [];

  lines.push('═'.repeat(80));
  lines.push(`${order.companyInfo.name.toUpperCase()}`);
  lines.push(`${order.companyInfo.address}`);
  lines.push(`Tel: ${order.companyInfo.phone} | Email: ${order.companyInfo.email}`);
  lines.push('═'.repeat(80));
  lines.push('');

  lines.push('AUFTRAGSBLATT');
  lines.push(`Auftragsnummer: ${order.orderNumber}`);
  lines.push(`Datum: ${order.orderDate}`);
  lines.push(`Status: ${order.status}`);
  lines.push('');

  lines.push('KUNDENDATEN');
  lines.push('-'.repeat(80));
  lines.push(`Kunde: ${order.customer.name}`);
  if (order.customer.contactPerson) {
    lines.push(`Ansprechpartner: ${order.customer.contactPerson}`);
  }
  if (order.customer.address) {
    lines.push(`Adresse: ${order.customer.address}`);
  }
  if (order.customer.email) {
    lines.push(`Email: ${order.customer.email}`);
  }
  if (order.customer.phone) {
    lines.push(`Telefon: ${order.customer.phone}`);
  }
  lines.push('');

  lines.push('AUFTRAGSPOSITIONEN');
  lines.push('-'.repeat(80));
  lines.push(
    `${'Artikelnummer'.padEnd(15)} ${'Produktname'.padEnd(30)} ${'Menge'.padEnd(8)} ${'Preis'.padEnd(12)} ${'Gesamt'.padEnd(12)}`
  );
  lines.push('-'.repeat(80));

  order.items.forEach((item) => {
    lines.push(
      `${item.articleNumber.padEnd(15)} ${item.productName.padEnd(30)} ${item.quantity.toString().padEnd(8)} €${item.unitPrice.toFixed(2).padEnd(11)} €${item.totalPrice.toFixed(2).padEnd(11)}`
    );
  });

  lines.push('-'.repeat(80));
  lines.push(`${'GESAMTSUMME:'.padEnd(53)} €${order.totalAmount.toFixed(2)}`);
  lines.push('═'.repeat(80));
  lines.push('');
  lines.push(`Generiert am: ${new Date().toLocaleString('de-DE')}`);

  return lines.join('\n');
}

/**
 * Generate JSON representation of order for API responses
 */
export function generateOrderSheetJSON(order: PrintableOrder): Record<string, any> {
  return {
    orderNumber: order.orderNumber,
    orderDate: order.orderDate,
    status: order.status,
    customer: {
      name: order.customer.name,
      address: order.customer.address || '',
      contactPerson: order.customer.contactPerson || '',
      email: order.customer.email || '',
      phone: order.customer.phone || '',
    },
    items: order.items.map((item) => ({
      articleNumber: item.articleNumber,
      productName: item.productName,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
      totalPrice: item.totalPrice,
    })),
    totalAmount: order.totalAmount,
    companyInfo: {
      name: order.companyInfo.name,
      address: order.companyInfo.address,
      phone: order.companyInfo.phone,
      email: order.companyInfo.email,
    },
    generatedAt: new Date().toISOString(),
  };
}

/**
 * Generate CSV representation of order items
 */
export function generateOrderItemsCSV(order: PrintableOrder): string {
  const headers = ['Artikelnummer', 'Produktname', 'Menge', 'Einzelpreis', 'Gesamtpreis'];
  const rows = order.items.map((item) => [
    `"${item.articleNumber}"`,
    `"${item.productName}"`,
    item.quantity.toString(),
    item.unitPrice.toFixed(2),
    item.totalPrice.toFixed(2),
  ]);

  const csv = [headers.join(','), ...rows.map((row) => row.join(','))].join('\n');

  return csv;
}
