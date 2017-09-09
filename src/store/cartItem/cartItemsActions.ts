export const ADD_CART_ITEM = 'ADD_CART_ITEM';
export const UPDATE_CART_ITEM_QUANTITY = 'UPDATE_CART_ITEM_QUANTITY';
export const UPDATE_CART_ITEM_OPTIONS = 'UPDATE_CART_ITEM_OPTIONS';
export const REMOVE_CART_ITEM = 'REMOVE_CART_ITEM';

export const addCartItem = (
    id: string,
    item: string,
    owner: string,
    quantity: number,
    options: ReadonlyArray<app.store.GenericId>,
): AddCartItemAction => ({
    type: ADD_CART_ITEM,
    id,
    item,
    owner,
    quantity,
    options,
});

export const updateCartItemQuantity = (
    id: string,
    quantity: number,
): UpdateCartItemQuantityAction => ({
    type: UPDATE_CART_ITEM_QUANTITY,
    id,
    quantity,
});

export const updateCartItemOptions = (
    id: string,
    options:ReadonlyArray<app.store.GenericId>,
    quantityMap: OwnerQuantityMap,
): UpdateCartItemOptionsAction => ({
    type: UPDATE_CART_ITEM_OPTIONS,
    id,
    options,
    quantityMap,
});

export const removeCartItem = (
    id: string
): RemoveCartItemAction => ({
    type: REMOVE_CART_ITEM,
    id,
});

export interface AddCartItemAction {
    readonly type: 'ADD_CART_ITEM';
    readonly id: string;
    readonly item: string;
    readonly owner: string;
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
