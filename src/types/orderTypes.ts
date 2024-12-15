export interface OrderData{
    phoneNumber:string
    shippingAddress:string,
    totalAmount:number,
    paymentDetails:{
        paymentMethod:PaymentMethod,
        paymentStatus?:paymentStatus,
        pidx?:string

    },
    items:OrderDetails[]

}
export interface OrderDetails{
    quantity:number,
    productId:string
} 
export enum PaymentMethod{
    Cod='cod',
    Khalti='khalti',
    Esewa='esewa'
}
export enum paymentStatus{
    paid='paid',
    unpaid='unpaid'
}
export interface KhaltiResponse{
    pidx:string,
    payment_url:string,
    expires_at: Date|string,
    expires_in:number,
    user_fee:number
}
export interface TransactionVerificationResponse{
    pidx: string,
    total_amount: number,
    status: TransactionStatus,
    transaction_id: string,
    fee: number,
    refunded: boolean
}
export enum TransactionStatus{
    Completed='Completed',
    Refunded ='Refunded',
    Pending='Pending',
    initiated='Initiated'
}
export enum OrderStatus{
    Pending='pending',
  Ontheway='ontheway',
    Delivered='delivered',
    Cancelled='cancelled',
    Preparation ='preparation'
}