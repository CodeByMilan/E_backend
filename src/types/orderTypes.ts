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