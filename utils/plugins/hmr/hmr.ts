import { PluginOption } from 'vite';

function getClientScript(): string {
  return `
  const ws = new WebSocket('ws://localhost:5000');

  ws.onmessage = ({ data }) => {
    const parsedData = JSON.parse(data.toString());

    if (parsedData.type === 'UPDATE_REQUEST') {
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
  `;
}

export function addHmr(): PluginOption {
  return {
    name: 'add-hmr',
    transform(code, id) {
      if (id.endsWith('background/index.ts')) {
        console.log('transform');
        return code + getClientScript();
      }
      return code;
    },
  };
}
