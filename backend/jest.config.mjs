import { createDefaultPreset } from "ts-jest";

const tsJestTransformCfg = createDefaultPreset().transform;

/** @type {import("jest").Config} **/
export default {
	testEnvironment: "node",
	preset: "ts-jest/presets/default-esm",
	testMatch: ["**/__tests__/**/*.ts", "**/?(*.)+(spec|test).ts"],
	moduleNameMapper: {
		"^(\\.{1,2}/.*)\\.js$": "$1", // Mapea .js a .ts
	},
	transform: {
		...tsJestTransformCfg,
	},
};
