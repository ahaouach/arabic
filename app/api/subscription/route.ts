import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { validateOrigin } from "@/lib/auth";
import { getSessionUser, unauthorized, badRequest } from "@/lib/api-auth";

const upgradeSchema = z.object({
  planId: z.string().min(1),
});

// GET /api/subscription — return the current user's subscription and invoices
export async function GET(request: NextRequest) {
  const session = await getSessionUser(request);
  if (!session) return unauthorized();

  const subscription = await prisma.subscription.findUnique({
    where: { userId: session.sub },
    include: {
      invoices: { orderBy: { date: "desc" } },
    },
  });

  if (!subscription) {
    return NextResponse.json({ subscription: null, invoices: [] });
  }

  return NextResponse.json({
    subscription: {
      planId: subscription.planId,
      status: subscription.status,
      startDate: subscription.startDate.toISOString().split("T")[0],
      renewalDate: subscription.renewalDate.toISOString().split("T")[0],
    },
    invoices: subscription.invoices.map((inv) => ({
      id: inv.id,
      date: inv.date.toISOString().split("T")[0],
      amount: inv.amount,
      currency: inv.currency,
      plan: inv.plan,
      status: inv.status,
    })),
  });
}

// POST /api/subscription — create or upgrade a subscription
export async function POST(request: NextRequest) {
  if (!validateOrigin(request)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const session = await getSessionUser(request);
  if (!session) return unauthorized();

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return badRequest("Invalid request body");
  }

  const result = upgradeSchema.safeParse(body);
  if (!result.success) {
    return badRequest(result.error.issues[0]?.message ?? "Validation failed");
  }

  const { planId } = result.data;

  const now = new Date();
  const renewalDate = new Date(now);
  renewalDate.setDate(renewalDate.getDate() + 30);

  // Upsert subscription
  const subscription = await prisma.subscription.upsert({
    where: { userId: session.sub },
    update: {
      planId,
      status: "active",
      startDate: now,
      renewalDate,
    },
    create: {
      userId: session.sub,
      planId,
      status: "active",
      startDate: now,
      renewalDate,
    },
  });

  // Create invoice record
  // Plan amount lookup — kept simple here; in production use Stripe webhook
  const PLAN_AMOUNTS: Record<string, { amount: number; name: string }> = {
    "individual-monthly":   { amount: 129, name: "Individual Monthly"   },
    "individual-6months":   { amount: 119, name: "Individual 6 Months"  },
    "individual-12months":  { amount: 99,  name: "Individual 12 Months" },
    "group-conversation":   { amount: 39,  name: "Conversation Club"    },
    "group-quran":          { amount: 39,  name: "Quran Group"          },
  };

  const planInfo = PLAN_AMOUNTS[planId] ?? { amount: 0, name: planId };

  const invoice = await prisma.invoice.create({
    data: {
      subscriptionId: subscription.id,
      userId: session.sub,
      amount: planInfo.amount,
      plan: planInfo.name,
      currency: "€",
      status: "paid",
    },
  });

  return NextResponse.json({
    subscription: {
      planId: subscription.planId,
      status: subscription.status,
      startDate: subscription.startDate.toISOString().split("T")[0],
      renewalDate: subscription.renewalDate.toISOString().split("T")[0],
    },
    invoice: {
      id: invoice.id,
      date: invoice.date.toISOString().split("T")[0],
      amount: invoice.amount,
      currency: invoice.currency,
      plan: invoice.plan,
      status: invoice.status,
    },
  }, { status: 201 });
}
