import 'reflect-metadata';
import 'jest';
import { cloneDeep } from 'lodash';
import {
    ADD_CART_ITEM,
    addCartItem,
    updateCartItemQuantity,
    updateCartItemOptions,
    removeCartItem,
    AddCartItemAction,
} from './cartItemsActions';
import cartItems from './cartItemsReducer';
import {
    createAddExpectation,
    shouldThrowErrorWhenEntityNotFound,
    shouldBeImmutable,
    createRandomCartItem,
} from 'services/test';
import { generateEntityId } from 'services/storeUtil';

describe('cartItemsReducer', function (this: TestEnv) {
    const createAddCartItemActionByEntity = (cartItem: app.entity.CartItem): AddCartItemAction => {
        return addCartItem(cartItem.item, cartItem.cart, cartItem.quantity, cartItem.options);
    };

    const generateCartItemId = (id: number): string => {
        return generateEntityId('cartItem', id);
    };

    beforeEach(() => {
        this.NEXT_ID = 9;

        this.store = {
            byId:{
                cartItem1: { id: 'cartItem1', item: 'item1', cart: 'cart2', quantity: 3, options: [] },
                cartItem2: {
                    id: 'cartItem2',
                    item: 'item2',
                    cart: 'cart2',
                    quantity: 5,
                    options: [
                        { type: 'topping', id: 'topping1' },
                        { type: 'topping', id: 'topping2' },
                        { type: 'topping', id: 'topping3' },
                    ],
                },
                cartItem3: { id: 'cartItem3', item: 'item3', cart: 'cart3', quantity: 7, options: [] },
                cartItem4: { id: 'cartItem4', item: 'item2', cart: 'cart2', quantity: 2, options: [] },
                cartItem5: { id: 'cartItem5', item: 'item3', cart: 'cart4', quantity: 2, options: [] },
                cartItem6: { id: 'cartItem6', item: 'item2', cart: 'cart5', quantity: 1, options: [{ type: 'topping', id: 'topping3' }] },

            },
            allIds:['cartItem1', 'cartItem2', 'cartItem3', 'cartItem4', 'cartItem5', 'cartItem6'],
            idCounter: this.NEXT_ID,
        };
    });

    describe('#AddCartItemAction', () => {
        it('should add item', () => {
            const NEXT_ID = 9;
            const newCartItem = createRandomCartItem(generateCartItemId(NEXT_ID), 'item9');
            const initState: app.store.ReadonlyStore<app.entity.CartItem> = { byId:{}, allIds:[], idCounter: NEXT_ID };

            const result = cartItems(initState, createAddCartItemActionByEntity(newCartItem));

            expect(result).toEqual({
                byId: {
                    [newCartItem.id]: newCartItem,
                },
                allIds: [newCartItem.id],
                idCounter: NEXT_ID + 1,
            });
        });

        it('should append then new item at the end', () => {
            const newCartItem = createRandomCartItem(generateCartItemId(this.NEXT_ID), 'item9');
            const expectation = createAddExpectation(this.store, newCartItem);
            expectation.idCounter += 1;

            const result = cartItems(this.store, createAddCartItemActionByEntity(newCartItem));

            expect(result).toEqual(expectation);
        });

        it('should sum item quantity when cart item is same item and options in then same cart', () => {
            const QUANTITY = 5;
            const CART_ITEM_ID = 'cartItem1';

            const cartItem = this.store.byId[CART_ITEM_ID];
            const expectation = cloneDeep(this.store) as app.store.Store<CartItem>;
            expectation.byId[CART_ITEM_ID].quantity += QUANTITY;

            const result = cartItems(this.store, addCartItem(
                cartItem.item,
                cartItem.cart,
                QUANTITY,
                cartItem.options,
            ));

            expect(result).toEqual(expectation);
        });

        it('should sum item quantity when cart item is same item and options in then same cart, even if options order is different', () => {
            const QUANTITY = 2;
            const CART_ITEM_ID = 'cartItem2';

            const cartItem = this.store.byId[CART_ITEM_ID];
            const expectation = cloneDeep(this.store) as app.store.Store<CartItem>;
            expectation.byId[CART_ITEM_ID].quantity += QUANTITY;

            const result = cartItems(this.store, addCartItem(
                cartItem.item,
                cartItem.cart,
                QUANTITY,
                [
                    { type: 'topping', id: 'topping3' },
                    { type: 'topping', id: 'topping1' },
                    { type: 'topping', id: 'topping2' },
                ],
            ));

            expect(result).toEqual(expectation);
        });

        it('should not sum item quantity when cart item is same options in the same cart but with different item', () => {
            const newCartItem = createRandomCartItem(generateCartItemId(this.NEXT_ID), 'item4', 'cart2');
            const expectation = createAddExpectation(this.store, newCartItem);
            expectation.idCounter += 1;

            const result = cartItems(this.store, createAddCartItemActionByEntity(newCartItem));

            expect(result).toEqual(expectation);
        });

        it('should not sum item quantity when cart item is same item and options but in different cart', () => {
            const newCartItem = createRandomCartItem(generateCartItemId(this.NEXT_ID), 'item8', 'cart4');
            const expectation = createAddExpectation(this.store, newCartItem);
            expectation.idCounter += 1;

            const result = cartItems(this.store, createAddCartItemActionByEntity(newCartItem));

            expect(result).toEqual(expectation);
        });

        it('should not sum item quantity when cart item is same item in the same cart but with different options', () => {
            const newCartItem = createRandomCartItem(
                generateCartItemId(this.NEXT_ID),
                'item1',
                'cart2',
                undefined,
                [{ type: 'topping', id: 'topping1' }],
            );
            const expectation = createAddExpectation(this.store, newCartItem);
            expectation.idCounter += 1;

            const result = cartItems(this.store, createAddCartItemActionByEntity(newCartItem));

            expect(result).toEqual(expectation);
        });

        it('should return ideintity item when quantity is 0', () => {
            const newCartItem = createRandomCartItem(generateCartItemId(this.NEXT_ID), 'item9', 'cart9', 0);

            const result = cartItems(this.store, createAddCartItemActionByEntity(newCartItem));

            expect(result).toEqual(this.store);
        });

        it('should return ideintity item  when quantity is < 0', () => {
            const newCartItem = createRandomCartItem(generateCartItemId(this.NEXT_ID), 'item9', 'cart9', -3);

            const result = cartItems(this.store, createAddCartItemActionByEntity(newCartItem));

            expect(result).toEqual(this.store);
        });

        shouldBeImmutable(this)(cartItems, addCartItem('item2', 'cart8', 3, []), ['byId', 'allIds']);
    });

    describe('#updateCartItemQuantity', () => {
        it('should update item quantity', () => {
            const QUANTITY = 8;
            const CART_ITEM_ID = 'cartItem2';

            const expectation = cloneDeep(this.store) as app.store.Store<CartItem>;
            expectation.byId[CART_ITEM_ID].quantity = QUANTITY;
            const action = updateCartItemQuantity(CART_ITEM_ID, QUANTITY);

            const result = cartItems(this.store, action);

            expect(result).toEqual(expectation);
        });

        it('should return ideintity item object when quantity is same', () => {
            const CART_ITEM_ID = 'cartItem2';

            const cartItem = this.store.byId[CART_ITEM_ID];
            const action = updateCartItemQuantity(cartItem.id, cartItem.quantity);

            const result = cartItems(this.store, action);

            expect(result).toBe(this.store);
        });

        it('should remove item when quantity is 0', () => {
            const CART_ITEM_ID = 'cartItem2';
            const expectation = cloneDeep(this.store) as app.store.Store<app.entity.CartItem>;
            delete expectation.byId[CART_ITEM_ID];
            expectation.allIds = expectation.allIds.filter(id => id !== CART_ITEM_ID);
            const action = updateCartItemQuantity(CART_ITEM_ID, 0);

            const result = cartItems(this.store, action);

            expect(result).toEqual(expectation);
        });

        it('should remove item when quantity is < 0', () => {
            const CART_ITEM_ID = 'cartItem2';
            const expectation = cloneDeep(this.store) as app.store.Store<app.entity.CartItem>;
            delete expectation.byId[CART_ITEM_ID];
            expectation.allIds = expectation.allIds.filter(id => id !== CART_ITEM_ID);
            const action = updateCartItemQuantity(CART_ITEM_ID, -9);

            const result = cartItems(this.store, action);

            expect(result).toEqual(expectation);
        });

        shouldBeImmutable(this)(cartItems, updateCartItemQuantity('cartItem1', 9), ['byId.cartItem1']);
        shouldThrowErrorWhenEntityNotFound(this)(cartItems, updateCartItemQuantity('cartItem10', 9));
    });

    describe('#updateCartItemOptions', () => {
        it('should update item options', () => {
            const CART_ITEM_ID = 'cartItem1';

            const expectation = cloneDeep(this.store) as app.store.Store<CartItem>;
            const cartItem = expectation.byId[CART_ITEM_ID];
            cartItem.options = [{ type: 'topping', id: 'topping1' }];
            const action = updateCartItemOptions(CART_ITEM_ID, cartItem.options, {
                [cartItem.cart]: cartItem.quantity,
            });

            const result = cartItems(this.store, action);

            expect(result).toEqual(expectation);
        });

        it('should update item quantity', () => {
            const QUANTITY = 6;
            const CART_ITEM_ID = 'cartItem1';

            const expectation = cloneDeep(this.store) as app.store.Store<CartItem>;
            const cartItem = expectation.byId[CART_ITEM_ID];
            cartItem.quantity = QUANTITY;
            const action = updateCartItemOptions(CART_ITEM_ID, cartItem.options, {
                [cartItem.cart]: QUANTITY,
            });

            const result = cartItems(this.store, action);

            expect(result).toEqual(expectation);
        });

        it('should remove item when the quantity is 0', () => {
            const CART_ITEM_ID = 'cartItem1';
            const cartItem = this.store.byId[CART_ITEM_ID];
            const expectation = cloneDeep(this.store) as app.store.Store<CartItem>;
            delete expectation.byId[CART_ITEM_ID];
            expectation.allIds = expectation.allIds.filter(id => id !== CART_ITEM_ID);

            const action = updateCartItemOptions(
                CART_ITEM_ID,
                cartItem.options,
                {
                    [cartItem.cart]: 0,
                },
            );

            const result = cartItems(this.store, action);

            expect(result).toEqual(expectation);
        });

        it('should not merge and remove item when the quantity is 0', () => {
            const CART_ITEM_ID1 = 'cartItem4';
            const CART_ITEM_ID2 = 'cartItem2';

            const expectation = cloneDeep(this.store) as app.store.Store<CartItem>;
            delete expectation.byId[CART_ITEM_ID1];
            expectation.allIds = expectation.allIds.filter(id => id !== CART_ITEM_ID1);

            const action = updateCartItemOptions(
                CART_ITEM_ID1,
                this.store.byId[CART_ITEM_ID2].options,
                {
                    [this.store.byId[CART_ITEM_ID1].cart]: 0,
                },
            );

            const result = cartItems(this.store, action);

            expect(result).toEqual(expectation);
        });

        it('should remove the item when the quantity is < 0', () => {
            const CART_ITEM_ID = 'cartItem1';
            const cartItem = this.store.byId[CART_ITEM_ID];
            const expectation = cloneDeep(this.store) as app.store.Store<CartItem>;
            delete expectation.byId[CART_ITEM_ID];
            expectation.allIds = expectation.allIds.filter(id => id !== CART_ITEM_ID);

            const action = updateCartItemOptions(
                CART_ITEM_ID,
                cartItem.options,
                {
                    [cartItem.cart]: -1,
                },
            );

            const result = cartItems(this.store, action);

            expect(result).toEqual(expectation);
        });

        it('should return ideintity item object when quantity and options are unchanged', () => {
            const CART_ITEM_ID = 'cartItem3';
            const CART = 'cart4';

            const cartItem = this.store.byId[CART_ITEM_ID];
            const action = updateCartItemOptions(
                cartItem.id,
                cartItem.options,
                {
                    [cartItem.cart]: cartItem.quantity,
                    [CART]: 0,
                },
            );

            const result = cartItems(this.store, action);
            expect(result).toBe(this.store);
        });

        it('should merge to the exist item when the cart contains the same item', () => {
            const QUANTITY = 6;
            const CART_ITEM_ID = 'cartItem4';
            const MERGED_CART_ITEM_ID = 'cartItem2';

            const expectation = cloneDeep(this.store) as app.store.Store<CartItem>;
            expectation.byId[MERGED_CART_ITEM_ID].quantity += QUANTITY;
            delete expectation.byId[CART_ITEM_ID];
            expectation.allIds = expectation.allIds.filter(id => id !== CART_ITEM_ID);

            const action = updateCartItemOptions(
                CART_ITEM_ID,
                this.store.byId[MERGED_CART_ITEM_ID].options,
                {
                    [this.store.byId[CART_ITEM_ID].cart]: QUANTITY,
                },
            );

            const result = cartItems(this.store, action);

            expect(result).toEqual(expectation);
        });

        it('should merge and follow existing toppings order when the cart contains the same item', () => {
            const QUANTITY = 3;
            const CART_ITEM_ID = 'cartItem4';
            const MERGED_CART_ITEM_ID = 'cartItem2';

            const expectation = cloneDeep(this.store) as app.store.Store<CartItem>;
            expectation.byId[MERGED_CART_ITEM_ID].quantity += QUANTITY;
            delete expectation.byId[CART_ITEM_ID];
            expectation.allIds = expectation.allIds.filter(id => id !== CART_ITEM_ID);

            const action = updateCartItemOptions(
                CART_ITEM_ID,
                [
                    { type: 'topping', id: 'topping3' },
                    { type: 'topping', id: 'topping1' },
                    { type: 'topping', id: 'topping2' },
                ],
                {
                    [this.store.byId[MERGED_CART_ITEM_ID].cart]: QUANTITY,
                },
            );

            const result = cartItems(this.store, action);

            expect(result).toEqual(expectation);
        });

        it('should add a new item when the item is assigned to other cart', () => {
            const QUANTITY = 6;
            const OTHER_CART = 'cart9';
            const CART_ITEM_ID = 'cartItem4';
            const NEXT_ENTITY_ID = generateCartItemId(this.NEXT_ID);

            const originalItem = this.store.byId[CART_ITEM_ID];
            const expectation = cloneDeep(this.store) as app.store.Store<CartItem>;
            expectation.byId[NEXT_ENTITY_ID] = createRandomCartItem(
                NEXT_ENTITY_ID,
                originalItem.item,
                OTHER_CART,
                QUANTITY,
                originalItem.options,
            );
            expectation.allIds.push(NEXT_ENTITY_ID);
            expectation.idCounter += 1;
            const action = updateCartItemOptions(CART_ITEM_ID, [], { [OTHER_CART]: QUANTITY });

            const result = cartItems(this.store, action);

            expect(result).toEqual(expectation);
        });

        it('should merge to the exisiting item when other carts contain the same item', () => {
            const QUANTITY = 6;
            const CART_ITEM_ID = 'cartItem6';
            const MERGED_CART_ITEM_ID = 'cartItem4';

            const expectation = cloneDeep(this.store) as app.store.Store<CartItem>;
            const mergedItem = expectation.byId[MERGED_CART_ITEM_ID];
            mergedItem.quantity += QUANTITY;
            const action = updateCartItemOptions(CART_ITEM_ID, [], { [mergedItem.cart]: QUANTITY });

            const result = cartItems(this.store, action);

            expect(result).toEqual(expectation);
        });

        it('should merge and follow existing toppings order when other carts contain the same item', () => {
            const QUANTITY = 1;
            const CART_ITEM_ID = 'cartItem6';
            const MERGED_CART_ITEM_ID = 'cartItem2';

            const expectation = cloneDeep(this.store) as app.store.Store<CartItem>;
            const mergedItem = expectation.byId[MERGED_CART_ITEM_ID];
            mergedItem.quantity += QUANTITY;
            const action = updateCartItemOptions(
                CART_ITEM_ID,
                [
                    { type: 'topping', id: 'topping3' },
                    { type: 'topping', id: 'topping1' },
                    { type: 'topping', id: 'topping2' },
                ],
                {
                    [mergedItem.cart]: QUANTITY,
                },
            );

            const result = cartItems(this.store, action);

            expect(result).toEqual(expectation);
        });

        it('should return ideintity item object when other cart quantity is 0', () => {
            const CART_ITEM_ID = 'cartItem3';
            const CART_ID1 = 'cart2';
            const CART_ID2 = 'cart4';

            const cartItem = this.store.byId[CART_ITEM_ID];
            const action = updateCartItemOptions(
                cartItem.id,
                cartItem.options,
                {
                    [cartItem.cart]: cartItem.quantity,
                    [CART_ID1]: 0,
                    [CART_ID2]: 0,
                },
            );

            const result = cartItems(this.store, action);
            expect(result).toBe(this.store);
        });

        it('should return ideintity item object when other cart quantity is < 0', () => {
            const CART_ITEM_ID = 'cartItem3';
            const CART_ID1 = 'cart2';
            const CART_ID2 = 'cart4';

            const cartItem = this.store.byId[CART_ITEM_ID];
            const action = updateCartItemOptions(
                cartItem.id,
                cartItem.options,
                {
                    [cartItem.cart]: cartItem.quantity,
                    [CART_ID1]: -3,
                    [CART_ID2]: -4,
                },
            );

            const result = cartItems(this.store, action);
            expect(result).toBe(this.store);
        });

        const action = updateCartItemOptions('cartItem1', [], { cart2: 1 });
        shouldBeImmutable(this)(cartItems, action, ['byId.cartItem1.options']);
        shouldThrowErrorWhenEntityNotFound(this)(cartItems, updateCartItemOptions('cartItem10', [], { cart2: 1 }));
    });

    describe('#removeCartItem', () => {
        it('should remove item', () => {
            const CART_ITEM_ID = 'cartItem2';
            const expectation = cloneDeep(this.store) as app.store.Store<app.entity.CartItem>;
            delete expectation.byId[CART_ITEM_ID];
            expectation.allIds = expectation.allIds.filter(id => id !== CART_ITEM_ID);
            const action = removeCartItem(CART_ITEM_ID);

            const result = cartItems(this.store, action);

            expect(result).toEqual(expectation);
        });

        shouldBeImmutable(this)(cartItems, removeCartItem('cartItem1'), ['byId', 'allIds']);
        shouldThrowErrorWhenEntityNotFound(this)(cartItems, removeCartItem('cartItem10'));
    });
});

interface CartItem extends app.store.Entity {
    item: string;
    cart: string;
    quantity: number;
    options: ReadonlyArray<app.store.GenericId>;
}

type TestEnv = {
    NEXT_ID: number,
    store: app.store.ReadonlyStore<app.entity.CartItem>,
};
