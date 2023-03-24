const AWS = require('aws-sdk');

const dynamoDB = new AWS.DynamoDB.DocumentClient();
//
module.exports.createShortUrl = (event, context, callback) => {
  const reqBody = JSON.parse(event);

  const { longUrl, shortUrl } = reqBody;

  if (typeof longUrl !== 'string' || typeof shortUrl !== 'string') {
    return callback(null, {
      statusCode: 400,
      headers: {
        'Content-Type': 'text/plain'
      },
      body: 'Invalid URL'
    });
  }

  const urlParams = {
    TableName: 'urls',
    Item: {
      longUrl,
      shortUrl
    }
  };

  return dynamoDB.put(urlParams, (error) => {
    if (error) {
      console.log(error);
      return callback(null, {
        statusCode: error.statusCode || 501,
        headers: {
          'Content-Type': 'text/plain'
        },
        body: 'Failed to create short URL'
      });
    }

    const response = {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        message: `Created short URL for ${longUrl}`
      })
    };
    callback(null, response);
  });
};

module.exports.getLongUrl = (event, context, callback) => {
  const reqBody = JSON.parse(event.body);

  const { shortUrl } = reqBody;

  if (typeof shortUrl !== 'string') {
    return callback(null, {
      statusCode: 400,
      headers: {
        'Content-Type': 'text/plain'
      },
      body: 'Invalid URL'
    });
  }

  const urlParams = {
    TableName: 'urls',
    Key: {
      shortUrl
    }
  };

  return dynamoDB.get(urlParams, (error, data) => {
    if (error) {
      console.log(error);
      return callback(null, {
        statusCode: error.statusCode || 501,
        headers: {
          'Content-Type': 'text/plain'
        },
        body: 'Failed to fetch long URL'
      });
    }

    const { longUrl } = data.Item;

    const response = {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        message: `Fetched long URL for ${shortUrl}`,
        longUrl
      })
    };
    callback(null, response);
  });
};