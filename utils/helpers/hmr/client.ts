type clientScriptOptions = {
  onUpdate: (path: string) => void;
};

export function clientScript({ onUpdate }: clientScriptOptions) {
  const ws = new WebSocket(`ws://localhost:5000`);

  ws.onmessage = ({ data }) => {
    const parsedData = JSON.parse(data.toString());

    if (parsedData.type === 'UPDATE_REQUEST') {
      onUpdate(parsedData.path);
      if (chrome && chrome.runtime) {
        chrome.runtime.reload();
      } else {
        window.location.reload();
      }
      ws.send(
        JSON.stringify({
          type: 'UPDATE_COMPLETE',
        }),
      );
    }
  };
}
