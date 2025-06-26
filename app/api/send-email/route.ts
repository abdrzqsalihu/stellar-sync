import * as nodemailer from 'nodemailer';
import { NextRequest, NextResponse } from 'next/server';
import { dbAdmin } from '../../../lib/firebase-admin';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { to, fileId, password, senderName } = body;

    // Create transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    });

    const fileLink = `https://stellar-sync.vercel.app/preview/${fileId}`;
    
    const mailOptions = {
      from: `"Stellar Sync" <${process.env.GMAIL_USER}>`,
      to: to,
      subject: 'File shared with you',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="margin: 0; padding: 40px 20px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif; background-color: #fafafa; line-height: 1.6;">
          
          <div style="max-width: 500px; margin: 0 auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);">
            
            <!-- Header -->
            <div style="padding: 32px 32px 24px; text-align: center; border-bottom: 1px solid #f1f1f1;">
              <h1 style="margin: 0; font-size: 24px; font-weight: 600; color: #111;">File shared with you</h1>
              ${senderName ? `<p style="margin: 12px 0 0; color: #666; font-size: 15px;"><strong>${senderName}</strong> shared a file with you</p>` : '<p style="margin: 8px 0 0; color: #666; font-size: 15px;">Click below to access your file</p>'}
            </div>

            <!-- Content -->
            <div style="padding: 32px;">
              
              <!-- CTA Button -->
              <div style="text-align: center; margin-bottom: 32px;">
                <a href="${fileLink}" 
                   style="display: inline-block; background: #5056FD; color: white; padding: 12px 30px; text-decoration: none; border-radius: 8px; font-weight: 500; font-size: 15px;">
                  Open File
                </a>
              </div>

              ${password ? `
              <!-- Password -->
              <div style="background: #fef9e7; border: 1px solid #f7d794; border-radius: 8px; padding: 18px; text-align: center; margin-bottom: 24px;">
                <p style="margin: 0 0 12px; color: #8b6914; font-size: 14px; font-weight: 500;">Password required</p>
                <code style="font-family: ui-monospace, 'SF Mono', Consolas, monospace; font-size: 18px; font-weight: 600; color: #111; background: white; padding: 8px 16px; border-radius: 6px; border: 1px solid #e5e5e5;">
                  ${password}
                </code>
              </div>
              ` : ''}

              <!-- Link fallback -->
              <div style="padding: 16px; background: #f8f8f8; border-radius: 6px; margin-top: 24px;">
                <p style="margin: 0 0 8px; font-size: 12px; color: #666; text-transform: uppercase; letter-spacing: 0.5px; font-weight: 500;">Or copy this link</p>
                <p style="margin: 0; font-family: ui-monospace, monospace; font-size: 12px; color: #888; word-break: break-all;">${fileLink}</p>
              </div>

            </div>

            <!-- Footer -->
            <div style="padding: 20px 32px; background: #fafafa; border-top: 1px solid #f1f1f1; text-align: center;">
              <p style="margin: 0; font-size: 13px; color: #888;">
                 Sent via <a href="https://stellar-sync.vercel.app" style="color: #5056FD; text-decoration: none;"> <strong style="color: #5056FD;">Stellar Sync</strong></a>
              </p>
            </div>

          </div>

        </body>
        </html>
      `,
    };

    await transporter.sendMail(mailOptions);

    await dbAdmin.collection("uploadedFiles").doc(fileId).update({ shared: true });
    
    return NextResponse.json({ 
      success: true, 
      message: 'Email sent successfully' 
    });
    
  } catch (error) {
    console.error('Email sending error:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to send email',
        details: error instanceof Error ? error.message : 'Unknown error'
      }, 
      { status: 500 }
    );
  }
}