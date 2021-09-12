import { getEssentialElements, createCustomElement } from "../src/client/js/elementHelper"

describe("Testing the essential element functionality", () => {
    test("Testing the getEssentialElements() function", () => {
        //test that getEssentialElements() is defined
        expect(getEssentialElements).toBeDefined();
        expect(createCustomElement).toBeDefined();
})});