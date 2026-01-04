import {defineConfig} from "@hey-api/openapi-ts";


export default defineConfig({
    input: "http://localhost:3009/docs-json",
    output: "src/client",
    plugins: [
        {
            name: "@hey-api/client-next",
            runtimeConfigPath: "@/config/openapi-runtime",
        },
    ],
});