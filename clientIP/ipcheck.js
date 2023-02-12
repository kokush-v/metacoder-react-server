const fs = require('fs');

module.exports = function ipCheck(ip_address, res) {
   let data = fs.readFileSync('./clientIP/ip.txt', 'utf8', (err) => {
      if (err) console.log(err);
   });

   if (!data.includes(`${ip_address}`)) {
      fs.appendFile(
         './clientIP/ip.txt',
         `/*===============*/
          ${JSON.stringify(res.data)}
          /*===============*/`,
         (err) => {
            if (err) console.log(err);
         }
      );
      console.log(res.data);
      console.log({ user: 'SAVED' });
   } else {
      console.log({
         connection: 'already visited',
         ip: `${res.data.ip_address}`,
      });
   }
};
