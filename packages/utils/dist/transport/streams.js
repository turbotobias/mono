export async function readable_stream_to_array_buffer(stream) {
    const reader = stream.getReader();
    const chunks = [];
    while (true) {
        const { done, value } = await reader.read();
        if (done)
            break;
        chunks.push(value);
    }
    const total_length = chunks.reduce((acc, chunk) => acc + chunk.byteLength, 0);
    const array_buffer = new Uint8Array(total_length);
    let offset = 0;
    for (const chunk of chunks) {
        array_buffer.set(new Uint8Array(chunk), offset);
        offset += chunk.byteLength;
    }
    if (!(array_buffer.buffer instanceof ArrayBuffer))
        throw new Error("array_buffer is not an ArrayBuffer");
    return array_buffer.buffer;
}
export async function array_buffer_to_readable_stream(array_buffer) {
    return new ReadableStream({
        start(controller) {
            controller.enqueue(new Uint8Array(array_buffer));
            controller.close();
        },
    });
}
//# sourceMappingURL=streams.js.map