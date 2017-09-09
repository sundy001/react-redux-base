export default (
    id: string,
    item: string,
    owner: string,
    quantity: number,
    options: ReadonlyArray<app.store.GenericId>,
): app.entity.CartItem => {
    return {
        id,
        item,
        owner,
        quantity,
        options,
    }
};
