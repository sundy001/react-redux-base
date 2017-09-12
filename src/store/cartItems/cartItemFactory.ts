export default (
    id: string,
    item: string,
    cart: string,
    quantity: number,
    options: ReadonlyArray<app.store.GenericId>,
): app.entity.CartItem => {
    return {
        id,
        item,
        cart,
        quantity,
        options,
    }
};
