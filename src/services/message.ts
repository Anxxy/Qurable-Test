export function getMessage(messages: string[][]): string {
  let message = '';
  const messageLength = messages.reduce(
    (prev: number, current: string[]): number => {
      if (prev === -1)
        return -1;
      if (current.length === prev || prev === 0)
        return current.length;
      return -1;
    }, 0
  );

  if (messageLength == -1)
    throw new Error("Inconsistent number of message parts");

  for (let i = 0; i < messageLength; i++) {
    let part = '';
    for (let msg of messages) {
      if (msg[i] !== '')
        part = msg[i];
    }
    message += part + " ";
  }

  return message.slice(0, -1);
}
