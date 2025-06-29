import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { amount, userId, email, plan } = await req.json();

  const res = await fetch("https://api.flutterwave.com/v3/payments", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.FLW_SECRET_KEY}`,
    },
    body: JSON.stringify({
      tx_ref: `${userId}-${Date.now()}`,
      amount,
      currency: "USD",
      redirect_url: `${process.env.NEXT_PUBLIC_APP_URL}/api/payment/verify`,
      payment_options: "card,account,banktransfer,ussd",
      customer: { email },
      meta: { userId, plan },
      customizations: {
        title: "Upgrade Plan",
        description: `Upgrade to ${plan} Plan`,
        logo: `${process.env.NEXT_PUBLIC_APP_URL}/favicon.png`,
      },
    }),
  });

  const data = await res.json();

  return NextResponse.json({ link: data?.data?.link });
}
