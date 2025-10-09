import { NextRequest, NextResponse } from "next/server";
import { dbAdmin } from "../../../../lib/firebase-admin";
import jsPDF from "jspdf";

// Constants for PDF layout
const COLORS = {
  PRIMARY: [80, 86, 253] as [number, number, number],
  BACKGROUND: [248, 249, 250] as [number, number, number],
  BORDER: [220, 220, 220] as [number, number, number],
  TEXT: [0, 0, 0] as [number, number, number],
  TEXT_SECONDARY: [102, 102, 102] as [number, number, number],
  WHITE: [255, 255, 255] as [number, number, number],
};

const FONT_SIZES = {
  TITLE: 28,
  SUBTITLE: 16,
  SECTION_HEADER: 14,
  BODY: 10,
  FOOTER: 8,
};

const MARGINS = {
  LEFT: 20,
  RIGHT: 20,
  TOP: 70,
  SECTION_GAP: 10,
};

interface PaymentData {
  status: string;
  paymentDate: { toDate: () => Date };
  txRef?: string;
  originalCustomer?: { name?: string; email?: string };
  plan?: string;
  amount?: number;
  currency?: string;
}

/**
 * Generates and returns a PDF invoice for a given payment ID.
 * @param req - The Next.js request object.
 * @param params - Contains the paymentId parameter.
 * @returns A PDF response or an error JSON response.
 */
