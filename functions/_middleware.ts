interface PagesContext {
  request: Request;
  next: () => Promise<Response>;
}

export const onRequest = async ({ request, next }: PagesContext): Promise<Response> => {
  const url = new URL(request.url);

  if (url.hostname === 'www.justclickfor.me') {
    url.hostname = 'justclickfor.me';
    return Response.redirect(url.toString(), 301);
  }

  return next();
};
