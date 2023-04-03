import { FastifyRequest } from "fastify";
import { app } from "../..";
import { parse } from "node-html-parser";
import nodeUrl from "url";
import { prisma } from "../../libs/prisma";
import { decode } from "html-entities";

type SearchRequest = FastifyRequest<{
	Querystring: {
		q: string;
		page: number;
	};
}>;

export const TextRoutes = () => {
	app.get("/search/text", async (req: SearchRequest, res) => {
		const q = req.query.q.toLowerCase().trim();

		if (!q) {
			res.status(400).send({
				error: "No query provided"
			});
			return;
		}

		const results = await searchText(q);

		res.send(results);
	});

	app.get(
		"/search/text/preflight",
		async (req: SearchRequest, res) => {
			const q = req.query.q.toLowerCase().trim();

			if (!q) {
				res.status(400).send({
					error: "No query provided"
				});
				return;
			}

			const results = searchText(q);

			res.send({
				status: "ok"
			});
		}
	);
};

const searchText = async (q: string) => {
	try {
		const cached = await prisma.searchCache.findFirst({
			where: {
				query: q,
				type: "text"
			}
		});

		if (cached) {
			return JSON.parse(cached.results);
		}
	} catch (error) {}

	const searchReq = await fetch(
		"https://html.duckduckgo.com/html/?q=" + q
	);
	const searchRes = await searchReq.text();

	const root = parse(searchRes);

	const results = root
		.querySelector(".results")
		?.childNodes.map((result) => {
			const parsedElem = parse(result.toString());

			const title = decode(
				parsedElem
					.querySelector(".result__title")
					?.innerText.trim()
			);

			const link = nodeUrl.parse(
				parsedElem.querySelector(".result__url")
					? `https://${parsedElem
							.querySelector(".result__url")!
							.innerText.trim()}`
					: "https://ceccun.com"
			);
			const description = decode(
				parsedElem
					.querySelector(".result__snippet")
					?.innerText.trim()
			);

			if (title) {
				return {
					title,
					link,
					description
				};
			}
		})
		.filter((result) => result !== undefined);

	try {
		await prisma.searchCache.create({
			data: {
				query: q,
				results: JSON.stringify(results),
				type: "text"
			}
		});
	} catch (err) {}

	return results;
};