export async function GET(req: NextRequest, { params }: { params: Promise<{ paymentId: string }> }) {
  try {
    const { paymentId } = await params;

    // Fetch payment data
    const paymentDoc = await dbAdmin.collection("payments").doc(paymentId).get();
    if (!paymentDoc.exists) {
      return NextResponse.json({ error: "Payment not found" }, { status: 404 });
    }

    const paymentData = paymentDoc.data() as PaymentData;
    if (paymentData?.status !== "successful") {
      return NextResponse.json(
        { error: "Invoice not available for non-successful payments" },
        { status: 400 }
      );
    }

    // Initialize PDF document
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;
    const pageHeight = doc.internal.pageSize.height;

    // Helper function to add wrapped text and return new Y position
    const addWrappedText = (text: string, x: number, y: number, maxWidth: number): number => {
      const lines = doc.splitTextToSize(text, maxWidth);
      doc.text(lines, x, y);
      return y + lines.length * 5;
    };

    // Header
    doc.setFillColor(...COLORS.PRIMARY);
    doc.rect(0, 0, pageWidth, 50, "F");
    doc.setFontSize(FONT_SIZES.TITLE);
    doc.setTextColor(...COLORS.WHITE);
    doc.text("StellarSync", pageWidth / 2, 25, { align: "center" });
    doc.setFontSize(FONT_SIZES.SUBTITLE);
    doc.text("Invoice", pageWidth / 2, 40, { align: "center" });

    // Reset text color
    doc.setTextColor(...COLORS.TEXT);

    // Invoice details section
    let currentY = MARGINS.TOP;

    // Invoice info box
    doc.setFillColor(...COLORS.BACKGROUND);
    doc.rect(MARGINS.LEFT, currentY, 80, 60, "F");
    doc.setDrawColor(...COLORS.BORDER);
    doc.rect(MARGINS.LEFT, currentY, 80, 60, "S");

    doc.setFontSize(FONT_SIZES.SECTION_HEADER);
    doc.setFont(undefined, "bold");
    doc.text("Invoice Details", MARGINS.LEFT + 5, currentY + 10);

    doc.setFontSize(FONT_SIZES.BODY);
    doc.setFont(undefined, "normal");
    doc.text(`Invoice ID: ${paymentId}`, MARGINS.LEFT + 5, currentY + 25);
    doc.text(
      `Date: ${new Date(paymentData.paymentDate.toDate()).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })}`,
      MARGINS.LEFT + 5,
      currentY + 35
    );

    // Transaction reference
    const txRef = paymentData.txRef || "N/A";
    doc.text("Transaction Ref:", MARGINS.LEFT + 5, currentY + 45);
    if (txRef.length > 15) {
      const shortTxRef = txRef.substring(0, 15) + "...";
      doc.text(shortTxRef, MARGINS.LEFT + 5, currentY + 55);
    } else {
      doc.text(txRef, MARGINS.LEFT + 5, currentY + 55);
    }

    // Customer info box
    doc.setFillColor(...COLORS.BACKGROUND);
    doc.rect(pageWidth - 100, currentY, 80, 60, "F");
    doc.setDrawColor(...COLORS.BORDER);
    doc.rect(pageWidth - 100, currentY, 80, 60, "S");

    doc.setFontSize(FONT_SIZES.SECTION_HEADER);
    doc.setFont(undefined, "bold");
    doc.text("Bill To", pageWidth - 95, currentY + 10);

    doc.setFontSize(FONT_SIZES.BODY);
    doc.setFont(undefined, "normal");
    doc.text(paymentData.originalCustomer?.name || "N/A", pageWidth - 95, currentY + 25);

    // Customer email
    const customerEmail = paymentData.originalCustomer?.email || "N/A";
    if (customerEmail.length > 25) {
      const emailParts = customerEmail.split("@");
      if (emailParts.length === 2) {
        doc.text(emailParts[0], pageWidth - 95, currentY + 35);
        doc.text(`@${emailParts[1]}`, pageWidth - 95, currentY + 45);
      } else {
        currentY = addWrappedText(customerEmail, pageWidth - 95, currentY + 35, 70);
      }
    } else {
      doc.text(customerEmail, pageWidth - 95, currentY + 35);
    }

    // Items table
    currentY = 150;
    doc.setFillColor(...COLORS.PRIMARY);
    doc.rect(MARGINS.LEFT, currentY, pageWidth - MARGINS.LEFT - MARGINS.RIGHT, 15, "F");

    doc.setFontSize(FONT_SIZES.SECTION_HEADER - 2);
    doc.setTextColor(...COLORS.WHITE);
    doc.setFont(undefined, "bold");
    doc.text("Description", MARGINS.LEFT + 5, currentY + 10);
    doc.text("Amount", pageWidth - MARGINS.RIGHT - 30, currentY + 10);

    // Table content
    doc.setFillColor(...COLORS.WHITE);
    doc.rect(MARGINS.LEFT, currentY + 15, pageWidth - MARGINS.LEFT - MARGINS.RIGHT, 20, "F");
    doc.setDrawColor(...COLORS.BORDER);
    doc.rect(MARGINS.LEFT, currentY + 15, pageWidth - MARGINS.LEFT - MARGINS.RIGHT, 20, "S");

    doc.setTextColor(...COLORS.TEXT);
    doc.setFont(undefined, "normal");
    doc.text(
      `${(paymentData.plan || "SUBSCRIPTION").toUpperCase()} Plan`,
      MARGINS.LEFT + 5,
      currentY + 27
    );
    doc.text(
      `${(paymentData.amount || 0).toFixed(2)} ${paymentData.currency || "USD"}`,
      pageWidth - MARGINS.RIGHT - 30,
      currentY + 27
    );

    // Total section
    currentY += 50;
    doc.setFillColor(...COLORS.BACKGROUND);
    doc.rect(pageWidth - 90, currentY, 70, 15, "F");
    doc.setDrawColor(...COLORS.BORDER);
    doc.rect(pageWidth - 90, currentY, 70, 15, "S");

    doc.setFontSize(FONT_SIZES.SECTION_HEADER);
    doc.setFont(undefined, "bold");
    doc.text("Total:", pageWidth - 85, currentY + 10);
    doc.text(
      `${(paymentData.amount || 0).toFixed(2)} ${paymentData.currency || "USD"}`,
      pageWidth - 50,
      currentY + 10
    );

    // Footer
    currentY = pageHeight - 40;
    doc.setFontSize(FONT_SIZES.BODY);
    doc.setTextColor(...COLORS.TEXT_SECONDARY);
    doc.setFont(undefined, "normal");
    doc.text("Thank you for your business!", pageWidth / 2, currentY, { align: "center" });
    doc.text("This is a computer-generated invoice.", pageWidth / 2, currentY + 10, { align: "center" });

    // Add full transaction reference if truncated
    if (txRef.length > 15) {
      doc.setFontSize(FONT_SIZES.FOOTER);
      doc.text(`Full Transaction Reference: ${txRef}`, MARGINS.LEFT, currentY + 20);
    }

    // Generate and return PDF
    const pdfBuffer = Buffer.from(doc.output("arraybuffer"));
    return new NextResponse(pdfBuffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename=StellarSync-invoice-${paymentId}.pdf`,
      },
    });
  } catch (error) {
    console.error("Error generating invoice:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}