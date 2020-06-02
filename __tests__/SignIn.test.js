import React from "react";
import {
    Context as AuthContext,
    Provider as AuthProvider,
} from "~/context/AuthContext";
import App from "../App";
import renderer from "react-test-renderer";
describe("Login case", () => {
    it("renders SigninScreen correctly", () => {
        const app = renderer.create(
            <AuthProvider>
                <App></App>
            </AuthProvider>
        );
    });
});
