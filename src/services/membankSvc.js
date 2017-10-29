import localDbSvc from './localDbSvc';

const http = require('http');

export default {
  /**
   * Export a file to disk.
   */
  saveToMembank(fileId) {
    return localDbSvc.loadItem(`${fileId}/content`)
      .then((content) => {
        alert(content.text);

        // Post data to Membank.
        // Person fixed to Dante for now.
        const options = {
          hostname: 'localhost',
          port: 8081,
          path: '/memory/Dante',
          method: 'POST',
          headers: {
            mem_title: 'No title',
            mem_description: 'No Description',
            'Content-Type': 'text/html',
          },
        };

        const req = http.request(options, (res) => {
          console.log(`Status: ${res.statusCode}`);
          console.log(`Headers: ${JSON.stringify(res.headers)}`);
          res.setEncoding('utf8');
          res.on('data', (body) => {
            console.log(`Body: ${body}`);
          });
        });

        req.on('error', (e) => {
          console.log(`problem with request: ${e.message}`);
        });

        // Write data to request body
        req.write(content.text);
        req.end();
      });
  },
};
