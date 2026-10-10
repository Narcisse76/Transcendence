import OpenAIClient from 'openai';

const openai = new OpenAIClient
(
	{
		apiKey: process.env.OPENAI_API_KEY,
		timeout: 3000,
	}
);

export async function moderateMessage(text, context) 
{
	const moderation = await openai.moderations.create
	(
		{
			model: "omni-moderation-latest",
			input: text,
		}
	);
	const result = moderation.results[0];
	/*DEBUG*/
	 console.log("MODERATION:", JSON.stringify(result, null, 2));
	 /*-----*/
	if (result.flagged == true) 
		return { allowed: false, reason: "inappropriate language" };
	return { allowed: true };
}
