const { httpGet } = require('./mock-http-interface');

// Constants
const arnieQuoteKey = 'Arnie Quote'; // Success Key
const failureKey = 'FAILURE'; // Failure Key

/* 
  Function to convert Json string to Json Object 
  from response argument and handle exception accordingly 
*/
const handleJsonParse = (response) => {
  try {
    /* if response and body are not empty and response.body has 
       json string then parse that string as JSON using JSON.parse */
    return response && response.body && JSON.parse(response.body);
  } catch(error) {
    return null;
  }
};

/* Function to build results from httpGet API */
const handleResponse = (response, body) => {
  // If HTTP status is 200 then return response with pre-defined Success Key
  if(response.status && response.status === 200) {
    return {[arnieQuoteKey]: body.message};
  }
  // Any other HTTP status will return response with pre-defined Failure Key
  return {[failureKey]: body.message};
};

/* 
   Main Function - 
   1. Accepts list of URLs
   2. Invoke httpGet on each URL asynchronously 
   3. Waits until it resolves all calls using a Promise
   4. Returns custom response from handleResponse function
   
   This function will work as is even when httpGet is replaced 
   with axios or any other http clients
*/
const getArnieQuotes = async (urls) => {
  const allHttpGets = urls.map(url => {
    return httpGet(url);
  });
  const responses = await Promise.all(allHttpGets);
  const results = responses.map(response => {
    const body = handleJsonParse(response);
    if(body && body.message) {
      return handleResponse(response, body);
    }
    return null;
  });
  return results;
};

module.exports = {
  getArnieQuotes,
};
