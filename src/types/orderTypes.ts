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
enum paymentStatus{
    Paid='paid',
    Unpaid='unpaid'
}
export interface KhaltiResponse{
    pidx:string,
    payment_url:string,
    expires_at: Date|string,
    expires_in:number,
    user_fee:number
}