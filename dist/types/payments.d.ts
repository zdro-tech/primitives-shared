export interface PaymentEvent {
    paymentId: string;
    userId: string;
    threadId: string;
    intentId: string;
}
export interface PaymentIntent {
    id: number;
    paymentId: string;
    userId: string;
    intentId: string;
    clientSecret: string;
    createdAt: string;
}
//# sourceMappingURL=payments.d.ts.map