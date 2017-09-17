import {
    ADD_CART_ITEM,
    UPDATE_CART_ITEM_QUANTITY,
    UPDATE_CART_ITEM_OPTIONS,
    REMOVE_CART_ITEM,
    AddCartItemAction,
    UpdateCartItemQuantityAction,
    UpdateCartItemOptionsAction,
    RemoveCartItemAction,
} from './cartItemsActions';
import { assertEntityExist, assertEntitiesExist } from 'services/assets';
import { findIdentityItem, isSameOptions } from 'services/cart';
import { generateEntityId } from 'services/storeUtil';
import createCartItem from './cartItemFactory';

const removeCartItem = (
    state: app.store.ReadonlyStore<app.entity.CartItem>,
    id: string,
): app.store.ReadonlyStore<app.entity.CartItem> => {
    assertEntityExist('cartItems', state, id);

    const byId: app.store.IdStore<app.entity.CartItem> = { ...state.byId };
    delete byId[id];

    return {
        byId,
        allIds: state.allIds.filter(theId => theId !== id),
        idCounter: state.idCounter,
    };
};

const updateCartItemQuantityAndOptions = (
    state: app.store.ReadonlyStore<app.entity.CartItem>,
    id: string,
    quantity: number,
    options?: ReadonlyArray<app.store.GenericId>,
): app.store.ReadonlyStore<app.entity.CartItem> => {
    const item = {
        ...state.byId[id],
        quantity,
    };

    if (options !== undefined) {
        item.options = options;
    }

    return {
        byId: {
            ...state.byId,
            [id]: item,
        },
        allIds: state.allIds,
        idCounter: state.idCounter,
    };
};

const updateCartItem = (
    state: app.store.ReadonlyStore<app.entity.CartItem>,
    id: string,
    quantity: number,
    options?: ReadonlyArray<app.store.GenericId>,
): app.store.ReadonlyStore<app.entity.CartItem> => {
    assertEntityExist('cartItems', state, id);

    const cartItem = state.byId[id];
    const isOptionsNoUpdate = (options === undefined || isSameOptions(cartItem.options, options));

    if (quantity === cartItem.quantity && isOptionsNoUpdate) {
        return state;
    } else if (quantity <= 0) {
        return removeCartItem(state, id);
    } else if (options !== undefined) {
        const existingItemId = findIdentityItem(options, cartItem.item, cartItem.cart, state.byId);

        if (existingItemId === undefined || existingItemId === id) {
            return updateCartItemQuantityAndOptions(state, id, quantity, options);
        } else {
            const tempState = removeCartItem(state, id);
            return updateCartItemQuantityAndOptions(
                tempState,
                existingItemId,
                state.byId[existingItemId].quantity + quantity,
            );
        }
    } else {
        return updateCartItemQuantityAndOptions(state, id, quantity);
    }
};

const addCartItem = (
    state: app.store.ReadonlyStore<app.entity.CartItem>,
    item: string,
    cart: string,
    quantity: number,
    options: ReadonlyArray<app.store.GenericId>,
): app.store.ReadonlyStore<app.entity.CartItem> => {
    if (quantity <= 0) {
        return state;
    }

    const existingItemId = findIdentityItem(options, item, cart, state.byId);
    const id = generateEntityId('cartItem', state.idCounter);

    if (existingItemId === undefined) {
        return {
            byId: {
                ...state.byId,
                [id]: createCartItem(id, item, cart, quantity, options),
            },
            allIds: [...state.allIds, id],
            idCounter: state.idCounter + 1,
        };
    } else {
        return updateCartItem(state, existingItemId, state.byId[existingItemId].quantity + quantity);
    }
};

const addCartItemByAction = (
    state: app.store.ReadonlyStore<app.entity.CartItem>,
    action: AddCartItemAction,
): app.store.ReadonlyStore<app.entity.CartItem> => {
    return addCartItem(state, action.item, action.cart, action.quantity, action.options);
};

const updateCartItemQuantityByAction = (
    state: app.store.ReadonlyStore<app.entity.CartItem>,
    action: UpdateCartItemQuantityAction,
): app.store.ReadonlyStore<app.entity.CartItem> => {
    return updateCartItem(state, action.id, action.quantity);
};

const updateCartItemOptionsByAction = (
    state: app.store.ReadonlyStore<app.entity.CartItem>,
    action: UpdateCartItemOptionsAction,
): app.store.ReadonlyStore<app.entity.CartItem> => {
    assertEntityExist('cartItems', state, action.id);

    const targetCartItem = state.byId[action.id];

    let resultState = state;
    Object.keys(action.quantityMap).forEach(cart => {
        const quantity = action.quantityMap[cart];

        resultState = cart === targetCartItem.cart
            ? updateCartItem(resultState, action.id, quantity, action.options)
            : addCartItem(resultState, targetCartItem.item, cart, quantity, action.options);
    });

    return resultState;
};

const removeCartItemByAction = (
    state: app.store.ReadonlyStore<app.entity.CartItem>,
    action: RemoveCartItemAction,
): app.store.ReadonlyStore<app.entity.CartItem> => {
    return removeCartItem(state, action.id);
};

export default (
    state: app.store.ReadonlyStore<app.entity.CartItem>,
    action: Action,
): app.store.ReadonlyStore<app.entity.CartItem> => {
    switch (action.type) {
        case ADD_CART_ITEM: return addCartItemByAction(state, action);
        case UPDATE_CART_ITEM_QUANTITY: return updateCartItemQuantityByAction(state, action);
        case UPDATE_CART_ITEM_OPTIONS: return updateCartItemOptionsByAction(state, action);
        case REMOVE_CART_ITEM: return removeCartItemByAction(state, action);
        default: return state;
    }
};

type Action = AddCartItemAction | UpdateCartItemQuantityAction | UpdateCartItemOptionsAction | RemoveCartItemAction;
