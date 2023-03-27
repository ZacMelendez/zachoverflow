const { getPost } = require('../helpers/blogposts');
require('dotenv').config()

const handler = async (event) => {
  let response

  try {
    response = {
      statusCode: 200,
      body: JSON.stringify({
        content: await getPost(event.pathParameters.url)
      })
    };
  } catch (err) {
    console.log(err);
    response = {
      statusCode: 500,
      body: JSON.stringify({
        message: err instanceof Error ? err.message : 'some error happened'
      })
    };
  }

  return response;
};

exports.handler = handler