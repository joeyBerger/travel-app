import { convertCelsiusToFahrenheit } from "../src/server/helpers/helperFunctions"

describe("Testing the conversion of celsius to fahrenheit functionality", () => {
    test("Testing the convertCelsiusToFahrenheit() function", () => {
        //test freezing
        expect(convertCelsiusToFahrenheit(0)).toBe(32);
        //test boiling
        expect(convertCelsiusToFahrenheit(100)).toBe(212);
})});