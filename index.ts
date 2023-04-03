import fastify from "fastify";
import * as dotenv from "dotenv";
import { BindRoutes } from "./routes";
import cors from "@fastify/cors";
import "isomorphic-fetch";

dotenv.config();

export const app = fastify({
	logger: true
});

app.get("/", async (req, res) => {
	res.send({
		name: "Ceccun Search",
		version: "1.0.0",
		author: "Ceccun"
	});
});

BindRoutes();

const port = (process.env.PORT as any) || 3000;

app.register(cors, {
	origin: "*"
});

app.listen(
	{
		host: "0.0.0.0",
		port: port
	},
	(err, address) => {
		if (err) {
			console.error(err);
			process.exit(1);
		}
		console.log(`Search listening on ${address}`);
	}
);
