const { httpGet } = require('./mock-http-interface');

const arnieQuoteKey = 'Arnie Quote';
const failureKey = 'FAILURE';

const handleJsonParse = (response) => {
  try {
    return response && response.body && JSON.parse(response.body);
  } catch(error) {
    return null;
  }
};

const handleResponse = (response, body) => {
  if(response.status && response.status === 200) {
    return {[arnieQuoteKey]: body.message};
  }
  return {[failureKey]: body.message};
};

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
