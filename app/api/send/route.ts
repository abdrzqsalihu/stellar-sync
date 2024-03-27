import { EmailTemplate } from "./../../_components/email-template";
import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req) {
  const response = await req.json();
  try {
    const data = await resend.emails.send({
      from: "stellarsync@resend.dev",
      //   to: ["abdrzq.salihu@gmail.com"],
      to: [response.emailToSend],
      subject: response?.userName + " shared a file with you",
      react: EmailTemplate({ response }),
    });

    return Response.json(data);
  } catch (error) {
    return NextResponse.json({ error });
  }
}
