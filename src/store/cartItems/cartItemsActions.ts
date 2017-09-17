export const ADD_CART_ITEM = 'ADD_CART_ITEM';
export const UPDATE_CART_ITEM_QUANTITY = 'UPDATE_CART_ITEM_QUANTITY';
export const UPDATE_CART_ITEM_OPTIONS = 'UPDATE_CART_ITEM_OPTIONS';
export const REMOVE_CART_ITEM = 'REMOVE_CART_ITEM';

export const addCartItem = (
    item: string,
    cart: string,
    quantity: number,
    options: ReadonlyArray<app.store.GenericId>,
): AddCartItemAction => ({
    item,
    cart,
    quantity,
    options,
    type: ADD_CART_ITEM,
});

export const updateCartItemQuantity = (
    id: string,
    quantity: number,
): UpdateCartItemQuantityAction => ({
    id,
    quantity,
    type: UPDATE_CART_ITEM_QUANTITY,
});

export const updateCartItemOptions = (
    id: string,
    options:ReadonlyArray<app.store.GenericId>,
    quantityMap: OwnerQuantityMap,
): UpdateCartItemOptionsAction => ({
    id,
    options,
    quantityMap,
    type: UPDATE_CART_ITEM_OPTIONS,
});

export const removeCartItem = (
    id: string,
): RemoveCartItemAction => ({
    id,
    type: REMOVE_CART_ITEM,
});

export interface AddCartItemAction {
    readonly type: 'ADD_CART_ITEM';
    readonly item: string;
    readonly cart: string;
    readonly quantity: number;
    readonly options: ReadonlyArray<app.store.GenericId>;
}

export interface UpdateCartItemQuantityAction {
    readonly type: 'UPDATE_CART_ITEM_QUANTITY';
    readonly id: string;
    readonly quantity: number;
}

export interface UpdateCartItemOptionsAction {
    readonly type: 'UPDATE_CART_ITEM_OPTIONS';
    readonly id: string;
    readonly options:ReadonlyArray<app.store.GenericId>;
    readonly quantityMap: OwnerQuantityMap;
}

export interface RemoveCartItemAction {
    readonly type: 'REMOVE_CART_ITEM';
    readonly id: string;
}

type OwnerQuantityMap = { [owenerId: string]: number };
