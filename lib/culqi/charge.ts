// CULQI_SECRET_KEY solo se usa server-side — nunca exponer con NEXT_PUBLIC_

interface ChargeParams {
  token: string;
  amount: number;        // en céntimos (soles × 100)
  currency_code: string; // "PEN"
  email: string;
  description: string;
}

interface CulqiCharge {
  id: string;
  amount: number;
  currency_code: string;
  email: string;
  description: string;
  outcome: {
    type: string;
    code: string;
    merchant_message: string;
    user_message: string;
  };
}

export async function createCharge(params: ChargeParams): Promise<CulqiCharge> {
  const secretKey = process.env.CULQI_SECRET_KEY;
  if (!secretKey) {
    throw new Error("CULQI_SECRET_KEY no está configurada");
  }

  const res = await fetch("https://api.culqi.com/v2/charges", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${secretKey}`,
    },
    body: JSON.stringify({
      amount: params.amount,
      currency_code: params.currency_code,
      email: params.email,
      source_id: params.token,
      description: params.description,
    }),
  });

  const data = await res.json();

  if (!res.ok) {
    const culqiError = data?.user_message ?? data?.merchant_message ?? "Error en Culqi";
    throw new Error(culqiError);
  }

  return data as CulqiCharge;
}
