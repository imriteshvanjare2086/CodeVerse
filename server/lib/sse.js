// Decode provider SSE across arbitrary UTF-8/network chunk boundaries.
export async function* readSSE(body) {
  const decoder = new TextDecoder();
  let buffer = '';
  function parse(event) {
    const data = event.split('\n').filter(line => line.startsWith('data:')).map(line => line.slice(5).trimStart()).join('\n');
    return data && data !== '[DONE]' ? JSON.parse(data) : null;
  }
  for await (const chunk of body) {
    buffer += decoder.decode(chunk, { stream: true });
    buffer = buffer.replace(/\r\n/g, '\n');
    let boundary;
    while ((boundary = buffer.indexOf('\n\n')) >= 0) {
      const value = parse(buffer.slice(0, boundary));
      buffer = buffer.slice(boundary + 2);
      if (value) yield value;
    }
    if (buffer.length > 1024 * 1024) throw new Error('Provider stream event exceeds limit');
  }
  buffer += decoder.decode();
  if (buffer.trim()) { const value = parse(buffer); if (value) yield value; }
}
