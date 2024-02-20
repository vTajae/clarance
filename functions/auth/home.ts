interface Env {
	theform: KVNamespace;
}

export const onRequest: PagesFunction<Env> = async (context) => {
	const value = await context.env.theform.get('example');
 	return new Response(value);
}