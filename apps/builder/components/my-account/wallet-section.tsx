"use client";

import { Button } from "@workspace/ui/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { Plus, ArrowUpRight, ArrowDownLeft } from "@workspace/ui/lucide-react";
import { cn } from "@workspace/ui/lib/utils";

export function WalletSection() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Wallet</h2>
        <p className="mt-2 text-muted-foreground">
          Manage your payment methods and view your balance.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="bg-gradient-to-br border-none shadow-lg md:col-span-2 from-primary to-primary/90 text-primary-foreground">
          <CardHeader>
            <CardTitle className="text-sm font-medium tracking-wider uppercase text-primary-foreground/80">
              Total Balance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-4 text-4xl font-bold">$1,240.50</div>
            <div className="flex gap-4">
              <Button variant="secondary" size="sm" className="gap-2">
                <Plus className="w-4 h-4" />
                Add Funds
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="gap-2 bg-transparent border-primary-foreground/20 hover:bg-primary-foreground/10 text-primary-foreground hover:text-primary-foreground"
              >
                <ArrowUpRight className="w-4 h-4" />
                Withdraw
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="flex flex-col justify-center items-center p-6 text-center border-dashed">
          <div className="flex justify-center items-center mb-4 w-12 h-12 rounded-full bg-muted">
            <Plus className="w-6 h-6 text-muted-foreground" />
          </div>
          <h3 className="mb-1 font-semibold">Add New Card</h3>
          <p className="mb-4 text-sm text-muted-foreground">
            Link a new credit or debit card to your account.
          </p>
          <Button variant="outline" className="w-full bg-transparent">
            Add Method
          </Button>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Payment Methods</CardTitle>
          <CardDescription>
            Your saved cards and payment options.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="flex justify-between items-center p-4 rounded-lg border">
            <div className="flex gap-4 items-center">
              <div className="flex justify-center items-center w-14 h-10 text-xs font-bold text-white rounded bg-slate-900">
                VISA
              </div>
              <div>
                <p className="font-medium">Visa ending in 4242</p>
                <p className="text-sm text-muted-foreground">Expires 12/25</p>
              </div>
            </div>
            <Button variant="ghost" size="sm">
              Edit
            </Button>
          </div>
          <div className="flex justify-between items-center p-4 rounded-lg border">
            <div className="flex gap-4 items-center">
              <div className="h-10 w-14 bg-[#EB001B] rounded flex items-center justify-center text-white font-bold text-xs">
                MC
              </div>
              <div>
                <p className="font-medium">Mastercard ending in 8899</p>
                <p className="text-sm text-muted-foreground">Expires 09/26</p>
              </div>
            </div>
            <Button variant="ghost" size="sm">
              Edit
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
          <CardDescription>History of your wallet activity.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              {
                label: "Top up",
                date: "Today, 10:23 AM",
                amount: "+$500.00",
                type: "credit",
              },
              {
                label: "Purchase #ORD-2024-001",
                date: "Oct 24, 2024",
                amount: "-$129.00",
                type: "debit",
              },
              {
                label: "Refund #ORD-2024-003",
                date: "Sep 29, 2024",
                amount: "+$299.99",
                type: "credit",
              },
            ].map((tx, i) => (
              <div
                key={i}
                className="flex justify-between items-center py-2 border-b last:border-0"
              >
                <div className="flex gap-4 items-center">
                  <div
                    className={cn(
                      "h-8 w-8 rounded-full flex items-center justify-center",
                      tx.type === "credit"
                        ? "bg-green-100 text-green-600"
                        : "bg-red-100 text-red-600"
                    )}
                  >
                    {tx.type === "credit" ? (
                      <ArrowDownLeft className="w-4 h-4" />
                    ) : (
                      <ArrowUpRight className="w-4 h-4" />
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-medium">{tx.label}</p>
                    <p className="text-xs text-muted-foreground">{tx.date}</p>
                  </div>
                </div>
                <span
                  className={cn(
                    "font-medium text-sm",
                    tx.type === "credit" ? "text-green-600" : "text-foreground"
                  )}
                >
                  {tx.amount}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
